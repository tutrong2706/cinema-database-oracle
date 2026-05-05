# 🎬 Cinema Database Management System

## 📋 Overview

Hệ thống quản lý rạp chiếu phim toàn diện với:
- **Backend**: Node.js + Express + Oracle Database
- **Frontend**: React + Vite + Tailwind CSS
- **Database**: Oracle 21c XE với Views, Functions, Procedures

---

## 🚀 Quick Start

### Backend
```bash
cd app/Backend
npm install
npm run dev  # Chạy trên port 3069
cd app/backend ; npm run dev
```

### Frontend
```bash
cd app/Frontend
npm install
npm run dev  # Chạy trên port 5173
cd app/Frontend ; npm run dev
```

### Database
```bash
docker-compose up -d
docker-compose down -v
docker exec -it cinema-oracle-db sqlplus dev/dev123@//localhost:1521/XEPDB1
@/docker-entrypoint-initdb.d/00_create_user_oracle.sql
@/docker-entrypoint-initdb.d/01_create_tables_oracle.sql
@/docker-entrypoint-initdb.d/02_insert_data_oracle.sql
@/docker-entrypoint-initdb.d/03_sp_phim_oracle.sql
@/docker-entrypoint-initdb.d/04_sp_donhang_oracle.sql
@/docker-entrypoint-initdb.d/05_sp_ve_oracle.sql
@/docker-entrypoint-initdb.d/06_functions_oracle.sql
@/docker-entrypoint-initdb.d/07_triggers_business_oracle.sql
@/docker-entrypoint-initdb.d/08_triggers_tongtien_oracle.sql
@/docker-entrypoint-initdb.d/09_sp_view_data_oracle.sql
@/docker-entrypoint-initdb.d/10_demo_script_oracle.sql
@/docker-entrypoint-initdb.d/11_image_operations_oracle.sql
@/docker-entrypoint-initdb.d/12_api_helper_procedures_oracle.sql
@/docker-entrypoint-initdb.d/13_enhanced_views_sorting_oracle.sql
@/docker-entrypoint-initdb.d/run_all_oracle.sql
```

`run_all_oracle.sql` hiện đã bao gồm các script seed mở rộng để test mua vé tải lớn:
- `02a_insert_more_data.sql` (phim/phòng/suất chiếu/đơn/vé mở rộng)
- `17_seed_massive_screenings_tickets.sql` (massive data rạp/phòng/suất chiếu/vé)
- `18_seed_purchase_test_data_oracle.sql` (nhiều đơn chờ thanh toán cho flow mua vé)
- `19_seed_massive_showtimes_oracle.sql` (bơm rất nhiều suất chiếu để test transaction)

---

## 📊 Database Schema

### Main Tables
- **PHIM** - Movies
- **SUAT_CHIEU** - Screenings
- **RAP_CHIEU_PHIM** - Cinemas
- **PHONG_CHIEU** - Theater Rooms
- **GHE** - Seats
- **VE_XEM_PHIM** - Tickets
- **DON_HANG** - Orders
- **TAI_KHOAN** - Accounts
- **DANH_GIA** - Reviews
- **MAT_HANG** - Products (Snacks, Drinks)
- **CHUONG_TRINH_KHUYEN_MAI** - Promotions

### Important Views
- `V_PHIM_SORTED` - Movies with rating & revenue
- `V_SUAT_CHIEU_FULL` - Screenings with full details
- `V_PHIM_PERFORMANCE` - Movie analytics
- `V_DOANH_THU_THEO_PHIM` - Revenue by movie

---

## 🔑 Key API Endpoints

### Public (No Auth)
- `GET /api/auth/raps` - Get all cinemas
- `GET /api/auth/combos` - Get products
- `GET /api/auth/suat-chieus` - Get screenings
- `GET /api/phim` - Get all movies
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Register

### Admin Only (Auth + Role)
- `GET /api/admin/phims` - Manage movies
- `GET /api/admin/suats` - Manage screenings
- `GET /api/admin/raps` - Manage cinemas
- `GET /api/admin/revenue` - Revenue reports
- `GET /api/admin/users` - User management

### Customer (Auth)
- `GET /api/customer/tickets` - My tickets
- `GET /api/customer/orders` - My orders
- `POST /api/customer/reviews/:maPhim` - Post review

---

## 🗂️ Project Structure

```
cinema-database-oracle/
├── app/
│   ├── Backend/
│   │   ├── src/
│   │   │   ├── controllers/
│   │   │   ├── models/
│   │   │   ├── routes/
│   │   │   ├── middleware/
│   │   │   ├── helpers/
│   │   │   └── config/
│   │   ├── server.js
│   │   └── package.json
│   │
│   └── Frontend/
│       ├── src/
│       │   ├── pages/
│       │   ├── components/
│       │   ├── api/
│       │   └── App.jsx
│       ├── vite.config.js
│       └── package.json
│
├── sql/
│   ├── 01_create_tables_oracle.sql
│   ├── 02_insert_data_oracle.sql
│   ├── 03_sp_phim_oracle.sql
│   ├── 04_sp_donhang_oracle.sql
│   ├── 05_sp_ve_oracle.sql
│   ├── 06_functions_oracle.sql
│   ├── 07_triggers_business_oracle.sql
│   ├── 08_triggers_tongtien_oracle.sql
│   ├── 09_sp_view_data_oracle.sql
│   ├── 10_demo_script_oracle.sql
│   ├── 11_image_operations_oracle.sql
│   ├── 12_api_helper_procedures_oracle.sql
│   ├── 13_enhanced_views_sorting_oracle.sql
│   ├── 14_demo_test_logic.sql
│   └── run_all_oracle.sql
│
└── docs/
    ├── DATABASE_SCHEMA_MAPPING.md
    ├── API_SPECIFICATION.md
    └── MODELS_CREATED.md
```

---

## 🔧 Configuration

### Backend .env
```
PORT=3069
DB_USER=dev
DB_PASSWORD=dev123
DB_HOST=localhost
DB_PORT=1521
DB_SERVICE_NAME=XEPDB1
JWT_SECRET=your_secret_key
```

### Frontend .env
```
VITE_API_URL=http://localhost:3069/api
```

---

## 📚 Documentation

- **DATABASE_SCHEMA_MAPPING.md** - Database schema & column mappings
- **API_SPECIFICATION.md** - Complete API endpoints
- **MODELS_CREATED.md** - All database models & functions

---

## 🎯 Features

### ✅ Completed
- Movie management (CRUD)
- Screening management
- Cinema & room management
- Ticket booking system
- User authentication (JWT)
- Admin dashboard
- Revenue reports
- Customer reviews
- Order management
- Seat management

---

## 👥 Roles

- **Admin** - Full system access, reports, user management
- **Customer** - Book tickets, write reviews, view history
- **Guest** - View movies, screenings, public info

---

## 🛡️ Security

- JWT token-based authentication
- Role-based access control (RBAC)
- Password hashing
- SQL injection prevention
- Input validation

---

## 📞 Support

For issues or questions, check the docs folder.

