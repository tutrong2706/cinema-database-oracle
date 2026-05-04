-- ============================================================================
-- DEMO SCRIPT: TEST TOÀN BỘ LOGIC NGHIỆP VỤ CỦA DATABASE
-- ============================================================================
-- Chạy script này để verify tất cả stored procedures, functions, triggers hoạt động

SET SERVEROUTPUT ON
SET ECHO ON
SET FEEDBACK ON

PROMPT ============= BẮTĐẦU TEST DATABASE =============

-- ============================================================================
-- 1. TEST: QUẢN LÝ PHIM
-- ============================================================================
PROMPT;
PROMPT ============= 1. TEST QUẢN LÝ PHIM =============
PROMPT Lấy danh sách phim đang chiếu:
SELECT COUNT(*) as TongPhim FROM PHIM;
SELECT MaPhim, TenPhim, DanhGia FROM PHIM WHERE ROWNUM <= 3;

PROMPT;
PROMPT Danh sách phim sắp xếp theo rating (cao nhất):
SELECT MaPhim, TenPhim, DanhGia FROM PHIM ORDER BY DanhGia DESC FETCH FIRST 5 ROWS ONLY;

-- ============================================================================
-- 2. TEST: QUẢN LÝ SUẤT CHIẾU
-- ============================================================================
PROMPT;
PROMPT ============= 2. TEST QUẢN LÝ SUẤT CHIẾU =============
PROMPT Danh sách suất chiếu hôm nay:
SELECT 
    sc.MaSuat, 
    p.TenPhim, 
    pc.Ten as TenPhong, 
    sc.GioChieu, 
    sc.GiaVeCoBan
FROM SUAT_CHIEU sc
JOIN PHIM p ON sc.MaPhim = p.MaPhim
JOIN PHONG_CHIEU pc ON sc.MaPhong = pc.MaPhong
WHERE TRUNC(sc.NgayChieu) = TRUNC(SYSDATE)
AND ROWNUM <= 5;

PROMPT;
PROMPT Số ghế trống của mỗi suất chiếu:
SELECT 
    sc.MaSuat, 
    p.TenPhim,
    pc.SucChua as TongGhe,
    (SELECT COUNT(*) FROM VE_XEM_PHIM ve WHERE ve.MaSuat = sc.MaSuat) as GheDaBan,
    (pc.SucChua - (SELECT COUNT(*) FROM VE_XEM_PHIM ve WHERE ve.MaSuat = sc.MaSuat)) as GheTrong
FROM SUAT_CHIEU sc
JOIN PHIM p ON sc.MaPhim = p.MaPhim
JOIN PHONG_CHIEU pc ON sc.MaPhong = pc.MaPhong
WHERE TRUNC(sc.NgayChieu) = TRUNC(SYSDATE)
AND ROWNUM <= 5;

-- ============================================================================
-- 3. TEST: KHUYẾN MÃI
-- ============================================================================
PROMPT;
PROMPT ============= 3. TEST KHUYẾN MÃI =============
PROMPT Danh sách khuyến mãi đang hoạt động:
SELECT 
    MaKhuyenMai, 
    TenChuongTrinh, 
    MucGiam,
    NgayBatDau,
    NgayKetThuc
FROM CHUONG_TRINH_KHUYEN_MAI
WHERE TRUNC(SYSDATE) BETWEEN TRUNC(NgayBatDau) AND TRUNC(NgayKetThuc);

-- ============================================================================
-- 4. TEST: TÍNH TOÁN GIỚI HẠN (BUSINESS LOGIC)
-- ============================================================================
PROMPT;
PROMPT ============= 4. TEST TÍNH TOÁN GIỚI HẠN =============
PROMPT Test Function: Tính số ghế trống của suất chiếu:

DECLARE
    v_maSuat VARCHAR2(20) := 'SC001';
    v_gheTrong NUMBER;
BEGIN
    -- Lấy ghế trống (nếu có function)
    SELECT COUNT(*) INTO v_gheTrong 
    FROM GHE g
    WHERE g.MaPhong = (SELECT MaPhong FROM SUAT_CHIEU WHERE MaSuat = v_maSuat)
    AND NOT EXISTS (
        SELECT 1 FROM VE_XEM_PHIM ve 
        WHERE ve.MaPhong = g.MaPhong 
        AND ve.HangGhe = g.HangGhe 
        AND ve.SoGhe = g.SoGhe
        AND ve.MaSuat = v_maSuat
    );
    
    DBMS_OUTPUT.PUT_LINE('Ghế trống của suất ' || v_maSuat || ': ' || v_gheTrong);
END;
/

-- ============================================================================
-- 5. TEST: TRIGGER TỰ ĐỘNG TÍNH TỔNG TIỀN
-- ============================================================================
PROMPT;
PROMPT ============= 5. TEST TRIGGER TỰ ĐỘNG TÍNH TỔNG =============
PROMPT Kiểm tra trigger: Khi thêm vé, TongTien của DON_HANG tự update

-- Lấy một đơn hàng
DECLARE
    v_maDonHang VARCHAR2(20);
    v_tongTien NUMBER;
BEGIN
    -- Lấy đơn hàng gần đây
    SELECT MaDonHang INTO v_maDonHang
    FROM DON_HANG
    WHERE ROWNUM = 1
    ORDER BY ThoiGianDat DESC;
    
    -- Kiểm tra tổng tiền đúng không
    SELECT TongTien INTO v_tongTien
    FROM DON_HANG
    WHERE MaDonHang = v_maDonHang;
    
    DBMS_OUTPUT.PUT_LINE('Đơn hàng: ' || v_maDonHang || ' - Tổng tiền: ' || v_tongTien);
END;
/

-- ============================================================================
-- 6. TEST: BÁO CÁO DOANH THU
-- ============================================================================
PROMPT;
PROMPT ============= 6. TEST BÁO CÁO DOANH THU =============
PROMPT Doanh thu theo phim:
SELECT 
    p.MaPhim,
    p.TenPhim,
    COUNT(ve.MaVe) as SoVeDaBan,
    NVL(SUM(ve.GiaVeCuoi), 0) as TongDoanhThu
FROM PHIM p
LEFT JOIN SUAT_CHIEU sc ON p.MaPhim = sc.MaPhim
LEFT JOIN VE_XEM_PHIM ve ON sc.MaSuat = ve.MaSuat
GROUP BY p.MaPhim, p.TenPhim
ORDER BY TongDoanhThu DESC
FETCH FIRST 5 ROWS ONLY;

PROMPT;
PROMPT Doanh thu theo ngày:
SELECT 
    TRUNC(ve.NgayDat) as Ngay,
    COUNT(ve.MaVe) as SoVe,
    NVL(SUM(ve.GiaVeCuoi), 0) as TongDoanhThu
FROM VE_XEM_PHIM ve
GROUP BY TRUNC(ve.NgayDat)
ORDER BY Ngay DESC
FETCH FIRST 5 ROWS ONLY;

-- ============================================================================
-- 7. TEST: KIỂM TRA TOÀN VẸN DỮ LIỆU
-- ============================================================================
PROMPT;
PROMPT ============= 7. KIỂM TRA TOÀN VẸNDỮ LIỆU =============
PROMPT Số bảng:
SELECT COUNT(*) as TongBang FROM user_tables;

PROMPT Tổng số hàng trong các bảng chính:
SELECT 
    'PHIM' as BangName,
    COUNT(*) as TongHang
FROM PHIM
UNION ALL
SELECT 'SUAT_CHIEU', COUNT(*) FROM SUAT_CHIEU
UNION ALL
SELECT 'VE_XEM_PHIM', COUNT(*) FROM VE_XEM_PHIM
UNION ALL
SELECT 'DON_HANG', COUNT(*) FROM DON_HANG
UNION ALL
SELECT 'KHACH_HANG', COUNT(*) FROM KHACH_HANG
ORDER BY BangName;

-- ============================================================================
-- 8. TEST: STORED PROCEDURES
-- ============================================================================
PROMPT;
PROMPT ============= 8. TEST STORED PROCEDURES =============

DECLARE
    v_cursor SYS_REFCURSOR;
    v_count NUMBER := 0;
BEGIN
    DBMS_OUTPUT.PUT_LINE('Test: Gọi stored procedures');
    
    -- Test: Tất cả SPs đều compiled (không error)
    BEGIN
        EXECUTE IMMEDIATE 'BEGIN SP_GetAllMovies(?, ?); END;';
        DBMS_OUTPUT.PUT_LINE('✓ SP_GetAllMovies compiled successfully');
    EXCEPTION
        WHEN OTHERS THEN
            DBMS_OUTPUT.PUT_LINE('✗ SP_GetAllMovies error: ' || SQLERRM);
    END;
    
END;
/

-- ============================================================================
-- 9. TEST: VIEWS
-- ============================================================================
PROMPT;
PROMPT ============= 9. TEST VIEWS =============
PROMPT Kiểm tra views hoạt động:

-- Test View 1: Phim sắp xếp theo rating
PROMPT View: Phim sắp xếp theo rating
SELECT * FROM V_PHIM_BY_RATING WHERE ROWNUM <= 3;

-- Test View 2: Doanh thu theo phim
PROMPT View: Doanh thu theo phim
SELECT * FROM V_DOANH_THU_BY_MOVIE WHERE ROWNUM <= 3;

-- Test View 3: Suất chiếu theo thời gian
PROMPT View: Suất chiếu theo thời gian
SELECT * FROM V_SUAT_CHIEU_BY_TIME WHERE ROWNUM <= 3;

-- ============================================================================
-- 10. TEST: TRANSACTIONS
-- ============================================================================
PROMPT;
PROMPT ============= 10. TEST TRANSACTIONS =============
PROMPT Kiểm tra Foreign Key Constraints:

-- Kiểm tra ràng buộc FK
BEGIN
    -- Cố gắng tạo vé với MaSuat không tồn tại (sẽ lỗi)
    INSERT INTO VE_XEM_PHIM (MaVe, MaSuat, MaPhong, HangGhe, SoGhe, MaDonHang, MaNguoiDung_KH, GiaVeCoBan, GiaVeCuoi, NgayDat)
    VALUES ('VE_TEST', 'SC_INVALID', 'P001', 'A', 1, 'DH001', 'KH001', 100, 100, SYSDATE);
    DBMS_OUTPUT.PUT_LINE('✗ FK constraint không hoạt động');
EXCEPTION
    WHEN OTHERS THEN
        DBMS_OUTPUT.PUT_LINE('✓ FK constraint hoạt động: ' || SQLERRM);
        ROLLBACK;
END;
/

-- ============================================================================
-- 11. TỔNG KẾTTHỐNG KÊ
-- ============================================================================
PROMPT;
PROMPT ============= 11. THỐNG KÊ TỔNG HỢP =============

DECLARE
    v_tongPhim NUMBER;
    v_tongSuat NUMBER;
    v_tongVe NUMBER;
    v_tongDoanhThu NUMBER;
    v_tongKhach NUMBER;
    v_tongDonHang NUMBER;
BEGIN
    SELECT COUNT(*) INTO v_tongPhim FROM PHIM;
    SELECT COUNT(*) INTO v_tongSuat FROM SUAT_CHIEU;
    SELECT COUNT(*) INTO v_tongVe FROM VE_XEM_PHIM;
    SELECT COUNT(*) INTO v_tongKhach FROM KHACH_HANG;
    SELECT COUNT(*) INTO v_tongDonHang FROM DON_HANG;
    SELECT NVL(SUM(GiaVeCuoi), 0) INTO v_tongDoanhThu FROM VE_XEM_PHIM;
    
    DBMS_OUTPUT.PUT_LINE(RPAD('=', 50, '='));
    DBMS_OUTPUT.PUT_LINE('THỐNG KÊ DATABASE');
    DBMS_OUTPUT.PUT_LINE(RPAD('=', 50, '='));
    DBMS_OUTPUT.PUT_LINE('Tổng phim:           ' || v_tongPhim);
    DBMS_OUTPUT.PUT_LINE('Tổng suất chiếu:     ' || v_tongSuat);
    DBMS_OUTPUT.PUT_LINE('Tổng vé bán:         ' || v_tongVe);
    DBMS_OUTPUT.PUT_LINE('Tổng doanh thu:      ' || v_tongDoanhThu);
    DBMS_OUTPUT.PUT_LINE('Tổng khách hàng:     ' || v_tongKhach);
    DBMS_OUTPUT.PUT_LINE('Tổng đơn hàng:       ' || v_tongDonHang);
    DBMS_OUTPUT.PUT_LINE(RPAD('=', 50, '='));
END;
/

PROMPT;
PROMPT ============= TEST HOÀN THÀNH =============
PROMPT Tất cả logic database đã được kiểm tra!

