-- ============================================================================
-- BALANCED FUTURE SCREENINGS SEED (Oracle)
-- Purpose:
--   - Generate future showtimes starting from 2026-05-10.
--   - Standardize dedicated seeded rooms and their seat maps.
--   - Keep reruns safe by only replacing generated SCN* showtimes.
-- Idempotent prefixes:
--   - Room: PS0xx
--   - Screening: SCNxxxxxx
-- ============================================================================

SET DEFINE OFF;
SET ECHO OFF;
SET FEEDBACK OFF;
SET TERMOUT ON;
SET VERIFY OFF;
SET SERVEROUTPUT ON;

DECLARE
    c_seed_start_date CONSTANT DATE := DATE '2026-05-10';
    c_open_status      CONSTANT VARCHAR2(20) := UNISTR('\0110ang m\1EDF');
    c_done_status      CONSTANT VARCHAR2(20) := UNISTR('\0110\00E3 chi\1EBFu');

    v_counter NUMBER := 1;
    v_movie_idx NUMBER := 0;

    v_ma_suat SUAT_CHIEU.MaSuatChieu%TYPE;
    v_ma_phim PHIM.MaPhim%TYPE;
    v_thoi_luong PHIM.ThoiLuong%TYPE;

    v_ma_phong PHONG_CHIEU.MaPhong%TYPE;
    v_ma_rap RAP_CHIEU_PHIM.MaRapPhim%TYPE;

    v_ngay DATE;
    v_start_ts TIMESTAMP;
    v_end_ts TIMESTAMP;

    v_slot_hour NUMBER;
    v_slot_min NUMBER;
    v_gia NUMBER;
    v_status VARCHAR2(20);
BEGIN
    DBMS_OUTPUT.PUT_LINE('=== START FUTURE SCREENINGS SEED ===');

    DELETE FROM AP_DUNG
    WHERE MaVe IN (
        SELECT MaVe
        FROM VE_XEM_PHIM
        WHERE MaSuatChieu LIKE 'SCN%'
    );

    DELETE FROM VE_XEM_PHIM
    WHERE MaSuatChieu LIKE 'SCN%';

    DELETE FROM SUAT_CHIEU
    WHERE MaSuatChieu LIKE 'SCN%';

    FOR r IN (
        SELECT MaRapPhim,
               CASE MaRapPhim
                   WHEN 'RAP001' THEN 'PS001'
                   WHEN 'RAP002' THEN 'PS002'
                   WHEN 'RAP003' THEN 'PS003'
                   WHEN 'RAP004' THEN 'PS004'
                   ELSE 'PS005'
               END AS MaPhongStd,
               CASE MaRapPhim
                   WHEN 'RAP001' THEN 'Phong Seed 1'
                   WHEN 'RAP002' THEN 'Phong Seed 2'
                   WHEN 'RAP003' THEN 'Phong Seed 3'
                   WHEN 'RAP004' THEN 'Phong Seed 4'
                   ELSE 'Phong Seed 5'
               END AS TenPhong
        FROM RAP_CHIEU_PHIM
        WHERE MaRapPhim IN ('RAP001', 'RAP002', 'RAP003', 'RAP004', 'RAP005')
        ORDER BY MaRapPhim
    ) LOOP
        MERGE INTO PHONG_CHIEU p
        USING (
            SELECT r.MaPhongStd AS MaPhong,
                   r.MaRapPhim AS MaRapPhim,
                   r.TenPhong AS TenPhong
            FROM DUAL
        ) s
        ON (p.MaPhong = s.MaPhong)
        WHEN MATCHED THEN UPDATE SET
            p.MaRapPhim = s.MaRapPhim,
            p.Ten = s.TenPhong,
            p.Loai = '2D',
            p.SucChua = 80,
            p.SoGhe = 80
        WHEN NOT MATCHED THEN
            INSERT (MaPhong, MaRapPhim, Ten, Loai, SucChua, SoGhe)
            VALUES (s.MaPhong, s.MaRapPhim, s.TenPhong, '2D', 80, 80);

        DELETE FROM GHE
        WHERE MaPhong = r.MaPhongStd;

        FOR row_num IN 1..8 LOOP
            FOR seat_num IN 1..10 LOOP
                INSERT INTO GHE (MaPhong, HangGhe, SoGhe, LoaiGhe)
                VALUES (
                    r.MaPhongStd,
                    CHR(64 + row_num),
                    seat_num,
                    CASE
                        WHEN row_num >= 7 THEN 'VIP'
                        ELSE 'Standard'
                    END
                );
            END LOOP;
        END LOOP;
    END LOOP;

    FOR tc IN (
        SELECT rp.MaRapPhim, p.MaPhim
        FROM RAP_CHIEU_PHIM rp
        CROSS JOIN PHIM p
        WHERE rp.MaRapPhim IN ('RAP001', 'RAP002', 'RAP003', 'RAP004', 'RAP005')
    ) LOOP
        MERGE INTO TRINH_CHIEU t
        USING (
            SELECT tc.MaRapPhim AS MaRapPhim,
                   tc.MaPhim AS MaPhim
            FROM DUAL
        ) s
        ON (t.MaRapPhim = s.MaRapPhim AND t.MaPhim = s.MaPhim)
        WHEN NOT MATCHED THEN
            INSERT (MaRapPhim, MaPhim)
            VALUES (s.MaRapPhim, s.MaPhim);
    END LOOP;

    FOR m IN (
        SELECT MaPhim, ThoiLuong
        FROM PHIM
        ORDER BY MaPhim
    ) LOOP
        v_movie_idx := v_movie_idx + 1;
        v_ma_phim := m.MaPhim;
        v_thoi_luong := m.ThoiLuong;

        FOR slot_idx IN 1..3 LOOP
            CASE MOD(v_movie_idx + slot_idx - 2, 5)
                WHEN 0 THEN
                    v_ma_rap := 'RAP001';
                    v_ma_phong := 'PS001';
                WHEN 1 THEN
                    v_ma_rap := 'RAP002';
                    v_ma_phong := 'PS002';
                WHEN 2 THEN
                    v_ma_rap := 'RAP003';
                    v_ma_phong := 'PS003';
                WHEN 3 THEN
                    v_ma_rap := 'RAP004';
                    v_ma_phong := 'PS004';
                ELSE
                    v_ma_rap := 'RAP005';
                    v_ma_phong := 'PS005';
            END CASE;

            v_ngay := c_seed_start_date + MOD(v_movie_idx - 1, 15) + (slot_idx - 1);

            IF slot_idx = 1 THEN
                v_slot_hour := 9;
                v_slot_min := 0;
            ELSIF slot_idx = 2 THEN
                v_slot_hour := 14;
                v_slot_min := 15;
            ELSE
                v_slot_hour := 19;
                v_slot_min := 30;
            END IF;

            v_start_ts := TO_TIMESTAMP(
                TO_CHAR(v_ngay, 'YYYY-MM-DD') || ' ' ||
                LPAD(v_slot_hour, 2, '0') || ':' || LPAD(v_slot_min, 2, '0') || ':00',
                'YYYY-MM-DD HH24:MI:SS'
            );
            v_end_ts := v_start_ts + NUMTODSINTERVAL(v_thoi_luong + 20, 'MINUTE');

            v_gia := 90000 + slot_idx * 10000 + MOD(v_movie_idx, 5) * 5000;
            v_ma_suat := 'SCN' || LPAD(v_counter, 6, '0');
            v_status := CASE
                WHEN v_ngay < TRUNC(SYSDATE) THEN c_done_status
                ELSE c_open_status
            END;

            INSERT INTO SUAT_CHIEU (
                MaSuatChieu,
                MaPhim,
                MaPhong,
                NgayChieu,
                GioBatDau,
                GioKetThuc,
                GiaVeCoBan,
                TrangThai
            ) VALUES (
                v_ma_suat,
                v_ma_phim,
                v_ma_phong,
                v_ngay,
                v_start_ts,
                v_end_ts,
                v_gia,
                v_status
            );

            v_counter := v_counter + 1;
        END LOOP;
    END LOOP;

    COMMIT;

    DBMS_OUTPUT.PUT_LINE('Inserted screenings: ' || TO_CHAR(v_counter - 1));
    DBMS_OUTPUT.PUT_LINE('Seed start date: 2026-05-10');
    DBMS_OUTPUT.PUT_LINE('=== FUTURE SCREENINGS SEED COMPLETED ===');
END;
/

SELECT TO_CHAR(MIN(NgayChieu), 'YYYY-MM-DD') AS MIN_NGAY,
       TO_CHAR(MAX(NgayChieu), 'YYYY-MM-DD') AS MAX_NGAY,
       COUNT(*) AS SO_SUAT
FROM SUAT_CHIEU
WHERE MaSuatChieu LIKE 'SCN%';

SELECT MaPhong, COUNT(*) AS SO_GHE
FROM GHE
WHERE MaPhong LIKE 'PS0%'
GROUP BY MaPhong
ORDER BY MaPhong;
