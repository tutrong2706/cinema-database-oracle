# 📋 BÁNG CÁO KIỂM TOÁN DATABASE - RẠP CHIẾU PHIM

**Ngày kiểm tra:** 18/04/2026  
**Phiên bản kiểm tra:** v1.0  
**Trạng thái:** ⚠️ **PHÁT HIỆN NHIỀU VẤN ĐỀ**

---

## 🔴 VẤN ĐỀ CHÍNH PHÁT HIỆN

### 1️⃣ THIẾU DỮ LIỆU VỀ VÉ XEM PHIM (VE_XEM_PHIM)
**Mức độ nghiêm trọng:** 🔴 CRITICAL

**Mô tả:**
- Dữ liệu insert không chứa bất kỳ bản ghi nào cho bảng `VE_XEM_PHIM`
- Đây là bảng quan trọng nhất trong hệ thống vé, liên kết với:
  - SUAT_CHIEU (suất chiếu)
  - GHE (ghế)
  - KHACH_HANG (khách hàng)
  - DON_HANG (đơn hàng)

**Ảnh hưởng:**
```
Khách hàng đặt vé → không có bản ghi vé 
DON_HANG (DH001-DH012) → không biết vé nào được mua
SUAT_CHIEU (SC001-SC004) → không biết ghế nào được đặt
```

**Dự kiến cần có:** Tối thiểu 30-50 bản ghi vé liên kết với các đơn hàng hiện tại

---

### 2️⃣ THIẾU DỮ LIỆU TRINH_CHIEU LỰC (TRINH_CHIEU_LUC)
**Mức độ nghiêm trọng:** 🟠 HIGH

**Mô tả:**
- INSERT chỉ có 9 bản ghi TRINH_CHIEU cơ bản
- Không có dữ liệu lịch chiếu chi tiết (ngày giờ, trạng thái chiếu)
- Các rạp phim (RAP001-RAP005) chỉ có từ 1-2 bộ phim chiếu

**Vấn đề:**
```
RAP001: 3 bộ phim (PH001, PH002, PH006)
RAP002: 2 bộ phim (PH003, PH007)
RAP003: 2 bộ phim (PH004, PH008)
RAP004: 1 bộ phim (PH005) ← SỐ LƯỢNG QUÁÁAA ÍT
RAP005: 1 bộ phim (PH001)
```

---

### 3️⃣ KHÔNG LIÊN KẾT DỨNG GIỮA TRINH_CHIEU VÀ SUAT_CHIEU
**Mức độ nghiêm trọng:** 🔴 CRITICAL

**Mô tả:**
- SUAT_CHIEU (SC001-SC004) được insert độc lập
- Không có ràng buộc logic:
  - SC001: MaPhim='PH001', MaPhong='P001' nhưng không check TRINH_CHIEU('RAP001', 'PH001') có tồn tại
  - SC003: MaPhim='PH003', MaPhong='P003' → RAP002 có chiếu PH003, P003 cũng ở RAP002 ✓
  - Nhưng SC002: MaPhim='PH002', MaPhong='P002' → P002 ở RAP001, TRINH_CHIEU có (RAP001, PH002) ✓

**Logic đúng phải là:**
```
TRINH_CHIEU(MaRapPhim, MaPhim) → phim được chiếu tại rạp nào
PHONG_CHIEU(MaPhong, MaRapPhim) → phòng ở rạp nào
SUAT_CHIEU(MaPhim, MaPhong) → suất chiếu phim nào ở phòng nào

⚠️ HIỆN TẠI: SUAT_CHIEU chỉ liên kết qua MaPhim và MaPhong
❌ KHÔNG CÓ CHECK: MaPhim có được chiếu tại rạp của MaPhong không?
```

---

### 4️⃣ DỮ LIỆU SUẤT CHIẾU QUÁA THIẾU
**Mức độ nghiêm trọng:** 🟠 HIGH

**Mô tả:**
- Chỉ có 4 suất chiếu (SC001-SC004) cho 8 bộ phim
- Chỉ có 2 ngày chiếu (2025-12-20 và 2025-12-24)
- Ngày 2025-12-20 có 3 suất, ngày 2025-12-24 có 1 suất

**Hiện tại:**
```
SC001: 2025-12-20, P001, 08:00-10:30, 120,000đ (PH001 - Avengers)
SC002: 2025-12-20, P002, 10:00-12:00, 100,000đ (PH002 - Nhà Bà Nữ)
SC003: 2025-12-20, P003, 13:00-15:15, 150,000đ (PH003 - Fast & Furious)
SC004: 2025-12-24, P001, 19:00-21:30, 120,000đ (PH001 - Avengers)
```

**Kỳ vọng:** Mỗi phòng phải có 2-4 suất/ngày, tối thiểu 3-5 ngày chiếu

---

### 5️⃣ ĐƠN HÀNG VÀ VÉ KHÔNG LIÊN KẾT LOGIC
**Mức độ nghiêm trọng:** 🔴 CRITICAL

**Phân tích DH001:**
```
DH001: KH001 đặt 2025-12-20 10:00, TongTien=165,000đ

GOM(DH001):
  - MH001 (Bắp bơ): 1 × 45,000 = 45,000đ
  - MH002 (Nước Coca): 2 × 30,000 = 60,000đ
  TỔNG: 105,000đ ❌ KHÔNG KHỚP (Đơn hàng: 165,000đ)

❓ DỨA LÀ 60,000đ CHI PHÍ VÉ XEM PHIM?
❓ NHƯNG KHÔNG CÓ BẢN GHI VE_XEM_PHIM NÀO LIÊN KẾT VỚI DH001!
```

**Phân tích tất cả đơn hàng:**
```
DH001: GOM tổng = 105,000đ, DH tổng = 165,000đ → THIẾU 60,000đ (1 vé?)
DH002: GOM tổng = 70,000đ, DH tổng = 160,000đ → THIẾU 90,000đ (vé?)
DH003: GOM tổng = 60,000đ, DH tổng = 100,000đ → THIẾU 40,000đ (vé?)
DH004: GOM không có → THIẾU 95,000đ (vé?)
DH005: GOM tổng = 400,000đ, DH tổng = 500,000đ → THIẾU 100,000đ (vé?)
DH006: GOM tổng = 85,000đ, DH tổng = 175,000đ → THIẾU 90,000đ (vé?)
DH007: GOM tổng = 195,000đ, DH tổng = 280,000đ → THIẾU 85,000đ (vé?)
DH008: GOM tổng = 55,000đ, DH tổng = 145,000đ → THIẾU 90,000đ (vé?)
DH009: GOM tổng = 280,000đ, DH tổng = 380,000đ → THIẾU 100,000đ (vé?)
DH010: GOM tổng = 440,000đ, DH tổng = 785,000đ → THIẾU 345,000đ (nhiều vé?)
DH011: GOM tổng = 90,000đ, DH tổng = 155,000đ → THIẾU 65,000đ (vé?)
DH012: GOM tổng = 110,000đ, DH tổng = 200,000đ → THIẾU 90,000đ (vé?)
```

**🚨 KẾT LUẬN:** Tất cả 12 đơn hàng đều có chi phí VÉ XEM PHIM nhưng KHÔNG CÓ DỮ LIỆU VE_XEM_PHIM!

---

### 6️⃣ BẢNG AP_DUNG (ÁP DỤNG KHUYẾN MÃI) KHÔNG CÓ DỮ LIỆU
**Mức độ nghiêm trọng:** 🟠 HIGH

**Mô tả:**
- Không có bất kỳ bản ghi nào trong bảng AP_DUNG
- Có 5 chương trình khuyến mãi (KM001-KM005) nhưng không áp dụng cho vé nào
- Lôgic: Khách hàng mua vé → được áp dụng khuyến mãi

**Khuyến mãi có sẵn:**
```
KM001: Thứ 3 vui vẻ - giảm 20,000đ
KM002: Thành viên Silver - giảm 15,000đ
KM003: Combo vé + bắp - giảm 10,000đ
KM004: HSSV - giảm 25,000đ
KM005: Giáng Sinh 2025 (24-25/12) - giảm 50,000đ
```

**🟢 CƠ HỘI:** KH002 (Silver), KH006 (Silver), KH016 (Silver) nên được áp KM002

---

### 7️⃣ DỮ LIỆU GHẾ KHÔNG ĐỦ CHO PHÒNG
**Mức độ nghiêm trọng:** 🟠 HIGH

**So sánh:**
```
PHONG_CHIEU:
P001: 100 ghế (RAP001)
P002: 80 ghế (RAP001)
P003: 150 ghế (RAP002)
P004: 60 ghế (RAP003)
P005: 90 ghế (RAP004)
P006: 40 ghế (RAP005)

GHE (thực tế):
P001: 6 ghế (A1, A2, A3, B1, B2, E1, E2) ← Phải có 100 ghế!
P002: 2 ghế (A1, A2) ← Phải có 80 ghế!
P003: 2 ghế (C5, C6) ← Phải có 150 ghế!
P004: 1 ghế (A1) ← Phải có 60 ghế!
P005: 1 ghế (A1) ← Phải có 90 ghế!
P006: 2 ghế (D1, D2) ← Phải có 40 ghế!

TỔNG GHẾ HIỆN CÓ: 14 ghế
TỔNG GHẾ CẦN CÓ: 520 ghế
❌ THIẾU: 506 ghế (96% không có dữ liệu)
```

**⚠️ KHÔNG CÓ KHÁCH HÀNG CÓ THỂ ĐẶT VÉ VÌ SỬ DỤ LIỆU GHẾ QUÁA THIẾU**

---

### 8️⃣ DANH GIA (ĐÁNH GIÁ PHIM) CÓ VẤN ĐỀ LOGIC
**Mức độ nghiêm trọng:** 🟡 MEDIUM

**Vấn đề:**
```
DG001: KH001 đánh giá PH001 (Avengers) - 10 điểm
DG002: KH002 đánh giá PH001 - 9 điểm
...

❓ NHƯNG KHÔNG CÓ BẢN GHI VE_XEM_PHIM NÀO CHỈ RA KH001 ĐÃ XEM PHIM PH001!
```

**Logic đúng phải:** Khách hàng chỉ được đánh giá phim mà họ đã mua vé xem

---

### 9️⃣ THANH TOAN (THANH TOÁN) CÓ KHÔNG KHỚP
**Mức độ nghiêm trọng:** 🟡 MEDIUM

**Vấn đề:**
```
THANH_TOAN:
TT001: DH001 = 165,000đ, THANH_TOAN = 165,000đ ✓
TT002: DH002 = 160,000đ, THANH_TOAN = 160,000đ ✓
...

❌ NHƯNG:
  - TT001 trạng thái "Đã thanh toán" nhưng DH001 trạng thái cũng "Đã thanh toán" ✓
  - TT004 trạng thái "Thất bại" nhưng DH004 trạng thái "Hủy" ✓ (logic ổn)
  - TT008 trạng thái "Đang xử lý" → DH008 trạng thái "Chờ thanh toán" ✓ (ổn)

✓ Cái này tương đối ổn, nhưng cần kiểm tra ràng buộc.
```

---

### 🔟 KHÁCH HÀNG VÀ ĐIỂM TÍCH LŨY LỤC
**Mức độ nghiêm trọng:** 🟡 MEDIUM

**Phân tích:**
```
Tổng GOM (hàng hóa bán):
  MH001: 3 lần × 45,000 = 135,000đ
  MH002: 4 lần × 30,000 = 120,000đ
  MH003: 3 lần × 70,000 = 210,000đ
  MH004: 1 lần × 60,000 = 60,000đ
  MH005: 3 lần × 200,000 = 600,000đ
  MH006: 2 lần × 55,000 = 110,000đ
  MH007: 2 lần × 40,000 = 80,000đ
  MH008: 2 lần × 150,000 = 300,000đ
  TỔNG: 1,615,000đ

TỔNG DOANH THU ĐƠN HÀNG: 2,515,000đ

CHI PHÁT: Tuyến vé xem phim (lúc này chưa có dữ liệu) = 2,515,000 - 1,615,000 = 900,000đ

Điểm tích lũy nên là: 900,000 / 1,000 = ~900 điểm
NHƯNG HIỆN CÓ:
  KH001: 33 điểm ❌
  KH002: 210 điểm ❌
  KH003: 682 điểm ❌
  KH005: 1213 điểm ❌
  KH010: 1060 điểm ❌
  ...

❌ ĐIỂM TÍCH LŨY KHÔNG KHỚP LOGIC DOANH THU
```

---

## 📊 BẢNG TÓM TẮT

| Bảng | Mục đích | Dữ liệu hiện tại | Dự kiến | Trạng thái |
|------|---------|-----------------|--------|-----------|
| **VE_XEM_PHIM** | Vé xem phim | 0 bản ghi | 20-50 | 🔴 EMPTY |
| **SUAT_CHIEU** | Suất chiếu | 4 bản ghi | 20-30 | 🟠 THIẾU |
| **GHE** | Danh sách ghế | 14 bản ghi | 500+ | 🔴 EMPTY |
| **AP_DUNG** | Áp dụng KM | 0 bản ghi | 10-15 | 🔴 EMPTY |
| **DON_HANG** | Đơn hàng | 12 bản ghi | 12-15 ✓ | 🟢 OK |
| **GOM** | Chi tiết đơn | 17 bản ghi | 20-25 | 🟡 OK |
| **THANH_TOAN** | Thanh toán | 12 bản ghi | 12-15 | 🟢 OK |
| **DANH_GIA** | Đánh giá phim | 15 bản ghi | 15-20 | 🟡 OK |
| **TAI_KHOAN** | Tài khoản | 23 bản ghi | 30+ | 🟡 OK |
| **KHACH_HANG** | Khách hàng | 20 bản ghi | 20+ | 🟢 OK |
| **QUAN_TRI_VIEN** | Quản trị viên | 3 bản ghi | 5-10 | 🟡 OK |
| **PHIM** | Danh sách phim | 8 bản ghi | 8-15 | 🟢 OK |
| **PHONG_CHIEU** | Phòng chiếu | 6 bản ghi | 6-8 | 🟢 OK |
| **RAP_CHIEU_PHIM** | Rạp chiếu phim | 5 bản ghi | 3-5 | 🟢 OK |

---

## 🎯 KHUYẾN NGHỊ CHỈNH SỬA

### 🔴 ÚU TIÊN 1 (CRITICAL - Phải sửa ngay)

1. **INSERT dữ liệu bảng GHE hoàn chỉnh** (500+ bản ghi)
   - Mỗi phòng phải có đủ số ghế theo `SoGhe` trong PHONG_CHIEU
   - Chia thành các loại: Thường, VIP, Đôi, Giường nằm

2. **INSERT dữ liệu bảng SUAT_CHIEU đủ** (20-30 suất)
   - Mỗi ngày mỗi phòng tối thiểu 2 suất (sáng, chiều, tối)
   - Ít nhất 5-7 ngày chiếu

3. **INSERT dữ liệu bảng VE_XEM_PHIM** (30-50 vé)
   - Liên kết với SUAT_CHIEU
   - Liên kết với GHE
   - Liên kết với DON_HANG (nhất là DH001-DH010 có chi phí vé)
   - Liên kết với KHACH_HANG

---

### 🟠 ÚU TIÊN 2 (HIGH - Nên sửa)

4. **INSERT thêm dữ liệu SUAT_CHIEU** để phim được chiếu nhiều lần
5. **INSERT dữ liệu bảng AP_DUNG** (10-15 bản ghi)
   - Áp dụng KM005 (Giáng Sinh) cho các vé ngày 24-25/12
   - Áp dụng KM002 (Silver) cho vé của khách hạng Silver

6. **INSERT thêm suất chiếu khác** để đa dạng lịch
7. **Kiểm tra lại điểm tích lũy KHACH_HANG** để khớp với lịch sử mua hàng

---

### 🟡 ÚU TIÊN 3 (MEDIUM - Nên kiểm tra)

8. **INSERT dữ liệu CA_LAM_VIEC** tương ứng với lịch chiếu
9. **Kiểm tra lại logic DANH_GIA** - khách hàng chỉ được đánh giá phim đã mua vé
10. **Thêm ràng buộc CHECK** để validate logic ở database

---

## 📝 KẾT LUẬN

**🚨 Tình trạng hiện tại:** Database chưa đầy đủ để sử dụng thực tế

**Vấn đề cốt lõi:**
- ❌ Không có dữ liệu vé xem phim (bảng VE_XEM_PHIM)
- ❌ Không có đủ dữ liệu ghế (chỉ 14/520 ghế)
- ❌ Không có đủ suất chiếu
- ❌ Không liên kết dữ liệu gó cảnh (orphaned records)

**Mức độ:** 🔴 **KHÔNG THỂ HOẠT ĐỘNG** ở trạng thái hiện tại

---

**Người kiểm tra:** GitHub Copilot  
**Ngày báo cáo:** 18/04/2026  
**Phiên bản:** v1.0-DRAFT
