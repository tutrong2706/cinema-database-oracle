# Database Backend API Mapping Audit Report
**Date**: April 18, 2026 | **Status**: Comprehensive Mismatch Analysis

---

## Executive Summary
Phát hiện **5 lỗi chính** giữa backend API và database schema:
1. ❌ `screeningModel.createScreening()` dùng `MaRapPhim` (không tồn tại)
2. ❌ `screeningModel.updateScreening()` dùng `ThoiGianBatDau/ThoiGianKetThuc` (sai tên)
3. ⚠️ `orderModel` không có support để lấy ticket riêng
4. ✅ `movieModel` OK - gọi view `V_PHIM_SORTED`
5. ✅ `ticketModel` OK - query chính xác
6. ✅ `roomModel` OK - query chính xác

---

## Detailed Analysis

### ❌ **LỖI 1: screeningModel.createScreening() - Wrong Column**

**Vị trí**: `src/models/screeningModel.js`, lines 78-90

**Vấn đề**:
```javascript
const { MaSuatChieu, MaPhim, MaRapPhim, GiaVeCoBan, ThoiGianBatDau, ... } = screeningData;
INSERT INTO SUAT_CHIEU (..., MaRapPhim, ...)  // ❌ KHÔNG CÓ CỘT NÀY
```

**Database Schema** (SUAT_CHIEU):
```sql
MaSuatChieu VARCHAR2(20) PRIMARY KEY
MaPhim VARCHAR2(20) NOT NULL                  ✅ CÓ
MaPhong VARCHAR2(20) NOT NULL                 ✅ CÓ (không phải MaRapPhim)
NgayChieu DATE NOT NULL                       ✅ CÓ
GioBatDau TIMESTAMP DEFAULT SYSDATE NOT NULL  ✅ CÓ (sai tên parameter)
GioKetThuc TIMESTAMP DEFAULT SYSDATE NOT NULL ✅ CÓ (sai tên parameter)
GiaVeCoBan DECIMAL(18,2) NOT NULL            ✅ CÓ
TrangThai VARCHAR2(20) NOT NULL              ✅ CÓ
```

**Nguyên nhân**: Backend tìm cách lấy cinema từ showtime nhưng mất quan hệ trung gian (PHONG_CHIEU).

**Fix Required**: Thay `MaRapPhim` → `MaPhong` trong createScreening

---

### ❌ **LỖI 2: screeningModel - Wrong Parameter Names**

**Vị trí**: `src/models/screeningModel.js`, lines 78-90 & 106-118

**Vấn đề**:
```javascript
// Backend gửi
const { ThoiGianBatDau, ThoiGianKetThuc } = screeningData;

// Database mong đợi
GioBatDau TIMESTAMP
GioKetThuc TIMESTAMP
```

**Fix Required**: Thay tên parameter từ `ThoiGianBatDau/ThoiGianKetThuc` → `GioBatDau/GioKetThuc`

---

### ❌ **LỖI 3: screeningModel.updateScreening() - Same Issues**

**Vị trí**: `src/models/screeningModel.js`, lines 106-118

**SQL sai**:
```javascript
UPDATE SUAT_CHIEU
SET GiaVeCoBan = :1, ThoiGianBatDau = :2, ThoiGianKetThuc = :3, TrangThai = :4
//                  ^^^^^^^^^^^^^^^ WRONG ^^^^^^^^^^^ WRONG
```

**Đúng**:
```javascript
UPDATE SUAT_CHIEU
SET GiaVeCoBan = :1, GioBatDau = :2, GioKetThuc = :3, TrangThai = :4
```

---

## Correct Mappings

### ✅ **TABLE: RAP_CHIEU_PHIM**
| Backend Field | Database Column | Type | Notes |
|---|---|---|---|
| maRapPhim | MaRapPhim | VARCHAR2(20) | Primary Key |
| ten | Ten | VARCHAR2(50) | Cinema name |
| thanhPho | ThanhPho | VARCHAR2(25) | City |
| diaChi | DiaChi | VARCHAR2(50) | Address |
| sdt | SDT | VARCHAR2(15) | Phone |
| email | Email | VARCHAR2(50) | Email |

### ✅ **TABLE: PHONG_CHIEU**
| Backend Field | Database Column | Type | Notes |
|---|---|---|---|
| maPhong | MaPhong | VARCHAR2(20) | PK - Screening room ID |
| maRapPhim | MaRapPhim | VARCHAR2(20) | FK - Cinema ID |
| ten | Ten | VARCHAR2(20) | Room name (P001, IMAX, etc) |
| loai | Loai | VARCHAR2(20) | Type (2D, 3D, IMAX, VIP) |
| sucChua | SucChua | INT | Capacity |
| soGhe | SoGhe | INT | Number of seats |

### ⚠️ **TABLE: SUAT_CHIEU**
| Backend Field | Database Column | Type | Notes |
|---|---|---|---|
| maSuatChieu | MaSuatChieu | VARCHAR2(20) | PK |
| maPhim | MaPhim | VARCHAR2(20) | FK ✅ |
| ~~maRapPhim~~ | **MaPhong** | VARCHAR2(20) | **FK - Room ID not Cinema!** ❌ |
| ngayChieu | NgayChieu | DATE | Screening date ✅ |
| ~~thoiGianBatDau~~ | **GioBatDau** | TIMESTAMP | **Start time** ❌ |
| ~~thoiGianKetThuc~~ | **GioKetThuc** | TIMESTAMP | **End time** ❌ |
| giaVeCoBan | GiaVeCoBan | DECIMAL(18,2) | Base ticket price ✅ |
| trangThai | TrangThai | VARCHAR2(20) | Status ✅ |

### ✅ **TABLE: VE_XEM_PHIM**
| Backend Field | Database Column | Type | Notes |
|---|---|---|---|
| maVe | MaVe | VARCHAR2(20) | PK ✅ |
| maSuatChieu | MaSuatChieu | VARCHAR2(20) | FK ✅ |
| maPhong | MaPhong | VARCHAR2(20) | FK ✅ |
| hangGhe | HangGhe | VARCHAR2(10) | Row letter ✅ |
| soGhe | SoGhe | INT | Seat number ✅ |
| maNguoiDung_KH | MaNguoiDung_KH | VARCHAR2(20) | FK Customer ✅ |
| maDonHang | MaDonHang | VARCHAR2(20) | FK Order ✅ |
| giaVeCuoi | GiaVeCuoi | DECIMAL(18,2) | Final price ✅ |
| ngayDat | NgayDat | TIMESTAMP | Booking date ✅ |
| trangThai | TrangThai | VARCHAR2(20) | Status ✅ |

---

## Backend vs Database - Full Comparison

### 🔴 screeningModel ERRORS

```
createScreening() PARAMETERS:
  ❌ MaRapPhim        → Should be MaPhong
  ❌ ThoiGianBatDau   → Should be GioBatDau  
  ❌ ThoiGianKetThuc  → Should be GioKetThuc

updateScreening() PARAMETERS:
  ❌ ThoiGianBatDau   → Should be GioBatDau
  ❌ ThoiGianKetThuc  → Should be GioKetThuc
```

### ✅ movieModel OK
- Queries `V_PHIM_SORTED` view correctly
- All column mappings valid

### ✅ ticketModel OK
- All VE_XEM_PHIM queries correct
- Proper JOINs to SUAT_CHIEU, PHIM, PHONG_CHIEU, RAP_CHIEU_PHIM

### ✅ roomModel OK
- PHONG_CHIEU queries correct
- Proper JOINs to RAP_CHIEU_PHIM

### ✅ orderModel OK
- DON_HANG, GOM, THANH_TOAN queries correct
- Supports VE_XEM_PHIM revenue calculations

### ⚠️ reviewModel - NEEDS CHECK
- Uses DANH_GIA table
- Should link to VE_XEM_PHIM for audit trail

---

## Impact Analysis

| Model | Impact | Severity | Fix Time |
|---|---|---|---|
| screeningModel | Cannot create/update screenings correctly | 🔴 Critical | 5 mins |
| movieModel | None - working correctly | ✅ None | N/A |
| ticketModel | None - working correctly | ✅ None | N/A |
| roomModel | None - working correctly | ✅ None | N/A |
| orderModel | None - working correctly | ✅ None | N/A |

---

## Recommended Fixes

### Fix #1: screeningModel.createScreening()
**File**: `src/models/screeningModel.js` (lines 78-90)

Change FROM:
```javascript
const { MaSuatChieu, MaPhim, MaRapPhim, GiaVeCoBan, ThoiGianBatDau, ThoiGianKetThuc, NgayChieu, TrangThai } = screeningData;

const sql = `
    INSERT INTO SUAT_CHIEU (MaSuatChieu, MaPhim, MaRapPhim, GiaVeCoBan, ThoiGianBatDau,
                           ThoiGianKetThuc, NgayChieu, TrangThai)
    VALUES (:1, :2, :3, :4, :5, :6, :7, :8)
`;

return await execute(sql, [
    MaSuatChieu, MaPhim, MaRapPhim, GiaVeCoBan, ThoiGianBatDau,
    ThoiGianKetThuc, NgayChieu, TrangThai || 'DangChieu'
]);
```

Change TO:
```javascript
const { MaSuatChieu, MaPhim, MaPhong, GiaVeCoBan, GioBatDau, GioKetThuc, NgayChieu, TrangThai } = screeningData;

const sql = `
    INSERT INTO SUAT_CHIEU (MaSuatChieu, MaPhim, MaPhong, GiaVeCoBan, GioBatDau,
                           GioKetThuc, NgayChieu, TrangThai)
    VALUES (:1, :2, :3, :4, :5, :6, :7, :8)
`;

return await execute(sql, [
    MaSuatChieu, MaPhim, MaPhong, GiaVeCoBan, GioBatDau,
    GioKetThuc, NgayChieu, TrangThai || 'Đang mở'
]);
```

### Fix #2: screeningModel.updateScreening()
**File**: `src/models/screeningModel.js` (lines 106-118)

Change FROM:
```javascript
const { GiaVeCoBan, ThoiGianBatDau, ThoiGianKetThuc, TrangThai } = screeningData;

const sql = `
    UPDATE SUAT_CHIEU
    SET GiaVeCoBan = :1, ThoiGianBatDau = :2, ThoiGianKetThuc = :3, TrangThai = :4
    WHERE MaSuatChieu = :5
`;

return await execute(sql, [GiaVeCoBan, ThoiGianBatDau, ThoiGianKetThuc, TrangThai, maSuatChieu]);
```

Change TO:
```javascript
const { GiaVeCoBan, GioBatDau, GioKetThuc, TrangThai } = screeningData;

const sql = `
    UPDATE SUAT_CHIEU
    SET GiaVeCoBan = :1, GioBatDau = :2, GioKetThuc = :3, TrangThai = :4
    WHERE MaSuatChieu = :5
`;

return await execute(sql, [GiaVeCoBan, GioBatDau, GioKetThuc, TrangThai, maSuatChieu]);
```

### Fix #3: screeningModel.createScreening() Controller
**File**: `src/controllers/movieController.js` or wherever screenings are created

Update API payload to send:
```javascript
{
    maSuatChieu: "SC001",
    maPhim: "PH001",
    maPhong: "P001",              // NOT maRapPhim!
    giaVeCoBan: 120000,
    gioBatDau: "2025-12-20 08:00:00",    // NOT thoiGianBatDau!
    gioKetThuc: "2025-12-20 10:30:00",   // NOT thoiGianKetThuc!
    ngayChieu: "2025-12-20",
    trangThai: "Đang mở"
}
```

---

## Testing Checklist

- [ ] Update screeningModel.createScreening()
- [ ] Update screeningModel.updateScreening()
- [ ] Test creating new screening with valid room ID
- [ ] Test updating screening times
- [ ] Verify no more ORA-01407 errors (column doesn't exist)
- [ ] Run full suite of screening API tests

---

## Notes

- Database uses **Oracle convention**: "Gio" (Hour) instead of "ThoiGian" (Time)
- RAP_CHIEU_PHIM → PHONG_CHIEU → SUAT_CHIEU chain must be respected
- SUAT_CHIEU links to rooms (MaPhong), not directly to cinemas
- Get cinema: SUAT_CHIEU.MaPhong → PHONG_CHIEU.MaRapPhim → RAP_CHIEU_PHIM.MaRapPhim

