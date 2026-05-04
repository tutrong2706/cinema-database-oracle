-- ORACLE VERSION: Demo Script - Sample Data and Test Cases
-- ============================================================================
-- Run after:
--   01_create_tables_oracle.sql
--   02_insert_data_oracle.sql
--   03_sp_phim_oracle.sql
--   04_sp_donhang_oracle.sql
--   06_functions_oracle.sql
--   09_sp_view_data_oracle.sql

SET SERVEROUTPUT ON;

BEGIN
    DBMS_OUTPUT.PUT_LINE('=== CINEMA DATABASE ORACLE - DEMO SCRIPT ===');
    DBMS_OUTPUT.PUT_LINE('Testing procedures, functions, and views...');
END;
/

-- DEMO 1: Test Movie Management
DECLARE
    v_exists NUMBER := 0;
BEGIN
    DBMS_OUTPUT.PUT_LINE(CHR(10) || '--- DEMO 1: Movie Management ---');

    SELECT COUNT(*)
    INTO v_exists
    FROM PHIM
    WHERE MaPhim = 'AVENGERS5';

    IF v_exists = 0 THEN
        SP_Insert_PHIM(
            'AVENGERS5',
            'Avengers: Endgame 2',
            160,
            'English',
            'USA',
            'Russo Bros',
            'Robert Downey Jr, Chris Evans',
            TO_DATE('2026-05-01', 'YYYY-MM-DD'),
            'Demo movie inserted by 10_demo_script_oracle.sql',
            13,
            'Action/Adventure'
        );
        DBMS_OUTPUT.PUT_LINE('[OK] Inserted demo movie: AVENGERS5');
    ELSE
        DBMS_OUTPUT.PUT_LINE('[SKIP] Demo movie AVENGERS5 already exists');
    END IF;
END;
/

-- DEMO 2: Test Movie Performance Function
DECLARE
    v_result VARCHAR2(100);
BEGIN
    DBMS_OUTPUT.PUT_LINE(CHR(10) || '--- DEMO 2: Movie Performance Analysis ---');

    SELECT FUNC_DanhGiaHieuQuaPhim('PH001')
    INTO v_result
    FROM DUAL;

    DBMS_OUTPUT.PUT_LINE('Movie PH001 performance: ' || v_result);
END;
/

-- DEMO 3: Test Ticket Booking
DECLARE
    v_order_exists NUMBER := 0;
    v_item_exists  NUMBER := 0;
BEGIN
    DBMS_OUTPUT.PUT_LINE(CHR(10) || '--- DEMO 3: Ticket Booking System ---');

    SELECT COUNT(*)
    INTO v_order_exists
    FROM DON_HANG
    WHERE MaDonHang = 'ORD_DEMO001';

    IF v_order_exists = 0 THEN
        SP_TaoDonHang(
            'ORD_DEMO001',
            'KH001',
            'Thanh toan tai quay'
        );
        DBMS_OUTPUT.PUT_LINE('[OK] Created order: ORD_DEMO001');
    ELSE
        DBMS_OUTPUT.PUT_LINE('[SKIP] Order ORD_DEMO001 already exists');
    END IF;

    SELECT COUNT(*)
    INTO v_item_exists
    FROM GOM
    WHERE MaDonHang = 'ORD_DEMO001'
      AND MaHang = 'MH001';

    IF v_item_exists = 0 THEN
        BEGIN
            SP_ThemMatHangVaoDon(
                'ORD_DEMO001',
                'MH001',
                2
            );
            DBMS_OUTPUT.PUT_LINE('[OK] Added 2x snack (MH001) to order');
        EXCEPTION
            WHEN OTHERS THEN
                DBMS_OUTPUT.PUT_LINE(
                    '[SKIP] Could not add item MH001 to ORD_DEMO001: ' || SQLERRM
                );
        END;
    ELSE
        DBMS_OUTPUT.PUT_LINE('[SKIP] Item MH001 already exists in ORD_DEMO001');
    END IF;
END;
/

-- DEMO 4: Test View Queries
DECLARE
    v_count NUMBER;
BEGIN
    DBMS_OUTPUT.PUT_LINE(CHR(10) || '--- DEMO 4: Accessing Views ---');

    SELECT COUNT(*) INTO v_count FROM V_PHIM_FULL;
    DBMS_OUTPUT.PUT_LINE('Total movies available: ' || v_count);

    SELECT COUNT(*) INTO v_count FROM V_SUAT_CHIEU_FULL;
    DBMS_OUTPUT.PUT_LINE('Total showtimes available: ' || v_count);
END;
/

-- DEMO 5: Generate Revenue Report
DECLARE
    v_total_revenue NUMBER := 0;
    v_last_day      DATE;
BEGIN
    DBMS_OUTPUT.PUT_LINE(CHR(10) || '--- DEMO 5: Revenue Report ---');

    SELECT MAX(Ngay)
    INTO v_last_day
    FROM V_DOANH_THU_THEO_PHIM;

    IF v_last_day IS NULL THEN
        DBMS_OUTPUT.PUT_LINE('No revenue data available in V_DOANH_THU_THEO_PHIM.');
    ELSE
        SELECT NVL(SUM(TongDoanhThu), 0)
        INTO v_total_revenue
        FROM V_DOANH_THU_THEO_PHIM
        WHERE Ngay >= v_last_day - 30;

        DBMS_OUTPUT.PUT_LINE(
            'Revenue in latest 30-day data window: ' ||
            TO_CHAR(v_total_revenue, 'FM9,999,999.00')
        );
    END IF;
END;
/

-- DEMO 6: Test Ticket Functions
DECLARE
    v_gia_goc  NUMBER := 150000;
    v_gia_cuoi NUMBER;
BEGIN
    DBMS_OUTPUT.PUT_LINE(CHR(10) || '--- DEMO 6: Ticket Price Calculation ---');

    v_gia_cuoi := FUNC_TinhGiaVeVoiKhuyenMai(v_gia_goc, 'KM001');

    DBMS_OUTPUT.PUT_LINE('Original Price: ' || v_gia_goc);
    DBMS_OUTPUT.PUT_LINE('Final Price: ' || v_gia_cuoi);
END;
/

-- DEMO 7: Display Latest Movies
BEGIN
    DBMS_OUTPUT.PUT_LINE(CHR(10) || '--- DEMO 7: Latest Movies ---');

    FOR movie IN (
        SELECT TenPhim, ChuDePhim, NgayKhoiChieu
        FROM (
            SELECT TenPhim, ChuDePhim, NgayKhoiChieu
            FROM PHIM
            ORDER BY NgayKhoiChieu DESC
        )
        WHERE ROWNUM <= 5
    )
    LOOP
        DBMS_OUTPUT.PUT_LINE(
            movie.TenPhim || ' (' || movie.ChuDePhim || ') - ' ||
            TO_CHAR(movie.NgayKhoiChieu, 'YYYY-MM-DD')
        );
    END LOOP;
END;
/

-- DEMO 8: Show Available Showtimes
BEGIN
    DBMS_OUTPUT.PUT_LINE(CHR(10) || '--- DEMO 8: Available Showtimes ---');

    FOR sc IN (
        SELECT TenPhim, NgayChieu, ThoiGianChieu, TenPhong, GheTrong
        FROM (
            SELECT
                p.TenPhim,
                s.NgayChieu,
                TO_CHAR(s.GioBatDau, 'HH24:MI') || '-' || TO_CHAR(s.GioKetThuc, 'HH24:MI') AS ThoiGianChieu,
                pc.Ten AS TenPhong,
                FUNC_SoGheTrong(s.MaSuatChieu) AS GheTrong
            FROM SUAT_CHIEU s
            JOIN PHIM p ON s.MaPhim = p.MaPhim
            JOIN PHONG_CHIEU pc ON s.MaPhong = pc.MaPhong
            ORDER BY s.NgayChieu, s.GioBatDau
        )
        WHERE ROWNUM <= 10
    )
    LOOP
        DBMS_OUTPUT.PUT_LINE(
            sc.TenPhim || ' - ' ||
            TO_CHAR(sc.NgayChieu, 'YYYY-MM-DD') || ' - ' ||
            sc.ThoiGianChieu || ' - ' ||
            sc.TenPhong || ' (' || sc.GheTrong || ' seats left)'
        );
    END LOOP;
END;
/

-- DEMO 9: Customer Statistics
DECLARE
    v_customer_count NUMBER := 0;
BEGIN
    DBMS_OUTPUT.PUT_LINE(CHR(10) || '--- DEMO 9: Top Customers ---');

    SELECT COUNT(*)
    INTO v_customer_count
    FROM V_KHACH_HANG_FULL
    WHERE SoVeDat > 0;

    IF v_customer_count = 0 THEN
        DBMS_OUTPUT.PUT_LINE('No customer ticket data available yet.');
    ELSE

        FOR cust IN (
            SELECT HoTen, SoVeDat, TongTienVe
            FROM (
                SELECT HoTen, SoVeDat, NVL(TongTienVe, 0) AS TongTienVe
                FROM V_KHACH_HANG_FULL
                WHERE SoVeDat > 0
                ORDER BY NVL(TongTienVe, 0) DESC
            )
            WHERE ROWNUM <= 5
        )
        LOOP
            DBMS_OUTPUT.PUT_LINE(
                cust.HoTen || ' - ' || cust.SoVeDat ||
                ' tickets - Total: ' || cust.TongTienVe
            );
        END LOOP;
    END IF;
END;
/

-- DEMO 10: Top Revenue Movies
DECLARE
    v_movie_count NUMBER := 0;
BEGIN
    DBMS_OUTPUT.PUT_LINE(CHR(10) || '--- DEMO 10: Top Revenue Movies ---');

    SELECT COUNT(*)
    INTO v_movie_count
    FROM V_PHIM_TOP_DOANH_THU;

    IF v_movie_count = 0 THEN
        DBMS_OUTPUT.PUT_LINE('No movie revenue data available yet.');
    ELSE
        FOR movie IN (
            SELECT TenPhim, SoVe, DoanhThu
            FROM (
                SELECT TenPhim, SoVe, DoanhThu
                FROM V_PHIM_TOP_DOANH_THU
                ORDER BY DoanhThu DESC
            )
            WHERE ROWNUM <= 5
        )
        LOOP
            DBMS_OUTPUT.PUT_LINE(
                movie.TenPhim || ' - ' || movie.SoVe ||
                ' tickets - ' || TO_CHAR(movie.DoanhThu, 'FM9,999,999')
            );
        END LOOP;
    END IF;
END;
/

-- DEMO 11: Validation Tests
BEGIN
    DBMS_OUTPUT.PUT_LINE(CHR(10) || '--- DEMO 11: Validation Tests ---');
    DBMS_OUTPUT.PUT_LINE('Testing constraint validation...');

    BEGIN
        SP_Insert_PHIM(
            'INVALID_MOVIE',
            'Test Movie',
            -60,
            'English',
            'USA',
            'Director',
            'Actor',
            TO_DATE('2024-01-01', 'YYYY-MM-DD'),
            'Description',
            13,
            'Test'
        );
    EXCEPTION
        WHEN OTHERS THEN
            DBMS_OUTPUT.PUT_LINE('[OK] Caught validation error: ' || SQLERRM);
    END;
END;
/

BEGIN
    DBMS_OUTPUT.PUT_LINE(CHR(10) || '=== DEMO COMPLETE ===');
    DBMS_OUTPUT.PUT_LINE('Demo script finished.');
END;
/
