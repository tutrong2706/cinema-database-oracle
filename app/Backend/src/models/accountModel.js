import { query, execute } from '../config/database.js';

/**
 * Lấy danh sách tài khoản
 */
export async function getAllAccounts() {
    const sql = `SELECT MaNguoiDung, HoTen, Email, SDT, DiaChi, VaiTro FROM TAI_KHOAN ORDER BY MaNguoiDung`;
    return await query(sql);
}

/**
 * Lấy tài khoản theo email
 */
export async function getAccountByEmail(email) {
    const sql = `SELECT * FROM TAI_KHOAN WHERE LOWER(Email) = LOWER(:1)`;
    const results = await query(sql, [email]);
    return results.length > 0 ? results[0] : null;
}

/**
 * Lấy tài khoản theo email hoặc mã người dùng
 */
export async function getAccountByEmailOrId(identifier) {
    const sql = `
        SELECT *
        FROM TAI_KHOAN
        WHERE LOWER(Email) = LOWER(:1)
           OR LOWER(MaNguoiDung) = LOWER(:2)
    `;
    const results = await query(sql, [identifier, identifier]);
    return results.length > 0 ? results[0] : null;
}

/**
 * Lấy tài khoản theo ID
 */
export async function getAccountById(maNguoiDung) {
    const sql = `SELECT MaNguoiDung, HoTen, Email, SDT, DiaChi, VaiTro, GioiTinh FROM TAI_KHOAN WHERE MaNguoiDung = :1`;
    const results = await query(sql, [maNguoiDung]);
    return results.length > 0 ? results[0] : null;
}

/**
 * Tạo tài khoản
 */
export async function createAccount(accountData) {
    const { MaNguoiDung, HoTen, Email, MatKhau, SDT, DiaChi, VaiTro, GioiTinh } = accountData;

    const sql = `
        INSERT INTO TAI_KHOAN (MaNguoiDung, HoTen, Email, MatKhau, SDT, DiaChi, VaiTro, GioiTinh)
        VALUES (:1, :2, :3, :4, :5, :6, :7, :8)
    `;

    return await execute(sql, [
        MaNguoiDung, HoTen, Email, MatKhau, SDT, DiaChi, VaiTro || 'Khach', GioiTinh || null
    ]);
}

/**
 * Lấy thông tin khách hàng theo mã người dùng
 */
export async function getCustomerProfileById(maNguoiDung) {
    const sql = `
        SELECT MaNguoiDung, LoaiThanhVien, DiemTichLuy
        FROM KHACH_HANG
        WHERE MaNguoiDung = :1
    `;
    const results = await query(sql, [maNguoiDung]);
    return results.length > 0 ? results[0] : null;
}

/**
 * Đảm bảo tài khoản có bản ghi KHACH_HANG (idempotent)
 */
export async function ensureCustomerProfile(maNguoiDung, loaiThanhVien = 'Bronze', diemTichLuy = 0) {
    const sql = `
        MERGE INTO KHACH_HANG KH
        USING (SELECT :1 AS MaNguoiDung FROM DUAL) SRC
        ON (KH.MaNguoiDung = SRC.MaNguoiDung)
        WHEN NOT MATCHED THEN
            INSERT (MaNguoiDung, LoaiThanhVien, DiemTichLuy)
            VALUES (SRC.MaNguoiDung, :2, :3)
    `;

    return await execute(sql, [maNguoiDung, loaiThanhVien, diemTichLuy]);
}

/**
 * Cập nhật tài khoản
 */
export async function updateAccount(maNguoiDung, accountData) {
    const { HoTen, SDT, DiaChi, VaiTro, GioiTinh } = accountData;

    const sql = `
        UPDATE TAI_KHOAN
        SET HoTen = :1, SDT = :2, DiaChi = :3, VaiTro = :4, GioiTinh = :5
        WHERE MaNguoiDung = :6
    `;

    return await execute(sql, [HoTen, SDT, DiaChi, VaiTro, GioiTinh, maNguoiDung]);
}

/**
 * Kiểm tra email đã tồn tại
 */
export async function emailExists(email) {
    const result = await getAccountByEmail(email);
    return result !== null;
}

/**
 * Lấy profile đầy đủ của người dùng (kể cả điểm tích lũy cho khách hàng)
 */
export async function getFullProfile(maNguoiDung) {
    const sql = `
        SELECT 
            TK.MaNguoiDung,
            TK.HoTen,
            TK.Email,
            TK.SDT,
            TK.DiaChi,
            TK.VaiTro,
            TK.GioiTinh,
            KH.LoaiThanhVien,
            KH.DiemTichLuy
        FROM TAI_KHOAN TK
        LEFT JOIN KHACH_HANG KH ON TK.MaNguoiDung = KH.MaNguoiDung
        WHERE TK.MaNguoiDung = :1
    `;
    const results = await query(sql, [maNguoiDung]);
    return results.length > 0 ? results[0] : null;
}