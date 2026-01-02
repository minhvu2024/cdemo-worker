export class CacheService {
  constructor(kv) { this.kv = kv; this.ttl = 3600; }
  key(prefix, params) {
    return `${prefix}:${Object.keys(params).sort().map(k => `${k}:${params[k]}`).join("|")}`;
  }
  async get(prefix, params) {
    try {
      const data = await this.kv.get(this.key(prefix, params));
      return data ? JSON.parse(data) : null;
    } catch { return null; }
  }
  async set(prefix, params, data, ttl) {
    try {
      await this.kv.put(this.key(prefix, params), JSON.stringify(data), { expirationTtl: ttl || this.ttl });
    } catch (e) { console.error("Cache error:", e); }
  }
  async clear(pattern) {
    try {
      const keys = await this.kv.list({ prefix: pattern });
      for (const key of keys.keys) await this.kv.delete(key.name);
    } catch (e) { console.error("Clear cache error:", e); }
  }
}

