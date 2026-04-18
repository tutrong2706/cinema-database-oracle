# 📚 COMPREHENSIVE API SPECIFICATION - Cinema Management System

## 🎯 API ENDPOINTS STRUCTURE

### 1️⃣ **AUTHENTICATION** (`/api/auth`)
- `POST /register` - Register new customer
- `POST /login` - Login (returns JWT)
- `POST /logout` - Logout
- `GET /profile` - Get current user profile
- `PUT /profile` - Update profile

### 2️⃣ **PUBLIC/BOOKING** (`/api/auth` - No auth needed)
- `GET /raps` - Get all cinemas
- `GET /combos` - Get all products (snacks, drinks)
- `GET /suat-chieus` - Get screenings (filter by movie/cinema/date)
- `GET /seat-map/:maSuatChieu` - Get seat map for screening
- `POST /book-ticket` - Book tickets
- `POST /orders` - Create order

### 3️⃣ **CUSTOMER** (`/api/customer` - Auth required)
- `GET /tickets` - Get my tickets
- `GET /orders` - Get my orders
- `GET /favorites` - Get favorite movies
- `POST /favorites/:maPhim` - Add favorite
- `DELETE /favorites/:maPhim` - Remove favorite
- `POST /reviews/:maPhim` - Post review
- `GET /reviews/movie/:maPhim` - Get reviews

### 4️⃣ **ADMIN - PHIM** (`/api/admin/phims` - Admin only)
- `GET /` - Get all movies
- `GET /:id` - Get movie details
- `POST /` - Create movie
- `PUT /:id` - Update movie
- `DELETE /:id` - Delete movie
- `GET /search?keyword=` - Search movies

### 5️⃣ **ADMIN - SUẤT CHIẾU** (`/api/admin/suats` - Admin only)
- `GET /` - Get all screenings
- `GET /:id` - Get screening details
- `POST /` - Create screening
- `PUT /:id` - Update screening
- `DELETE /:id` - Delete screening

### 6️⃣ **ADMIN - RẠP** (`/api/admin/raps` - Admin only)
- `GET /` - Get all cinemas
- `GET /:id` - Get cinema details
- `POST /` - Create cinema
- `PUT /:id` - Update cinema
- `DELETE /:id` - Delete cinema

### 7️⃣ **ADMIN - PHÒNG** (`/api/admin/phongs` - Admin only)
- `GET /` - Get all rooms
- `GET /:maRap` - Get rooms by cinema
- `POST /` - Create room
- `PUT /:id` - Update room
- `DELETE /:id` - Delete room

### 8️⃣ **ADMIN - HÀNG (COMBO)** (`/api/admin/hangs` - Admin only)
- `GET /` - Get all products
- `POST /` - Create product
- `PUT /:id` - Update product
- `DELETE /:id` - Delete product

### 9️⃣ **ADMIN - KHUYẾN MÃI** (`/api/admin/promotions` - Admin only)
- `GET /` - Get all promotions
- `POST /` - Create promotion
- `PUT /:id` - Update promotion
- `DELETE /:id` - Delete promotion

### 🔟 **ADMIN - USERS** (`/api/admin/users` - Admin only)
- `GET /` - Get all users
- `GET /stats` - Get user statistics
- `GET /:id` - Get user details
- `PUT /:id/role` - Change user role

### 1️⃣1️⃣ **ADMIN - ORDERS** (`/api/admin/orders` - Admin only)
- `GET /` - Get all orders
- `GET /:id` - Get order details
- `PUT /:id/status` - Update order status
- `GET /search?date=` - Search orders by date

### 1️⃣2️⃣ **ADMIN - REPORTS** (`/api/admin/reports` - Admin only)
- `GET /revenue/daily` - Daily revenue
- `GET /revenue/monthly` - Monthly revenue
- `GET /revenue/movie` - Revenue by movie
- `GET /revenue/cinema` - Revenue by cinema
- `GET /popular-movies` - Popular movies
- `GET /customer-stats` - Customer statistics

---

## 📊 DATABASE MODELS TO CREATE

### Models Needed:
1. ✅ `movieModel.js` - PHIM
2. ✅ `screeningModel.js` - SUAT_CHIEU
3. ✅ `generalModel.js` - RAP_CHIEU_PHIM, MAT_HANG
4. ✅ `accountModel.js` - TAI_KHOAN, KHACH_HANG
5. ✅ `ticketModel.js` - VE_XEM_PHIM
6. ❌ `roomModel.js` - PHONG_CHIEU (NEW)
7. ❌ `orderModel.js` - DON_HANG, GOM (NEW)
8. ❌ `reviewModel.js` - DANH_GIA (NEW)
9. ❌ `promotionModel.js` - CHUONG_TRINH_KHUYEN_MAI (NEW)
10. ❌ `reportModel.js` - Report views (NEW)

### Controllers Needed:
1. ✅ `movieController.js` - Movie CRUD
2. ✅ `screeningController.js` - Screening CRUD
3. ✅ `bookingController.js` - Public booking
4. ✅ `adminController.js` - Admin operations
5. ❌ `roomController.js` - Room management (NEW)
6. ❌ `orderController.js` - Order management (NEW)
7. ❌ `customerController.js` - Customer profile/favorites (NEW)
8. ❌ `reportController.js` - Revenue reports (NEW)

---

## 🔗 KEY DATABASE JOINS FOR APIs

### Screenings with Details:
```sql
SELECT sc.*, p.TenPhim, pc.Ten TENPHONG, rc.Ten TENRAP
FROM SUAT_CHIEU sc
JOIN PHIM p ON sc.MaPhim = p.MaPhim
JOIN PHONG_CHIEU pc ON sc.MaPhong = pc.MaPhong
JOIN RAP_CHIEU_PHIM rc ON pc.MaRapPhim = rc.MaRapPhim
```

### Orders with Line Items:
```sql
SELECT dh.*, g.MaHang, g.SoLuong, g.DonGia
FROM DON_HANG dh
LEFT JOIN GOM g ON dh.MaDonHang = g.MaDonHang
```

### Tickets with Screening Details:
```sql
SELECT v.*, sc.NgayChieu, p.TenPhim, rc.Ten TENRAP
FROM VE_XEM_PHIM v
JOIN SUAT_CHIEU sc ON v.MaSuatChieu = sc.MaSuatChieu
JOIN PHIM p ON sc.MaPhim = p.MaPhim
JOIN PHONG_CHIEU pc ON sc.MaPhong = pc.MaPhong
JOIN RAP_CHIEU_PHIM rc ON pc.MaRapPhim = rc.MaRapPhim
```

### Revenue Report:
```sql
SELECT p.TenPhim, COUNT(v.MaVe) SoVe, SUM(v.GiaVeCuoi) DoanhThu
FROM VE_XEM_PHIM v
JOIN SUAT_CHIEU sc ON v.MaSuatChieu = sc.MaSuatChieu
JOIN PHIM p ON sc.MaPhim = p.MaPhim
WHERE v.TrangThai = 'Đã thanh toán'
GROUP BY p.MaPhim, p.TenPhim
```

---

## 🗂️ FILES TO CREATE

### Models (`app/Backend/src/models/`):
- [ ] `roomModel.js`
- [ ] `orderModel.js`
- [ ] `reviewModel.js`
- [ ] `promotionModel.js`
- [ ] `reportModel.js`

### Controllers (`app/Backend/src/controllers/`):
- [ ] `roomController.js`
- [ ] `orderController.js`
- [ ] `customerController.js`
- [ ] `reportController.js`

### Routes (`app/Backend/src/routes/`):
- [ ] `roomRoutes.js`
- [ ] `orderRoutes.js`
- [ ] `customerRoutes.js`
- [ ] `reportRoutes.js`

---

## 🚀 PRIORITY ORDER

**PHASE 1 (Highest Priority):**
1. Orders & Order Items (DON_HANG, GOM)
2. Rooms (PHONG_CHIEU)
3. Revenue Reports
4. Promotions

**PHASE 2:**
5. Customer favorites
6. Reviews (DANH_GIA)
7. Product management (MAT_HANG)

**PHASE 3:**
8. Analytics
9. Admin user management
10. System logs

