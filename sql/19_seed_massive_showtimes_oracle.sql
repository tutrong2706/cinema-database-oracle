-- ============================================================================
-- SHOWTIMES TOP-UP SEED (Oracle)
-- Purpose:
--   - Ensure each movie has around 5 screenings in the same day (2026-05-10).
--   - Top-up only missing screenings (does not duplicate endlessly).
--   - Use generated room prefix PX### with full seat map for frontend booking.
-- Idempotent prefix: SCX######
-- ============================================================================

SET DEFINE OFF;
SET ECHO OFF;
SET FEEDBACK OFF;
SET TERMOUT ON;
SET VERIFY OFF;
SET SERVEROUTPUT ON;

DECLARE
    c_seed_start_date CONSTANT DATE := DATE '2026-05-10';
    c_open_status     CONSTANT VARCHAR2(20) := UNISTR('\0110ang m\1EDF');

    v_counter NUMBER := 1;
    v_created NUMBER := 0;
    v_movie_idx NUMBER := 0;

    v_ma_suat SUAT_CHIEU.MaSuatChieu%TYPE;
    v_ma_phong PHONG_CHIEU.MaPhong%TYPE;
    v_ma_rap RAP_CHIEU_PHIM.MaRapPhim%TYPE;

    v_target_count NUMBER;
    v_existing_count NUMBER;
    v_need_add NUMBER;

    v_current_start_ts TIMESTAMP;
    v_start_ts TIMESTAMP;
    v_end_ts TIMESTAMP;
    v_ngay DATE;
    v_gia NUMBER;
BEGIN
    DBMS_OUTPUT.PUT_LINE('=== START SHOWTIMES TOP-UP SEED (5 PER MOVIE, SAME DAY) ===');

    -- Re-run safety: remove previous generated SCX screenings and dependent rows.
    DELETE FROM AP_DUNG
    WHERE MaVe IN (
        SELECT MaVe FROM VE_XEM_PHIM WHERE MaSuatChieu LIKE 'SCX%'
    );
    DELETE FROM VE_XEM_PHIM WHERE MaSuatChieu LIKE 'SCX%';
    DELETE FROM SUAT_CHIEU WHERE MaSuatChieu LIKE 'SCX%';
    COMMIT;

    -- Calculate next SCX sequence number.
    SELECT NVL(MAX(TO_NUMBER(SUBSTR(MaSuatChieu, 4))), 0) + 1
    INTO v_counter
    FROM SUAT_CHIEU
    WHERE MaSuatChieu LIKE 'SCX%';

    FOR m IN (
        SELECT MaPhim, ThoiLuong
        FROM PHIM
        ORDER BY MaPhim
    ) LOOP
        v_movie_idx := v_movie_idx + 1;

                -- Target: 5 screenings per movie in one day.
                v_target_count := 5;

                -- Existing screenings for the same target day only.
        SELECT COUNT(*)
        INTO v_existing_count
        FROM SUAT_CHIEU
        WHERE MaPhim = m.MaPhim
                    AND NgayChieu = c_seed_start_date
          AND TrangThai <> UNISTR('\0048\1EE7y');

        v_need_add := GREATEST(v_target_count - v_existing_count, 0);

        IF v_need_add = 0 THEN
            CONTINUE;
        END IF;

        -- Create one dedicated generated room per movie for stable frontend seat-map.
        v_ma_phong := 'PX' || LPAD(v_movie_idx, 3, '0');
        v_ma_rap := CASE MOD(v_movie_idx - 1, 5)
            WHEN 0 THEN 'RAP001'
            WHEN 1 THEN 'RAP002'
            WHEN 2 THEN 'RAP003'
            WHEN 3 THEN 'RAP004'
            ELSE 'RAP005'
        END;

        MERGE INTO PHONG_CHIEU p
        USING (
            SELECT v_ma_phong AS MaPhong,
                   v_ma_rap AS MaRapPhim,
                   'Phong Lich ' || m.MaPhim AS TenPhong
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

        -- Ensure TRINH_CHIEU link exists for reporting/filtering.
        MERGE INTO TRINH_CHIEU t
        USING (
            SELECT v_ma_rap AS MaRapPhim,
                   m.MaPhim AS MaPhim
            FROM DUAL
        ) s
        ON (t.MaRapPhim = s.MaRapPhim AND t.MaPhim = s.MaPhim)
        WHEN NOT MATCHED THEN
            INSERT (MaRapPhim, MaPhim)
            VALUES (s.MaRapPhim, s.MaPhim);

        -- Rebuild generated room seats (8 rows x 10 seats).
        DELETE FROM GHE WHERE MaPhong = v_ma_phong;
        FOR row_num IN 1..8 LOOP
            FOR seat_num IN 1..10 LOOP
                INSERT INTO GHE (MaPhong, HangGhe, SoGhe, LoaiGhe)
                VALUES (
                    v_ma_phong,
                    CHR(64 + row_num),
                    seat_num,
                    CASE WHEN row_num >= 7 THEN 'VIP' ELSE 'Standard' END
                );
            END LOOP;
        END LOOP;

        v_ngay := c_seed_start_date;
        v_current_start_ts := TO_TIMESTAMP(
            TO_CHAR(v_ngay, 'YYYY-MM-DD') || ' 08:00:00',
            'YYYY-MM-DD HH24:MI:SS'
        );

        FOR slot_idx IN 1..v_need_add LOOP
            -- Schedule sequentially in the same day to avoid overlap trigger.
            v_start_ts := v_current_start_ts;
            v_end_ts := v_start_ts + NUMTODSINTERVAL(m.ThoiLuong + 20, 'MINUTE');

            v_gia := 95000 + slot_idx * 7000 + MOD(v_movie_idx, 4) * 5000;
            v_ma_suat := 'SCX' || LPAD(v_counter, 6, '0');

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
                m.MaPhim,
                v_ma_phong,
                v_ngay,
                v_start_ts,
                v_end_ts,
                v_gia,
                c_open_status
            );

            -- 15-minute cleaning/buffer before next showtime.
            v_current_start_ts := v_end_ts + NUMTODSINTERVAL(15, 'MINUTE');

            v_counter := v_counter + 1;
            v_created := v_created + 1;
        END LOOP;
    END LOOP;

    COMMIT;

    DBMS_OUTPUT.PUT_LINE('Top-up screenings inserted: ' || TO_CHAR(v_created));
    DBMS_OUTPUT.PUT_LINE('=== SHOWTIMES TOP-UP SEED COMPLETED ===');
END;
/

-- Verify total screenings per movie on 2026-05-10.
SELECT MaPhim,
             COUNT(*) AS SoSuatNgay_20260510
FROM SUAT_CHIEU
WHERE NgayChieu = DATE '2026-05-10'
  AND TrangThai <> UNISTR('\0048\1EE7y')
GROUP BY MaPhim
ORDER BY MaPhim;

-- View generated SCX screenings.
SELECT s.MaSuatChieu,
       s.MaPhim,
       p.TenPhim,
       s.MaPhong,
       s.NgayChieu,
       s.GioBatDau,
       s.GioKetThuc,
       s.GiaVeCoBan,
       s.TrangThai
FROM SUAT_CHIEU s
JOIN PHIM p ON p.MaPhim = s.MaPhim
WHERE s.MaSuatChieu LIKE 'SCX%'
ORDER BY s.MaPhim, s.NgayChieu, s.GioBatDau;
