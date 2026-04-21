import { query, execute } from '../config/database.js';

/**
 * Lấy danh sách phòng chiếu
 */
export async function getAllRooms() {
    const sql = `
        SELECT PC.MaPhong, PC.MaRapPhim, PC.Ten AS TEN, PC.Loai, PC.SucChua, PC.SoGhe,
               RC.Ten AS TENRAP
        FROM PHONG_CHIEU PC
        JOIN RAP_CHIEU_PHIM RC ON PC.MaRapPhim = RC.MaRapPhim
        ORDER BY RC.Ten, PC.Ten
    `;
    return await query(sql);
}

/**
 * Lấy phòng theo ID
 */
export async function getRoomById(maPhong) {
    const sql = `
        SELECT PC.MaPhong, PC.MaRapPhim, PC.Ten AS TEN, PC.Loai, PC.SucChua, PC.SoGhe,
               RC.Ten AS TENRAP
        FROM PHONG_CHIEU PC
        JOIN RAP_CHIEU_PHIM RC ON PC.MaRapPhim = RC.MaRapPhim
        WHERE PC.MaPhong = :1
    `;
    const results = await query(sql, [maPhong]);
    return results.length > 0 ? results[0] : null;
}

/**
 * Lấy phòng theo rạp
 */
export async function getRoomsBycinema(maRapPhim) {
    const sql = `
        SELECT PC.MaPhong, PC.Ten AS TEN, PC.Loai, PC.SucChua, PC.SoGhe
        FROM PHONG_CHIEU PC
        WHERE PC.MaRapPhim = :1
        ORDER BY PC.Ten
    `;
    return await query(sql, [maRapPhim]);
}

/**
 * Tạo phòng chiếu mới
 */
export async function createRoom(roomData) {
    const { MaPhong, MaRapPhim, Ten, Loai, SucChua, SoGhe } = roomData;

    const sql = `
        INSERT INTO PHONG_CHIEU (MaPhong, MaRapPhim, Ten, Loai, SucChua, SoGhe)
        VALUES (:1, :2, :3, :4, :5, :6)
    `;

    return await execute(sql, [MaPhong, MaRapPhim, Ten, Loai, SucChua, SoGhe]);
}

/**
 * Cập nhật phòng chiếu
 */
export async function updateRoom(maPhong, roomData) {
    const { Ten, Loai, SucChua, SoGhe } = roomData;

    const sql = `
        UPDATE PHONG_CHIEU
        SET Ten = :1, Loai = :2, SucChua = :3, SoGhe = :4
        WHERE MaPhong = :5
    `;

    return await execute(sql, [Ten, Loai, SucChua, SoGhe, maPhong]);
}

/**
 * Xóa phòng chiếu
 */
export async function deleteRoom(maPhong) {
    const sql = `DELETE FROM PHONG_CHIEU WHERE MaPhong = :1`;
    return await execute(sql, [maPhong]);
}

/**
 * Lấy danh sách ghế của phòng
 */
export async function getRoomSeats(maPhong) {
    const sql = `
        SELECT MaPhong, HangGhe, SoGhe, LoaiGhe
        FROM GHE
        WHERE MaPhong = :1
        ORDER BY HangGhe, SoGhe
    `;
    return await query(sql, [maPhong]);
}

/**
 * Thêm ghế vào phòng
 */
export async function addSeat(maPhong, hangGhe, soGhe, loaiGhe) {
    const sql = `
        INSERT INTO GHE (MaPhong, HangGhe, SoGhe, LoaiGhe)
        VALUES (:1, :2, :3, :4)
    `;

    return await execute(sql, [maPhong, hangGhe, soGhe, loaiGhe]);
}

/**
 * Xóa ghế
 */
export async function deleteSeat(maPhong, hangGhe, soGhe) {
    const sql = `DELETE FROM GHE WHERE MaPhong = :1 AND HangGhe = :2 AND SoGhe = :3`;
    return await execute(sql, [maPhong, hangGhe, soGhe]);
}
