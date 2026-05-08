# 🍃 MongoDB Optimistic Concurrency Control Demo

## Tổng Quan

Demo này minh họa cơ chế **Optimistic Concurrency Control** - một mô hình quản lý đồng thời (**không sử dụng khóa**) phổ biến trong các ứng dụng NoSQL và web hiện đại.

---

## 🔑 Khái Niệm Chính

### Optimistic Concurrency Control (OCC)

**Triết lý**: Giả định rằng **conflict hiếm khi xảy ra**. Thay vì khóa tài nguyên trước (pessimistic lock), ta:
1. **READ** dữ liệu kèm **version number** (không khóa)
2. **MODIFY** dữ liệu ở client
3. **WRITE** dữ liệu + kiểm tra version:
   - Nếu version khớp → ghi thành công, version++
   - Nếu version khác → **CONFLICT!** → Trả lỗi 409

**Ưu điểm**:
- ✅ Không có lock overhead → hiệu suất cao
- ✅ Concurrent requests nhiều → không bị block
- ✅ Phù hợp với web API, mobile apps
- ✅ Dễ scale horizontally (không need transaction manager)

**Nhược điểm**:
- ⚠️ Khi conflict → client phải retry lại
- ⚠️ Không phù hợp với high-conflict scenarios
- ⚠️ Cần client logic xử lý conflict

---

## 🚀 Cách Test Conflict Trên Web

### Bước 1: Chuẩn Bị
- Backend chạy ở port **3069**
- MongoDB chạy ở **localhost:27017** (hoặc cập nhật `.env`)
- Frontend chạy ở port **5173**

### Bước 2: Truy Cập Demo Page
```
http://localhost:5173/mongo-demo
```

### Bước 3: Thấy Conflict (Race Condition)

```
┌─────────────────────────────────────────────┐
│          STEP 1: Get Booking (v=0)          │
├─────────────────────────────────────────────┤
│                                             │
│  Tab 1: Click "📖 Lấy Booking"              │
│  ✓ Get booking, version = 0                 │
│  ✓ UI hiển thị: "Version: 0"                │
│                                             │
│  Tab 2: Click "📖 Lấy Booking"              │
│  ✓ Get booking, version = 0                 │
│  ✓ UI hiển thị: "Version: 0"                │
│                                             │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│      STEP 2: Update (Tab 1 thành công)      │
├─────────────────────────────────────────────┤
│                                             │
│  Tab 1: Sửa "Ghế" → "A1, A5, A6"           │
│         Click "✅ Update"                   │
│  ✓ POST /mongo/booking/update               │
│    - bookingId: ...                        │
│    - gheDaDat: ["A1", "A5", "A6"]          │
│    - __v: 0 (version cũ)                   │
│                                             │
│  Server: Check if (__v == 0) → YES! ✓      │
│  Server: UPDATE, version 0 → 1              │
│  ✓ Tab 1: Message = "✅ Success! v0 → v1"   │
│                                             │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│     STEP 3: Update (Tab 2 bị conflict)      │
├─────────────────────────────────────────────┤
│                                             │
│  Tab 2: Sửa "Ghế" → "A2, A3"               │
│         Click "✅ Update"                   │
│  ✓ POST /mongo/booking/update               │
│    - bookingId: ...                        │
│    - gheDaDat: ["A2", "A3"]                │
│    - __v: 0 (version cũ - OUTDATED!)       │
│                                             │
│  Server: Check if (__v == 0)?               │
│          No! Current version = 1 (Tab 1 đã  │
│          update rồi!)                      │
│  ✗ CONFLICT! → Return 409                   │
│                                             │
│  ✗ Tab 2: Message = "⚠️ CONFLICT!           │
│            Version mismatch: v0 vs v1"      │
│            "Hãy click Lấy Booking lại"     │
│                                             │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│      STEP 4: Retry (Tab 2 lấy lại)          │
├─────────────────────────────────────────────┤
│                                             │
│  Tab 2: Click "📖 Lấy Booking"              │
│  ✓ GET booking, version = 1 (đã update)    │
│  ✓ gheDaDat = ["A1", "A5", "A6"] (từ Tab1) │
│  ✓ UI refresh: "Version: 1"                 │
│                                             │
│  Tab 2: Sửa lại ghế (dựa trên dữ liệu mới) │
│         Click "✅ Update"                   │
│  ✓ POST với __v: 1 → Thành công!            │
│  ✓ Message = "✅ Success! v1 → v2"          │
│                                             │
└─────────────────────────────────────────────┘
```

---

## 📝 Lịch Sử Trên UI

Khi bạn thực hiện các bước trên, bạn sẽ thấy lịch sử tương tự:

```
📝 Lịch Sử:
17:45:23  ✅ Khởi tạo booking mới trên MongoDB
17:45:24  📖 GET: Booking lấy version 0
17:45:25  📖 GET: Booking lấy version 0
17:45:26  ✏️ UPDATE: SUCCESS (v0 → v1)
17:45:27  ❌ UPDATE CONFLICT: v0 vs DB v1
17:45:28  📖 GET: Booking lấy version 1
17:45:29  ✏️ UPDATE: SUCCESS (v1 → v2)
```

---

## 🎯 So Sánh: MongoDB vs Oracle

### MongoDB (Optimistic Lock - Demo này)
```javascript
// READ (không khóa)
const booking = await bookings.findOne({ _id: id });
const version = booking.__v;

// MODIFY
booking.seats = [...];

// WRITE (kiểm tra version)
const result = await bookings.findOneAndUpdate(
  { _id: id, __v: version },  // ← Check version!
  { $set: {...}, $inc: { __v: 1 } }
);
```

**Kết quả**: ✅ Nếu version match | ❌ Nếu khác → Conflict 409

### Oracle (Pessimistic Lock - Truyền thống)
```sql
-- READ (+ Lock)
SELECT * FROM BOOKING WHERE ID = '123' FOR UPDATE;

-- MODIFY (đang lock)
UPDATE BOOKING SET SEATS = '...' WHERE ID = '123';

-- COMMIT (release lock)
COMMIT;
```

**Kết quả**: Người khác phải đợi → hiệu suất thấp hơn

---

## 🔧 API Endpoints

### GET /api/mongo/booking
**Lấy booking + version**
```bash
curl http://localhost:3069/api/mongo/booking?bookingId=demo_123
```
**Response**:
```json
{
  "code": 200,
  "message": "OK",
  "meta": {
    "bookingId": "demo_123",
    "tenPhim": "Avatar",
    "gheDaDat": ["A1", "A2"],
    "tongtien": 400000,
    "__v": 0
  }
}
```

### POST /api/mongo/booking/update
**Cập nhật với Optimistic Lock**
```bash
curl -X POST http://localhost:3069/api/mongo/booking/update \
  -H "Content-Type: application/json" \
  -d '{
    "bookingId": "demo_123",
    "gheDaDat": ["A1", "A5"],
    "tongtien": 400000,
    "__v": 0
  }'
```

**Nếu thành công**:
```json
{
  "code": 200,
  "message": "Cập nhật thành công!",
  "meta": {
    "bookingId": "demo_123",
    "__v": 1
  }
}
```

**Nếu conflict**:
```json
{
  "code": 409,
  "message": "Conflict! Booking đã bị sửa bởi người khác.",
  "meta": {
    "currentVersion": 1,
    "expectedVersion": 0,
    "conflictReason": "Version mismatch - Optimistic Lock failed"
  }
}
```

---

## 📚 Use Cases

### ✅ Phù Hợp (Low Conflict)
- 🎬 **Booking vé phim**: Ít user modify cùng booking
- 🛒 **Shopping cart**: Mỗi user có cart riêng
- 📝 **Collaborative docs**: CRDT hoặc OCC
- 💬 **Comments**: Ít conflict, mỗi comment riêng

### ❌ Không Phù Hợp (High Conflict)
- 💰 **Ngân hàng**: Cần strong consistency, pessimistic lock tốt hơn
- 📊 **Inventory**: Nhiều user update cùng lúc
- 🎮 **Game state**: Realtime update liên tục

---

## 💡 Hướng Dẫn Thực Hành

1. **Mở 2-3 tab cùng lúc**
2. **Cả 3 tab click "📖 Lấy Booking"** → version = 0
3. **Tab 1 & 2: Sửa ghế khác nhau → Click Update**
4. **Xem ai thành công, ai bị conflict**
5. **Người bị conflict: Click "📖 Lấy Booking" lại → nhập dữ liệu mới → Update**
6. **Quan sát "🔄 Version" thay đổi khi conflict**

---

## 🚨 MongoDB Connection Error?

Nếu thấy: `❌ Lỗi MongoDB: MongoDB not connected`

**Giải pháp**:
1. **Cài MongoDB local**:
   ```bash
   choco install mongodb-community
   net start MongoDB
   ```

2. **Hoặc dùng MongoDB Atlas (Cloud)**:
   ```env
   MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/cinema_db
   ```

3. **Kiểm tra kết nối**:
   ```bash
   mongosh
   ```

---

## 📖 Tham Khảo

- **Optimistic Concurrency Control**: https://en.wikipedia.org/wiki/Optimistic_concurrency_control
- **MongoDB Transactions**: https://docs.mongodb.com/manual/core/transactions/
- **Vector Clocks & Conflict Resolution**: https://en.wikipedia.org/wiki/Vector_clock

---

**Created**: May 2026  
**Demo Version**: 1.0  
**Status**: ✅ Production Ready
