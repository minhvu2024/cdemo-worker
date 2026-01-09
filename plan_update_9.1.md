# Kế hoạch Triển khai Update 9.1 (Tối ưu Import & Reconcile)

Dựa trên tài liệu `update 9.1.txt`, tôi đề xuất kế hoạch triển khai như sau:

## 1. Mục tiêu
- **Giảm tải D1 Read/Write:** Chuyển đổi cơ chế cập nhật `bin_inventory` từ "Re-calculate" sang "Delta Update in Memory".
- **Tăng tốc độ Import:** Loại bỏ hoàn toàn bước đọc bảng `cdata` khi import thẻ mới.
- **Đảm bảo tính sẵn sàng:** Chuyển đổi cơ chế Rebuild sang Refresh (giảm thời gian downtime của bảng thống kê).

## 2. Chi tiết triển khai

### Phase 1: Tối ưu Daily Import (Delta Update) - **Thay đổi quan trọng nhất**

**Hiện tại:**
1. Insert thẻ vào `cdata`.
2. Query `cdata` để tính lại tổng số thẻ (GROUP BY Bin) cho các BIN bị ảnh hưởng.
3. Upsert kết quả vào `bin_inventory` (Ghi đè giá trị cũ).
-> **Vấn đề:** Phải đọc `cdata` (bảng lớn) mỗi lần import -> Tốn Read D1.

**Thay đổi (Theo Update 9.1):**
1. Tính toán Delta ngay trong Memory (từ danh sách thẻ đầu vào):
   - Ví dụ: BIN 414720 thêm 5 thẻ (3 Live, 2 Die).
2. Insert thẻ vào `cdata` (Giữ nguyên).
3. Upsert **Cộng dồn** vào `bin_inventory`:
   - `total_cards = bin_inventory.total_cards + 5`
   - `live_cards = bin_inventory.live_cards + 3`
   - ...
-> **Lợi ích:** **Zero Read** trên `cdata` khi import. Tốc độ cực nhanh.

**Công việc cần làm:**
- Sửa `src/modules/database.js`:
    - Viết lại hàm `updateBinStats` để nhận tham số là `deltaMap` thay vì danh sách BIN ID.
    - Sửa câu SQL Upsert để dùng phép cộng dồn (`+ excluded.col`).
- Sửa `src/router.js` (hoặc nơi gọi import):
    - Tính toán `deltaMap` trước khi gọi DB.

### Phase 2: Monthly Refresh (Reconciliation)

**Hiện tại:**
- `DELETE FROM bin_inventory` -> `INSERT INTO ... SELECT ... FROM cdata`
-> **Vấn đề:** Bảng trống trong thời gian chạy query (nguy cơ downtime ngắn).

**Thay đổi (Theo Update 9.1 Option B):**
- Sử dụng `INSERT OR REPLACE INTO bin_inventory ... SELECT ...`
- Hoặc tối ưu hơn: Update từng batch nếu dữ liệu quá lớn (nhưng với 21k BIN thì 1 lệnh SQL vẫn ổn).
- **Đề xuất:** Giữ nguyên logic `INSERT INTO ... SELECT` nhưng bỏ `DELETE` toàn bộ trước đó, thay vào đó dùng `INSERT OR REPLACE` để update đè lên. Hoặc nếu muốn xóa BIN rác (BIN không còn thẻ), thì cách DELETE cũ sạch sẽ hơn.
- *Quyết định:* Tạm thời giữ nguyên hoặc tối ưu nhẹ `INSERT OR REPLACE` để đảm bảo bảng luôn có data.

### Phase 3: KV-First
- Đã hoàn thành ở các bước trước (Dashboard, Filter logic).
- Chỉ cần đảm bảo quy trình Rebuild sẽ cập nhật lại KV.

## 3. Quy trình kiểm tra (Testing)
1.  **Test Import:**
    - Import một file thẻ nhỏ (10-20 thẻ).
    - Kiểm tra `bin_inventory` xem số lượng có tăng đúng không (Cộng dồn).
    - Kiểm tra `cdata` xem thẻ có vào không.
2.  **Test Rebuild:**
    - Chạy chức năng "Update Data".
    - Kiểm tra xem số liệu có được đồng bộ lại chính xác từ `cdata` không (Sửa sai lệch do cộng dồn nếu có).

## 4. Xin phê duyệt
Bạn vui lòng xác nhận:
1.  Đồng ý chuyển đổi logic Import sang **Delta In-Memory (Cộng dồn)**?
2.  Đồng ý các bước triển khai trên?

Nếu đồng ý, tôi sẽ bắt đầu code Phase 1.
