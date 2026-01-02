export class DatabaseService {
  constructor(db) { this.db = db; }

  async ensureIndexes() {
    try {
      await this.db.batch([
        this.db.prepare("CREATE INDEX IF NOT EXISTS idx_cdata_bin_status ON cdata(Bin, status)"),
        this.db.prepare("CREATE INDEX IF NOT EXISTS idx_cdata_pan ON cdata(pan)"),
        this.db.prepare("CREATE INDEX IF NOT EXISTS idx_cdata_yy_mm ON cdata(yy, mm)"),
        this.db.prepare("DROP INDEX IF EXISTS idx_cdata_bin"),
        this.db.prepare("DROP INDEX IF EXISTS idx_cdata_bin_status_pan"),
        this.db.prepare("DROP INDEX IF EXISTS idx_cdata_status_bin"),
        this.db.prepare("DROP INDEX IF EXISTS idx_bindata_brand"),
        this.db.prepare("DROP INDEX IF EXISTS idx_bindata_type"),
        this.db.prepare("DROP INDEX IF EXISTS idx_bindata_category"),
        this.db.prepare("DROP INDEX IF EXISTS idx_bindata_country"),
        this.db.prepare("DROP INDEX IF EXISTS idx_bindata_issuer"),
        this.db.prepare("DROP INDEX IF EXISTS idx_bindata_bin_brand_type"),
        this.db.prepare("CREATE INDEX IF NOT EXISTS idx_bindata_brand_type_cat_country ON BIN_Data(Brand, Type, Category, isoCode2)"),
        this.db.prepare("CREATE TABLE IF NOT EXISTS bin_inventory (Bin TEXT PRIMARY KEY, Brand TEXT NOT NULL DEFAULT 'UNKNOWN', Type TEXT NOT NULL DEFAULT 'UNKNOWN', Category TEXT NOT NULL DEFAULT 'UNKNOWN', isoCode2 TEXT NOT NULL DEFAULT 'XX', Issuer TEXT NOT NULL DEFAULT 'UNKNOWN', CountryName TEXT, total_cards INTEGER NOT NULL DEFAULT 0, live_cards INTEGER NOT NULL DEFAULT 0, ct_cards INTEGER NOT NULL DEFAULT 0, die_cards INTEGER NOT NULL DEFAULT 0, unknown_cards INTEGER NOT NULL DEFAULT 0, updated_at INTEGER NOT NULL DEFAULT (strftime('%s','now')) )"),
        this.db.prepare("CREATE INDEX IF NOT EXISTS idx_bininv_country_brand ON bin_inventory(isoCode2, Brand)"),
        this.db.prepare("CREATE INDEX IF NOT EXISTS idx_bininv_brand_type ON bin_inventory(Brand, Type)"),
        this.db.prepare("CREATE INDEX IF NOT EXISTS idx_bininv_category ON bin_inventory(Category)"),
        this.db.prepare("CREATE INDEX IF NOT EXISTS idx_bininv_total ON bin_inventory(total_cards DESC)")
      ]);
    } catch (e) {
      console.error("Index creation error:", e);
    }
  }

  async getCardStats() {
    try {
      const [totals, brandResult, typeResult, categoryResult, countryResult, topBinsResult, statusAgg] = await Promise.all([
        this.db.prepare(`SELECT SUM(total_cards) as totalCards, COUNT(*) as uniqueBins FROM bin_inventory`).first(),
        this.db.prepare(`SELECT Brand as brand, SUM(total_cards) as count FROM bin_inventory GROUP BY Brand ORDER BY count DESC LIMIT 10`).all(),
        this.db.prepare(`SELECT Type as type, SUM(total_cards) as count FROM bin_inventory GROUP BY Type ORDER BY count DESC LIMIT 10`).all(),
        this.db.prepare(`SELECT Category as category, SUM(total_cards) as count FROM bin_inventory GROUP BY Category ORDER BY count DESC LIMIT 10`).all(),
        this.db.prepare(`SELECT isoCode2 as country, SUM(total_cards) as count FROM bin_inventory GROUP BY isoCode2 ORDER BY count DESC LIMIT 10`).all(),
        this.db.prepare(`SELECT Bin, total_cards as count FROM bin_inventory ORDER BY total_cards DESC LIMIT 10`).all(),
        this.db.prepare(`SELECT SUM(live_cards) as live, SUM(die_cards) as die, SUM(ct_cards) as ct, SUM(unknown_cards) as unknown FROM bin_inventory`).first()
      ]);

      const byStatus = {
        live: statusAgg?.live || 0,
        die: statusAgg?.die || 0,
        ct: statusAgg?.ct || 0,
        unknown: statusAgg?.unknown || 0
      };

      return {
        totalCards: totals?.totalCards || 0,
        uniqueBins: totals?.uniqueBins || 0,
        byStatus,
        byBrand: (brandResult.results || []).reduce((acc, r) => { acc[r.brand] = r.count; return acc; }, {}),
        byType: (typeResult.results || []).reduce((acc, r) => { acc[r.type] = r.count; return acc; }, {}),
        byCategory: (categoryResult.results || []).reduce((acc, r) => { acc[r.category] = r.count; return acc; }, {}),
        byCountry: (countryResult.results || []).reduce((acc, r) => { acc[r.country] = r.count; return acc; }, {}),
        topBins: (topBinsResult.results || []).map(r => ({ Bin: r.Bin, count: r.count }))
      };
    } catch (error) {
      console.error("Card stats error:", error);
      throw error;
    }
  }

  async searchBins(params) {
    const { brand, type, category, country, issuer, bins = [], minCards = 10, maxBins = 10000, status = ['unknown', '1', '2'] } = params;
    const where = ["1=1"];
    const qp = [];
    if (Array.isArray(bins) && bins.length > 0) { where.push(`Bin IN (${bins.map(() => '?').join(',')})`); qp.push(...bins); }
    if (brand) { where.push("Brand = ?"); qp.push(brand); }
    if (type) { where.push("Type = ?"); qp.push(type); }
    if (category) { where.push("Category = ?"); qp.push(category); }
    if (country) { where.push("isoCode2 = ?"); qp.push(country); }
    if (issuer) { where.push("Issuer LIKE ?"); qp.push(`%${issuer}%`); }
    where.push("total_cards >= ?"); qp.push(minCards);
    let statusFilterExpr = null;
    const hasStatus = Array.isArray(status) && status.length > 0;
    if (hasStatus) {
      const set = new Set(status);
      const parts = [];
      if (set.has('1')) parts.push("live_cards > 0");
      if (set.has('2')) parts.push("ct_cards > 0");
      if (set.has('0')) parts.push("die_cards > 0");
      if (set.has('unknown')) parts.push("unknown_cards > 0");
      if (parts.length > 0) statusFilterExpr = parts.join(" OR ");
    }
    const sql = `
      SELECT 
        Bin as bin,
        Brand as brand,
        Type as type,
        Category as category,
        isoCode2 as country,
        Issuer as issuer,
        total_cards as cardCount,
        live_cards as liveCount
      FROM bin_inventory
      WHERE ${where.join(" AND ")}
      ${statusFilterExpr ? `AND (${statusFilterExpr})` : ''}
      ORDER BY total_cards DESC
      LIMIT ?
    `;
    qp.push(Math.min(maxBins || 100000, 100000));
    try {
      const result = await this.db.prepare(sql).bind(...qp).all();
      const bins = (result.results || []).map(r => ({
        ...r,
        liveRate: r.cardCount > 0 ? (r.liveCount / r.cardCount) : 0
      }));
      return { bins, total: bins.length };
    } catch (error) {
      console.error("Search bins error:", error);
      throw error;
    }
  }

  async exportCards(params) {
    const { bins, limit = 100, offset = 0, status = ['unknown', '1', '2'], format = 'text', sequential = false } = params;
    if (!bins || bins.length === 0) {
      return { cards: [], stats: { totalBins: 0, totalCards: 0, byBin: {} } };
    }
    
    // Nếu sequential = true, ta export tuần tự tốc độ cao (cho Full Export)
    // Nếu sequential = false, ta dùng logic cũ (Random Sample per BIN)
    
    const statusPlaceholders = status.map(() => "?").join(",");
    const binPlaceholders = bins.map(() => "?").join(",");
    
    try {
      let result;
      if (sequential) {
        // Full export logic: Simple SELECT with LIMIT/OFFSET
        const sql = `
          SELECT pan, mm, yy, cvv, Bin, info
          FROM cdata
          WHERE Bin IN (${binPlaceholders})
            AND status IN (${statusPlaceholders})
          ORDER BY Bin, pan
          LIMIT ? OFFSET ?
        `;
        result = await this.db.prepare(sql).bind(...bins, ...status, limit, offset).all();
      } else {
        // Sample logic: Random N cards per BIN
        result = await this.db.prepare(`
          WITH RankedCards AS (
            SELECT 
              c.pan, c.mm, c.yy, c.cvv, c.Bin, c.info,
              ROW_NUMBER() OVER (PARTITION BY c.Bin ORDER BY RANDOM()) as rn
            FROM cdata c
            WHERE c.Bin IN (${binPlaceholders})
              AND c.status IN (${statusPlaceholders})
          )
          SELECT pan, mm, yy, cvv, Bin, info
          FROM RankedCards
          WHERE rn <= ?
          ORDER BY Bin, rn
        `).bind(...bins, ...status, limit).all();
      }

      const byBin = {};
      const cards = [];
      (result.results || []).forEach(c => {
        let cardStr = '';
        if (format === 'pan') {
          cardStr = `${c.pan}`;
        } else if (format === 'full') {
          cardStr = `${c.pan}|${c.mm}|${c.yy}|${c.cvv}|${c.info || ''}`;
        } else {
          // default 'text' (plain)
          cardStr = `${c.pan}|${c.mm}|${c.yy}|${c.cvv}`;
        }
          
        if (!byBin[c.Bin]) byBin[c.Bin] = 0;
        byBin[c.Bin]++;
        
        cards.push(cardStr);
      });

      return {
        cards,
        stats: {
          totalBins: Object.keys(byBin).length,
          totalCards: cards.length,
          byBin
        }
      };
    } catch (error) {
      console.error("Export cards error:", error);
      throw error;
    }
  }

  async searchBIN(params) {
    const { bin, brand, type, category, country, issuer, limit = 50, offset = 0 } = params;
    let whereConditions = [];
    let queryParams = [];
    if (bin) {
      const bins = bin.split(",").map(b => b.trim()).filter(Boolean);
      whereConditions.push(`BIN IN (${bins.map(() => "?").join(",")})`);
      queryParams.push(...bins);
    }
    if (brand) {
      const values = brand.split(",").map(v => v.trim()).filter(Boolean);
      whereConditions.push(values.length > 1 ? `Brand IN (${values.map(() => "?").join(",")})` : "Brand = ?");
      queryParams.push(...values);
    }
    if (type) {
      const values = type.split(",").map(v => v.trim()).filter(Boolean);
      whereConditions.push(values.length > 1 ? `Type IN (${values.map(() => "?").join(",")})` : "Type = ?");
      queryParams.push(...values);
    }
    if (category) {
      const values = category.split(",").map(v => v.trim()).filter(Boolean);
      whereConditions.push(values.length > 1 ? `Category IN (${values.map(() => "?").join(",")})` : "Category = ?");
      queryParams.push(...values);
    }
    if (country) {
      const values = country.split(",").map(v => v.trim()).filter(Boolean);
      whereConditions.push(values.length > 1 ? `isoCode2 IN (${values.map(() => "?").join(",")})` : "isoCode2 = ?");
      queryParams.push(...values);
    }
    if (issuer) {
      const values = issuer.split(",").map(v => v.trim()).filter(Boolean);
      whereConditions.push(values.length > 1 ? `Issuer IN (${values.map(() => "?").join(",")})` : "Issuer LIKE ?");
      queryParams.push(...(values.length > 1 ? values : [`%${values[0]}%`]));
    }
    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(" AND ")}` : "";
    const countResult = await this.db.prepare(`SELECT COUNT(*) as total FROM BIN_Data ${whereClause}`).bind(...queryParams).first();
    const total = countResult?.total || 0;
    queryParams.push(limit, offset);
    const dataResult = await this.db.prepare(`
      SELECT BIN as bin, Brand as brand, Type as type, Category as category, 
             Issuer as issuer, isoCode2 as country
      FROM BIN_Data ${whereClause} ORDER BY BIN ASC LIMIT ? OFFSET ?
    `).bind(...queryParams).all();
    return { data: dataResult.results || [], total };
  }

  async getBINById(bin) {
    return await this.db.prepare(`
      SELECT BIN as bin, Brand as brand, Type as type, Category as category,
             Issuer as issuer, isoCode2 as country
      FROM BIN_Data WHERE BIN = ? LIMIT 1
    `).bind(bin).first();
  }

  async getStats() {
    const [totalResult, brandsResult, countriesResult, typesResult, categoriesResult] = await Promise.all([
      this.db.prepare("SELECT COUNT(*) as total FROM BIN_Data").first(),
      this.db.prepare("SELECT Brand as brand, COUNT(*) as count FROM BIN_Data GROUP BY Brand ORDER BY count DESC LIMIT 10").all(),
      this.db.prepare("SELECT isoCode2 as country, COUNT(*) as count FROM BIN_Data GROUP BY isoCode2 ORDER BY count DESC LIMIT 10").all(),
      this.db.prepare("SELECT Type as type, COUNT(*) as count FROM BIN_Data GROUP BY Type ORDER BY count DESC").all(),
      this.db.prepare("SELECT Category as category, COUNT(*) as count FROM BIN_Data GROUP BY Category ORDER BY count DESC LIMIT 20").all()
    ]);
    return {
      totalRecords: totalResult?.total || 0,
      brands: brandsResult.results || [],
      countries: countriesResult.results || [],
      types: typesResult.results || [],
      categories: categoriesResult.results || []
    };
  }

  async getDashboardStats() {
    const [totals, statusAgg, topBins, brandResult, typeResult, categoryResult, countryResult] = await Promise.all([
      this.db.prepare(`SELECT SUM(total_cards) as totalCards, COUNT(*) as totalRecords FROM bin_inventory`).first(),
      this.db.prepare(`SELECT SUM(live_cards) as live, SUM(die_cards) as die FROM bin_inventory`).first(),
      this.db.prepare(`SELECT Bin, total_cards as count FROM bin_inventory ORDER BY total_cards DESC LIMIT 10`).all(),
      this.db.prepare(`SELECT Brand as brand, SUM(total_cards) as count FROM bin_inventory GROUP BY Brand ORDER BY count DESC LIMIT 10`).all(),
      this.db.prepare(`SELECT Type as type, SUM(total_cards) as count FROM bin_inventory GROUP BY Type ORDER BY count DESC LIMIT 10`).all(),
      this.db.prepare(`SELECT Category as category, SUM(total_cards) as count FROM bin_inventory GROUP BY Category ORDER BY count DESC LIMIT 10`).all(),
      this.db.prepare(`SELECT isoCode2 as country, SUM(total_cards) as count FROM bin_inventory GROUP BY isoCode2 ORDER BY count DESC LIMIT 10`).all()
    ]);
    return {
      totalCards: totals?.totalCards || 0,
      totalRecords: totals?.totalRecords || 0,
      liveCards: statusAgg?.live || 0,
      dieCards: statusAgg?.die || 0,
      topBins: topBins.results || [],
      brands: brandResult.results || [],
      types: typeResult.results || [],
      categories: categoryResult.results || [],
      countries: countryResult.results || []
    };
  }

  async getFilters() {
    const [brandsRes, typesRes, categoriesRes, countriesRes, issuersRes] = await Promise.all([
      this.db.prepare("SELECT DISTINCT Brand as brand FROM BIN_Data WHERE Brand IS NOT NULL ORDER BY brand ASC").all(),
      this.db.prepare("SELECT DISTINCT Type as type FROM BIN_Data WHERE Type IS NOT NULL ORDER BY type ASC").all(),
      this.db.prepare("SELECT DISTINCT Category as category FROM BIN_Data ORDER BY category ASC").all(),
      this.db.prepare("SELECT DISTINCT isoCode2 as country FROM BIN_Data ORDER BY country ASC").all(),
      this.db.prepare("SELECT DISTINCT Issuer as issuer FROM BIN_Data WHERE Issuer IS NOT NULL ORDER BY issuer ASC LIMIT 200").all()
    ]);
    return {
      brands: (brandsRes.results || []).map(b => b.brand).filter(Boolean),
      types: (typesRes.results || []).map(t => t.type).filter(Boolean),
      categories: (categoriesRes.results || []).map(c => c.category || "").filter(Boolean),
      countries: (countriesRes.results || []).map(c => c.country || "").filter(Boolean),
      issuers: (issuersRes.results || []).map(i => i.issuer).filter(Boolean)
    };
  }

  async checkDuplicates(pans) {
    const duplicates = new Set();
    const uniquePans = [...new Set(pans)];
    if (uniquePans.length === 0) return duplicates;
    try {
      await this.db.batch([
        this.db.prepare(`DROP TABLE IF EXISTS tmp_pans`),
        this.db.prepare(`CREATE TEMP TABLE tmp_pans (pan TEXT PRIMARY KEY)`)
      ]);
      const MAX_VALUES_PER_INSERT = 100;
      for (let i = 0; i < uniquePans.length; i += MAX_VALUES_PER_INSERT) {
        const chunk = uniquePans.slice(i, i + MAX_VALUES_PER_INSERT);
        const placeholders = chunk.map(() => "(?)").join(",");
        const values = chunk;
        await this.db.prepare(`INSERT OR IGNORE INTO tmp_pans (pan) VALUES ${placeholders}`).bind(...values).run();
      }
      const result = await this.db.prepare(`SELECT c.pan FROM cdata c INNER JOIN tmp_pans t ON c.pan = t.pan`).all();
      (result.results || []).forEach(r => duplicates.add(r.pan));
      await this.db.prepare(`DROP TABLE IF EXISTS tmp_pans`).run();
    } catch (error) {
      console.error("Check duplicates temp table error:", error);
      const CHUNK_SIZE = 100;
      const queries = [];
      for (let i = 0; i < uniquePans.length; i += CHUNK_SIZE) {
        const chunk = uniquePans.slice(i, i + CHUNK_SIZE);
        const placeholders = chunk.map(() => "?").join(",");
        queries.push(this.db.prepare(`SELECT pan FROM cdata WHERE pan IN (${placeholders})`).bind(...chunk).all());
      }
      const results = await Promise.all(queries);
      results.forEach(result => { (result.results || []).forEach(r => duplicates.add(r.pan)); });
    }
    return duplicates;
  }

  async importCards(cards) {
    const CARDS_PER_INSERT = 12; // Keep low to respect D1 limits
    let success = 0, skipped = 0, errors = [];
    
    // 1. Chỉ thực hiện Insert vào cdata (Write tối thiểu)
    for (let i = 0; i < cards.length; i += CARDS_PER_INSERT) {
      const chunk = cards.slice(i, i + CARDS_PER_INSERT);
      try {
        const placeholders = chunk.map(() => "(?, ?, ?, ?, ?, ?, ?, 'unknown')").join(",");
        const values = [];
        chunk.forEach(c => {
          values.push(c.pan, c.mm, c.yy, c.cvv, c.bin, c.last4, c.info || null);
        });
        await this.db.prepare(`INSERT OR IGNORE INTO cdata (pan, mm, yy, cvv, Bin, last4, info, status) VALUES ${placeholders}`).bind(...values).run();
        success += chunk.length;
      } catch (error) {
        skipped += chunk.length;
        errors.push(`Chunk ${Math.floor(i / CARDS_PER_INSERT) + 1}: ${error.message}`);
      }
    }

    // 2. KHÔNG update bin_inventory hay country_stats tại đây để tiết kiệm Write
    // 3. KHÔNG clear cache để đảm bảo Dashboard vẫn load nhanh (dữ liệu cũ)
    
    return { success, skipped, errors };
  }

  async buildBinCardStats() {
    try {
      await this.db.batch([
        this.db.prepare(`DELETE FROM bin_inventory`),
        this.db.prepare(`INSERT INTO bin_inventory (Bin, Brand, Type, Category, isoCode2, Issuer, CountryName, total_cards, live_cards, ct_cards, die_cards, unknown_cards) SELECT c.Bin, COALESCE(b.Brand,'UNKNOWN'), COALESCE(b.Type,'UNKNOWN'), COALESCE(b.Category,'UNKNOWN'), COALESCE(b.isoCode2,'XX'), COALESCE(b.Issuer,'UNKNOWN'), b.CountryName, COUNT(*) as total_cards, SUM(CASE WHEN c.status='1' THEN 1 ELSE 0 END) as live_cards, SUM(CASE WHEN c.status='2' THEN 1 ELSE 0 END) as ct_cards, SUM(CASE WHEN c.status='0' THEN 1 ELSE 0 END) as die_cards, SUM(CASE WHEN c.status='unknown' THEN 1 ELSE 0 END) as unknown_cards FROM cdata c LEFT JOIN BIN_Data b ON c.Bin = b.BIN GROUP BY c.Bin`)
      ]);
      return true;
    } catch (e) { return false; }
  }
}
