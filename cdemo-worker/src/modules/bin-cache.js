export class BinCache {
  /**
   * Nén danh sách BIN từ DB thành cấu trúc Dictionary Compression
   * @param {Array} rows - Danh sách dòng từ bảng bin_inventory
   * @returns {Object} - Cấu trúc { m: metadata, d: data, u: updated_at }
   */
  static compress(rows) {
    const m = {
      b: [], // Brands
      t: [], // Types
      cat: [], // Categories
      c: [], // Countries (isoCode2)
      i: []  // Issuers
    };
    
    // Maps để lookup index nhanh khi nén
    const maps = {
      b: new Map(),
      t: new Map(),
      cat: new Map(),
      c: new Map(),
      i: new Map()
    };

    const getIndex = (key, value) => {
      const val = value ? value.trim() : "UNKNOWN";
      if (!maps[key].has(val)) {
        const idx = m[key].length;
        m[key].push(val);
        maps[key].set(val, idx);
        return idx;
      }
      return maps[key].get(val);
    };

    const d = {};
    
    rows.forEach(r => {
      // Cấu trúc mảng: [BrandIdx, TypeIdx, CategoryIdx, CountryIdx, IssuerIdx, TotalCards, LiveCards, DieCards]
      d[r.Bin] = [
        getIndex('b', r.Brand),
        getIndex('t', r.Type),
        getIndex('cat', r.Category),
        getIndex('c', r.isoCode2),
        getIndex('i', r.Issuer),
        r.total_cards || 0,
        r.live_cards || 0,
        r.die_cards || 0
      ];
    });

    return {
      m,
      d,
      u: Math.floor(Date.now() / 1000) // Unix timestamp
    };
  }

  /**
   * Giải nén thông tin cho một list BIN cụ thể (Card Checker)
   * @param {Object} cache - Dữ liệu nén từ KV
   * @param {Array} bins - Danh sách BIN cần tra cứu
   */
  static lookup(cache, bins) {
    if (!cache || !cache.d) return [];
    
    const results = [];
    const { m, d } = cache;

    bins.forEach(bin => {
      const data = d[bin];
      if (data) {
        // [Brand, Type, Cat, Country, Issuer, Total, Live, Die]
        results.push({
          bin: bin,
          brand: m.b[data[0]],
          type: m.t[data[1]],
          category: m.cat ? m.cat[data[2]] : 'UNKNOWN',
          country: m.c[data[3]],
          issuer: m.i[data[4]],
          cardCount: data[5],
          liveCount: data[6],
          dieCount: data[7],
          source: 'cache'
        });
      } else {
        results.push({
          bin: bin,
          brand: 'UNKNOWN',
          type: 'UNKNOWN',
          category: 'UNKNOWN',
          country: 'XX',
          issuer: 'UNKNOWN',
          cardCount: 0,
          liveCount: 0,
          source: 'unknown'
        });
      }
    });
    
    return results;
  }

  static search(cache, params) {
    if (!cache || !cache.d) return { bins: [], total: 0 };

    const { m, d } = cache;
    const { brand, type, category, country, issuer, bin, minCards = 0, limit = 50, offset = 0 } = params;

    const findIdx = (key, val) => {
      if (!val) return -1;
      return m[key].indexOf(val);
    };

    const brandIdx = findIdx('b', brand);
    const typeIdx = findIdx('t', type);
    const catIdx = findIdx('cat', category);
    const countryIdx = findIdx('c', country);
    const issuerIdx = findIdx('i', issuer);

    let entries = Object.entries(d);

    entries = entries.filter(([b, data]) => {
      if (bin && !b.startsWith(bin)) return false;
      if (minCards > 0 && data[5] < minCards) return false;
      if (brand && data[0] !== brandIdx) return false;
      if (type && data[1] !== typeIdx) return false;
      if (category && data[2] !== catIdx) return false;
      if (country && data[3] !== countryIdx) return false;
      if (issuer && data[4] !== issuerIdx) return false;
      
      return true;
    });

    const total = entries.length;

    entries.sort((a, b) => b[1][5] - a[1][5]); // Sort by total_cards (index 5)

    const page = entries.slice(offset, offset + limit);

    const bins = page.map(([b, data]) => ({
      bin: b,
      brand: m.b[data[0]],
      type: m.t[data[1]],
      category: m.cat ? m.cat[data[2]] : 'UNKNOWN',
      country: m.c[data[3]],
      issuer: m.i[data[4]],
      cardCount: data[5],
      liveCount: data[6],
      liveRate: data[5] > 0 ? data[6]/data[5] : 0
    }));

    return { bins, total };
  }
}