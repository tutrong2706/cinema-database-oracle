import oracledb from 'oracledb';
import dotenv from 'dotenv';

dotenv.config();
process.env.NODE_ORACLEDB_THIN_MODE = 1;

const dbConfig = {
    user: process.env.DB_USER || 'dev',
    password: process.env.DB_PASSWORD || 'dev123',
    connectionString: `${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || 1521}/${process.env.DB_SERVICE_NAME || 'XEPDB1'}`,
};

const SEED_START_DATE = '2026-05-10';
const OPEN_STATUS = 'Đang mở';
const DONE_STATUS = 'Đã chiếu';

const seedRooms = [
    { maRapPhim: 'RAP001', maPhong: 'PS001', tenPhong: 'Phong Seed 1' },
    { maRapPhim: 'RAP002', maPhong: 'PS002', tenPhong: 'Phong Seed 2' },
    { maRapPhim: 'RAP003', maPhong: 'PS003', tenPhong: 'Phong Seed 3' },
    { maRapPhim: 'RAP004', maPhong: 'PS004', tenPhong: 'Phong Seed 4' },
    { maRapPhim: 'RAP005', maPhong: 'PS005', tenPhong: 'Phong Seed 5' },
];

const buildTimestampText = (dateText, hour, minute) =>
    `${dateText} ${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:00`;

const shiftDateText = (baseDateText, offsetDays) => {
    const date = new Date(`${baseDateText}T00:00:00`);
    date.setDate(date.getDate() + offsetDays);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const addMinutesToTimestampText = (timestampText, minutesToAdd) => {
    const date = new Date(timestampText.replace(' ', 'T'));
    date.setMinutes(date.getMinutes() + minutesToAdd);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

const TODAY = shiftDateText(new Date().toISOString().slice(0, 10), 0);

let connection;

try {
    connection = await oracledb.getConnection(dbConfig);

    await connection.execute(
        `DELETE FROM AP_DUNG WHERE MaVe IN (
            SELECT MaVe FROM VE_XEM_PHIM WHERE MaSuatChieu LIKE 'SCN%'
        )`
    );
    await connection.execute(`DELETE FROM VE_XEM_PHIM WHERE MaSuatChieu LIKE 'SCN%'`);
    await connection.execute(`DELETE FROM SUAT_CHIEU WHERE MaSuatChieu LIKE 'SCN%'`);

    for (const room of seedRooms) {
        await connection.execute(
            `MERGE INTO PHONG_CHIEU p
             USING (
                 SELECT :maPhong AS MaPhong, :maRapPhim AS MaRapPhim, :tenPhong AS TenPhong
                 FROM DUAL
             ) src
             ON (p.MaPhong = src.MaPhong)
             WHEN MATCHED THEN UPDATE SET
                 p.MaRapPhim = src.MaRapPhim,
                 p.Ten = src.TenPhong,
                 p.Loai = '2D',
                 p.SucChua = 80,
                 p.SoGhe = 80
             WHEN NOT MATCHED THEN
                 INSERT (MaPhong, MaRapPhim, Ten, Loai, SucChua, SoGhe)
                 VALUES (src.MaPhong, src.MaRapPhim, src.TenPhong, '2D', 80, 80)`,
            room
        );

        await connection.execute(`DELETE FROM GHE WHERE MaPhong = :maPhong`, { maPhong: room.maPhong });

        const seatBinds = [];
        for (let rowIndex = 0; rowIndex < 8; rowIndex += 1) {
            for (let seatNumber = 1; seatNumber <= 10; seatNumber += 1) {
                seatBinds.push({
                    maPhong: room.maPhong,
                    hangGhe: String.fromCharCode(65 + rowIndex),
                    soGhe: seatNumber,
                    loaiGhe: rowIndex >= 6 ? 'VIP' : 'Standard',
                });
            }
        }

        await connection.executeMany(
            `INSERT INTO GHE (MaPhong, HangGhe, SoGhe, LoaiGhe)
             VALUES (:maPhong, :hangGhe, :soGhe, :loaiGhe)`,
            seatBinds
        );
    }

    const movieResult = await connection.execute(
        `SELECT MaPhim, ThoiLuong
         FROM PHIM
         ORDER BY MaPhim`,
        [],
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    const movies = movieResult.rows || [];

    for (const room of seedRooms) {
        for (const movie of movies) {
            await connection.execute(
                `MERGE INTO TRINH_CHIEU t
                 USING (
                     SELECT :maRapPhim AS MaRapPhim, :maPhim AS MaPhim
                     FROM DUAL
                 ) src
                 ON (t.MaRapPhim = src.MaRapPhim AND t.MaPhim = src.MaPhim)
                 WHEN NOT MATCHED THEN
                     INSERT (MaRapPhim, MaPhim)
                     VALUES (src.MaRapPhim, src.MaPhim)`,
                { maRapPhim: room.maRapPhim, maPhim: movie.MAPHIM }
            );
        }
    }

    const screeningBinds = [];
    movies.forEach((movie, movieIndex) => {
        for (let slotIndex = 0; slotIndex < 3; slotIndex += 1) {
            const room = seedRooms[(movieIndex + slotIndex) % seedRooms.length];
            const screeningDate = shiftDateText(SEED_START_DATE, (movieIndex % 15) + slotIndex);
            const slots = [
                { hour: 9, minute: 0 },
                { hour: 14, minute: 15 },
                { hour: 19, minute: 30 },
            ];
            const slot = slots[slotIndex];
            const startText = buildTimestampText(screeningDate, slot.hour, slot.minute);
            const endText = addMinutesToTimestampText(startText, Number(movie.THOILUONG || 0) + 20);
            const status = screeningDate < TODAY ? DONE_STATUS : OPEN_STATUS;

            screeningBinds.push({
                maSuatChieu: `SCN${String(screeningBinds.length + 1).padStart(6, '0')}`,
                maPhim: movie.MAPHIM,
                maPhong: room.maPhong,
                ngayChieu: screeningDate,
                gioBatDau: startText,
                gioKetThuc: endText,
                giaVeCoBan: 90000 + (slotIndex + 1) * 10000 + (movieIndex % 5) * 5000,
                trangThai: status,
            });
        }
    });

    for (const screening of screeningBinds) {
        await connection.execute(
            `INSERT INTO SUAT_CHIEU (
            MaSuatChieu,
            MaPhim,
            MaPhong,
            NgayChieu,
            GioBatDau,
            GioKetThuc,
            GiaVeCoBan,
            TrangThai
        ) VALUES (
            :maSuatChieu,
            :maPhim,
            :maPhong,
            TO_DATE(:ngayChieu, 'YYYY-MM-DD'),
            TO_TIMESTAMP(:gioBatDau, 'YYYY-MM-DD HH24:MI:SS'),
            TO_TIMESTAMP(:gioKetThuc, 'YYYY-MM-DD HH24:MI:SS'),
            :giaVeCoBan,
            :trangThai
        )`,
            screening
        );
    }

    await connection.commit();

    const summaryResult = await connection.execute(
        `SELECT COUNT(*) AS TOTAL,
                SUM(CASE WHEN MaSuatChieu LIKE 'SCN%' THEN 1 ELSE 0 END) AS GENERATED,
                TO_CHAR(MIN(CASE WHEN MaSuatChieu LIKE 'SCN%' THEN NgayChieu END), 'YYYY-MM-DD') AS MIN_DAY,
                TO_CHAR(MAX(CASE WHEN MaSuatChieu LIKE 'SCN%' THEN NgayChieu END), 'YYYY-MM-DD') AS MAX_DAY
         FROM SUAT_CHIEU`,
        [],
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    console.log(JSON.stringify(summaryResult.rows?.[0] || null, null, 2));
} catch (error) {
    if (connection) {
        try {
            await connection.rollback();
        } catch (rollbackError) {
            console.error('Rollback error:', rollbackError.message);
        }
    }

    console.error(error);
    process.exitCode = 1;
} finally {
    if (connection) {
        await connection.close();
    }
}
