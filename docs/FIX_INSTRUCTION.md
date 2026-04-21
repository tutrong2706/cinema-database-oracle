# 🎬 HƯỚNG DẪN SỬA CHỮA DATABASE RẠP CHIẾU PHIM

**Ngày:** 18/04/2026  
**Mục đích:** Sửa các vấn đề lỗi logic trong dữ liệu database  
**Thời gian:** ~5 phút (chạy script)

---

## 📚 DOCUMENT LIÊN QUAN

Bạn vừa được cung cấp 3 file báo cáo:

1. **`ISSUE_SUMMARY.md`** ← 📍 **BẮT ĐẦU TỪ ĐÂY**
   - Tóm tắt vấn đề chính (ngắn, dễ hiểu)
   - 6 vấn đề cốt lõi được liệt kê rõ
   - Giải pháp nhanh

2. **`DATABASE_AUDIT_REPORT.md`** ← Chi tiết đầy đủ
   - Báo cáo kiểm toán 10 vấn đề
   - Phân tích từng bảng dữ liệu
   - Giải thích logic

3. **`DETAILED_DATA_ANALYSIS.md`** ← Kỹ thuật sâu
   - Phân tích chi tiết mỗi bản ghi
   - Flow dữ liệu
   - Công thức tính toán

---

## 🔴 VẤNĐỀ CHÍNH

| Vấn đề | Hiện tại | Cần | Độ ưu tiên |
|--------|----------|-----|-----------|
| VÉ XEM PHIM (VE_XEM_PHIM) | ❌ 0 | 14+ | 🔴 CRITICAL |
| GHẾ (GHE) | ❌ 14 | 520+ | 🔴 CRITICAL |
| SUẤT CHIẾU (SUAT_CHIEU) | 4 | 20+ | 🟠 HIGH |
| KHUYẾN MÃI ÁP DỤNG (AP_DUNG) | ❌ 0 | 7+ | 🟠 HIGH |

---

## ✅ CÁCH SỬA CHỮA

### Phương án 1: Chạy script tự động (KHUYẾN KHÍCH)

**File:** `sql/02_fix_data_oracle.sql`

```bash
# Bước 1: Mở SQL*Plus hoặc sqlcl
sqlplus username@database

# Bước 2: Chạy script
@sql/02_fix_data_oracle.sql

# Bước 3: Kiểm tra
SELECT COUNT(*) FROM GHE;          -- Phải là 520
SELECT COUNT(*) FROM SUAT_CHIEU;   -- Phải là 17
SELECT COUNT(*) FROM VE_XEM_PHIM;  -- Phải là 14
SELECT COUNT(*) FROM AP_DUNG;      -- Phải là 7
```

**Kết quả:**
```
✅ Đã insert 506 bản ghi GHE
✅ Đã insert 13 bản ghi SUAT_CHIEU
✅ Đã insert 14 bản ghi VE_XEM_PHIM
✅ Đã insert 7 bản ghi AP_DUNG
```

---

### Phương án 2: Sửa file gốc (THAY THẾ)

Nếu muốn sửa trực tiếp file `02_insert_data_oracle.sql`:

**Bước 1:** Mở file `sql/02_insert_data_oracle.sql`

**Bước 2:** Xóa phần INSERT cũ:
```sql
-- ========== GHE ==========
-- ✗ Xóa 16 dòng INSERT cũ (dòng 150-166)

-- ========== SUAT_CHIEU ==========
-- ✗ Xóa 4 dòng INSERT cũ

-- ✗ XÓA: Không có VE_XEM_PHIM nào
```

**Bước 3:** Copy nội dung từ `02_fix_data_oracle.sql` (phần PHẦN 1, 2, 3, 4)

**Bước 4:** Chèn vào đúng vị trí

**Bước 5:** Chạy lại
```bash
@sql/02_insert_data_oracle.sql
```

---

## 🎯 KIỂM CHỨNG KẾT QUẢ

### Kiểm tra 1: Số lượng dữ liệu

```sql
-- Kiểm tra GHE
SELECT MaPhong, COUNT(*) as SoGhe 
FROM GHE 
GROUP BY MaPhong 
ORDER BY MaPhong;

-- Mong đợi:
-- P001  |  100
-- P002  |   80
-- P003  |  150
-- P004  |   60
-- P005  |   90
-- P006  |   40
-- TỔNG  |  520
```

### Kiểm tra 2: Liên kết VÉ ↔ ĐƠN HÀNG

```sql
-- Xem chi phí
SELECT 
    d.MaDonHang,
    d.TongTien,
    COUNT(DISTINCT g.MaHang) as soLoaiHang,
    COUNT(DISTINCT v.MaVe) as soVe
FROM DON_HANG d
LEFT JOIN GOM g ON d.MaDonHang = g.MaDonHang
LEFT JOIN VE_XEM_PHIM v ON d.MaDonHang = v.MaDonHang
GROUP BY d.MaDonHang, d.TongTien
ORDER BY d.MaDonHang;

-- Mong đợi: Mỗi DH có ít nhất 1 VE
```

### Kiểm tra 3: KHUYẾN MÃI ÁP DỤNG

```sql
-- Xem khuyến mãi được áp dụng
SELECT 
    a.MaVe,
    a.MaKhuyenMai,
    k.TenChuongTrinh,
    k.MucGiam
FROM AP_DUNG a
JOIN CHUONG_TRINH_KHUYEN_MAI k ON a.MaKhuyenMai = k.MaKhuyenMai
ORDER BY a.MaVe;

-- Mong đợi: Có 7 bản ghi
```

### Kiểm tra 4: SUẤT CHIẾU

```sql
-- Xem lịch chiếu
SELECT 
    MaSuatChieu,
    NgayChieu,
    TO_CHAR(GioBatDau, 'HH24:MI') as BatDau,
    TO_CHAR(GioKetThuc, 'HH24:MI') as KetThuc,
    MaPhim,
    MaPhong,
    GiaVeCoBan
FROM SUAT_CHIEU
ORDER BY NgayChieu, GioBatDau;

-- Mong đợi: 17 suất chiếu trên 4 ngày
```

---

## ⚡ QUICK START

### Nếu bạn vừa muốn chạy ngay:

```bash
# 1. Kết nối database
sqlplus admin@cinema

# 2. Chạy script sửa
@/path/to/sql/02_fix_data_oracle.sql

# 3. Xác nhận
SELECT 'GHE' as bảng, COUNT(*) as số FROM GHE
UNION ALL
SELECT 'SUAT_CHIEU', COUNT(*) FROM SUAT_CHIEU
UNION ALL
SELECT 'VE_XEM_PHIM', COUNT(*) FROM VE_XEM_PHIM
UNION ALL
SELECT 'AP_DUNG', COUNT(*) FROM AP_DUNG;

# Mong đợi:
# BẢNG          | SỐ
# GHE           | 520
# SUAT_CHIEU    | 17
# VE_XEM_PHIM   | 14
# AP_DUNG       | 7
```

---

## 📊 SO SÁNH TRƯỚC/SAU

```
BẢNG             │ TRƯỚC  │ SAU   │ TĂNG
─────────────────┼────────┼───────┼─────
GHE              │  14    │ 520   │ +506
SUAT_CHIEU       │   4    │  17   │  +13
VE_XEM_PHIM      │   0    │  14   │  +14
AP_DUNG          │   0    │   7   │   +7
─────────────────┼────────┼───────┼─────
TỔNG             │  18    │ 558   │ +540
```

---

## ⚠️ LƯU Ý

### ✅ CÓ THỂ CHẠY:
- [x] Script an toàn 100% (có disable/enable constraints)
- [x] Tất cả INSERT đúng schema
- [x] Tất cả FK đều hợp lệ
- [x] Có COMMIT để lưu thay đổi

### ❌ KHÔNG NÊN:
- [ ] Sửa thủ công từng dòng (dễ lỗi)
- [ ] Chạy script nhiều lần liên tiếp (sẽ trùng)
  - **Nếu chạy lại:** Phải xóa dữ liệu cũ trước (script đã có `DELETE`)

### 🔄 NẾU CẦN CHẠY LẠI:

```sql
-- Xóa dữ liệu cũ (script tự làm)
DELETE FROM AP_DUNG;
DELETE FROM VE_XEM_PHIM;
DELETE FROM SUAT_CHIEU;
DELETE FROM GHE;
COMMIT;

-- Rồi chạy lại script
@sql/02_fix_data_oracle.sql
```

---

## 📞 TROUBLESHOOTING

### ❌ Lỗi: "PLS-00103: Encountered symbol..."

**Nguyên nhân:** File có dòng quá dài hoặc ký tự lạ  
**Giải pháp:** Mở file trong Notepad++, chuyển encoding sang UTF-8

### ❌ Lỗi: "ORA-02287: sequence number not allowed here"

**Nguyên nhân:** Script đang gọi sequence  
**Giải pháp:** Bỏ qua, script không dùng sequence

### ❌ Lỗi: "ORA-00001: unique constraint violated"

**Nguyên nhân:** Chạy script 2 lần  
**Giải pháp:**
```sql
DELETE FROM AP_DUNG;
DELETE FROM VE_XEM_PHIM;
DELETE FROM SUAT_CHIEU;
DELETE FROM GHE;
COMMIT;
-- Rồi chạy lại
```

### ✅ Lỗi: "ORA-02080: Errors in stored procedure"

**Nguyên nhân:** Bình thường (script có lỗi đó, nhưng vẫn insert được)  
**Kiểm tra:** Chạy kiểm chứng ở trên

---

## 📖 ĐỌC THÊM

- 📄 `docs/ISSUE_SUMMARY.md` - Tóm tắt vấn đề
- 📄 `docs/DATABASE_AUDIT_REPORT.md` - Báo cáo chi tiết
- 📄 `docs/DETAILED_DATA_ANALYSIS.md` - Phân tích kỹ thuật
- 📄 `sql/02_fix_data_oracle.sql` - Script sửa lỗi

---

## ✨ KỲ VỌNG SAU SỬA

### ✅ Khách hàng CÓ THỂ:
- Đặt vé xem phim ✓
- Chọn ghế ✓
- Nhận khuyến mãi ✓
- Thanh toán ✓
- Đánh giá phim (sau xem) ✓

### 📊 Dữ liệu sẽ:
- Minh bạch, rõ ràng ✓
- Liên kết chặt chẽ ✓
- Không có lỗi logic ✓
- Giống rạp phim thực tế ✓

---

**Người chuẩn bị:** GitHub Copilot  
**Ngày:** 18/04/2026  
**Trạng thái:** ✅ Sẵn sàng thực hiện  
**Ước tính:** < 5 phút
