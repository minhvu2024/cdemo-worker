# Đề xuất sửa lỗi Filter Card Checker

## 1. Nguyên nhân
- Hiện tại, logic tìm kiếm trong `router.js` đang sử dụng hàm `BinCache.lookup(cache, bins)`.
- Hàm này hoạt động theo cơ chế: **Tra cứu thông tin cho một danh sách BIN cụ thể**.
- Khi người dùng sử dụng bộ lọc (Filter) theo Brand, Country, Type... mà **không nhập danh sách BIN cụ thể**, tham số `bins` gửi lên là mảng rỗng `[]`.
- Do đó, `BinCache.lookup` trả về kết quả rỗng -> Hệ thống báo "Found 0 BINs".

## 2. Giải pháp đề xuất
Cập nhật logic trong `src/router.js` để xử lý hai trường hợp riêng biệt:

1.  **Trường hợp 1: Người dùng nhập danh sách BIN cụ thể**
    - Giữ nguyên logic cũ: Sử dụng `BinCache.lookup` để tra cứu nhanh thông tin cho các BIN đó.

2.  **Trường hợp 2: Người dùng chỉ dùng bộ lọc (Filter) mà không nhập BIN**
    - Chuyển sang sử dụng hàm `BinCache.search(cache, params)`.
    - Hàm này đã có sẵn trong `modules/bin-cache.js`, hỗ trợ quét toàn bộ dữ liệu trong Cache để tìm các BIN thỏa mãn tiêu chí (Brand, Country, Type, MinCards...).

## 3. Mã giả (Logic mới)
```javascript
// src/router.js

const cache = await this.cache.get("bin_cache_v2");
if (cache) {
  const bins = body.bins || [];

  if (bins.length > 0) {
    // CASE 1: Có danh sách BIN -> Dùng Lookup
    kvResults = BinCache.lookup(cache, bins);
  } else {
    // CASE 2: Không có danh sách BIN (Filter Mode) -> Dùng Search
    const searchResult = BinCache.search(cache, { ...body, limit: 1000 });
    kvResults = searchResult.bins;
  }
  
  // Trả về kết quả nếu thỏa mãn điều kiện tối ưu (minCards >= 10)
  if (minCards >= 10 && kvResults.length > 0) {
      return this.json({ success: true, bins: kvResults, total: kvResults.length });
  }
}
```

## 4. Lưu ý
- Dữ liệu trong Cache (KV) được tối ưu cho các BIN có số lượng thẻ **>= 10**.
- Nếu người dùng tìm kiếm với `minCards < 10` và dùng bộ lọc, kết quả từ Cache có thể chưa đầy đủ (thiếu các BIN nhỏ). Tuy nhiên, với tính năng "Card Checker" (thường dùng để tìm BIN lớn để export), việc ưu tiên Cache là hợp lý để đảm bảo tốc độ.
