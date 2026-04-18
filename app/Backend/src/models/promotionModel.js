import { query, execute } from '../config/database.js';

/**
 * Lấy danh sách khuyến mãi
 */
export async function getAllPromotions() {
    const sql = `
        SELECT MaKhuyenMai AS MAKHUYENMAI, TenChuongTrinh AS TENCHƯƠNG, DieuKien, 
               NgayBatDau, NgayKetThuc, MucGiam AS MUCGIAM
        FROM CHUONG_TRINH_KHUYEN_MAI
        ORDER BY NgayKetThuc DESC
    `;
    return await query(sql);
}

/**
 * Lấy khuyến mãi đang hoạt động
 */
export async function getActivePromotions() {
    const sql = `
        SELECT MaKhuyenMai AS MAKHUYENMAI, TenChuongTrinh AS TENCHƯƠNG, DieuKien, 
               NgayBatDau, NgayKetThuc, MucGiam AS MUCGIAM
        FROM CHUONG_TRINH_KHUYEN_MAI
        WHERE TRUNC(SYSDATE) BETWEEN NgayBatDau AND NgayKetThuc
        ORDER BY NgayKetThuc
    `;
    return await query(sql);
}

/**
 * Lấy khuyến mãi theo ID
 */
export async function getPromotionById(maKhuyenMai) {
    const sql = `
        SELECT MaKhuyenMai AS MAKHUYENMAI, TenChuongTrinh AS TENCHƯƠNG, DieuKien, 
               NgayBatDau, NgayKetThuc, MucGiam AS MUCGIAM
        FROM CHUONG_TRINH_KHUYEN_MAI
        WHERE MaKhuyenMai = :1
    `;
    const results = await query(sql, [maKhuyenMai]);
    return results.length > 0 ? results[0] : null;
}

/**
 * Tạo khuyến mãi mới
 */
export async function createPromotion(promotionData) {
    const { MaKhuyenMai, TenChuongTrinh, DieuKien, NgayBatDau, NgayKetThuc, MucGiam } = promotionData;

    const sql = `
        INSERT INTO CHUONG_TRINH_KHUYEN_MAI (MaKhuyenMai, TenChuongTrinh, DieuKien, NgayBatDau, NgayKetThuc, MucGiam)
        VALUES (:1, :2, :3, :4, :5, :6)
    `;

    return await execute(sql, [MaKhuyenMai, TenChuongTrinh, DieuKien, NgayBatDau, NgayKetThuc, MucGiam]);
}

/**
 * Cập nhật khuyến mãi
 */
export async function updatePromotion(maKhuyenMai, promotionData) {
    const { TenChuongTrinh, DieuKien, NgayBatDau, NgayKetThuc, MucGiam } = promotionData;

    const sql = `
        UPDATE CHUONG_TRINH_KHUYEN_MAI
        SET TenChuongTrinh = :1, DieuKien = :2, NgayBatDau = :3, NgayKetThuc = :4, MucGiam = :5
        WHERE MaKhuyenMai = :6
    `;

    return await execute(sql, [TenChuongTrinh, DieuKien, NgayBatDau, NgayKetThuc, MucGiam, maKhuyenMai]);
}

/**
 * Xóa khuyến mãi
 */
export async function deletePromotion(maKhuyenMai) {
    const sql = `DELETE FROM CHUONG_TRINH_KHUYEN_MAI WHERE MaKhuyenMai = :1`;
    return await execute(sql, [maKhuyenMai]);
}

/**
 * Lấy khuyến mãi được sử dụng nhiều nhất
 */
export async function getTopUsedPromotions() {
    const sql = `
        SELECT CK.MaKhuyenMai AS MAKHUYENMAI, CK.TenChuongTrinh AS TENCHƯƠNG, 
               COUNT(AD.MaVe) AS SOLAN_SD, CK.MucGiam AS MUCGIAM
        FROM CHUONG_TRINH_KHUYEN_MAI CK
        LEFT JOIN AP_DUNG AD ON CK.MaKhuyenMai = AD.MaKhuyenMai
        GROUP BY CK.MaKhuyenMai, CK.TenChuongTrinh, CK.MucGiam
        ORDER BY SOLAN_SD DESC
    `;
    return await query(sql);
}

/**
 * Lấy số tiền tiết kiệm từ khuyến mãi
 */
export async function getPromotionSavings() {
    const sql = `
        SELECT CK.MaKhuyenMai AS MAKHUYENMAI, CK.TenChuongTrinh AS TENCHƯƠNG,
               COUNT(AD.MaVe) AS SOLAN_SD,
               SUM(CK.MucGiam) AS TONG_GIAM,
               CK.MucGiam AS MUCGIAM_MOI_LAN
        FROM CHUONG_TRINH_KHUYEN_MAI CK
        LEFT JOIN AP_DUNG AD ON CK.MaKhuyenMai = AD.MaKhuyenMai
        GROUP BY CK.MaKhuyenMai, CK.TenChuongTrinh, CK.MucGiam
        ORDER BY TONG_GIAM DESC
    `;
    return await query(sql);
}
