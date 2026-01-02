# Kiến Trúc Module Toàn Hệ Thống

## 1. Tổng Quan Hệ Thống

Hệ thống quản lý BIN (Bank Identification Number) với 4 module chính:
- **Dashboard**: Hiển thị tổng quan dữ liệu BIN cá nhân
- **Card Checker**: Kiểm tra thông tin thẻ từ bin_inventor
- **Tool**: Công cụ xử lý dữ liệu BIN kết hợp với bin_inventor
- **Bin Checker**: Tra cứu thông tin BIN toàn cầu từ Bin_Data

## 2. Cấu Trúc Module

### 2.1 Module Dashboard
**Mục đích**: Hiển thị thống kê và tổng quan dữ liệu BIN cá nhân

**Components chính**:
- `DashboardLayout`: Layout chính của dashboard
- `StatisticsCard`: Card hiển thị thống kê
- `BINTable`: Bảng dữ liệu BIN cá nhân
- `ChartContainer`: Biểu đồ thống kê

**Data Flow**:
```
User → Dashboard → Query bin_inventor → Display cdata
```

**Queries chính**:
```sql
-- Lấy tổng số BIN cá nhân
SELECT COUNT(*) FROM bin_inventor WHERE user_id = ?

-- Lấy danh sách BIN cá nhân với phân trang
SELECT b.*, c.data as card_data 
FROM bin_inventor b 
JOIN cdata c ON b.bin_id = c.id 
WHERE b.user_id = ? 
ORDER BY b.created_at DESC 
LIMIT ? OFFSET ?
```

### 2.2 Module Card Checker
**Mục đích**: Kiểm tra thông tin thẻ từ dữ liệu BIN cá nhân

**Components chính**:
- `CardCheckerForm`: Form nhập số thẻ
- `CardValidation`: Component validate thẻ
- `CardResult`: Hiển thị kết quả kiểm tra
- `CardDetails`: Chi tiết thông tin thẻ

**Data Flow**:
```
User Input Card Number → Extract BIN → Query bin_inventor + cdata → Display Result
```

**Queries chính**:
```sql
-- Tìm BIN trong inventory cá nhân
SELECT b.*, c.data 
FROM bin_inventor b 
JOIN cdata c ON b.bin_id = c.id 
WHERE b.user_id = ? AND b.bin_number = ? 
LIMIT 1

-- Lấy thông tin chi tiết card data
SELECT * FROM cdata WHERE bin_prefix = ? AND user_id = ?
```

### 2.3 Module Tool
**Mục đích**: Công cụ xử lý và quản lý dữ liệu BIN cá nhân

**Components chính**:
- `ToolDashboard`: Giao diện chính tools
- `BINImporter**: Import dữ liệu BIN
- `BINValidator`: Validate dữ liệu BIN
- `BINExporter`: Export dữ liệu BIN
- `BulkOperations**: Thao tác hàng loạt

**Data Flow**:
```
Tool Selection → Operation → Query/Update bin_inventor → Result
```

**Queries chính**:
```sql
-- Import BIN mới
INSERT INTO bin_inventor (user_id, bin_id, bin_number, status, created_at) 
VALUES (?, ?, ?, ?, NOW())

-- Bulk update status
UPDATE bin_inventor 
SET status = ?, updated_at = NOW() 
WHERE user_id = ? AND bin_number IN (?)

-- Validate BIN tồn tại
SELECT COUNT(*) as count FROM bin_inventor 
WHERE user_id = ? AND bin_number = ?
```

### 2.4 Module Bin Checker
**Mục đích**: Tra cứu thông tin BIN toàn cầu

**Components chính**:
- `BinCheckerForm`: Form nhập BIN
- `BinResult`: Kết quả tra cứu
- `BinDetails`: Chi tiết BIN
- `BinHistory`: Lịch sử tra cứu

**Data Flow**:
```
User Input BIN → Query Bin_Data → Display Global BIN Info
```

**Queries chính**:
```sql
-- Tìm BIN trong dữ liệu toàn cầu
SELECT * FROM Bin_Data 
WHERE bin_prefix = ? 
LIMIT 1

-- Tìm BIN với wildcard
SELECT * FROM Bin_Data 
WHERE bin_prefix LIKE ? 
ORDER BY bin_prefix 
LIMIT 10

-- Lấy thông tin ngân hàng
SELECT bank_name, country, card_type 
FROM Bin_Data 
WHERE bin_prefix = ?
```

## 3. Database Schema

### 3.1 Bảng bin_inventor (Dữ liệu BIN cá nhân)
```sql
CREATE TABLE bin_inventor (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    bin_id UUID NOT NULL,
    bin_number VARCHAR(20) NOT NULL,
    status VARCHAR(50) DEFAULT 'active',
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    INDEX idx_user_bin (user_id, bin_number),
    INDEX idx_status (status),
    INDEX idx_created (created_at)
);
```

### 3.2 Bảng cdata (Dữ liệu chi tiết BIN cá nhân)
```sql
CREATE TABLE cdata (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    bin_id UUID NOT NULL,
    bin_prefix VARCHAR(10) NOT NULL,
    data JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    INDEX idx_user_prefix (user_id, bin_prefix),
    INDEX idx_bin_id (bin_id)
);
```

### 3.3 Bảng Bin_Data (Dữ liệu BIN toàn cầu)
```sql
CREATE TABLE Bin_Data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bin_prefix VARCHAR(10) NOT NULL UNIQUE,
    bank_name VARCHAR(255),
    country VARCHAR(100),
    card_type VARCHAR(50),
    card_category VARCHAR(50),
    issuer_info JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    INDEX idx_bin_prefix (bin_prefix),
    INDEX idx_bank_country (bank_name, country)
);
```

## 4. API Architecture

### 4.1 API Endpoints

**Dashboard APIs**:
- `GET /api/dashboard/stats` - Lấy thống kê dashboard
- `GET /api/dashboard/bin-list` - Lấy danh sách BIN cá nhân
- `GET /api/dashboard/chart-data` - Lấy dữ liệu biểu đồ

**Card Checker APIs**:
- `POST /api/card-checker/validate` - Validate số thẻ
- `GET /api/card-checker/bin-info/:bin` - Lấy thông tin BIN
- `POST /api/card-checker/check-card` - Kiểm tra thẻ hoàn chỉnh

**Tool APIs**:
- `POST /api/tools/import` - Import dữ liệu BIN
- `POST /api/tools/validate-bulk` - Validate hàng loạt
- `POST /api/tools/export` - Export dữ liệu BIN
- `PUT /api/tools/update-status` - Cập nhật trạng thái BIN

**Bin Checker APIs**:
- `GET /api/bin-checker/lookup/:bin` - Tra cứu BIN toàn cầu
- `GET /api/bin-checker/search` - Tìm kiếm BIN
- `GET /api/bin-checker/bank-info/:bin` - Lấy thông tin ngân hàng

### 4.2 Response Format
```typescript
interface APIResponse<T> {
    success: boolean;
    data?: T;
    error?: {
        code: string;
        message: string;
        details?: any;
    };
    timestamp: string;
}

interface BinInfo {
    bin_prefix: string;
    bank_name: string;
    country: string;
    card_type: string;
    card_category?: string;
    issuer_info?: Record<string, any>;
}
```

## 5. Performance Optimization

### 5.1 Index Strategy
- Sử dụng composite index trên (user_id, bin_number) cho bin_inventor
- Index prefix search với btree index cho bin_prefix
- Partitioning cho bảng Bin_Data theo quốc gia nếu cần

### 5.2 Caching
- Redis cache cho tra cứu BIN phổ biến
- Browser cache cho dữ liệu không thay đổi thường xuyên
- Application-level cache cho dashboard statistics

### 5.3 Query Optimization
- Sử dụng prepared statements cho queries lặp lại
- Implement pagination với cursor-based approach
- Batch operations cho bulk insert/update

## 6. Security Considerations

### 6.1 Data Access Control
- Row Level Security (RLS) cho Supabase
- User isolation trong bin_inventor và cdata
- Rate limiting cho API endpoints

### 6.2 Data Validation
- Input validation cho tất cả API endpoints
- BIN format validation (6-10 digits)
- SQL injection prevention với parameterized queries

### 6.3 Audit Trail
- Log tất cả thao tác với BIN cá nhân
- Track user actions trong tool operations
- Monitor suspicious lookup patterns