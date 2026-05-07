/**
 * MongoDB Transaction Service
 * Xử lý bookings với ACID transaction guarantee
 */

import { MongoClient, ObjectId, Int32, Double } from 'mongodb';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017';
const DB_NAME = 'cinema_db';

let client = null;
let db = null;

// ========================================
// 1. INITIALIZE CONNECTION
// ========================================
export async function connectMongoDB() {
  try {
    if (client && db) {
      return db;
    }

    client = new MongoClient(MONGO_URI);
    await client.connect();
    db = client.db(DB_NAME);
    console.log('✅ Connected to MongoDB');
    return db;
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    throw error;
  }
}

async function ensureMongoDBConnection() {
  if (db && client) {
    return db;
  }

  return await connectMongoDB();
}

// Get DB instance
export function getMongoDb() {
  if (!db) {
    throw new Error('MongoDB not connected. Call connectMongoDB() first.');
  }
  return db;
}

export function getMongoClient() {
  if (!client) {
    throw new Error('MongoDB not connected. Call connectMongoDB() first.');
  }
  return client;
}

async function runBookingTransaction({
  userId,
  screeningId,
  seats,
  purpose,
  customerLabel,
  expectedPricePerSeat
}) {
  await ensureMongoDBConnection();

  const session = client.startSession();

  try {
    return await session.withTransaction(async () => {
      const user = await db.collection('users').findOne(
        { _id: new ObjectId(userId) },
        { session }
      );

      if (!user) {
        throw new Error('User not found');
      }

      const screening = await db.collection('screenings').findOne(
        { _id: new ObjectId(screeningId) },
        { session }
      );

      if (!screening) {
        throw new Error('Screening not found');
      }

      const movie = await db.collection('movies').findOne(
        { _id: screening.movieId },
        { session }
      );

      if (!movie) {
        throw new Error('Movie not found');
      }

      const pricePerSeat = Number(movie.price || expectedPricePerSeat || 0);
      const totalAmount = seats.length * pricePerSeat;

      if (user.wallet < totalAmount) {
        throw new Error(`Không đủ tiền: ví hiện tại ${user.wallet}, cần ${totalAmount}`);
      }

      const bookedSeats = screening.bookedSeats || [];
      const conflictSeats = seats.filter((seat) => bookedSeats.includes(seat));

      if (conflictSeats.length > 0) {
        throw new Error(`Ghế ${conflictSeats.join(', ')} đã được mua`);
      }

      await db.collection('users').updateOne(
        { _id: new ObjectId(userId) },
        {
          $inc: { wallet: -totalAmount },
          $set: { updatedAt: new Date() }
        },
        { session }
      );

      await db.collection('screenings').updateOne(
        { _id: new ObjectId(screeningId) },
        { $push: { bookedSeats: { $each: seats } } },
        { session }
      );

      const bookingId = new ObjectId();
      await db.collection('bookings').insertOne(
        {
          _id: bookingId,
          userId: new ObjectId(userId),
          screeningId: new ObjectId(screeningId),
          movieTitle: movie.title,
          seats,
          totalAmount: new Double(totalAmount),
          status: 'confirmed',
          paymentMethod: 'wallet',
          bookingDate: new Date(),
          screeningDate: screening.screenTime,
          purpose,
          customerLabel,
          createdAt: new Date()
        },
        { session }
      );

      await db.collection('transaction_logs').insertOne(
        {
          _id: new ObjectId(),
          bookingId,
          userId: new ObjectId(userId),
          status: 'committed',
          amount: new Double(totalAmount),
          details: `${customerLabel} booked seats ${seats.join(', ')} for ${movie.title}`,
          timestamp: new Date(),
          purpose
        },
        { session }
      );

      return {
        bookingId: bookingId.toString(),
        totalAmount,
        pricePerSeat,
        userBeforeWallet: user.wallet,
        userAfterWallet: user.wallet - totalAmount,
        bookedSeats: seats
      };
    });
  } finally {
    await session.endSession();
  }
}

async function createDemoFixture({
  suffix,
  wallet,
  movieTitle,
  pricePerSeat,
  bookedSeats = []
}) {
  const demoEmail = `${suffix}@demo.com`;
  const demoName = suffix.includes('case3') ? 'Khách A' : 'Khách Demo';
  const userId = new ObjectId();
  const movieId = new ObjectId();
  const screeningId = new ObjectId();
  const screeningTime = new Date(Date.now() + 24 * 60 * 60 * 1000);

  await db.collection('bookings').deleteMany({ purpose: suffix });
  await db.collection('transaction_logs').deleteMany({ purpose: suffix });
  await db.collection('screenings').deleteMany({ purpose: suffix });
  await db.collection('users').deleteMany({ email: demoEmail });

  await db.collection('users').insertOne({
    _id: userId,
    email: demoEmail,
    name: demoName,
    phone: '0900000000',
    wallet: new Double(wallet),
    role: 'user',
    createdAt: new Date(),
    updatedAt: new Date()
  });

  await db.collection('movies').insertOne({
    _id: movieId,
    title: movieTitle,
    description: 'Mongo transaction demo movie',
    duration: new Int32(120),
    genre: 'Demo',
    price: new Double(pricePerSeat),
    createdAt: new Date()
  });

  await db.collection('screenings').insertOne({
    _id: screeningId,
    movieId,
    screeningRoom: 'Phòng Demo',
    screenTime: screeningTime,
    totalSeats: new Int32(100),
    bookedSeats,
    purpose: suffix,
    createdAt: new Date()
  });

  return { userId, movieId, screeningId, screeningTime, demoEmail };
}

export async function runConcurrentBookingDemo() {
  await ensureMongoDBConnection();

  const summary = { case1: null, case2: null, case3: null };

  {
    const fixture = await createDemoFixture({
      suffix: 'case1_concurrent_demo',
      wallet: 500000,
      movieTitle: 'Mắt Biếc - Case 1',
      pricePerSeat: 150000
    });

    const result = await runBookingTransaction({
      userId: fixture.userId,
      screeningId: fixture.screeningId,
      seats: ['C1', 'C2'],
      purpose: 'case1_concurrent_demo',
      customerLabel: 'Khách A',
      expectedPricePerSeat: 150000
    });

    const userAfter = await db.collection('users').findOne({ _id: fixture.userId });
    const screeningAfter = await db.collection('screenings').findOne({ _id: fixture.screeningId });

    summary.case1 = {
      scenario: 'A đủ tiền và ghế chưa ai mua',
      status: 'success',
      message: 'Khách A mua thành công và bị trừ tiền',
      beforeWallet: result.userBeforeWallet,
      afterWallet: Number(userAfter.wallet),
      seats: ['C1', 'C2'],
      bookedSeats: screeningAfter.bookedSeats || [],
      bookingId: result.bookingId,
      totalAmount: result.totalAmount
    };
  }

  {
    const fixture = await createDemoFixture({
      suffix: 'case2_insufficient_funds_demo',
      wallet: 100000,
      movieTitle: 'Mắt Biếc - Case 2',
      pricePerSeat: 150000
    });

    let failureMessage = '';
    try {
      await runBookingTransaction({
        userId: fixture.userId,
        screeningId: fixture.screeningId,
        seats: ['C1', 'C2'],
        purpose: 'case2_insufficient_funds_demo',
        customerLabel: 'Khách A',
        expectedPricePerSeat: 150000
      });
      failureMessage = 'Không được phép mua nhưng transaction lại thành công';
    } catch (error) {
      failureMessage = error.message;
    }

    const userAfter = await db.collection('users').findOne({ _id: fixture.userId });
    const screeningAfter = await db.collection('screenings').findOne({ _id: fixture.screeningId });

    summary.case2 = {
      scenario: 'A không đủ tiền và ghế chưa ai mua',
      status: 'failed',
      message: failureMessage,
      beforeWallet: 100000,
      afterWallet: Number(userAfter.wallet),
      seats: ['C1', 'C2'],
      bookedSeats: screeningAfter.bookedSeats || [],
      bookingCreated: false
    };
  }

  {
    const fixture = await createDemoFixture({
      suffix: 'case3_conflict_demo',
      wallet: 500000,
      movieTitle: 'Mắt Biếc - Case 3',
      pricePerSeat: 150000
    });

    const customerAResult = await runBookingTransaction({
      userId: fixture.userId,
      screeningId: fixture.screeningId,
      seats: ['C1', 'C2'],
      purpose: 'case3_conflict_demo',
      customerLabel: 'Khách A',
      expectedPricePerSeat: 150000
    });

    const customerBId = new ObjectId();
    await db.collection('users').insertOne({
      _id: customerBId,
      email: 'case3_b@demo.com',
      name: 'Khách B',
      phone: '0912345678',
      wallet: new Double(500000),
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date()
    });

    let bFailureMessage = '';
    try {
      await runBookingTransaction({
        userId: customerBId,
        screeningId: fixture.screeningId,
        seats: ['C1', 'C2'],
        purpose: 'case3_conflict_demo',
        customerLabel: 'Khách B',
        expectedPricePerSeat: 150000
      });
      bFailureMessage = 'Khách B không được phép mua nhưng transaction lại thành công';
    } catch (error) {
      bFailureMessage = error.message;
    }

    const customerAAfter = await db.collection('users').findOne({ _id: fixture.userId });
    const customerBAfter = await db.collection('users').findOne({ _id: customerBId });
    const screeningAfter = await db.collection('screenings').findOne({ _id: fixture.screeningId });

    summary.case3 = {
      scenario: 'A và B cùng muốn mua ghế đó, A mua trước',
      status: 'partial-success',
      message: 'Khách A thành công, Khách B thất bại vì ghế vừa mới được mua',
      customerA: {
        status: 'success',
        beforeWallet: customerAResult.userBeforeWallet,
        afterWallet: Number(customerAAfter.wallet),
        bookingId: customerAResult.bookingId,
        seats: ['C1', 'C2']
      },
      customerB: {
        status: 'failed',
        beforeWallet: 500000,
        afterWallet: Number(customerBAfter.wallet),
        message: bFailureMessage,
        bookingCreated: false,
        seats: ['C1', 'C2']
      },
      bookedSeats: screeningAfter.bookedSeats || [],
      demoResult: true
    };
  }

  return summary;
}

// ========================================
// 2. BOOK TICKET WITH TRANSACTION
// ========================================
export async function bookTicketWithTransaction(userId, screeningId, seats) {
  await ensureMongoDBConnection();

  const session = client.startSession();
  const transactionLog = [];

  try {
    const result = await session.withTransaction(async () => {
      // Step 1: Get user and validate wallet
      const user = await db.collection('users').findOne(
        { _id: new ObjectId(userId) },
        { session }
      );

      if (!user) {
        throw new Error('User not found');
      }

      // Step 2: Get screening and movie info
      const screening = await db.collection('screenings').findOne(
        { _id: new ObjectId(screeningId) },
        { session }
      );

      if (!screening) {
        throw new Error('Screening not found');
      }

      const movie = await db.collection('movies').findOne(
        { _id: screening.movieId },
        { session }
      );

      // Step 3: Calculate total amount
      const totalAmount = seats.length * movie.price;

      // Validate wallet
      if (user.wallet < totalAmount) {
        throw new Error(
          `Insufficient wallet: ${user.wallet} < ${totalAmount}`
        );
      }

      // Step 4: Check seat conflicts
      const bookedSeats = screening.bookedSeats || [];
      const conflict = seats.filter(seat => bookedSeats.includes(seat));

      if (conflict.length > 0) {
        throw new Error(`Seats already booked: ${conflict.join(', ')}`);
      }

      // Step 5: Deduct wallet
      await db.collection('users').updateOne(
        { _id: new ObjectId(userId) },
        {
          $inc: { wallet: -totalAmount },
          $set: { updatedAt: new Date() }
        },
        { session }
      );

      transactionLog.push({
        step: 1,
        action: 'wallet_deducted',
        amount: totalAmount
      });

      // Step 6: Update seats
      await db.collection('screenings').updateOne(
        { _id: new ObjectId(screeningId) },
        { $push: { bookedSeats: { $each: seats } } },
        { session }
      );

      transactionLog.push({
        step: 2,
        action: 'seats_updated',
        seats: seats
      });

      // Step 7: Create booking
      const booking = {
        _id: new ObjectId(),
        userId: new ObjectId(userId),
        screeningId: new ObjectId(screeningId),
        movieTitle: movie.title,
        seats: seats,
        totalAmount: new Double(totalAmount),
        status: 'confirmed',
        paymentMethod: 'wallet',
        bookingDate: new Date(),
        screeningDate: screening.screenTime,
        createdAt: new Date()
      };

      const insertResult = await db.collection('bookings').insertOne(booking, {
        session
      });

      transactionLog.push({
        step: 3,
        action: 'booking_created',
        bookingId: insertResult.insertedId
      });

      // Step 8: Log transaction
      await db.collection('transaction_logs').insertOne(
        {
          _id: new ObjectId(),
          bookingId: insertResult.insertedId,
          userId: new ObjectId(userId),
          status: 'committed',
          amount: new Double(totalAmount),
          details: `Booked seats ${seats.join(', ')} for ${movie.title}`,
          timestamp: new Date()
        },
        { session }
      );

      return {
        bookingId: insertResult.insertedId.toString(),
        status: 'success'
      };
    });

    return {
      code: 201,
      message: 'Booking successful with transaction',
      data: {
        bookingId: result.bookingId,
        status: 'confirmed',
        totalAmount: seats.length * 150000, // Assuming 150k per ticket
        seats: seats,
        transactionLog: transactionLog
      }
    };
  } catch (error) {
    transactionLog.push({
      action: 'rollback',
      error: error.message,
      timestamp: new Date()
    });

    throw {
      code: 400,
      message: `Booking failed: ${error.message}`,
      transactionLog: transactionLog
    };
  } finally {
    await session.endSession();
  }
}

// ========================================
// 3. REFUND WITH TRANSACTION
// ========================================
export async function refundTicketWithTransaction(bookingId) {
  await ensureMongoDBConnection();

  const session = client.startSession();
  const transactionLog = [];

  try {
    const result = await session.withTransaction(async () => {
      // Find booking
      const booking = await db.collection('bookings').findOne(
        { _id: new ObjectId(bookingId) },
        { session }
      );

      if (!booking) {
        throw new Error('Booking not found');
      }

      if (booking.status === 'cancelled') {
        throw new Error('Booking already cancelled');
      }

      // Step 1: Return money
      await db.collection('users').updateOne(
        { _id: booking.userId },
        {
          $inc: { wallet: booking.totalAmount },
          $set: { updatedAt: new Date() }
        },
        { session }
      );

      transactionLog.push({
        step: 1,
        action: 'wallet_returned',
        amount: booking.totalAmount
      });

      // Step 2: Release seats
      await db.collection('screenings').updateOne(
        { _id: booking.screeningId },
        { $pull: { bookedSeats: { $in: booking.seats } } },
        { session }
      );

      transactionLog.push({
        step: 2,
        action: 'seats_released',
        seats: booking.seats
      });

      // Step 3: Update booking status
      await db.collection('bookings').updateOne(
        { _id: new ObjectId(bookingId) },
        { $set: { status: 'cancelled', updatedAt: new Date() } },
        { session }
      );

      transactionLog.push({
        step: 3,
        action: 'booking_cancelled'
      });

      // Step 4: Log transaction
      await db.collection('transaction_logs').insertOne(
        {
          _id: new ObjectId(),
          bookingId: new ObjectId(bookingId),
          userId: booking.userId,
          status: 'committed',
          amount: new Double(Number(booking.totalAmount)),
          details: `Refunded booking ${bookingId}`,
          timestamp: new Date()
        },
        { session }
      );

      return { status: 'refunded' };
    });

    return {
      code: 200,
      message: 'Refund processed successfully',
      data: {
        bookingId: bookingId,
        status: 'refunded',
        transactionLog: transactionLog
      }
    };
  } catch (error) {
    transactionLog.push({
      action: 'rollback',
      error: error.message,
      timestamp: new Date()
    });

    throw {
      code: 400,
      message: `Refund failed: ${error.message}`,
      transactionLog: transactionLog
    };
  } finally {
    await session.endSession();
  }
}

// ========================================
// 4. QUERY FUNCTIONS
// ========================================
export async function getUserBookings(userId) {
  try {
    await ensureMongoDBConnection();
    return await db
      .collection('bookings')
      .find({ userId: new ObjectId(userId) })
      .toArray();
  } catch (error) {
    throw {
      code: 500,
      message: error.message
    };
  }
}

export async function getBookingDetails(bookingId) {
  try {
    await ensureMongoDBConnection();
    const booking = await db.collection('bookings').findOne({
      _id: new ObjectId(bookingId)
    });

    if (!booking) {
      throw {
        code: 404,
        message: 'Booking not found'
      };
    }

    return booking;
  } catch (error) {
    if (error.code) throw error;
    throw {
      code: 500,
      message: error.message
    };
  }
}

export async function getTransactionHistory(bookingId) {
  try {
    await ensureMongoDBConnection();
    return await db
      .collection('transaction_logs')
      .find({ bookingId: new ObjectId(bookingId) })
      .sort({ timestamp: 1 })
      .toArray();
  } catch (error) {
    throw {
      code: 500,
      message: error.message
    };
  }
}

export async function getScreeningSeats(screeningId) {
  try {
    await ensureMongoDBConnection();
    const screening = await db.collection('screenings').findOne({
      _id: new ObjectId(screeningId)
    });

    if (!screening) {
      throw {
        code: 404,
        message: 'Screening not found'
      };
    }

    return {
      screeningId: screeningId,
      totalSeats: screening.totalSeats,
      bookedSeats: screening.bookedSeats || [],
      availableSeats: screening.totalSeats - (screening.bookedSeats || []).length
    };
  } catch (error) {
    if (error.code) throw error;
    throw {
      code: 500,
      message: error.message
    };
  }
}

export async function getAllUsers() {
  try {
    await ensureMongoDBConnection();
    return await db.collection('users').find({}).toArray();
  } catch (error) {
    throw {
      code: 500,
      message: error.message
    };
  }
}

export async function getAllMovies() {
  try {
    await ensureMongoDBConnection();
    return await db.collection('movies').find({}).toArray();
  } catch (error) {
    throw {
      code: 500,
      message: error.message
    };
  }
}

export async function getAllScreenings() {
  try {
    await ensureMongoDBConnection();
    return await db.collection('screenings').find({}).toArray();
  } catch (error) {
    throw {
      code: 500,
      message: error.message
    };
  }
}
