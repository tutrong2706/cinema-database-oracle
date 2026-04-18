import { query, execute } from '../config/database.js';

/**
 * Lấy danh sách đánh giá phim
 */
export async function getMovieReviews(maPhim) {
    const sql = `
        SELECT DG.MaDanhGia, DG.MaNguoiDung, DG.MaPhim, DG.NoiDung, DG.NgayDang, DG.DiemSo,
               TK.HoTen, TK.Email
        FROM DANH_GIA DG
        JOIN KHACH_HANG KH ON DG.MaNguoiDung = KH.MaNguoiDung
        JOIN TAI_KHOAN TK ON KH.MaNguoiDung = TK.MaNguoiDung
        WHERE DG.MaPhim = :1
        ORDER BY DG.NgayDang DESC
    `;
    return await query(sql, [maPhim]);
}

/**
 * Lấy đánh giá theo ID
 */
export async function getReviewById(maDanhGia) {
    const sql = `
        SELECT DG.*, TK.HoTen
        FROM DANH_GIA DG
        JOIN KHACH_HANG KH ON DG.MaNguoiDung = KH.MaNguoiDung
        JOIN TAI_KHOAN TK ON KH.MaNguoiDung = TK.MaNguoiDung
        WHERE DG.MaDanhGia = :1
    `;
    const results = await query(sql, [maDanhGia]);
    return results.length > 0 ? results[0] : null;
}

/**
 * Lấy đánh giá của khách hàng
 */
export async function getCustomerReviews(maNguoiDung) {
    const sql = `
        SELECT DG.MaDanhGia, DG.MaPhim, DG.NoiDung, DG.NgayDang, DG.DiemSo,
               P.TenPhim
        FROM DANH_GIA DG
        JOIN PHIM P ON DG.MaPhim = P.MaPhim
        WHERE DG.MaNguoiDung = :1
        ORDER BY DG.NgayDang DESC
    `;
    return await query(sql, [maNguoiDung]);
}

/**
 * Tạo đánh giá mới
 */
export async function createReview(reviewData) {
    const { MaDanhGia, MaNguoiDung, MaPhim, NoiDung, DiemSo } = reviewData;

    const sql = `
        INSERT INTO DANH_GIA (MaDanhGia, MaNguoiDung, MaPhim, NoiDung, DiemSo)
        VALUES (:1, :2, :3, :4, :5)
    `;

    return await execute(sql, [MaDanhGia, MaNguoiDung, MaPhim, NoiDung, DiemSo]);
}

/**
 * Cập nhật đánh giá
 */
export async function updateReview(maDanhGia, reviewData) {
    const { NoiDung, DiemSo } = reviewData;

    const sql = `
        UPDATE DANH_GIA
        SET NoiDung = :1, DiemSo = :2
        WHERE MaDanhGia = :3
    `;

    return await execute(sql, [NoiDung, DiemSo, maDanhGia]);
}

/**
 * Xóa đánh giá
 */
export async function deleteReview(maDanhGia) {
    const sql = `DELETE FROM DANH_GIA WHERE MaDanhGia = :1`;
    return await execute(sql, [maDanhGia]);
}

/**
 * Lấy điểm trung bình phim
 */
export async function getMovieAverageRating(maPhim) {
    const sql = `
        SELECT ROUND(AVG(DiemSo), 1) AS DIEMTRUNGBINH,
               COUNT(*) AS SOLUOTDANHGIA,
               MIN(DiemSo) AS DIEMTHAPNHAT,
               MAX(DiemSo) AS DIEMCAONHAT
        FROM DANH_GIA
        WHERE MaPhim = :1
    `;
    const results = await query(sql, [maPhim]);
    return results.length > 0 ? results[0] : { DIEMTRUNGBINH: 0, SOLUOTDANHGIA: 0 };
}

/**
 * Lấy phân bố điểm đánh giá
 */
export async function getRatingDistribution(maPhim) {
    const sql = `
        SELECT DiemSo, COUNT(*) AS SOLUONG
        FROM DANH_GIA
        WHERE MaPhim = :1
        GROUP BY DiemSo
        ORDER BY DiemSo
    `;
    return await query(sql, [maPhim]);
}

/**
 * Kiểm tra đã đánh giá chưa
 */
export async function hasReviewed(maNguoiDung, maPhim) {
    const sql = `
        SELECT COUNT(*) AS CNT
        FROM DANH_GIA
        WHERE MaNguoiDung = :1 AND MaPhim = :2
    `;
    const results = await query(sql, [maNguoiDung, maPhim]);
    return results[0]?.CNT > 0;
}
