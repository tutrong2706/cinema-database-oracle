import { getMongoDb } from '../config/mongoService.js';
import { handleSuccessResponse, handleErrorResponse } from '../helpers/responseHandler.js';

/**
 * ============================================================================
 * OPTIMISTIC CONCURRENCY CONTROL DEMO
 * 
 * Triết lý: Không khóa trước (No Lock), chỉ kiểm tra lúc ghi (Check on Write)
 * 
 * Cơ chế:
 * 1. Client READ dữ liệu + version number
 * 2. Client sửa dữ liệu
 * 3. Client gửi kèm version cũ
 * 4. Server kiểm tra: nếu version trong DB khác → Conflict!
 * 5. Nếu match → ghi dữ liệu, increment version
 * ============================================================================
 */

/**
 * GET /api/mongo/booking - Lấy booking data với version number
 * 
 * @param {*} req
 * @param {*} res
 */
export async function getBookingWithVersion(req, res) {
    try {
        const db = getMongoDb();
        const { bookingId } = req.query;

        if (!bookingId) {
            return res.status(400).json(handleErrorResponse(400, 'bookingId không được để trống'));
        }

        // Tìm booking trong MongoDB
        const bookingCollection = db.collection('bookings');
        const booking = await bookingCollection.findOne({ _id: bookingId });

        if (!booking) {
            return res.status(404).json(handleErrorResponse(404, 'Booking không tồn tại'));
        }

        // Trả về dữ liệu + version number (cho client lưu giữ)
        return res.status(200).json(handleSuccessResponse(200, 'OK', {
            bookingId: booking._id,
            tenPhim: booking.tenPhim,
            gheDaDat: booking.gheDaDat || [],
            tongtien: booking.tongtien,
            trangthai: booking.trangthai,
            __v: booking.__v || 0  // Version number - CLIENT PHẢI LƯU
        }));
    } catch (error) {
        console.error('getBookingWithVersion error:', error);
        return res.status(500).json(handleErrorResponse(500, error.message));
    }
}

/**
 * POST /api/mongo/booking/update - Cập nhật booking với Optimistic Lock
 * 
 * Gửi kèm: { bookingId, gheDaDat, tongtien, __v (version cũ) }
 * 
 * Logic:
 * - Kiểm tra version trong DB có khớp với __v không
 * - Nếu khác → người khác đã sửa → Conflict!
 * - Nếu khớp → UPDATE + increment version
 * 
 * @param {*} req
 * @param {*} res
 */
export async function updateBookingOptimistic(req, res) {
    try {
        const db = getMongoDb();
        const { bookingId, gheDaDat, tongtien, __v: oldVersion } = req.body;

        if (!bookingId || !oldVersion) {
            return res.status(400).json(handleErrorResponse(400, 'bookingId hoặc version bị thiếu'));
        }

        const bookingCollection = db.collection('bookings');

        // ✅ OPTIMISTIC CONCURRENCY: CHECK ON WRITE
        // Chỉ update nếu version trong DB khớp với version client gửi lên
        const result = await bookingCollection.findOneAndUpdate(
            {
                _id: bookingId,
                __v: oldVersion  // 🔑 Điều kiện: version phải khớp!
            },
            {
                $set: {
                    gheDaDat: gheDaDat,
                    tongtien: tongtien,
                    updatedAt: new Date()
                },
                $inc: { __v: 1 }  // Increment version
            },
            { returnDocument: 'after' }
        );

        // Nếu không tìm thấy document → version đã thay đổi
        if (!result.value) {
            // Lấy version hiện tại để gửi về client
            const currentBooking = await bookingCollection.findOne({ _id: bookingId });
            return res.status(409).json(handleErrorResponse(409, 
                'Conflict! Booking đã bị sửa bởi người khác. Vui lòng tải lại dữ liệu mới.',
                {
                    currentVersion: currentBooking?.__v || 0,
                    expectedVersion: oldVersion,
                    conflictReason: 'Version mismatch - Optimistic Lock failed'
                }
            ));
        }

        // ✅ Update thành công
        return res.status(200).json(handleSuccessResponse(200, 'Cập nhật thành công!', {
            bookingId: result.value._id,
            tenPhim: result.value.tenPhim,
            gheDaDat: result.value.gheDaDat,
            tongtien: result.value.tongtien,
            __v: result.value.__v  // Version mới
        }));
    } catch (error) {
        console.error('updateBookingOptimistic error:', error);
        return res.status(500).json(handleErrorResponse(500, error.message));
    }
}

/**
 * POST /api/mongo/booking/init - Tạo booking mới (dùng để demo)
 * 
 * @param {*} req
 * @param {*} res
 */
export async function initBooking(req, res) {
    try {
        const db = getMongoDb();
        const { bookingId, tenPhim, gheDaDat, tongtien } = req.body;

        if (!bookingId || !tenPhim) {
            return res.status(400).json(handleErrorResponse(400, 'bookingId hoặc tenPhim không được để trống'));
        }

        const bookingCollection = db.collection('bookings');

        // Xóa booking cũ (nếu tồn tại)
        await bookingCollection.deleteOne({ _id: bookingId });

        // Tạo booking mới với version = 0
        const newBooking = {
            _id: bookingId,
            tenPhim: tenPhim,
            gheDaDat: gheDaDat || [],
            tongtien: tongtien || 0,
            __v: 0,  // Version mới bắt đầu từ 0
            createdAt: new Date(),
            updatedAt: new Date()
        };

        await bookingCollection.insertOne(newBooking);

        return res.status(201).json(handleSuccessResponse(201, 'Tạo booking thành công!', {
            ...newBooking,
            message: '🎬 Demo Optimistic Concurrency: Dữ liệu được lưu trên MongoDB'
        }));
    } catch (error) {
        console.error('initBooking error:', error);
        return res.status(500).json(handleErrorResponse(500, error.message));
    }
}

/**
 * GET /api/mongo/booking/demo-info - Thông tin về Optimistic Concurrency
 * 
 * @param {*} req
 * @param {*} res
 */
export function getDemoInfo(req, res) {
    const demoInfo = {
        title: '🔒 Optimistic Concurrency Control - MongoDB Demo',
        description: 'Triết lý: Không khóa trước (No Lock), chỉ kiểm tra lúc ghi (Check on Write)',
        steps: [
            '1️⃣  Client gọi GET /api/mongo/booking → lấy dữ liệu + __v (version)',
            '2️⃣  Client sửa dữ liệu (ghế, giá tiền, ...)',
            '3️⃣  Client gọi POST /api/mongo/booking/update → gửi dữ liệu cũ + __v cũ',
            '4️⃣  Server kiểm tra: if (__v trong DB === __v client gửi)',
            '5️⃣  ✅ Nếu khớp → UPDATE + __v++ | ❌ Nếu khác → Conflict 409!'
        ],
        advantages: [
            '✅ Không cần khóa database (no lock overhead)',
            '✅ Hiệu suất cao, concurrent requests nhiều',
            '✅ Phù hợp với NoSQL (MongoDB, DynamoDB, ...)',
            '✅ Client không bị blocked'
        ],
        disadvantages: [
            '⚠️  Nếu conflict → client phải retry lại (tải dữ liệu mới)',
            '⚠️  Không phù hợp với writes liên tục & conflict cao'
        ],
        useCases: [
            '🎬 Booking vé phim (ít conflict)',
            '🛒 Shopping cart (ít conflict)',
            '📝 Collaborative editing (cao conflict → dùng CRDT tốt hơn)',
            '💰 Tài chính (không dùng! Dùng pessimistic lock)'
        ]
    };

    return res.status(200).json(handleSuccessResponse(200, 'OK', demoInfo));
}
