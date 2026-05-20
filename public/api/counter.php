<?php
/**
 * Hostinger visitor counter API.
 *
 * Public actions:
 * - ?action=increment  Counts a visitor once per dedupe window and returns live total.
 * - ?action=get        Returns live total without incrementing.
 * - ?action=flush      Flushes the in-memory buffer to MySQL. Requires FLUSH_TOKEN.
 */

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, max-age=0');
header('Access-Control-Allow-Origin: ' . (getenv('ALLOWED_ORIGIN') ?: ('https://' . ($_SERVER['HTTP_HOST'] ?? 'localhost'))));

const CONFIG = [
    'db_host' => 'localhost',
    'db_user' => 'hostinger_user',
    'db_pass' => '',
    'db_name' => 'hostinger_db',
    'db_port' => 3306,
    'counter_id' => 1,
    'buffer_key' => 'cjp_counter_buffer',
    'base_count_key' => 'cjp_counter_base_count',
    'base_count_ttl' => 300,
    'buffer_size' => 10000,
    'ip_cache_ttl' => 3600,
    'flush_interval_seconds' => 300,
    'bot_filter' => true,
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
        echo json_encode([
            'success' => false,
            'error' => $message,
            'timestamp' => gmdate('c'),
        ]);
        exit;
    }
}

final class CounterCache
{
    public function requireApcu(): void
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

    public function delete(string $key): bool
    {
        return apcu_delete($key);
    }
}

final class CounterBuffer
{
    public function __construct(private CounterCache $cache)
    {
        $this->cache->add($this->lastFlushKey(), time(), 0);
    }

    public function increment(): int
    {
        return $this->cache->increment($this->bufferKey());
    }

    public function current(): int
    {
        return (int) $this->cache->get($this->bufferKey(), 0);
    }

    public function reset(): void
    {
        $this->cache->set($this->bufferKey(), 0);
        $this->cache->set($this->lastFlushKey(), time());
    }

    public function take(): int
    {
        return $this->cache->takeInt($this->bufferKey());
    }

    public function restore(int $increment): void
    {
        $this->cache->incrementBy($this->bufferKey(), $increment);
    }

    public function markFlushed(): void
    {
        $this->cache->set($this->lastFlushKey(), time());
    }

    public function shouldFlush(): bool
    {
        $count = $this->current();
        $lastFlush = (int) $this->cache->get($this->lastFlushKey(), time());

        return $count >= (int) Config::get('buffer_size') ||
            time() - $lastFlush >= (int) Config::get('flush_interval_seconds');
    }

    private function bufferKey(): string
    {
        return (string) Config::get('buffer_key');
    }

    private function lastFlushKey(): string
    {
        return $this->bufferKey() . ':last_flush';
    }
}

final class VisitorIdentity
{
    public function clientIp(): string
    {
        $candidates = [
            $this->firstForwardedIp($_SERVER['HTTP_X_FORWARDED_FOR'] ?? ''),
            $_SERVER['HTTP_CLIENT_IP'] ?? '',
            $_SERVER['REMOTE_ADDR'] ?? '',
        ];

        foreach ($candidates as $ip) {
            if (filter_var($ip, FILTER_VALIDATE_IP)) {
                return $ip;
            }
        }

        return '0.0.0.0';
    }

    public function isBot(): bool
    {
        if (!Config::get('bot_filter')) {
            return false;
        }

        $userAgent = strtolower($_SERVER['HTTP_USER_AGENT'] ?? '');
        if ($userAgent === '') {
            return true;
        }

        return (bool) preg_match(
            '/bot|crawler|spider|scraper|curl|wget|python|java(?!script)|headless|phantom|selenium|googlebot|bingbot|slurp|duckduckgo/i',
            $userAgent
        );
    }

    public function dedupeKey(): string
    {
        $salt = getenv('IP_HASH_SALT') ?: (string) Config::get('db_name');
        return 'cjp_visitor_' . substr(hash('sha256', $salt . '|' . $this->clientIp()), 0, 24);
    }

    private function firstForwardedIp(string $value): string
    {
        $parts = explode(',', $value);
        return trim($parts[0] ?? '');
    }
}

final class CounterDatabase
{
    private ?PDO $pdo = null;

    public function baseCount(CounterCache $cache): int
    {
        $cacheKey = (string) Config::get('base_count_key');
        $cached = $cache->get($cacheKey);
        if ($cached !== null) {
            return (int) $cached;
        }

        $stmt = $this->connection()->prepare('SELECT total_visitors FROM visitor_counter WHERE id = ? LIMIT 1');
        $stmt->execute([(int) Config::get('counter_id')]);
        $count = (int) ($stmt->fetchColumn() ?: 0);
        $cache->set($cacheKey, $count, (int) Config::get('base_count_ttl'));

        return $count;
    }

    public function flush(int $increment, CounterCache $cache): int
    {
        if ($increment <= 0) {
            return $this->baseCount($cache);
        }

        $stmt = $this->connection()->prepare(
            'UPDATE visitor_counter
             SET total_visitors = total_visitors + ?, unique_ips = unique_ips + ?, last_updated = NOW()
             WHERE id = ?'
        );
        $stmt->execute([$increment, $increment, (int) Config::get('counter_id')]);

        $cache->delete((string) Config::get('base_count_key'));
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

final class CounterController
{
    private CounterCache $cache;
    private CounterBuffer $buffer;
    private CounterDatabase $database;
    private VisitorIdentity $visitor;

    public function __construct()
    {
        $this->cache = new CounterCache();
        $this->cache->requireApcu();
        $this->buffer = new CounterBuffer($this->cache);
        $this->database = new CounterDatabase();
        $this->visitor = new VisitorIdentity();
    }

    public function handle(): void
    {
        try {
            match ($_GET['action'] ?? 'get') {
                'increment' => $this->increment(),
                'get' => $this->get(),
                'flush' => $this->flushFromCron(),
                default => JsonResponse::error('Invalid action', 404),
            };
        } catch (Throwable $error) {
            error_log('Counter error: ' . $error->getMessage());
            JsonResponse::error('Counter unavailable', 503);
        }
    }

    private function increment(): void
    {
        $this->requireAllowedOrigin();

        $status = 'already_counted';

        if ($this->visitor->isBot()) {
            $status = 'bot_filtered';
        } elseif ($this->cache->add($this->visitor->dedupeKey(), 1, (int) Config::get('ip_cache_ttl'))) {
            $this->buffer->increment();
            $status = 'counted';

            if ($this->buffer->shouldFlush()) {
                $this->flushBuffer();
            }
        }

        JsonResponse::ok([
            'count' => $this->liveCount(),
            'status' => $status,
        ]);
    }

    private function get(): void
    {
        JsonResponse::ok(['count' => $this->liveCount()]);
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
        $increment = $this->buffer->take();

        try {
            $total = $this->database->flush($increment, $this->cache);
            $this->buffer->markFlushed();
        } catch (Throwable $error) {
            $this->buffer->restore($increment);
            throw $error;
        }

        return [
            'flushed' => $increment,
            'count' => $total,
        ];
    }

    private function liveCount(): int
    {
        return $this->database->baseCount($this->cache) + $this->buffer->current();
    }

    private function requireAllowedOrigin(): void
    {
        $allowedOrigin = getenv('ALLOWED_ORIGIN');
        $origin = $_SERVER['HTTP_ORIGIN'] ?? '';

        if ($allowedOrigin && $origin && !hash_equals($allowedOrigin, $origin)) {
            JsonResponse::error('Origin not allowed', 403);
        }
    }
}

(new CounterController())->handle();
