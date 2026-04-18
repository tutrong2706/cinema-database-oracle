# 📋 DATABASE SCHEMA MAPPING - CHÍNH XÁC

## BẢNG CHA (Parent Tables - Không FK)

### 1. RAP_CHIEU_PHIM (Rạp Chiếu Phim)
| Column | Type | Maps To |
|--------|------|---------|
| MaRapPhim | VARCHAR2(20) | PK |
| **Ten** | VARCHAR2(50) | Cinema Name (NOT TenRap) |
| ThanhPho | VARCHAR2(25) | City |
| DiaChi | VARCHAR2(50) | Address |
| **SDT** | VARCHAR2(15) | Phone (NOT SoDienThoai) |
| Email | VARCHAR2(50) | Email |

### 2. PHIM (Movies)
| Column | Type | Maps To |
|--------|------|---------|
| MaPhim | VARCHAR2(20) | PK |
| TenPhim | VARCHAR2(200) | Movie Name |
| ThoiLuong | INT | Duration (minutes) |
| NgonNgu | VARCHAR2(50) | Language |
| QuocGia | VARCHAR2(50) | Country |
| DaoDien | VARCHAR2(100) | Director |
| DienVienChinh | VARCHAR2(200) | Main Actor |
| NgayKhoiChieu | DATE | Release Date |
| MoTaNoiDung | CLOB | Description |
| DoTuoi | INT | Age Rating |
| ChuDePhim | VARCHAR2(100) | Genre |
| Anh | VARCHAR2(500) | Poster URL |

### 3. TAI_KHOAN (Accounts)
| Column | Type | Maps To |
|--------|------|---------|
| MaNguoiDung | VARCHAR2(20) | PK - User ID |
| HoTen | VARCHAR2(50) | Full Name |
| DiaChi | VARCHAR2(200) | Address |
| SDT | VARCHAR2(15) | Phone |
| GioiTinh | CHAR(1) | Gender (M/F/O) |
| Email | VARCHAR2(50) | Email |
| MatKhau | VARCHAR2(255) | Password (hashed) |
| VaiTro | VARCHAR2(20) | Role (Khach/Admin) |

### 4. MAT_HANG (Products/Items)
| Column | Type | Maps To |
|--------|------|---------|
| MaHang | VARCHAR2(20) | PK |
| TenHang | VARCHAR2(200) | Product Name |
| DonGia | DECIMAL(18,2) | Unit Price |
| SoLuongTon | INT | Stock |
| MoTa | VARCHAR2(500) | Description |
| LoaiHang | VARCHAR2(20) | Type (DO_AN/QUA_LUU_NIEM) |

### 5. CHUONG_TRINH_KHUYEN_MAI (Promotions)
| Column | Type | Maps To |
|--------|------|---------|
| MaKhuyenMai | VARCHAR2(20) | PK |
| TenChuongTrinh | VARCHAR2(200) | Promo Name |
| DieuKien | VARCHAR2(250) | Condition |
| NgayBatDau | DATE | Start Date |
| NgayKetThuc | DATE | End Date |
| MucGiam | DECIMAL(18,2) | Discount Amount |

---

## BẢNG CON (Child Tables - Có FK)

### 6. PHONG_CHIEU (Theater Rooms)
| Column | Type | FK | Maps To |
|--------|------|-------|---------|
| MaPhong | VARCHAR2(20) | - | PK - Room ID |
| **MaRapPhim** | VARCHAR2(20) | RAP_CHIEU_PHIM | Cinema |
| **Ten** | VARCHAR2(20) | - | Room Name (e.g., "Phòng 1") |
| Loai | VARCHAR2(20) | - | Type (2D/3D) |
| SucChua | INT | - | Capacity |
| SoGhe | INT | - | Seat Count |

### 7. SUAT_CHIEU (Screenings) ⭐ CRITICAL
| Column | Type | FK | Maps To |
|--------|------|-------|---------|
| MaSuatChieu | VARCHAR2(20) | - | PK - Screening ID |
| **MaPhim** | VARCHAR2(20) | PHIM | Movie |
| **MaPhong** | VARCHAR2(20) | PHONG_CHIEU | Room (NOT MaRapPhim!) |
| NgayChieu | DATE | - | Screening Date |
| **GioBatDau** | TIMESTAMP | - | Start Time (NOT ThoiGianBatDau) |
| **GioKetThuc** | TIMESTAMP | - | End Time (NOT ThoiGianKetThuc) |
| GiaVeCoBan | DECIMAL(18,2) | - | Base Ticket Price |
| TrangThai | VARCHAR2(20) | - | Status (Đang mở/Hủy/Đã chiếu) |

**KEY POINT**: SUAT_CHIEU has `MaPhong` (Room), NOT `MaRapPhim`!
- To get cinema: JOIN PHONG_CHIEU → JOIN RAP_CHIEU_PHIM

### 8. KHACH_HANG (Customers)
| Column | Type | FK | Maps To |
|--------|------|-------|---------|
| MaNguoiDung | VARCHAR2(20) | TAI_KHOAN | PK - Customer ID |
| LoaiThanhVien | VARCHAR2(20) | - | Member Level (Bronze/Silver/Gold/Platinum) |
| DiemTichLuy | INT | - | Loyalty Points |

### 9. QUAN_TRI_VIEN (Admins)
| Column | Type | FK | Maps To |
|--------|------|-------|---------|
| MaNguoiDung | VARCHAR2(20) | TAI_KHOAN | PK - Admin ID |
| NgayBatDauLam | DATE | - | Start Date |
| Luong | DECIMAL(18,2) | - | Salary |
| ChucVu | VARCHAR2(50) | - | Position |

### 10. VE_XEM_PHIM (Tickets)
| Column | Type | FK | Maps To |
|--------|------|-------|---------|
| MaVe | VARCHAR2(20) | - | PK - Ticket ID |
| **MaSuatChieu** | VARCHAR2(20) | SUAT_CHIEU | Screening |
| **MaPhong** | VARCHAR2(20) | GHE | Room (part of composite FK) |
| **HangGhe** | VARCHAR2(10) | GHE | Row (part of composite FK) |
| **SoGhe** | INT | GHE | Seat Number (part of composite FK) |
| MaNguoiDung_KH | VARCHAR2(20) | KHACH_HANG | Customer |
| MaDonHang | VARCHAR2(20) | DON_HANG | Order |
| GiaVeCuoi | DECIMAL(18,2) | - | Final Price |
| NgayDat | TIMESTAMP | - | Booking Date |
| TrangThai | VARCHAR2(20) | - | Status (Đã đặt/Đã thanh toán/Hủy) |

### 11. DON_HANG (Orders)
| Column | Type | FK | Maps To |
|--------|------|-------|---------|
| MaDonHang | VARCHAR2(20) | - | PK - Order ID |
| MaNguoiDung_KH | VARCHAR2(20) | KHACH_HANG | Customer |
| PhuongThuc | VARCHAR2(50) | - | Method |
| ThoiGianDat | TIMESTAMP | - | Order Time |
| TongTien | DECIMAL(18,2) | - | Total Amount |
| TrangThai | VARCHAR2(20) | - | Status |

### 12. GOM (Order Items) - Composite FK
| Column | Type | FK | Maps To |
|--------|------|-------|---------|
| MaDonHang | VARCHAR2(20) | DON_HANG | Order (part of PK) |
| MaHang | VARCHAR2(20) | MAT_HANG | Product (part of PK) |
| SoLuong | INT | - | Quantity |
| DonGia | DECIMAL(18,2) | - | Unit Price |

### 13. DANH_GIA (Reviews)
| Column | Type | FK | Maps To |
|--------|------|-------|---------|
| MaDanhGia | VARCHAR2(20) | - | PK - Review ID |
| MaNguoiDung | VARCHAR2(20) | KHACH_HANG | Customer |
| MaPhim | VARCHAR2(20) | PHIM | Movie |
| NoiDung | VARCHAR2(1000) | - | Content |
| NgayDang | TIMESTAMP | - | Posted Date |
| DiemSo | INT | - | Rating (1-10) |

### 14. GHE (Seats) - Composite PK
| Column | Type | FK | Maps To |
|--------|------|-------|---------|
| MaPhong | VARCHAR2(20) | PHONG_CHIEU | Room |
| HangGhe | VARCHAR2(10) | - | Row |
| SoGhe | INT | - | Seat Number |
| LoaiGhe | VARCHAR2(15) | - | Seat Type |

---

## ⚠️ COMMON MISTAKES TO FIX

| Old Query | ❌ Wrong | ✅ Correct |
|-----------|---------|-----------|
| RAP_PHIM | Table doesn't exist | RAP_CHIEU_PHIM |
| TenRap | Column doesn't exist | Ten (from RAP_CHIEU_PHIM) |
| SoDienThoai | Column doesn't exist | SDT |
| ThoiGianBatDau | Column name wrong | GioBatDau |
| ThoiGianKetThuc | Column name wrong | GioKetThuc |
| SC.MaRapPhim | Direct reference | Join via PHONG_CHIEU |
| SELECT * | Brings extra columns | Specify exact columns |

---

## 📝 JOIN EXAMPLES

### Get Screening with Movie & Cinema:
```sql
SELECT 
    SC.MaSuatChieu, SC.NgayChieu, SC.GioBatDau, SC.GioKetThuc,
    P.TenPhim, PC.Ten AS TENPHONG, RC.Ten AS TENRAP
FROM SUAT_CHIEU SC
JOIN PHIM P ON SC.MaPhim = P.MaPhim
JOIN PHONG_CHIEU PC ON SC.MaPhong = PC.MaPhong
JOIN RAP_CHIEU_PHIM RC ON PC.MaRapPhim = RC.MaRapPhim
ORDER BY SC.NgayChieu DESC, SC.GioBatDau
```

### Get Tickets with All Details:
```sql
SELECT 
    V.MaVe, V.GiaVeCuoi, V.TrangThai,
    SC.MaSuatChieu, P.TenPhim, 
    PC.Ten AS TENPHONG, RC.Ten AS TENRAP,
    KH.HoTen
FROM VE_XEM_PHIM V
JOIN SUAT_CHIEU SC ON V.MaSuatChieu = SC.MaSuatChieu
JOIN PHIM P ON SC.MaPhim = P.MaPhim
JOIN PHONG_CHIEU PC ON SC.MaPhong = PC.MaPhong
JOIN RAP_CHIEU_PHIM RC ON PC.MaRapPhim = RC.MaRapPhim
JOIN KHACH_HANG KH ON V.MaNguoiDung_KH = KH.MaNguoiDung
```

---

## 🔧 NODE.JS MODELS TO FIX

1. `movieModel.js` - PHIM table
2. `screeningModel.js` - SUAT_CHIEU with JOIN to RAP_CHIEU_PHIM
3. `generalModel.js` - RAP_CHIEU_PHIM columns
4. `ticketModel.js` - VE_XEM_PHIM joins
5. `orderModel.js` - DON_HANG joins
6. `userModel.js` - TAI_KHOAN columns

