# 🎯 MongoDB Demo - Quick Reference

## Cơ Chế Optimistic Concurrency Control

```
┌─────────────────────────────────────────────────────────────────┐
│                    OPTIMISTIC LOCK FLOW                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  CLIENT 1                  DATABASE              CLIENT 2       │
│  ─────────────────         ────────             ─────────────  │
│                                                                 │
│  1. GET /booking       ──→  (no lock)                          │
│     version: 0         ←──                                     │
│                                                                 │
│                                         2. GET /booking   ──→  │
│                                            version: 0   ←──   │
│                                                                 │
│  3. Modify locally                                             │
│     seats: [A1,A2]                                             │
│     v_held: 0                                                  │
│                                                                 │
│                                         4. Modify locally       │
│                                            seats: [B1,B2]      │
│                                            v_held: 0          │
│                                                                 │
│  5. POST /update       ──→  if(v_db == 0)                      │
│     {v_held: 0}              UPDATE ✓                          │
│                              v_db = 1   ←── ✅ SUCCESS         │
│                                                                 │
│                                         6. POST /update   ──→  │
│                                            {v_held: 0}         │
│                                                    if(v_db==0)? │
│                                                    NO! v_db=1   │
│                                                    CONFLICT! ←──│
│                                                    ❌ 409 Error  │
│                                                                 │
│  7. Done! version 0→1                                          │
│                                         8. GET /booking   ──→  │
│                                            (refresh)           │
│                                            version: 1   ←──   │
│                                                                 │
│                                         9. Retry POST /update  │
│                                            {v_held: 1}         │
│                                                    if(v_db==1)? │
│                                                    YES! UPDATE✓ │
│                                                    ←── ✅ SUCCESS│
│                                                     v_db = 2    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🌐 Web UI Components

### MongoDBDemoPage Layout

```
┌──────────────────────────────────────────────────────────────────┐
│  🍃 MongoDB Demo - Optimistic Concurrency Control                │
│  Không khóa, chỉ kiểm tra lúc ghi                               │
└──────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────┬──────────────────────┐
│                                         │                      │
│  LEFT SIDE:                             │  RIGHT SIDE:         │
│  ──────────                             │  ────────────        │
│                                         │                      │
│  📋 Booking Info                        │  📚 Cơ Chế           │
│  ├─ Booking ID: demo_XXX               │  ├─ Bước 1: GET     │
│  ├─ Phim: Avatar                       │  ├─ Bước 2: MODIFY  │
│  ├─ 🔄 Version: 0                      │  ├─ Bước 3: POST    │
│  ├─ Ghế: A1, A2                        │  ├─ Ưu điểm...      │
│  └─ Giá: 400,000 VNĐ                   │  └─ Nhược điểm...   │
│                                         │                      │
│  ✏️ Chỉnh Sửa Booking                   │  📝 Lịch Sử         │
│  ├─ Ghế: [input]                       │  ├─ 17:45:23 ✅     │
│  └─ Giá: [input]                       │  ├─ 17:45:24 ❌     │
│                                         │  ├─ 17:45:25 📖     │
│  [📖 Lấy] [✅ Update] [🔄 Reset]        │  └─ 17:45:26 ✏️     │
│                                         │                      │
│  ⚠️ Message Alert (green/red/blue)      │  🧪 Cách Test       │
│  💾 Version Warning (purple)            │  └─ Mở 2 tab...    │
│                                         │                      │
└─────────────────────────────────────────┴──────────────────────┘
```

---

## 🔄 State Management Flow

```
┌─────────────────────────────────────────────────────────────────┐
│ React State (MongoDBDemoPage.jsx)                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ booking         ──→  {tenPhim, gheDaDat, tongtien, __v}       │
│ currentVersion  ──→  Lưu version cũ đang cầm (để check)       │
│ newSeats        ──→  Input ghế (để modify)                     │
│ newPrice        ──→  Input giá (để modify)                     │
│ message         ──→  Alert message (success/error/info)        │
│ messageType     ──→  'success' | 'error' | 'info'              │
│ history         ──→  Array của events                          │
│ loading         ──→  Boolean (disable buttons khi pending)     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

Actions:
├─ handleGetBooking()      ──→ GET + setState
├─ handleUpdateBooking()   ──→ POST + setState
├─ handleReset()           ──→ Clear all states
└─ addHistory(event)       ──→ Push to history array
```

---

## 📡 API Flow

```
Frontend (React)              Backend (Express)         Database (MongoDB)
─────────────────────         ────────────────────      ──────────────────

1. User clicks "📖 Lấy"
   │
   ├─→ GET /api/mongo/booking
                    │
                    ├─→ mongoDemoController.getBookingWithVersion()
                              │
                              ├─→ getMongoDb()
                                    │
                                    ├─→ bookingCollection.findOne({_id})
                                              │
                                              ├─→ {_id, tenPhim, gheDaDat, __v}
                                              ←─
                                    ←─
                              ←─
                    ← handleSuccessResponse(200, "OK", booking)
   ←─
   setState(booking, currentVersion)
   UI: "✅ Version: 0"

2. User modifies input + clicks "✅ Update"
   │
   ├─→ POST /api/mongo/booking/update
       {bookingId, gheDaDat, tongtien, __v: 0}
                    │
                    ├─→ mongoDemoController.updateBookingOptimistic()
                              │
                              ├─→ findOneAndUpdate(
                                   {_id, __v: 0},  ← 🔑 KEY!
                                   {$set: {...}, $inc: {__v: 1}}
                                  )
                                    │
                       ┌───────────┴──────────┐
                       │                      │
                   Found ✓              Not Found ✗
                       │                      │
                   UPDATE +1         → CONFLICT!
                   return doc            return null
                       │                      │
                    ←─                     ←─
                              ←─
                    ← handleSuccessResponse(200, "Success", booking)
                                            OR
                                   handleErrorResponse(409, "Conflict", {})
   ←─
   setState(booking)  OR  setMessage("CONFLICT!")
   UI: "✅ v0 → v1"  OR  "⚠️ CONFLICT!"

3. User clicks "📖 Lấy" again (if conflict)
   │
   └─→ Repeat Step 1 with new version=1
       setState(booking with v=1)
       newSeats = updated seats from Step 1
       retry logic manually
```

---

## 🎓 Comparison: MongoDB vs Oracle

### MongoDB (OCC)
```javascript
// Connection
MongoClient → mongodb://localhost:27017

// Read (No Lock)
const doc = await collection.findOne({ _id: id });
const version = doc.__v;  // ← Version number

// Modify
doc.data = newData;

// Write (Check Version)
const result = await collection.findOneAndUpdate(
  { _id: id, __v: version },  // ← OPTIMISTIC LOCK
  { $set: {...}, $inc: { __v: 1 } }
);

if (!result.value) {
  // CONFLICT → retry needed
}
```

### Oracle (Pessimistic Lock)
```sql
-- Connection
sqlplus dev/dev123@//localhost:1521/XEPDB1

-- Read (+ Lock)
SELECT * FROM BOOKING 
WHERE ID = '123' 
FOR UPDATE;  -- ← LOCK! Other sessions wait

-- Modify
-- (safe to modify while locked)

-- Write
UPDATE BOOKING SET DATA = '...' WHERE ID = '123';
COMMIT;  -- ← Release lock
```

---

## ✅ Demo Ready Checklist

- [ ] MongoDB chạy (port 27017)
- [ ] Backend chạy (port 3069)
- [ ] Frontend chạy (port 5173)
- [ ] Truy cập http://localhost:5173/mongo-demo
- [ ] Click "📖 Lấy Booking" → version = 0
- [ ] Mở Tab 2, repeat step 3
- [ ] Tab 1: Modify → Update → ✅ Success
- [ ] Tab 2: Modify → Update → ❌ Conflict!
- [ ] Tab 2: Click "📖 Lấy Booking" → version = 1
- [ ] Tab 2: Update lại → ✅ Success!

---

## 📚 File Structure

```
app/Backend/
├── src/
│   ├── config/
│   │   └── mongoService.js          ← MongoDB Connection
│   ├── controllers/
│   │   └── mongoDemoController.js   ← OCC Logic
│   └── routes/
│       └── mongoRoutes.js           ← /api/mongo endpoints
│
app/Frontend/
├── src/
│   └── pages/
│       └── MongoDBDemoPage.jsx      ← UI Demo
│
docs/
└── MONGODB_DEMO_GUIDE.md             ← Full Documentation
```

---

**Last Updated**: May 5, 2026  
**Demo Status**: ✅ Ready for Testing
