# Ultra-Lightweight Visitor Counter System
## Production Architecture for Hostinger (PHP + MySQL)

## 1. HIGH-LEVEL ARCHITECTURE

```
┌─────────────────────────────────────────────────────────────┐
│ USER REQUEST                                                │
└────────────────────┬────────────────────────────────────────┘
                     │
         ┌───────────▼─────────────┐
         │ CDN / Browser Cache     │
         │ (static HTML/JS)        │
         └───────────┬─────────────┘
                     │
         ┌───────────▼─────────────────────────┐
         │ Hostinger Web Server (PHP)          │
         │                                     │
         │ 1. Check IP Deduplication (APCu)    │
         │ 2. Increment In-Memory Buffer       │
         │ 3. Return cached count              │
         └───────────┬─────────────────────────┘
                     │
         ┌───────────▼──────────────┐
         │ In-Memory Buffer (APCu)  │
         │ - 10K visitors in RAM    │
         │ - Zero DB writes!        │
         └───────────┬──────────────┘
                     │
         ┌───────────▼──────────────────────┐
         │ CRON Job (Every 5-10 minutes)    │
         │ - Flush buffer to MySQL          │
         │ - Single INSERT/UPDATE query     │
         │ - Clean old IPs from cache       │
         └───────────┬──────────────────────┘
                     │
         ┌───────────▼──────────────┐
         │ MySQL Database           │
         │ - Single counter row     │
         │ - Minimal writes         │
         └──────────────────────────┘
```

## 2. REQUEST FLOW

```
User visits page
    ↓
Browser caches page (CDN/browser cache)
    ↓
JavaScript fetch → /api/counter.php?action=increment
    ↓
PHP receives request:
    • Check if IP already counted (APCu)
    • If yes: return cached count, skip increment
    • If no: increment buffer, cache IP (APCu)
    ↓
Return JSON: {count: 12345}
    ↓
Page displays live counter
    ↓
(Every 5 minutes, CRON flushes buffer to DB)
```

## 3. DATABASE SCHEMA

```sql
-- Minimal, optimized for write efficiency
CREATE TABLE visitor_counter (
    id INT PRIMARY KEY AUTO_INCREMENT,
    total_visitors BIGINT UNSIGNED DEFAULT 0,
    unique_ips BIGINT UNSIGNED DEFAULT 0,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_updated (last_updated)
);

-- Optional: Track per-page hits (if needed)
CREATE TABLE page_hits (
    page_slug VARCHAR(100) PRIMARY KEY,
    hit_count BIGINT UNSIGNED DEFAULT 0,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Archive table for historical data (optional)
CREATE TABLE visitor_counter_archive (
    id INT PRIMARY KEY AUTO_INCREMENT,
    total_visitors BIGINT UNSIGNED,
    unique_ips BIGINT UNSIGNED,
    recorded_date DATE UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Initialize
INSERT INTO visitor_counter (id, total_visitors, unique_ips) 
VALUES (1, 0, 0) 
ON DUPLICATE KEY UPDATE total_visitors=total_visitors;

CREATE TABLE petition_counter (
    id INT PRIMARY KEY AUTO_INCREMENT,
    signature_count BIGINT UNSIGNED DEFAULT 0,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO petition_counter (id, signature_count)
VALUES (1, 0)
ON DUPLICATE KEY UPDATE signature_count=signature_count;

CREATE TABLE member_counter (
    id INT PRIMARY KEY AUTO_INCREMENT,
    member_count BIGINT UNSIGNED DEFAULT 0,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO member_counter (id, member_count)
VALUES (1, 1247)
ON DUPLICATE KEY UPDATE member_count=member_count;
```

## 4. COST ANALYSIS

| Component | Cost | Notes |
|-----------|------|-------|
| Hostinger Shared Hosting | $2-5/mo | Already have it |
| MySQL Database | Included | Usually 500MB free |
| CDN | Optional | Use only if already configured |
| Storage needed | <100KB | Tiny! |
| **TOTAL** | **$2-5/mo** ✅ | No per-request fees |

Because Hostinger is already paid, this is essentially free to run.

## 5. SCALING METRICS

For various traffic levels:

| Traffic | Requests/sec | DB Writes/min | MySQL Impact | Recommendation |
|---------|-------------|---------------|--------------|-----------------|
| 1M/day | 12 | 1 | None | Works perfectly |
| 10M/day | 116 | 10-15 | Minimal | Works well |
| 100M/day | 1,157 | 100-150 | Low | Buffer tuning needed |
| 1B/day | 11,574 | 1,000+ | Moderate | Move to a dedicated cache/database layer |

**For your use case (10M/day):** This system needs **zero optimization** and works out of the box.

## 6. KEY ADVANTAGES

✅ **$0 incremental cost** (Hostinger already paid)
✅ **Millions of hits** without database strain
✅ **Simple implementation** (PHP + MySQL, no external APIs)
✅ **Easy debugging** (local MySQL access)
✅ **No third-party counter dependencies** (PHP + MySQL only)
✅ **Works on any PHP hosting** (shared hosting friendly)
✅ **Trivial to understand** (buffering + cron job pattern)

## 7. POTENTIAL BOTTLENECKS & SOLUTIONS

| Bottleneck | Cause | Solution |
|-----------|-------|----------|
| MySQL connection limit | Too many concurrent writes | Use batched buffer (this system) |
| High memory usage | Storing too many IPs | Implement IP bloom filter |
| Duplicate counter increments | Race conditions | Use memcached SET for atomicity |
| Bot inflated counts | Fake traffic | IP reputation scoring |
| Slow page load | Counter fetch delays | Cache counter in HTML, lazy-load |

All solved in the implementation below. ✅

---

**Continue to next sections for full PHP code, frontend integration, and deployment guide.**
