import { query, execute } from '../config/database.js';

/**
 * Lấy danh sách suất chiếu
 */
export async function getAllScreenings() {
    const sql = `
        SELECT SC.MaSuatChieu AS MASUATCHIEU, SC.MaPhim AS MAPHIM, SC.MaPhong AS MAPHONG, 
               SC.GiaVeCoBan AS GIAVECOBAN, SC.GioBatDau AS GIOBATDAU,
               SC.GioKetThuc AS GIOKETTHUC, SC.NgayChieu AS NGAYCHIEU, 
               SC.TrangThai AS TRANGTHAI, P.TenPhim AS TENPHIM, 
               PC.Ten AS TENPHONG, RC.Ten AS TENRAP
        FROM SUAT_CHIEU SC
        JOIN PHIM P ON SC.MaPhim = P.MaPhim
        JOIN PHONG_CHIEU PC ON SC.MaPhong = PC.MaPhong
        JOIN RAP_CHIEU_PHIM RC ON PC.MaRapPhim = RC.MaRapPhim
        ORDER BY SC.NgayChieu DESC, SC.GioBatDau
    `;
    return await query(sql);
}

/**
 * Lấy suất chiếu theo bộ lọc (phim, rạp, ngày)
 */
export async function getScreeningsByFilter(maPhim, maRap, ngayChieu) {
    let sql = `
        SELECT SC.MaSuatChieu AS MASUATCHIEU, SC.MaPhim AS MAPHIM, SC.MaPhong AS MAPHONG, 
               SC.GiaVeCoBan AS GIAVECOBAN, SC.GioBatDau AS GIOBATDAU,
               SC.GioKetThuc AS GIOKETTHUC, SC.NgayChieu AS NGAYCHIEU, 
               SC.TrangThai AS TRANGTHAI, P.TenPhim AS TENPHIM, 
               PC.Ten AS TENPHONG, RC.Ten AS TENRAP
        FROM SUAT_CHIEU SC
        JOIN PHIM P ON SC.MaPhim = P.MaPhim
        JOIN PHONG_CHIEU PC ON SC.MaPhong = PC.MaPhong
        JOIN RAP_CHIEU_PHIM RC ON PC.MaRapPhim = RC.MaRapPhim
        WHERE 1=1
    `;

    const params = [];

    if (maPhim) {
        sql += ` AND SC.MaPhim = :${params.length + 1}`;
        params.push(maPhim);
    }

    if (maRap) {
        sql += ` AND PC.MaRapPhim = :${params.length + 1}`;
        params.push(maRap);
    }

    if (ngayChieu) {
        sql += ` AND TRUNC(SC.NgayChieu) = TO_DATE(:${params.length + 1}, 'YYYY-MM-DD')`;
        params.push(ngayChieu);
    }

    sql += ` ORDER BY SC.GioBatDau`;

    return await query(sql, params);
}

/**
 * Lấy suất chiếu theo ID
 */
export async function getScreeningById(maSuatChieu) {
    const sql = `
        SELECT SC.MaSuatChieu AS MASUATCHIEU, SC.MaPhim AS MAPHIM, SC.MaPhong AS MAPHONG, 
               SC.GiaVeCoBan AS GIAVECOBAN, SC.GioBatDau AS GIOBATDAU,
               SC.GioKetThuc AS GIOKETTHUC, SC.NgayChieu AS NGAYCHIEU, 
               SC.TrangThai AS TRANGTHAI, P.TenPhim AS TENPHIM, 
               PC.Ten AS TENPHONG, RC.Ten AS TENRAP
        FROM SUAT_CHIEU SC
        JOIN PHIM P ON SC.MaPhim = P.MaPhim
        JOIN PHONG_CHIEU PC ON SC.MaPhong = PC.MaPhong
        JOIN RAP_CHIEU_PHIM RC ON PC.MaRapPhim = RC.MaRapPhim
        WHERE SC.MaSuatChieu = :1
    `;
    const results = await query(sql, [maSuatChieu]);
    return results.length > 0 ? results[0] : null;
}

/**
 * Tạo suất chiếu
 */
export async function createScreening(screeningData) {
    const {
        MaSuatChieu, MaPhim, MaRapPhim, GiaVeCoBan, ThoiGianBatDau,
        ThoiGianKetThuc, NgayChieu, TrangThai
    } = screeningData;

    const sql = `
        INSERT INTO SUAT_CHIEU (MaSuatChieu, MaPhim, MaRapPhim, GiaVeCoBan, ThoiGianBatDau,
                               ThoiGianKetThuc, NgayChieu, TrangThai)
        VALUES (:1, :2, :3, :4, :5, :6, :7, :8)
    `;

    return await execute(sql, [
        MaSuatChieu, MaPhim, MaRapPhim, GiaVeCoBan, ThoiGianBatDau,
        ThoiGianKetThuc, NgayChieu, TrangThai || 'DangChieu'
    ]);
}

/**
 * Cập nhật suất chiếu
 */
export async function updateScreening(maSuatChieu, screeningData) {
    const { GiaVeCoBan, ThoiGianBatDau, ThoiGianKetThuc, TrangThai } = screeningData;

    const sql = `
        UPDATE SUAT_CHIEU
        SET GiaVeCoBan = :1, ThoiGianBatDau = :2, ThoiGianKetThuc = :3, TrangThai = :4
        WHERE MaSuatChieu = :5
    `;

    return await execute(sql, [GiaVeCoBan, ThoiGianBatDau, ThoiGianKetThuc, TrangThai, maSuatChieu]);
}

/**
 * Xóa suất chiếu
 */
export async function deleteScreening(maSuatChieu) {
    const sql = `DELETE FROM SUAT_CHIEU WHERE MaSuatChieu = :1`;
    return await execute(sql, [maSuatChieu]);
}
