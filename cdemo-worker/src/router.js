import { DatabaseService } from "./modules/database.js";
import { CacheService } from "./modules/cache.js";
import { CardUtils } from "./modules/card-utils.js";
import { BinCache } from "./modules/bin-cache.js";

const CACHE_TTL = {
  STATS: 21600,
  FILTERS: 21600,
  DASHBOARD: 3600,
  CARD_STATS: 300,
  SEARCH: 300,
  BIN_DETAIL: 1800
};

export class Router {
  constructor(db, kv, env) {
    this.db = new DatabaseService(db);
    this.cache = new CacheService(kv);
    this.env = env;
    this.SECRET = "s3cr3t_k3y_ch4ng3_m3"; // Nên đưa vào env
  }

  async login(request) {
    try {
      const { username, password } = await request.json();
      if (username === "cchecker" && password === "Hgl@555@") {
        const token = await this.signToken({ sub: username, exp: Math.floor(Date.now()/1000) + 86400 }); // 24h
        return this.json({ success: true, token });
      }
      return this.json({ success: false, error: "Invalid credentials" }, 401);
    } catch (e) {
      return this.json({ success: false, error: "Login failed" }, 400);
    }
  }

  async setupDB(request) {
    // Admin only
    const authorized = await this.verifyAuth(request);
    if (!authorized) return this.json({ success: false, error: "Unauthorized" }, 401);
    
    try {
      await this.db.ensureIndexes();
      return this.json({ success: true, message: "Database schema and indexes updated" });
    } catch (e) {
      return this.json({ success: false, error: e.message }, 500);
    }
  }

  async verifyAuth(request) {
    const auth = request.headers.get("Authorization");
    if (!auth || !auth.startsWith("Bearer ")) return false;
    const token = auth.split(" ")[1];
    return await this.verifyToken(token);
  }

  async signToken(payload) {
    const header = { alg: "HS256", typ: "JWT" };
    const encodedHeader = btoa(JSON.stringify(header));
    const encodedPayload = btoa(JSON.stringify(payload));
    const data = `${encodedHeader}.${encodedPayload}`;
    const signature = await this.hmacSha256(data, this.SECRET);
    return `${data}.${signature}`;
  }

  async verifyToken(token) {
    try {
      const [h, p, s] = token.split(".");
      const signature = await this.hmacSha256(`${h}.${p}`, this.SECRET);
      if (signature !== s) return false;
      const payload = JSON.parse(atob(p));
      if (payload.exp < Math.floor(Date.now()/1000)) return false;
      return true;
    } catch { return false; }
  }

  async hmacSha256(msg, secret) {
    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
    const sign = await crypto.subtle.sign("HMAC", key, enc.encode(msg));
    return btoa(String.fromCharCode(...new Uint8Array(sign))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }
  json(data, status = 200) {
    return new Response(JSON.stringify(data), {
      status,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type"
      }
    });
  }
  parseParams(url) {
    const p = {};
    ['bin', 'brand', 'type', 'category', 'country', 'issuer'].forEach(k => {
      if (url.searchParams.get(k)) p[k] = url.searchParams.get(k);
    });
    p.limit = Math.min(Math.max(parseInt(url.searchParams.get("limit") || "50"), 1), 1000);
    p.offset = Math.max(parseInt(url.searchParams.get("offset") || "0"), 0);
    return p;
  }
  async cardStats() {
    try {
      const cached = await this.cache.get("card-stats", {});
      if (cached) return this.json(cached);
      const data = await this.db.getCardStats();
      const response = { success: true, data };
      await this.cache.set("card-stats", {}, response, CACHE_TTL.CARD_STATS);
      return this.json(response);
    } catch (error) {
      console.error("Card stats error:", error);
      return this.json({ success: false, error: error.message }, 500);
    }
  }
  async searchBins(request) {
    try {
      const body = await request.json();
      const minCards = body.minCards !== undefined ? body.minCards : 10; // Default 10
      
      // KV-First Strategy
      let kvResults = [];
      let missingBins = [];
      
      try {
        const cache = await this.cache.get("bin_cache_v2");
        if (cache) {
          const bins = body.bins || [];
          kvResults = BinCache.lookup(cache, bins);
          
          // Phân loại: BIN nào đã có trong KV, BIN nào chưa (source='unknown')
          missingBins = kvResults.filter(r => r.source === 'unknown').map(r => r.bin);
          
          // OPTIMIZATION: Nếu minCards >= 10, ta KHÔNG CẦN query D1 nữa.
          // Lý do: KV đã chứa toàn bộ BIN có >= 10 cards.
          // Nếu không thấy trong KV nghĩa là BIN đó < 10 cards -> Không thỏa mãn điều kiện lọc.
          if (minCards >= 10) {
             return this.json({ success: true, bins: kvResults, total: kvResults.length });
          }
        }
      } catch (e) {
        console.error("BinCache lookup error:", e);
      }

      // Fallback D1: Chỉ chạy khi (KV Miss/Lỗi) HOẶC (minCards < 10 và có missing bins)
      
      // Nếu KV hoạt động tốt và minCards < 10, ta chỉ query D1 cho các missingBins
      let binsToQuery = (missingBins.length > 0) ? missingBins : (body.bins || []);
      
      // Nếu binsToQuery rỗng (tức là tìm thấy hết trong KV rồi), trả về luôn
      if (binsToQuery.length === 0) {
         return this.json({ success: true, bins: kvResults, total: kvResults.length });
      }

      // Query D1 cho phần còn thiếu
      // Lưu ý: params truyền vào searchBins của DB cần đúng format
      const dbParams = { ...body, bins: binsToQuery }; 
      
      // Check cache D1 cũ (nếu có) cho nhóm này
      const cachedD1 = await this.cache.get("search-bins", dbParams);
      let dbResults = [];
      
      if (cachedD1 && cachedD1.data) {
        dbResults = cachedD1.data;
      } else {
        const result = await this.db.searchBins(dbParams);
        dbResults = result.data || [];
        // Cache lại kết quả D1 này (ngắn hạn)
        await this.cache.set("search-bins", dbParams, { success: true, data: dbResults }, CACHE_TTL.SEARCH);
      }
      
      // Merge kết quả: KV Results (đã có) + DB Results (vừa tìm được)
      // Cần update lại thông tin cho các missingBins trong kvResults bằng dữ liệu từ dbResults
      const finalResults = kvResults.map(item => {
        if (item.source !== 'unknown') return item; // Giữ nguyên item lấy từ KV
        
        // Tìm trong kết quả DB
        const foundInDb = dbResults.find(d => d.bin === item.bin);
        if (foundInDb) {
          return { ...item, ...foundInDb, source: 'database' };
        }
        return item; // Vẫn là unknown (không có trong cả DB)
      });
      
      // Nếu kvResults rỗng (do KV lỗi/miss hoàn toàn), dùng dbResults
      if (kvResults.length === 0) return this.json({ success: true, bins: dbResults, total: dbResults.length });

      return this.json({ success: true, bins: finalResults, total: finalResults.length });

    } catch (error) {
      console.error("Search bins error:", error);
      return this.json({ success: false, error: error.message }, 500);
    }
  }
  async exportCards(request) {
    try {
      const body = await request.json();
      // Map old param `cardsPerBin` to `limit` if not sequential to maintain compatibility
      if (!body.sequential && body.cardsPerBin) {
          body.limit = body.cardsPerBin;
      }
      const result = await this.db.exportCards(body);
      return this.json({ success: true, ...result });
    } catch (error) {
      console.error("Export cards error:", error);
      return this.json({ success: false, error: error.message }, 500);
    }
  }
  async normalizeCards(request) {
    try {
      const { cards, filterExpired } = await request.json();
      if (!cards || !Array.isArray(cards)) return this.json({ success: false, error: "Invalid input" }, 400);
      if (cards.length > 100000) return this.json({ success: false, error: "Max 100,000 cards" }, 400);
      const result = CardUtils.normalizeAll(cards, filterExpired || false);
      return this.json({
        success: true,
        data: {
          total: cards.length,
          valid: result.valid.map(c => c.normalized),
          validCount: result.valid.length,
          errors: result.errors,
          errorCount: result.errors.length
        }
      });
    } catch (error) {
      return this.json({ success: false, error: error.message }, 500);
    }
  }
  async checkDuplicates(request) {
    try {
      const { cards } = await request.json();
      if (!cards || !Array.isArray(cards)) return this.json({ success: false, error: "Invalid input" }, 400);
      
      const pans = [];
      const lineMap = new Map();
      
      cards.forEach((line) => {
        // Use CardUtils to extract PAN consistently
        const normalized = CardUtils.normalize(line);
        if (normalized && !normalized.error && normalized.pan) {
          const pan = normalized.pan;
          pans.push(pan);
          if (!lineMap.has(pan)) lineMap.set(pan, []);
          lineMap.get(pan).push(line.trim());
        }
      });

      if (pans.length === 0) {
        return this.json({ success: true, data: { total: cards.length, unique: [], uniqueCount: 0, duplicates: [], duplicateCount: 0 } });
      }

      const duplicatePans = await this.db.checkDuplicates(pans);
      const unique = [];
      const duplicates = [];

      lineMap.forEach((items, pan) => {
        if (duplicatePans.has(pan)) {
          items.forEach(line => {
            const truncated = line.length > 28 ? line.substring(0, 28) + '..' : line;
            duplicates.push(`${truncated}\tDuplicate in database`);
          });
        } else {
          items.forEach(line => unique.push(line));
        }
      });

      return this.json({ success: true, data: { total: cards.length, unique, uniqueCount: unique.length, duplicates, duplicateCount: duplicates.length } });
    } catch (error) {
      console.error("Check duplicates error:", error);
      return this.json({ success: false, error: error.message }, 500);
    }
  }
  async importCards(request) {
    try {
      const { cards } = await request.json();
      if (!cards || !Array.isArray(cards)) return this.json({ success: false, error: "Invalid input" }, 400);
      if (cards.length > 100000) return this.json({ success: false, error: "Max 100,000 cards" }, 400);
      const normalized = CardUtils.normalizeAll(cards);
      if (normalized.valid.length === 0) {
        return this.json({ success: false, error: "No valid cards", data: { total: cards.length, imported: 0, skipped: 0, errors: normalized.errors, errorCount: normalized.errors.length } }, 400);
      }
      
      // 1. Thực hiện Import vào DB (Delta Update bin_inventory đã được xử lý trong database.js)
      const result = await this.db.importCards(normalized.valid);
      
      // 2. Cập nhật KV Dashboard (Cộng dồn tương đối)
      // Logic: Lấy cache cũ -> Cộng thêm số lượng mới -> Ghi đè
      // Giúp Dashboard hiển thị số tăng ngay lập tức mà không cần Query DB
      try {
        const currentDash = await this.cache.get("dashboard", {});
        if (currentDash && currentDash.data) {
          const addedCount = result.success || 0;
          
          // Cập nhật số tổng
          currentDash.data.totalCards = (currentDash.data.totalCards || 0) + addedCount;
          // Tạm thời cộng vào Unknown status (vì import mặc định là unknown)
          // Khi nào check live/die thì sẽ update lại sau
          // currentDash.data.unknownCards = (currentDash.data.unknownCards || 0) + addedCount; 
          
          // Lưu lại KV với TTL dài (vẫn giữ nguyên 1h hoặc tăng lên tùy ý, ở đây giữ nguyên logic cũ nhưng không xóa)
          await this.cache.set("dashboard", {}, currentDash, 604800); // 7 ngày
        }
      } catch (e) {
        console.error("KV update failed:", e);
      }

      // 3. KHÔNG clear cache search/stats để tránh Read spike
      // await Promise.all([
      //   this.cache.clear("dashboard"),
      //   this.cache.clear("stats"),
      //   this.cache.clear("card-stats"),
      //   this.cache.clear("search")
      // ]);
      
      const allErrors = [...normalized.errors, ...result.errors.map(e => `Error\t${e}`)];
      return this.json({ success: true, data: { total: cards.length, imported: result.success, skipped: result.skipped, errors: allErrors, errorCount: allErrors.length } });
    } catch (error) {
      return this.json({ success: false, error: error.message }, 500);
    }
  }
  async export(request) {
    try {
      const params = this.parseParams(new URL(request.url));
      params.limit = 10000;
      params.offset = 0;
      const { data } = await this.db.searchBIN(params);
      if (new URL(request.url).searchParams.get("format") === "csv") {
        const headers = Object.keys(data[0] || {});
        const csv = [headers.join(","), ...data.map(row => headers.map(h => JSON.stringify(row[h] || "")).join(","))].join("\n");
        return new Response(csv, { headers: { "Content-Type": "text/csv", "Content-Disposition": 'attachment; filename="bin-data.csv"' } });
      }
      return this.json({ success: true, data });
    } catch (error) {
      return this.json({ success: false, error: error.message }, 500);
    }
  }
  async search(request) {
    try {
      const params = this.parseParams(new URL(request.url));
      
      // Bin Checker (Global 400k BINs) -> MUST use D1
      // Reverted KV logic here as KV only contains inventory data (21k BINs)
      
      const cached = await this.cache.get("search", params);
      if (cached) return this.json(cached);
      
      const { data, total } = await this.db.searchBIN(params);
      const response = {
        success: true, data,
        pagination: { total, limit: params.limit, offset: params.offset, hasMore: params.offset + params.limit < total }
      };
      
      await this.cache.set("search", params, response, CACHE_TTL.SEARCH);
      return this.json(response);
    } catch (error) {
      console.error("Search error:", error);
      return this.json({ success: false, error: error.message }, 500);
    }
  }
  async getBIN(bin) {
    try {
      const cached = await this.cache.get("bin", { bin });
      if (cached) return this.json(cached);
      const data = await this.db.getBINById(bin);
      if (!data) return this.json({ success: false, error: "Not found" }, 404);
      const response = { 
        success: true, 
        data: {
          ...data,
          metadata: {
            alpha_2: data.country,
            alpha_3: this.getCountryAlpha3(data.country),
            country_name: this.getCountryName(data.country),
            currency: this.getCountryCurrency(data.country)
          }
        }
      };
      await this.cache.set("bin", { bin }, response, CACHE_TTL.BIN_DETAIL);
      return this.json(response);
    } catch (error) {
      return this.json({ success: false, error: error.message }, 500);
    }
  }
  async stats() {
    try {
      const cached = await this.cache.get("stats", {});
      if (cached) return this.json(cached);
      const data = await this.db.getStats();
      const response = { success: true, data };
      await this.cache.set("stats", {}, response, CACHE_TTL.STATS);
      return this.json(response);
    } catch (error) {
      console.error("Stats error:", error);
      return this.json({ success: false, error: error.message }, 500);
    }
  }
  async dashboard() {
    try {
      const cached = await this.cache.get("dashboard", {});
      if (cached) return this.json(cached);
      const data = await this.db.getDashboardStats();
      const response = { success: true, data };
      await this.cache.set("dashboard", {}, response, CACHE_TTL.DASHBOARD);
      return this.json(response);
    } catch (error) {
      console.error("Dashboard error:", error);
      return this.json({ success: false, error: error.message, data: { totalCards: 0, totalRecords: 0, brands: [], types: [], categories: [], countries: [], topBins: [] } }, 200);
    }
  }
  async filters() {
    try {
      // KV-First for Filters
      try {
        const cache = await this.cache.get("bin_cache_v2");
        if (cache && cache.m) {
          return this.json({
            success: true,
            data: {
              brands: cache.m.b,
              types: cache.m.t,
              categories: cache.m.cat || [],
              countries: cache.m.c,
              issuers: cache.m.i
            }
          });
        }
      } catch (e) {
        console.error("BinCache filters error:", e);
      }

      // Fallback
      const cached = await this.cache.get("filters_v2", {});
      if (cached) return this.json(cached);
      const data = await this.db.getFilters();
      const response = { success: true, data };
      await this.cache.set("filters_v2", {}, response, CACHE_TTL.FILTERS);
      return this.json(response);
    } catch (error) {
      console.error("Filters error:", error);
      return this.json({ success: false, error: error.message }, 500);
    }
  }
  async rebuildStats(request, env) {
    // Đây là nút "Update Data" thủ công
    // Logic: Quét DB thật -> Ghi đè Cache -> Chính xác 100%
    try {
      // 1. Rebuild bin_inventory (Nếu cần thiết, nhưng với Delta Update thì bước này nhẹ)
      const ok1 = await this.db.buildBinCardStats();
      
      // 2. Lấy số liệu mới nhất từ DB
      const dashboardData = await this.db.getDashboardStats();
      const statsData = await this.db.getStats();
      const filterData = await this.db.getFilters();
      
      // 3. Ghi đè vào KV (Refresh Cache)
      const binRows = await this.db.getBinInventoryForCache();
      const binCache = BinCache.compress(binRows);
      
      await Promise.all([
        this.cache.set("dashboard", {}, { success: true, data: dashboardData }, 604800), // 7 ngày
        this.cache.set("stats", {}, { success: true, data: statsData }, 604800),
        this.cache.set("filters_v2", {}, { success: true, data: filterData }, 604800),
        this.cache.set("bin_cache_v2", {}, binCache, 604800) // 7 ngày
      ]);
      
      // Clear các cache tìm kiếm cũ để user search ra dữ liệu mới
      await this.cache.clear("search");
      
      return this.json({ success: true, message: "Data updated and cached successfully" });
    } catch (error) {
      return this.json({ success: false, error: error.message }, 500);
    }
  }
  getCountryAlpha3(country) {
    const map = { US: "USA", PL: "POL", GB: "GBR", JP: "JPN", VN: "VNM", CA: "CAN", AU: "AUS", DE: "DEU" };
    return map[country] || country;
  }
  getCountryName(country) {
    const map = { US: "United States", PL: "Poland", GB: "United Kingdom", JP: "Japan", VN: "Vietnam", CA: "Canada", AU: "Australia", DE: "Germany" };
    return map[country] || country;
  }
  getCountryCurrency(country) {
    const map = { US: "USD", PL: "PLN", GB: "GBP", JP: "JPY", VN: "VND", CA: "CAD", AU: "AUD", DE: "EUR" };
    return map[country] || "USD";
  }
}
