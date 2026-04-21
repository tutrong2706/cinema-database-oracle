# 📊 CHI TIẾT PHÂN TÍCH DỮ LIỆU DATABASE

## 🔍 PHÂN TÍCH CỤ THỂ TỪNG BẢN GHI

### I. ĐƠN HÀNG vs VÉ XEM PHIM - KHÔNG KHỚP LOGIC

#### Phân tích chi tiết DH001:
```
┌─────────────────────────────────────────────────┐
│ DON_HANG DH001                                  │
├─────────────────────────────────────────────────┤
│ MaDonHang:       DH001                          │
│ MaNguoiDung:     KH001 (Nguyễn Văn A)          │
│ ThoiGianDat:     2025-12-20 10:00              │
│ PhuongThuc:      Online                        │
│ TrangThai:       Đã thanh toán                 │
│ TongTien:        165,000đ                      │
└─────────────────────────────────────────────────┘

PHÂN TÍCH CHI TIẾT:

┌─ GOM (Hàng hóa trong đơn) ─────────────────────┐
│ MH001 (Bắp rang bơ):    1 × 45,000 = 45,000đ │
│ MH002 (Nước ngọt Coca): 2 × 30,000 = 60,000đ │
│ ─────────────────────────────────────────────  │
│ TỔNG GOM:                        = 105,000đ  │
└─────────────────────────────────────────────────┘

TÍNH TOÁN:
┌─────────────────────────────────┐
│ TongTien (Đơn hàng):  165,000đ │
│ GOM (Hàng hóa):      -105,000đ │
│ ─────────────────────────────── │
│ CHI PHÍ VÉ XEM PHIM:  = 60,000đ│
└─────────────────────────────────┘

❌ VẤN ĐỀ:
  → Đơn hàng ghi TongTien = 165,000đ
  → Nhưng GOM chỉ 105,000đ
  → Thiếu 60,000đ = chi phí vé (khoảng 1 vé)
  → NHƯNG KHÔNG CÓ BẢN GHI VE_XEM_PHIM!

✅ GIẢI PHÁP:
  → Thêm 1 bản ghi VE_XEM_PHIM cho DH001
  → GiaVeCuoi = 60,000đ
  → Liên kết đến suất chiếu hợp lệ (SC001, SC005, v.v.)
```

---

#### Phân tích tất cả 12 đơn hàng:
```
┌────┬──────────┬─────────────┬──────────────┬──────────┬──────────┐
│ DH │ Khách    │ GOM Total   │ DH Total     │ Chênh    │ Vé ?     │
├────┼──────────┼─────────────┼──────────────┼──────────┼──────────┤
│001 │ KH001    │ 105,000đ    │ 165,000đ     │ 60,000đ  │ 1 vé?    │
│002 │ KH002    │  70,000đ    │ 160,000đ     │ 90,000đ  │ 1 vé?    │
│003 │ KH003    │  60,000đ    │ 100,000đ     │ 40,000đ  │ 1 vé?    │
│004 │ KH004    │   0đ        │  95,000đ     │ 95,000đ  │ 1 vé?    │
│005 │ KH005    │ 400,000đ    │ 500,000đ     │100,000đ  │ 1 vé?    │
│006 │ KH006    │  85,000đ    │ 175,000đ     │ 90,000đ  │ 1 vé?    │
│007 │ KH007    │ 195,000đ    │ 280,000đ     │ 85,000đ  │ 1 vé?    │
│008 │ KH008    │  55,000đ    │ 145,000đ     │ 90,000đ  │ 1 vé?    │
│009 │ KH009    │ 280,000đ    │ 380,000đ     │100,000đ  │ 1 vé?    │
│010 │ KH010    │ 440,000đ    │ 785,000đ     │345,000đ  │ 3 vé?    │
│011 │ KH001    │  90,000đ    │ 155,000đ     │ 65,000đ  │ 1 vé?    │
│012 │ KH002    │ 110,000đ    │ 200,000đ     │ 90,000đ  │ 1 vé?    │
└────┴──────────┴─────────────┴──────────────┴──────────┴──────────┘

NHẬN XÉT:
  ✓ Mỗi đơn hàng đều có khoảng chênh lệch = chi phí vé
  ✓ Chi phí vé dao động từ 40,000-345,000đ
  ❌ NHƯNG TẤT CẢ ĐỀU KHÔNG CÓ DỮ LIỆU VE_XEM_PHIM!
```

---

### II. BẢN GHẾ (GHE) - THIẾU 96%

```
REQUIREMENT VS REALITY:

RẠP CHIẾU PHIM → PHÒNG CHIẾU → GHẾ
├─ RAP001 → P001 (100 ghế) → GHE: 6/100 ghế ❌ THIẾU 94
│         → P002 (80 ghế)  → GHE: 2/80 ghế  ❌ THIẾU 78
├─ RAP002 → P003 (150 ghế) → GHE: 2/150 ghế ❌ THIẾU 148
├─ RAP003 → P004 (60 ghế)  → GHE: 1/60 ghế  ❌ THIẾU 59
├─ RAP004 → P005 (90 ghế)  → GHE: 1/90 ghế  ❌ THIẾU 89
└─ RAP005 → P006 (40 ghế)  → GHE: 2/40 ghế  ❌ THIẾU 38

TỔNG: 520 ghế cần có, nhưng chỉ có 14 ghế ❌ THIẾU 506 ghế (96%)

❌ KHÔNG CÓ KHÁCH HÀNG CÓ THỂ ĐẶT VÉ!
```

---

### III. SUẤT CHIẾU (SUAT_CHIEU) - THIẾU 85%

```
HIỆN TẠI CHỈ CÓ 4 SUẤT:

SC001: 2025-12-20, P001, 08:00-10:30, PH001 (Avengers)
SC002: 2025-12-20, P002, 10:00-12:00, PH002 (Nhà Bà Nữ)
SC003: 2025-12-20, P003, 13:00-15:15, PH003 (Fast & Furious)
SC004: 2025-12-24, P001, 19:00-21:30, PH001 (Avengers)

VẤN ĐỀ:
✓ Chỉ 2 ngày chiếu (20/12 và 24/12)
✓ Chỉ 4 suất chiếu cho 8 bộ phim
✓ Không có suất chiếu cho: PH004, PH005, PH006, PH007, PH008
✓ Mỗi phòng mỗi ngày chỉ có 1 suất (không hợp lý)

SỰ THẬT CỦA RẠP PHIM THỰC TẾ:
- Mỗi phòng phải có 3-4 suất/ngày (sáng, chiều, tối, đêm khuya)
- Mỗi suất có thời gian cách nhau 3-4 giờ
- Mỗi bộ phim được chiếu nhiều lần/ngày ở các phòng khác nhau
- Có lịch chiếu trong vòng 2-3 tuần
```

---

### IV. KHUYẾN MÃI (CHUONG_TRINH_KHUYEN_MAI) vs ÁP DỤNG (AP_DUNG)

```
KHUYẾN MÃI CÓ SẵN:

┌────────┬─────────────────────┬──────────────┬────────┐
│ MaKM   │ TenChuongTrinh       │ DieuKien     │ MucGiam│
├────────┼─────────────────────┼──────────────┼────────┤
│ KM001  │ Thứ 3 vui vẻ        │ Thứ 3        │ 20k   │
│ KM002  │ Thành viên Silver    │ Hạng Silver  │ 15k   │
│ KM003  │ Combo vé + bắp      │ Mua kèm      │ 10k   │
│ KM004  │ HSSV                │ Thẻ HSSV     │ 25k   │
│ KM005  │ Giáng Sinh 2025     │ 24-25/12     │ 50k   │
└────────┴─────────────────────┴──────────────┴────────┘

KHÁCH HÀNG CÓ ĐIỀU KIỆN ÁP DỤNG KM:

┌────────┬───────────────────────┬──────────────┬────────────────┐
│ KH ID  │ LoaiThanhVien         │ NgayDat      │ NênÁpDung      │
├────────┼───────────────────────┼──────────────┼────────────────┤
│ KH002  │ Silver                │ 20/12 (T3)   │ KM001, KM002   │
│ KH005  │ Platinum              │ 24/12        │ KM005          │
│ KH006  │ Silver                │ 24/12        │ KM005, KM002   │
│ KH007  │ Bronze                │ 24/12        │ KM005          │
│ KH008  │ Gold                  │ 25/12        │ KM005          │
│ KH009  │ Bronze                │ 25/12        │ KM005          │
│ KH010  │ Platinum              │ 31/12        │ (không có KM)  │
└────────┴───────────────────────┴──────────────┴────────────────┘

❌ HIỆN TẠI: AP_DUNG trống, không có bản ghi nào!
✅ CẦN THÊM: 5-10 bản ghi liên kết vé với khuyến mãi
```

---

### V. DANH GIÁ (DANH_GIA) - VẤN ĐỀ LOGIC

```
DANH GIA HIỆN CÓ:

DG001: KH001 → PH001 (Avengers) - 10 điểm
DG002: KH002 → PH001 (Avengers) - 9 điểm
DG003: KH003 → PH001 (Avengers) - 10 điểm
...
DG015: KH015 → PH008 (Conjuring 3) - 9 điểm

❌ VẤN ĐỀ:
  → Không có VE_XEM_PHIM
  → Không biết KH001 có thực sự xem phim PH001 không
  → DANH_GIA trôi nổi, không liên kết đến bằng chứng mua vé

✅ LOGIC ĐÚNG PHẢI:
  KH001 → VE001 → SC001 → PH001 ✓ (đã mua vé, được phép đánh giá)
  KH001 → (không có vé PH002) ✗ (không được phép đánh giá)

⚠️ CẦN: Kiểm tra lại DANH_GIA sau khi thêm VE_XEM_PHIM
```

---

### VI. LIÊN KẾT DỮ LIỆU - SƠ ĐỒ FLOW

#### ❌ HIỆN TẠI (SAI):
```
KHACH_HANG
    ↓ (mua)
DON_HANG → GOM → MAT_HANG (hàng hóa)
    ↓
THANH_TOAN

❌ VÉ XEM PHIM ĐỐI LẬP (ORPHANED)
```

#### ✅ ĐÚNG (CẦN CÓ):
```
KHACH_HANG
    ↓ (mua)
DON_HANG
    ├─→ GOM → MAT_HANG (hàng hóa: bắp, nước, v.v.)
    ├─→ VE_XEM_PHIM → SUAT_CHIEU → PHIM ✓
    │       ↓
    │      GHE (ghế đã đặt)
    │
    └─→ THANH_TOAN (thanh toán cả hàng hóa + vé)

VE_XEM_PHIM
    ├─→ AP_DUNG → CHUONG_TRINH_KHUYEN_MAI (giảm giá)
    └─→ DANH_GIA → PHIM (đánh giá)
```

---

## 📈 TÍNH TOÁN CHI PHÍ VÉ - CẦN LOGIC

```
LOGIC TÍNH GiáVeCuối CÓ CHỌN LOẠI GHẾ:

GiaVeCoBan = 120,000đ (ví dụ)
LoaiGhe    = "VIP"

┌──────────────────────────────────┐
│ Hệ số giá theo loại ghế:         │
├──────────────────────────────────┤
│ Thường      = 1.0 × GiaVeCoBan  │
│ VIP         = 1.5 × GiaVeCoBan  │
│ Đôi         = 2.0 × GiaVeCoBan  │
│ Giường nằm  = 2.5 × GiaVeCoBan  │
└──────────────────────────────────┘

VÍ DỤ:
GiaVeCoBan = 120,000đ, LoaiGhe = "VIP"
GiaVeCuoi = 120,000 × 1.5 = 180,000đ ✓

GiaVeCoBan = 150,000đ, LoaiGhe = "Đôi"
GiaVeCuoi = 150,000 × 2.0 = 300,000đ ✓

❌ HIỆN TẠI: Không có logic tính toán này
✅ NÊN THÊM: Stored Procedure hoặc Trigger
```

---

## 🎯 CHECKLIST SỬA CHỮA

### Phase 1: DỮ LIỆU BẮTBUỘC (CRITICAL)

- [ ] **Thêm GHE (520 ghế)** - Đã tạo script
  - [ ] P001: 100 ghế (hàng A-F)
  - [ ] P002: 80 ghế (hàng A-E)
  - [ ] P003: 150 ghế (hàng A-K)
  - [ ] P004: 60 ghế (hàng A-F)
  - [ ] P005: 90 ghế (hàng A-I)
  - [ ] P006: 40 ghế (hàng A-D)

- [ ] **Thêm SUAT_CHIEU (17 suất)** - Đã tạo script
  - [ ] 5 suất ngày 20/12
  - [ ] 5 suất ngày 24/12
  - [ ] 2 suất ngày 25/12
  - [ ] 2 suất ngày 31/12

- [ ] **Thêm VE_XEM_PHIM (14 vé)** - Đã tạo script
  - [ ] Liên kết với DON_HANG
  - [ ] Liên kết với SUAT_CHIEU
  - [ ] Liên kết với GHE
  - [ ] Liên kết với KHACH_HANG

### Phase 2: TÍNH TOÁN LOGIC (HIGH)

- [ ] **Thêm AP_DUNG** - Đã tạo script
  - [ ] Áp dụng KM005 cho vé 24-25/12 (7 bản ghi)
  - [ ] Áp dụng KM002 cho vé khách Silver (2 bản ghi)

- [ ] **Xác nhận chi phí VÉ**
  - [ ] DH001: 165k - 105k = 60k vé ✓
  - [ ] DH010: 785k - 440k = 345k vé (3 vé) ✓

### Phase 3: TÍNH TOÀN VẸN DỮ LIỆU (MEDIUM)

- [ ] **Kiểm tra DANH_GIA**
  - [ ] Mỗi review phải có KH mua vé phim đó
  - [ ] Điểm số từ 1-10

- [ ] **Kiểm tra QUAN_LY**
  - [ ] Mỗi AD quản lý ít nhất 1 rạp
  - [ ] Hiện tại: AD001→RAP001, AD002→RAP002, AD003→RAP003 ✓

---

## 📋 KỲ VỌNG SAU SỬA CHỮA

### Thống kê dữ liệu:

```
Database: CINEMA_ORACLE

BẢNG                 │ TRƯỚC │ SAU  │ TĂNG  │ GHI CHÚ
─────────────────────┼──────┼──────┼───────┼───────────────
TAI_KHOAN           │  23  │  23  │   0   │ Không thay đổi
KHACH_HANG          │  20  │  20  │   0   │ Không thay đổi
QUAN_TRI_VIEN       │   3  │   3  │   0   │ Không thay đổi
RAP_CHIEU_PHIM      │   5  │   5  │   0   │ Không thay đổi
PHONG_CHIEU         │   6  │   6  │   0   │ Không thay đổi
PHIM                │   8  │   8  │   0   │ Không thay đổi
CHUONG_TRINH_KHUYEN │   5  │   5  │   0   │ Không thay đổi
DON_HANG            │  12  │  12  │   0   │ Không thay đổi
GOM                 │  17  │  17  │   0   │ Không thay đổi
THANH_TOAN          │  12  │  12  │   0   │ Không thay đổi
CA_LAM_VIEC         │   5  │   5  │   0   │ Không thay đổi
TRINH_CHIEU         │   9  │   9  │   0   │ Không thay đổi
────────────────────┼──────┼──────┼───────┼──────────────
GHE                 │  14  │ 520  │ +506  │ ⬆️ ĐÃ THÊMM
SUAT_CHIEU          │   4  │  17  │  +13  │ ⬆️ ĐÃ THÊMM
VE_XEM_PHIM         │   0  │  14  │  +14  │ ⬆️ THÊMM MỚI
AP_DUNG             │   0  │   7  │   +7  │ ⬆️ THÊMM MỚI
────────────────────┼──────┼──────┼───────┼──────────────
DANH_GIA            │  15  │  15  │   0   │ Cần kiểm tra
QUAN_LY             │   3  │   3  │   0   │ Không thay đổi

TỔNG BẢN GHI: 146 → 667 (+521 bản ghi)
```

---

## ✅ KỲ VỌNG SAU SỬA CHỮA

### 1. Khách hàng CÓ THỂ đặt vé:
```
KH001 → chọn SUAT_CHIEU (SC001) 
      → chọn GHE (P001-A-1) 
      → mua VE (VE001 với giá 60k)
      → thêm vào DON_HANG (DH001)
      → thanh toán (TT001)
```

### 2. Khuyến mãi ĐẠT HIỆU LỰC:
```
KH005 (Platinum) mua vé ngày 24/12
→ áp dụng KM005 (Giáng Sinh -50k)
→ giá vé = 120k - 50k = 70k ✓
```

### 3. Đánh giá phim CÓ LOGIC:
```
KH001 đã mua vé xem PH001 (VE001 → SC001 → PH001)
→ được phép đánh giá PH001 ✓
→ DG001 hợp lệ ✓
```

### 4. Báo cáo doanh thu CHÍNH XÁC:
```
Tổng doanh thu = ∑(GOM) + ∑(VE_XEM_PHIM)
               = 1,615,000đ + Tính toán VE
               = Khớp với ∑(DON_HANG.TongTien)
```

---

**Ngày cập nhật:** 18/04/2026  
**Phiên bản:** v1.0  
**Trạng thái:** Ready to implement
