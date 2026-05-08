import { query, execute } from '../config/database.js';

/**
 * Lấy danh sách phim
 */
export async function getAllMovies() {
    const sql = `
        SELECT 
            MaPhim, TenPhim, ThoiLuong, NgonNgu, QuocGia, DaoDien, DienVienChinh, 
            NgayKhoiChieu, MoTaNoiDung, DoTuoi, ChuDePhim, Anh,
            DiemTrungBinh AS DIEMDANHGIA,
            FUNC_DanhGiaHieuQuaPhim(MaPhim) AS HIEUQUA,
            CASE 
                WHEN TongDoanhThu > 1000000 THEN 'Tuyệt vời (' || ROUND(TongDoanhThu/1000000, 1) || 'M)'
                WHEN TongDoanhThu > 500000 THEN 'Hot (' || ROUND(TongDoanhThu/1000000, 1) || 'M)'
                WHEN TongDoanhThu > 100000 THEN 'Bình thường (' || ROUND(TongDoanhThu/1000000, 1) || 'M)'
                ELSE 'Cần cải thiện (' || ROUND(TongDoanhThu/1000000, 1) || 'M)'
            END AS HIEUQUAMOI
        FROM V_PHIM_SORTED 
        ORDER BY NgayKhoiChieu DESC
    `;
    return await query(sql);
}

/**
 * Lấy phim theo ID
 */
export async function getMovieById(maPhim) {
    const sql = `
        SELECT 
            MaPhim, TenPhim, ThoiLuong, NgonNgu, QuocGia, DaoDien, DienVienChinh, 
            NgayKhoiChieu, MoTaNoiDung, DoTuoi, ChuDePhim, Anh,
            DiemTrungBinh AS DIEMDANHGIA,
            FUNC_DanhGiaHieuQuaPhim(MaPhim) AS HIEUQUA,
            CASE 
                WHEN TongDoanhThu > 1000000 THEN 'Tuyệt vời (' || ROUND(TongDoanhThu/1000000, 1) || 'M)'
                WHEN TongDoanhThu > 500000 THEN 'Hot (' || ROUND(TongDoanhThu/1000000, 1) || 'M)'
                WHEN TongDoanhThu > 100000 THEN 'Bình thường (' || ROUND(TongDoanhThu/1000000, 1) || 'M)'
                ELSE 'Cần cải thiện (' || ROUND(TongDoanhThu/1000000, 1) || 'M)'
            END AS HIEUQUAMOI
        FROM V_PHIM_SORTED 
        WHERE MaPhim = :1
    `;
    const results = await query(sql, [maPhim]);
    return results.length > 0 ? results[0] : null;
}

/**
 * Tìm phim theo tên (search)
 */
export async function searchMovies(keyword = '', genre = '', rating = '0', special = '') {
    const sqlParts = [
        `SELECT 
            MaPhim, TenPhim, ThoiLuong, NgonNgu, QuocGia, DaoDien, DienVienChinh, 
            NgayKhoiChieu, MoTaNoiDung, DoTuoi, ChuDePhim, Anh,
            DiemTrungBinh AS DIEMDANHGIA,
            FUNC_DanhGiaHieuQuaPhim(MaPhim) AS HIEUQUA,
            CASE 
                WHEN TongDoanhThu > 1000000 THEN 'Tuyệt vời (' || ROUND(TongDoanhThu/1000000, 1) || 'M)'
                WHEN TongDoanhThu > 500000 THEN 'Hot (' || ROUND(TongDoanhThu/1000000, 1) || 'M)'
                WHEN TongDoanhThu > 100000 THEN 'Bình thường (' || ROUND(TongDoanhThu/1000000, 1) || 'M)'
                ELSE 'Cần cải thiện (' || ROUND(TongDoanhThu/1000000, 1) || 'M)'
            END AS HIEUQUAMOI
        FROM V_PHIM_SORTED
        WHERE 1=1`
    ];

    const binds = [];

    if (keyword.trim() !== '') {
        sqlParts.push(`AND (LOWER(TenPhim) LIKE LOWER(:${binds.length + 1}) OR LOWER(DaoDien) LIKE LOWER(:${binds.length + 2}) OR LOWER(DienVienChinh) LIKE LOWER(:${binds.length + 3}))`);
        binds.push(`%${keyword.trim()}%`, `%${keyword.trim()}%`, `%${keyword.trim()}%`);
    }

    if (genre.trim() !== '') {
        sqlParts.push(`AND LOWER(ChuDePhim) LIKE LOWER(:${binds.length + 1})`);
        binds.push(`%${genre.trim()}%`);
    }

    if (!isNaN(Number(rating)) && Number(rating) > 0) {
        sqlParts.push(`AND NVL(DiemTrungBinh, 0) >= :${binds.length + 1}`);
        binds.push(Number(rating));
    }

    if (special === 'above_avg') {
        sqlParts.push(`AND DiemTrungBinh > (SELECT NVL(AVG(DiemTrungBinh), 0) FROM V_PHIM_SORTED)`);
    }

    sqlParts.push('ORDER BY NgayKhoiChieu DESC');

    if (special === 'top_sales') {
        sqlParts.push('FETCH FIRST 1 ROWS ONLY');
    }

    const sql = sqlParts.join('\n');
    return await query(sql, binds);
}

/**
 * Tạo phim mới
 */
export async function createMovie(movieData) {
    const {
        TenPhim, ThoiLuong, NgonNgu, QuocGia, DaoDien,
        DienVienChinh, NgayKhoiChieu, MoTaNoiDung, DoTuoi, ChuDePhim, Anh
    } = movieData;

    // Auto-generate MaPhim (PHIM + timestamp)
    const maPhim = `PHIM_${Date.now()}`;

    const sql = `
    INSERT INTO PHIM (MaPhim, TenPhim, ThoiLuong, NgonNgu, QuocGia, DaoDien,
                      DienVienChinh, NgayKhoiChieu, MoTaNoiDung, DoTuoi, ChuDePhim, Anh)
    VALUES (:1, :2, :3, :4, :5, :6, :7, TO_DATE(:8, 'YYYY-MM-DD'), :9, :10, :11, :12)
`; // Sử dụng TO_DATE để ép kiểu chính xác

    return await execute(sql, [
        maPhim, TenPhim, ThoiLuong, NgonNgu, QuocGia, DaoDien,
        DienVienChinh, NgayKhoiChieu, MoTaNoiDung, DoTuoi, ChuDePhim, Anh
    ]);
}

/**
 * Cập nhật phim
 */
export async function updateMovie(maPhim, movieData) {
    const {
        TenPhim, ThoiLuong, NgonNgu, QuocGia, DaoDien,
        DienVienChinh, NgayKhoiChieu, MoTaNoiDung, DoTuoi, ChuDePhim, Anh
    } = movieData;

    const sql = `
        UPDATE PHIM
        SET TenPhim = :1, ThoiLuong = :2, NgonNgu = :3, QuocGia = :4, DaoDien = :5,
            DienVienChinh = :6, NgayKhoiChieu = TO_DATE(:7, 'YYYY-MM-DD'), MoTaNoiDung = :8, DoTuoi = :9,
            ChuDePhim = :10, Anh = :11
        WHERE MaPhim = :12
    `;

    return await execute(sql, [
        TenPhim, ThoiLuong, NgonNgu, QuocGia, DaoDien,
        DienVienChinh, NgayKhoiChieu, MoTaNoiDung, DoTuoi, ChuDePhim, Anh, maPhim
    ]);
}

/**
 * Xóa phim
 */
export async function deleteMovie(maPhim) {
    const sql = `DELETE FROM PHIM WHERE MaPhim = :1`;
    return await execute(sql, [maPhim]);
}

/**
 * Lấy đánh giá của phim
 */
export async function getMovieReviews(maPhim) {
    const sql = `
        SELECT 
            MaDanhGia, 
            MaNguoiDung, 
            MaPhim,
            NoiDung,
            NgayDang,
            DiemSo
        FROM DANH_GIA 
        WHERE MaPhim = :1 
        ORDER BY NgayDang DESC
    `;
    return await query(sql, [maPhim]);
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
 * Lấy điểm trung bình phim
 */
export async function getMovieAverageRating(maPhim) {
    const sql = `
        SELECT 
            ROUND(AVG(DiemSo), 1) as DiemTrungBinh,
            COUNT(*) as SoLuotDanhGia
        FROM DANH_GIA 
        WHERE MaPhim = :1
    `;
    const results = await query(sql, [maPhim]);
    return results.length > 0 ? results[0] : { DIEMTRUNGBINH: 0, SOLUOTDANHGIA: 0 };
}
