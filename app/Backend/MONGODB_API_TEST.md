# 🚀 MongoDB Transactions API - Test Guide

## 🔧 Setup

### 1. Install Dependencies
```bash
cd app/Backend
npm install
```

Điều này sẽ cài `mongodb@^6.3.0` driver

### 2. Start MongoDB Container
```bash
# From project root
docker compose up -d mongodb

# Wait 30 seconds for initialization
```

### 3. Start Backend Server
```bash
cd app/Backend
npm run dev

# Should see:
# ✓ Oracle database connection verified
# ✓ MongoDB connection verified (Transaction Demo available)
# ✓ Server running at http://localhost:3069
```

---

## ✅ API Endpoints

### 1. View Demo Data

#### Get All Users
```bash
GET http://localhost:3069/api/mongo/users

# Response:
{
  "code": 200,
  "message": "Users retrieved",
  "meta": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "email": "user1@cinema.com",
      "name": "Nguyễn Văn A",
      "wallet": 500000,
      "role": "user"
    },
    ...
  ]
}
```

#### Get All Movies
```bash
GET http://localhost:3069/api/mongo/movies
```

#### Get All Screenings
```bash
GET http://localhost:3069/api/mongo/screenings
```

---

### 2. Transaction Test - Book Ticket ⭐

#### Request
```bash
POST http://localhost:3069/api/mongo/book-ticket
Content-Type: application/json

{
  "userId": "507f1f77bcf86cd799439011",
  "screeningId": "707f1f77bcf86cd799439031",
  "seats": ["C1", "C2"]
}
```

#### Success Response (201 Created)
```json
{
  "code": 201,
  "message": "Booking successful with transaction",
  "meta": {
    "bookingId": "507f191e110c80b5d3c1a1b1",
    "status": "confirmed",
    "totalAmount": 300000,
    "seats": ["C1", "C2"],
    "transactionLog": [
      { "step": 1, "action": "wallet_deducted", "amount": 300000 },
      { "step": 2, "action": "seats_updated", "seats": ["C1", "C2"] },
      { "step": 3, "action": "booking_created", "bookingId": "507f191e110c80b5d3c1a1b1" }
    ]
  }
}
```

#### Error Response - Insufficient Wallet (400)
```json
{
  "code": 400,
  "message": "Booking failed: Insufficient wallet: 200000 < 750000",
  "meta": null
}
```

#### Error Response - Seats Already Booked (400)
```json
{
  "code": 400,
  "message": "Booking failed: Seats already booked: C1",
  "meta": null
}
```

---

### 3. Transaction Test - Refund Ticket

#### Request
```bash
POST http://localhost:3069/api/mongo/refund
Content-Type: application/json

{
  "bookingId": "507f191e110c80b5d3c1a1b1"
}
```

#### Success Response (200 OK)
```json
{
  "code": 200,
  "message": "Refund processed successfully",
  "meta": {
    "bookingId": "507f191e110c80b5d3c1a1b1",
    "status": "refunded",
    "transactionLog": [
      { "step": 1, "action": "wallet_returned", "amount": 300000 },
      { "step": 2, "action": "seats_released", "seats": ["C1", "C2"] },
      { "step": 3, "action": "booking_cancelled" }
    ]
  }
}
```

---

### 4. Query Booking Details

#### Get User Bookings
```bash
GET http://localhost:3069/api/mongo/bookings/507f1f77bcf86cd799439011
```

#### Get Booking Details + Transaction History
```bash
GET http://localhost:3069/api/mongo/bookings/507f191e110c80b5d3c1a1b1/details

# Response includes both booking data and all transaction logs
```

#### Get Transaction Audit Trail
```bash
GET http://localhost:3069/api/mongo/transaction-log/507f191e110c80b5d3c1a1b1
```

#### Get Screening Seat Availability
```bash
GET http://localhost:3069/api/mongo/screenings/707f1f77bcf86cd799439031/seats

# Response:
{
  "code": 200,
  "message": "Seat information retrieved",
  "meta": {
    "screeningId": "707f1f77bcf86cd799439031",
    "totalSeats": 100,
    "bookedSeats": ["A1", "A2", "B1", "C1", "C2"],
    "availableSeats": 95
  }
}
```

---

### 5. Health Check
```bash
GET http://localhost:3069/api/mongo/health

# Response:
{
  "code": 200,
  "message": "MongoDB connected",
  "meta": {
    "status": "connected",
    "timestamp": "2025-05-05T..."
  }
}
```

---

## 🧪 Test Scenarios

### Scenario 1: Successful Transaction
```bash
1. Get users: GET /api/mongo/users
   → Note userId: "507f1f77bcf86cd799439011" (wallet: 500,000)

2. Book tickets:
   POST /api/mongo/book-ticket
   { userId, screeningId, seats: ["C1", "C2"] }
   → Should return 201 CREATED

3. Verify changes:
   GET /api/mongo/users → Wallet should be 200,000
   GET /api/mongo/screenings/{id}/seats → C1, C2 should be booked
```

### Scenario 2: Insufficient Wallet (Auto Rollback)
```bash
1. Try to book 5 seats (cost: 750,000):
   POST /api/mongo/book-ticket
   { userId, screeningId, seats: ["D1", "D2", "D3", "D4", "D5"] }
   → Should return 400 ERROR

2. Verify NO changes occurred:
   GET /api/mongo/users → Wallet unchanged
   GET /api/mongo/screenings/{id}/seats → No new booked seats
```

### Scenario 3: Seats Already Booked (Auto Rollback)
```bash
1. Try to book seat A1 (already booked):
   POST /api/mongo/book-ticket
   { userId: "507f1f77bcf86cd799439012", screeningId, seats: ["A1", "F1"] }
   → Should return 400 ERROR

2. Verify NO changes:
   GET /api/mongo/users → Wallet unchanged
   Booking was NOT created
```

---

## 🧮 Demo Data Reference

### Users (from 02-sample-data.js)
| ObjectId | Email | Name | Wallet | Role |
|----------|-------|------|--------|------|
| 507f1f77bcf86cd799439011 | user1@cinema.com | Nguyễn Văn A | 500,000đ | user |
| 507f1f77bcf86cd799439012 | user2@cinema.com | Trần Thị B | 1,000,000đ | user |
| 507f1f77bcf86cd799439013 | admin@cinema.com | Admin Cinema | ∞ | admin |

### Movies
| ObjectId | Title | Price |
|----------|-------|-------|
| 607f1f77bcf86cd799439021 | Mắt Biếc | 150,000đ |
| 607f1f77bcf86cd799439022 | Avatar 3 | 200,000đ |
| 607f1f77bcf86cd799439023 | Conan | 100,000đ |

### Screenings
| ObjectId | Movie | Room | Booked Seats |
|----------|-------|------|--------------|
| 707f1f77bcf86cd799439031 | Mắt Biếc | Phòng 1 | [A1, A2, B1] |
| 707f1f77bcf86cd799439032 | Avatar 3 | Phòng 2 | (empty) |

---

## 🛠️ Using cURL

### Book Ticket
```bash
curl -X POST http://localhost:3069/api/mongo/book-ticket \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "507f1f77bcf86cd799439011",
    "screeningId": "707f1f77bcf86cd799439031",
    "seats": ["D1", "D2"]
  }'
```

### Refund
```bash
curl -X POST http://localhost:3069/api/mongo/refund \
  -H "Content-Type: application/json" \
  -d '{"bookingId": "your-booking-id-here"}'
```

### Get Users
```bash
curl http://localhost:3069/api/mongo/users
```

---

## 🔍 Using Postman

1. **Import Collection**: `mongodb/Postman_Collection.json`
2. **Set Variables**:
   - baseUrl: `http://localhost:3069`
   - apiVersion: `v1`
3. **Run Tests**: Execute pre-configured requests

---

## ⚠️ Common Issues

### MongoDB Connection Failed
```
Error: MongoDB not initialized
```
**Solution**: 
```bash
docker compose up -d mongodb
# Wait 30 seconds
npm run dev
```

### Replica Set Not Initialized
```
Error: transaction not allowed
```
**Solution**: Already fixed! The `rs.initiate()` command runs automatically in `01-init-collections.js`

### 404 Booking Not Found
```
Error: Booking not found
```
**Solution**: Use correct ObjectId from previous booking response

### Seats Conflict
```
Error: Seats already booked: C1, C2
```
**Solution**: Use different seat codes (D1, D2, E1, E2, etc.)

---

## 📊 What's Happening Inside

### Successful Transaction Flow
```
User sends request
    ↓
Backend receives /api/mongo/book-ticket
    ↓
Service creates MongoDB Session
    ↓
BEGIN TRANSACTION
    ├─ Check user wallet (enough?)
    ├─ Deduct wallet: wallet -= totalAmount
    ├─ Check seat conflicts (already booked?)
    ├─ Update seats: push to bookedSeats array
    ├─ Create booking document
    ├─ Log transaction as "committed"
    └─ COMMIT TRANSACTION
    ↓
Return 201 with transactionLog
```

### Failed Transaction Flow
```
During transaction...
    ├─ Check seats
    ├─ Error: "A1 already booked"
    └─ ABORT TRANSACTION
    ↓
Automatic ROLLBACK:
    ├─ Wallet: unchanged
    ├─ Seats: unchanged
    ├─ Booking: never created
    └─ Log: "rollback"
    ↓
Return 400 with error message
```

---

## ✅ Verification Checklist

- [ ] Backend starts without MongoDB connection error
- [ ] Can fetch users, movies, screenings
- [ ] Can successfully book tickets (wallet deducted, seats booked)
- [ ] Transaction rollback works (insufficient wallet)
- [ ] Transaction rollback works (seat conflict)
- [ ] Can refund bookings
- [ ] Wallet is returned on refund
- [ ] Seats are released on refund
- [ ] Transaction history shows all steps

---

## 📞 Next Steps

1. ✅ Test all endpoints locally
2. ✅ Verify transaction behavior
3. ✅ Check transaction logs
4. 🔄 Integrate into Frontend (if desired)
5. 🔄 Add more transaction scenarios

---

**Happy Testing! 🎬✨**
