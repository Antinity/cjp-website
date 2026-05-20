<?php
/**
 * Hostinger member counter API.
 *
 * Public actions:
 * - GET  /api/members.php?action=get
 * - POST /api/members.php?action=join
 * - GET  /api/members.php?action=flush&token=...
 */

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, max-age=0');
header('Access-Control-Allow-Origin: ' . (getenv('ALLOWED_ORIGIN') ?: ('https://' . ($_SERVER['HTTP_HOST'] ?? 'localhost'))));
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

const CONFIG = [
    'db_host' => 'localhost',
    'db_user' => 'hostinger_user',
    'db_pass' => '',
    'db_name' => 'hostinger_db',
    'db_port' => 3306,
    'counter_id' => 1,
    'buffer_key' => 'cjp_member_buffer',
    'base_count_key' => 'cjp_member_base_count',
    'base_count_ttl' => 300,
    'buffer_size' => 500,
    'dedupe_ttl' => 86400,
    'flush_interval_seconds' => 300,
];

final class Config
{
    public static function get(string $key)
    {
        $env = getenv(strtoupper($key));
        return $env === false || $env === '' ? CONFIG[$key] : $env;
    }
}

final class JsonResponse
{
    public static function ok(array $data): void
    {
        echo json_encode(['success' => true] + $data + ['timestamp' => gmdate('c')]);
        exit;
    }

    public static function error(string $message, int $status = 400): void
    {
        http_response_code($status);
        echo json_encode(['success' => false, 'error' => $message, 'timestamp' => gmdate('c')]);
        exit;
    }
}

final class Cache
{
    public function __construct()
    {
        if (!extension_loaded('apcu') || !function_exists('apcu_enabled') || !apcu_enabled()) {
            JsonResponse::error('APCu is not enabled for this PHP runtime.', 503);
        }
    }

    public function add(string $key, $value, int $ttl): bool
    {
        return apcu_add($key, $value, $ttl);
    }

    public function get(string $key, $default = null)
    {
        $success = false;
        $value = apcu_fetch($key, $success);
        return $success ? $value : $default;
    }

    public function set(string $key, $value, int $ttl = 0): bool
    {
        return apcu_store($key, $value, $ttl);
    }

    public function increment(string $key): int
    {
        if (!apcu_exists($key)) {
            apcu_add($key, 0);
        }

        return (int) apcu_inc($key, 1);
    }

    public function incrementBy(string $key, int $amount): int
    {
        if ($amount <= 0) {
            return (int) $this->get($key, 0);
        }

        if (!apcu_exists($key)) {
            apcu_add($key, 0);
        }

        return (int) apcu_inc($key, $amount);
    }

    public function takeInt(string $key): int
    {
        if (!apcu_exists($key)) {
            apcu_add($key, 0);
        }

        for ($attempt = 0; $attempt < 32; $attempt++) {
            $value = (int) $this->get($key, 0);
            if ($value <= 0) {
                return 0;
            }

            if (apcu_cas($key, $value, 0)) {
                return $value;
            }
        }

        return 0;
    }

    public function delete(string $key): void
    {
        apcu_delete($key);
    }
}

final class Database
{
    private ?PDO $pdo = null;

    public function baseCount(Cache $cache): int
    {
        $cacheKey = (string) Config::get('base_count_key');
        $cached = $cache->get($cacheKey);
        if ($cached !== null) {
            return (int) $cached;
        }

        $stmt = $this->connection()->prepare('SELECT member_count FROM member_counter WHERE id = ? LIMIT 1');
        $stmt->execute([(int) Config::get('counter_id')]);
        $count = (int) ($stmt->fetchColumn() ?: 0);
        $cache->set($cacheKey, $count, (int) Config::get('base_count_ttl'));

        return $count;
    }

    public function flush(int $increment, Cache $cache): int
    {
        if ($increment > 0) {
            $stmt = $this->connection()->prepare(
                'UPDATE member_counter
                 SET member_count = member_count + ?, last_updated = NOW()
                 WHERE id = ?'
            );
            $stmt->execute([$increment, (int) Config::get('counter_id')]);
            $cache->delete((string) Config::get('base_count_key'));
        }

        return $this->baseCount($cache);
    }

    private function connection(): PDO
    {
        if ($this->pdo instanceof PDO) {
            return $this->pdo;
        }

        $dsn = sprintf(
            'mysql:host=%s;port=%d;dbname=%s;charset=utf8mb4',
            Config::get('db_host'),
            (int) Config::get('db_port'),
            Config::get('db_name')
        );

        return $this->pdo = new PDO($dsn, Config::get('db_user'), Config::get('db_pass'), [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_TIMEOUT => 2,
        ]);
    }
}

final class MemberController
{
    private Cache $cache;
    private Database $database;

    public function __construct()
    {
        $this->cache = new Cache();
        $this->database = new Database();
        $this->cache->add($this->lastFlushKey(), time(), 0);
    }

    public function handle(): void
    {
        try {
            $action = $_GET['action'] ?? ($_SERVER['REQUEST_METHOD'] === 'POST' ? 'join' : 'get');

            match ($action) {
                'get' => JsonResponse::ok(['count' => $this->liveCount()]),
                'join' => $this->join(),
                'flush' => $this->flushFromCron(),
                default => JsonResponse::error('Invalid action', 404),
            };
        } catch (Throwable $error) {
            error_log('Member counter error: ' . $error->getMessage());
            JsonResponse::error('Member counter unavailable', 503);
        }
    }

    private function join(): void
    {
        $this->requirePost();
        $this->requireAllowedOrigin();

        $status = 'already_joined';
        if ($this->cache->add($this->dedupeKey(), 1, (int) Config::get('dedupe_ttl'))) {
            $this->cache->increment((string) Config::get('buffer_key'));
            $status = 'joined';

            if ($this->shouldFlush()) {
                $this->flushBuffer();
            }
        }

        JsonResponse::ok(['count' => $this->liveCount(), 'status' => $status]);
    }

    private function flushFromCron(): void
    {
        $expectedToken = getenv('FLUSH_TOKEN');
        $providedToken = $_GET['token'] ?? '';

        if (!$expectedToken || !hash_equals($expectedToken, $providedToken)) {
            JsonResponse::error('Unauthorized', 403);
        }

        JsonResponse::ok($this->flushBuffer());
    }

    private function flushBuffer(): array
    {
        $bufferKey = (string) Config::get('buffer_key');
        $increment = $this->cache->takeInt($bufferKey);

        try {
            $total = $this->database->flush($increment, $this->cache);
            $this->cache->set($this->lastFlushKey(), time());
        } catch (Throwable $error) {
            $this->cache->incrementBy($bufferKey, $increment);
            throw $error;
        }

        return ['flushed' => $increment, 'count' => $total];
    }

    private function liveCount(): int
    {
        return $this->database->baseCount($this->cache) + (int) $this->cache->get((string) Config::get('buffer_key'), 0);
    }

    private function shouldFlush(): bool
    {
        $count = (int) $this->cache->get((string) Config::get('buffer_key'), 0);
        $lastFlush = (int) $this->cache->get($this->lastFlushKey(), time());

        return $count >= (int) Config::get('buffer_size') ||
            time() - $lastFlush >= (int) Config::get('flush_interval_seconds');
    }

    private function dedupeKey(): string
    {
        $ip = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
        $salt = getenv('IP_HASH_SALT') ?: (string) Config::get('db_name');
        return 'cjp_member_' . substr(hash('sha256', $salt . '|' . $ip), 0, 24);
    }

    private function requirePost(): void
    {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            JsonResponse::error('Method not allowed', 405);
        }
    }

    private function requireAllowedOrigin(): void
    {
        $allowedOrigin = getenv('ALLOWED_ORIGIN');
        $origin = $_SERVER['HTTP_ORIGIN'] ?? '';

        if ($allowedOrigin && $origin && !hash_equals($allowedOrigin, $origin)) {
            JsonResponse::error('Origin not allowed', 403);
        }
    }

    private function lastFlushKey(): string
    {
        return (string) Config::get('buffer_key') . ':last_flush';
    }
}

(new MemberController())->handle();
