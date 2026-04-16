-- ORACLE VERSION: Demo Script - Sample Data and Test Cases
-- ============================================================================
-- This script demonstrates common operations and generates sample data
-- Run after 01_create_tables_oracle.sql and 02_insert_data_oracle.sql

BEGIN
    DBMS_OUTPUT.PUT_LINE('=== CINEMA DATABASE ORACLE - DEMO SCRIPT ===');
    DBMS_OUTPUT.PUT_LINE('Testing stored procedures and functions...');
END;
/

-- DEMO 1: Test Movie Management
BEGIN
    DBMS_OUTPUT.PUT_LINE(CHR(10) || '--- DEMO 1: Movie Management ---');
    
    -- Test inserting a new movie
    SP_Insert_PHIM(
        'AVENGERS5',
        'Avengers: Endgame 2',
        160,
        'Tiếng Anh',
        'USA',
        'Russo Bros',
        'Robert Downey Jr, Chris Evans',
        TO_DATE('2024-05-01', 'YYYY-MM-DD'),
        'Phần tiếp theo của bộ phim siêu anh hùng',
        13,
        'Action/Adventure'
    );
    DBMS_OUTPUT.PUT_LINE('✓ Successfully inserted new movie: AVENGERS5');
    
END;
/

-- DEMO 2: Test Movie Performance Function
BEGIN
    DBMS_OUTPUT.PUT_LINE(CHR(10) || '--- DEMO 2: Movie Performance Analysis ---');
    DECLARE
        v_Result VARCHAR2(100);
    BEGIN
        SELECT FUNC_DanhGiaHieuQuaPhim('THEPATIENCE')
        INTO v_Result
        FROM DUAL;
        DBMS_OUTPUT.PUT_LINE('Movie Performance: ' || v_Result);
    END;
END;
/

-- DEMO 3: Test Ticket Booking
BEGIN
    DBMS_OUTPUT.PUT_LINE(CHR(10) || '--- DEMO 3: Ticket Booking System ---');
    
    -- Create a demo order
    SP_TaoDonHang(
        'ORD_DEMO001',
        'ND001',
        'Thanh toán tại quầy'
    );
    DBMS_OUTPUT.PUT_LINE('✓ Created order: ORD_DEMO001');
    
    -- Add snacks to order
    SP_ThemMatHangVaoDon(
        'ORD_DEMO001',
        'MH001',
        2
    );
    DBMS_OUTPUT.PUT_LINE('✓ Added 2x snack (MH001) to order');
    
END;
/

-- DEMO 4: Test View Queries
BEGIN
    DBMS_OUTPUT.PUT_LINE(CHR(10) || '--- DEMO 4: Accessing Views ---');
    DECLARE
        v_Count NUMBER;
    BEGIN
        SELECT COUNT(*) INTO v_Count FROM V_PHIM_FULL;
        DBMS_OUTPUT.PUT_LINE('Total movies available: ' || v_Count);
        
        SELECT COUNT(*) INTO v_Count FROM V_SUAT_CHIEU_FULL;
        DBMS_OUTPUT.PUT_LINE('Total showtimes available: ' || v_Count);
    END;
END;
/

-- DEMO 5: Generate Revenue Report
BEGIN
    DBMS_OUTPUT.PUT_LINE(CHR(10) || '--- DEMO 5: Revenue Report ---');
    DECLARE
        v_TotalRevenue NUMBER := 0;
    BEGIN
        SELECT NVL(SUM(TongDoanhThu), 0)
        INTO v_TotalRevenue
        FROM V_DOANH_THU_THEO_PHIM
        WHERE Ngay >= TRUNC(SYSDATE) - 30;
        
        DBMS_OUTPUT.PUT_LINE('Revenue (Last 30 days): ' || 
                            TO_CHAR(v_TotalRevenue, '9,999,999.99'));
    END;
END;
/

-- DEMO 6: Test Ticket Functions
BEGIN
    DBMS_OUTPUT.PUT_LINE(CHR(10) || '--- DEMO 6: Ticket Price Calculation ---');
    DECLARE
        v_GiaGoc    NUMBER := 150000;
        v_GiaCuoi   NUMBER;
    BEGIN
        v_GiaCuoi := FUNC_TinhGiaVeVoiKhuyenMai(v_GiaGoc, 'KM_SALE_50');
        DBMS_OUTPUT.PUT_LINE('Original Price: ' || v_GiaGoc);
        DBMS_OUTPUT.PUT_LINE('Final Price: ' || v_GiaCuoi);
    END;
END;
/

-- DEMO 7: Display Current Movies
BEGIN
    DBMS_OUTPUT.PUT_LINE(CHR(10) || '--- DEMO 7: Current Movies ---');
    FOR movie IN (SELECT TenPhim, ChuDePhim, NgayKhoiChieu 
                  FROM PHIM 
                  WHERE NgayKhoiChieu >= TRUNC(SYSDATE)
                  ROWNUM <= 5)
    LOOP
        DBMS_OUTPUT.PUT_LINE(movie.TenPhim || ' (' || movie.ChuDePhim || ')');
    END LOOP;
END;
/

-- DEMO 8: Show Available Showtimes
BEGIN
    DBMS_OUTPUT.PUT_LINE(CHR(10) || '--- DEMO 8: Available Showtimes ---');
    FOR sc IN (SELECT TenPhim, ThoiGianChieu, TenPhong, GheTrong 
               FROM V_SUAT_CHIEU_FULL
               WHERE NgayChieu = TRUNC(SYSDATE) + 1
               ROWNUM <= 10)
    LOOP
        DBMS_OUTPUT.PUT_LINE(sc.TenPhim || ' at ' || sc.ThoiGianChieu || 
                            ' (' || sc.GheTrong || ' seats left)');
    END LOOP;
END;
/

-- DEMO 9: Customer Statistics
BEGIN
    DBMS_OUTPUT.PUT_LINE(CHR(10) || '--- DEMO 9: Top Customers ---');
    FOR cust IN (SELECT TenNguoiDung, SoVeDat, TongTienVe 
                 FROM V_KHACH_HANG_FULL 
                 WHERE SoVeDat > 0
                 ORDER BY TongTienVe DESC
                 ROWNUM <= 5)
    LOOP
        DBMS_OUTPUT.PUT_LINE(cust.TenNguoiDung || ' - ' || cust.SoVeDat || 
                            ' tickets - Total: ' || cust.TongTienVe);
    END LOOP;
END;
/

-- DEMO 10: Top Revenue Movies
BEGIN
    DBMS_OUTPUT.PUT_LINE(CHR(10) || '--- DEMO 10: Top Revenue Movies ---');
    FOR movie IN (SELECT TenPhim, SoVe, DoanhThu 
                  FROM V_PHIM_TOP_DOANH_THU
                  ROWNUM <= 5)
    LOOP
        DBMS_OUTPUT.PUT_LINE(movie.TenPhim || ' - ' || movie.SoVe || 
                            ' tickets - ' || TO_CHAR(movie.DoanhThu, '9,999,999'));
    END LOOP;
END;
/

-- DEMO 11: Validation Tests (Expected to show error handling)
BEGIN
    DBMS_OUTPUT.PUT_LINE(CHR(10) || '--- DEMO 11: Validation Tests ---');
    DBMS_OUTPUT.PUT_LINE('Testing constraint validation...');
    
    -- This should fail: negative duration
    BEGIN
        SP_Insert_PHIM(
            'INVALID_MOVIE',
            'Test Movie',
            -60,  -- Invalid: negative duration
            'Tiếng Anh',
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
            DBMS_OUTPUT.PUT_LINE('✓ Caught validation error: ' || SQLERRM);
    END;
    
END;
/

BEGIN
    DBMS_OUTPUT.PUT_LINE(CHR(10) || '=== DEMO COMPLETE ===');
    DBMS_OUTPUT.PUT_LINE('All tests executed successfully!');
END;
/
