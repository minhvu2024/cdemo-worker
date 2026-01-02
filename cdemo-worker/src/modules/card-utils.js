export class CardUtils {
  static luhnCheck(pan) {
    let sum = 0;
    let isEven = false;
    for (let i = pan.length - 1; i >= 0; i--) {
      let digit = parseInt(pan[i]);
      if (isEven) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      sum += digit;
      isEven = !isEven;
    }
    return sum % 10 === 0;
  }
  static isExpired(mm, yy) {
    const now = new Date();
    const currentYear = now.getFullYear() % 100;
    const currentMonth = now.getMonth() + 1;
    const year = parseInt(yy);
    const month = parseInt(mm);
    if (year < currentYear) return true;
    if (year === currentYear && month < currentMonth) return true;
    return false;
  }
  static normalize(line, filterExpired = false) {
    line = line.trim();
    if (!line) return { error: "Empty line" };
    line = line.replace(/\s*\|\s*/g, '|');
    line = line.replace(/\s*\/\s*/g, '/');
    line = line.replace(/\s*,\s*/g, ',');
    const patterns = [
      { regex: /^(\d{15,19})\|(\d{1,2})\|(\d{2,4})\|(\d{3,4})(.*)$/, delimiter: '|' },
      { regex: /^(\d{15,19})\/(\d{1,2})\/(\d{2,4})\/(\d{3,4})(.*)$/, delimiter: '/' },
      { regex: /^(\d{15,19}),(\d{1,2}),(\d{2,4}),(\d{3,4})(.*)$/, delimiter: ',' },
      { regex: /^(\d{15,19})\s+(\d{1,2})\s+(\d{2,4})\s+(\d{3,4})(.*)$/, delimiter: ' ' }
    ];
    for (const pattern of patterns) {
      const match = line.match(pattern.regex);
      if (match) {
        const [, pan, mm, yy, cvv, extraInfo] = match;
        if (!/^\d+$/.test(pan)) return { error: "PAN contains non-digit" };
        if (pan.length < 13) return { error: "PAN too short (min 13 digits)" };
        if (pan.length > 19) return { error: "PAN too long (max 19 digits)" };
        if (!CardUtils.luhnCheck(pan)) return { error: "Invalid PAN (Luhn check failed)" };
        if (!/^\d+$/.test(mm)) return { error: "Month not numeric" };
        const month = parseInt(mm);
        if (month < 1 || month > 12) return { error: "Invalid month" };
        if (!/^\d+$/.test(yy)) return { error: "Year not numeric" };
        if (yy.length !== 2 && yy.length !== 4) return { error: "Invalid year format" };
        if (!/^\d+$/.test(cvv)) return { error: "CVV not numeric" };
        if (cvv.length < 3) return { error: "CVV too short" };
        if (cvv.length > 4) return { error: "CVV too long" };
        let normalizedYY = yy.length === 4 ? yy.slice(-2) : yy;
        const paddedMM = mm.padStart(2, '0');
        const paddedYY = normalizedYY.padStart(2, '0');
        if (filterExpired && CardUtils.isExpired(paddedMM, paddedYY)) {
          return { error: "Card expired" };
        }
        let info = null;
        if (extraInfo && extraInfo.trim()) {
          info = extraInfo.replace(/^[\|\/, ]+/, '').trim();
          if (info.length === 0) info = null;
        }
        return {
          pan,
          cvv,
          info,
          mm: paddedMM,
          yy: paddedYY,
          bin: pan.slice(0, 6),
          last4: pan.slice(-4),
          normalized: `${pan}|${paddedMM}|${paddedYY}|${cvv}`
        };
      }
    }
    return { error: "Invalid format" };
  }
  static normalizeAll(lines, filterExpired = false) {
    const valid = [], errors = [];
    const seen = new Set();
    
    lines.forEach((line, i) => {
      const result = CardUtils.normalize(line, filterExpired);
      if (result?.error) {
        const truncated = line.length > 28 ? line.substring(0, 28) + '..' : line;
        errors.push(`${truncated}\t${result.error}`);
      } else if (result) {
        // Check for duplicates
        if (seen.has(result.normalized)) {
           // It's a duplicate within this batch
           // We silently skip it or maybe add to errors if user wants to know?
           // User request: "loại bỏ 1 dòng bị trùng" -> imply silent deduplication for "Normalize Cards"
           // For Import, maybe we want to know? But this is CardUtils.
           // Let's just skip it from valid list.
           const truncated = line.length > 28 ? line.substring(0, 28) + '..' : line;
           errors.push(`${truncated}\tDuplicate in input`);
        } else {
           seen.add(result.normalized);
           valid.push(result);
        }
      }
    });
    return { valid, errors };
  }
}
