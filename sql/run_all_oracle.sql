-- ============================================================================
-- RUN ALL SCRIPTS FOR ORACLE DATABASE MIGRATION
-- Complete database initialization with all Oracle-compatible components
-- 
-- Execute in Oracle SQL*Plus or SQL Developer:
--   sqlplus dev/dev123@XEPDB1
-- Then: @run_all_oracle.sql
-- ============================================================================

SET ECHO ON
SET TIMING ON

SPOOL run_all_oracle.log

PROMPT ========================================================================
PROMPT          CINEMA DATABASE - ORACLE MIGRATION COMPLETE
PROMPT ========================================================================

-- 0. Create user and grant privileges
-- PROMPT ============= [00] Creating User and Granting Privileges =============
-- @@00_create_user_oracle.sql

-- 1. Create all tables
PROMPT ============= [01] Creating Tables =============
@@/docker-entrypoint-initdb.d/01_create_tables_oracle.sql

-- 1.5. Add VaiTro column to TAI_KHOAN
PROMPT ============= [01.5] Adding VaiTro Column =============
@@/docker-entrypoint-initdb.d/15_add_vaitro_column.sql

-- 2. Insert initial data
PROMPT ============= [02] Inserting Sample Data =============
@@/docker-entrypoint-initdb.d/02_insert_data_oracle.sql

-- 2a. Insert cleaned extra movie data (with poster-safe upsert)
PROMPT ============= [02A] Inserting Clean Extra Movie Data =============
@@/docker-entrypoint-initdb.d/02a_insert_more_data.sql

-- 2a.2 Thêm 48 phim xịn xò vào Database
PROMPT ============= [02A.2] Inserting Massive Movie Master Data =============
@@/docker-entrypoint-initdb.d/oracle_movie_master.sql

-- 2b. Insert balanced screenings (2-3 showtimes per movie, uniform layout)
PROMPT ============= [02B] Inserting Balanced Screenings =============
@@/docker-entrypoint-initdb.d/17_seed_massive_screenings_tickets.sql

-- 2c. Tạo dữ liệu Test Mua Vé / Đơn Hàng
PROMPT ============= [02C] Inserting Purchase Test Data =============
@@/docker-entrypoint-initdb.d/18_seed_purchase_test_data_oracle.sql

-- 2d. Additional seed scripts.
PROMPT ============= [02D] Inserting Showtimes Top-Up (5-6 per movie) =============
@@/docker-entrypoint-initdb.d/19_seed_massive_showtimes_oracle.sql

-- 2e. Seed massive reviews (10 đánh giá mỗi phim)
PROMPT ============= [02E] Inserting Massive Movie Reviews =============
@@/docker-entrypoint-initdb.d/20_seed_massive_reviews.sql

-- 2f. BƠM TIỀN CHO HỆ THỐNG (Chuyển đơn Chờ thanh toán -> Đã thanh toán & Cập nhật tổng tiền)
PROMPT ============= [02F] Auto-Updating Revenue Data =============
BEGIN
    -- 1. Chuyển ngẫu nhiên khoảng 80% đơn hàng "Chờ thanh toán" thành "Đã thanh toán"
    UPDATE DON_HANG
    SET TrangThai = 'Đã thanh toán'
    WHERE TrangThai = 'Chờ thanh toán' 
      AND MOD(TO_NUMBER(SUBSTR(MaDonHang, 4)), 10) <= 7;

    -- 2. Cập nhật các vé thuộc các đơn hàng vừa được thanh toán
    UPDATE VE_XEM_PHIM
    SET TrangThai = 'Đã thanh toán'
    WHERE MaDonHang IN (SELECT MaDonHang FROM DON_HANG WHERE TrangThai = 'Đã thanh toán');

    -- 3. Sửa lỗi các đơn hàng bị 0đ (Tính tổng lại dựa trên giá vé thực tế)
    UPDATE DON_HANG dh
    SET TongTien = (
        SELECT NVL(SUM(GiaVeCuoi), 0)
        FROM VE_XEM_PHIM
        WHERE MaDonHang = dh.MaDonHang
    )
    WHERE TongTien = 0 AND TrangThai = 'Đã thanh toán';

    COMMIT;
END;
/

-- 3. Createstored procedures for movie management
PROMPT ============= [03] Creating Movie Management Procedures =============
@@/docker-entrypoint-initdb.d/03_sp_phim_oracle.sql

-- 4. Create stored procedures for order management
PROMPT ============= [04] Creating Order Management Procedures =============
@@/docker-entrypoint-initdb.d/04_sp_donhang_oracle.sql

-- 5. Create stored procedures for ticket management
PROMPT ============= [05] Creating Ticket Management Procedures =============
@@/docker-entrypoint-initdb.d/05_sp_ve_oracle.sql

-- 6. Create functions
PROMPT ============= [06] Creating Functions =============
@@/docker-entrypoint-initdb.d/06_functions_oracle.sql

-- 7. Create business logic triggers
PROMPT ============= [07] Creating Business Logic Triggers =============
@@/docker-entrypoint-initdb.d/07_triggers_business_oracle.sql

-- 8. Create order total calculation triggers
PROMPT ============= [08] Creating Order Total Calculation Triggers =============
@@/docker-entrypoint-initdb.d/08_triggers_tongtien_oracle.sql

-- 9. Create views and data access procedures
PROMPT ============= [09] Creating Views and Data Access Procedures =============
@@/docker-entrypoint-initdb.d/09_sp_view_data_oracle.sql

-- 10. Run demo script (sample operations)
--PROMPT ============= [10] Running Demo Script =============
--@@/docker-entrypoint-initdb.d/10_demo_script_oracle.sql

-- 11. Create image management features
PROMPT ============= [11] Creating Image Management System =============
@@/docker-entrypoint-initdb.d/11_image_operations_oracle.sql

-- 12. Create API helper procedures
PROMPT ============= [12] Creating API Helper Procedures =============
@@/docker-entrypoint-initdb.d/12_api_helper_procedures_oracle.sql

-- 13. Create enhanced views with flexible sorting
PROMPT ============= [13] Creating Enhanced Views with Sorting =============
@@/docker-entrypoint-initdb.d/13_enhanced_views_sorting_oracle.sql

-- 16. Seed admin/test accounts and sync KHACH_HANG for all customer accounts
PROMPT ============= [16] Seeding Accounts and Syncing Customers =============
@@/docker-entrypoint-initdb.d/16_insert_admin_users.sql

-- 17. Seed balanced screenings and tickets for all movies
BEGIN
    -- Cập nhật lại toàn bộ điểm tích lũy của khách hàng 
    -- dựa trên tổng doanh thu các đơn hàng 'Đã thanh toán' của họ trong quá khứ
    UPDATE KHACH_HANG kh
    SET DiemTichLuy = (
        SELECT NVL(ROUND(SUM(TongTien) / 10000), 0)
        FROM DON_HANG dh
        WHERE dh.MaNguoiDung_KH = kh.MaNguoiDung
          AND dh.TrangThai = 'Đã thanh toán'
    );

    COMMIT;
    DBMS_OUTPUT.PUT_LINE('Đã đồng bộ hồi tố điểm tích lũy cho toàn bộ khách hàng thành công!');
END;
/

BEGIN
    -- =========================================================================
    -- 1. NÂNG HẠNG THÀNH VIÊN TỰ ĐỘNG THEO ĐIỂM
    -- =========================================================================
    UPDATE KHACH_HANG
    SET LoaiThanhVien = CASE 
        WHEN DiemTichLuy >= 1000 THEN 'Platinum'
        WHEN DiemTichLuy >= 500  THEN 'Gold'
        WHEN DiemTichLuy >= 200  THEN 'Silver'
        ELSE 'Bronze'
    END;

    -- =========================================================================
    -- 2. KHẤU TRỪ TỒN KHO BẮP NƯỚC, QUÀ LƯU NIỆM
    -- (Dùng GREATEST để đảm bảo kho không bao giờ bị âm số lượng)
    -- =========================================================================
    UPDATE MAT_HANG mh
    SET SoLuongTon = GREATEST(SoLuongTon - NVL((
        SELECT SUM(g.SoLuong)
        FROM GOM g
        JOIN DON_HANG dh ON g.MaDonHang = dh.MaDonHang
        WHERE g.MaHang = mh.MaHang AND dh.TrangThai = 'Đã thanh toán'
    ), 0), 0);

    -- =========================================================================
    -- 3. ĐÓNG SỔ THỜI GIAN (QUÉT TỪ QUÁ KHỨ ĐẾN HIỆN TẠI)
    -- =========================================================================
    
    -- 3.1. Đóng các suất chiếu đã kết thúc
    UPDATE SUAT_CHIEU
    SET TrangThai = 'Đã chiếu'
    WHERE GioKetThuc < SYSTIMESTAMP AND TrangThai = 'Đang mở';

    -- 3.2. Chuyển vé thành 'Đã xem' cho những khách đã mua và suất chiếu đã diễn ra
    UPDATE VE_XEM_PHIM
    SET TrangThai = 'Đã xem'
    WHERE TrangThai = 'Đã thanh toán' 
      AND MaSuatChieu IN (SELECT MaSuatChieu FROM SUAT_CHIEU WHERE TrangThai = 'Đã chiếu');

    -- 3.3. Hủy vé của những khách hàng "bùng" (Không thanh toán trước giờ chiếu)
    UPDATE VE_XEM_PHIM
    SET TrangThai = 'Hủy'
    WHERE TrangThai IN ('Đã đặt', 'Chờ thanh toán')
      AND MaSuatChieu IN (SELECT MaSuatChieu FROM SUAT_CHIEU WHERE GioBatDau < SYSTIMESTAMP);

    -- 3.4. Hủy luôn Đơn Hàng nếu toàn bộ vé bên trong đã bị Hủy
    UPDATE DON_HANG dh
    SET TrangThai = 'Hủy'
    WHERE TrangThai = 'Chờ thanh toán'
      AND NOT EXISTS (
          SELECT 1 FROM VE_XEM_PHIM v 
          WHERE v.MaDonHang = dh.MaDonHang AND v.TrangThai != 'Hủy'
      );
      -- Lưu toàn bộ thay đổi
    COMMIT;
    DBMS_OUTPUT.PUT_LINE('✅ Đã reset toàn bộ logic nghiệp vụ (Hạng, Kho, Trạng thái) thành công!');
END;
/
-- 1. Dọn dẹp sạch sẽ dữ liệu cũ của tất cả 59 phòng này để tránh lỗi trùng lặp khóa chính
DELETE FROM GHE WHERE MaPhong IN (
    'P001','P002','P003','P004','P005','P006',
    'PS001','PS002','PS003','PS004','PS005',
    'PX001','PX002','PX003','PX004','PX005','PX006','PX007','PX008','PX009','PX010',
    'PX011','PX012','PX013','PX014','PX015','PX016','PX017','PX018','PX019','PX020',
    'PX021','PX022','PX023','PX024','PX025','PX026','PX027','PX028','PX029','PX030',
    'PX031','PX032','PX033','PX034','PX035','PX036','PX037','PX038','PX039','PX040',
    'PX041','PX042','PX043','PX044','PX045','PX046','PX047','PX048'
);

-- 2. Sinh và chèn đồng loạt 2.360 ghế chuẩn (Sơ đồ 5 hàng x 8 cột)
INSERT INTO GHE (MaPhong, HangGhe, SoGhe, LoaiGhe)
SELECT 
    p.column_value AS MaPhong, 
    h.hang AS HangGhe, 
    s.stt AS SoGhe,
    CASE WHEN h.hang = 'E' THEN 'VIP' ELSE 'Thường' END AS LoaiGhe
FROM 
    -- Nguồn 1: Danh sách 59 mã phòng
    TABLE(sys.odcivarchar2list(
        'P001','P002','P003','P004','P005','P006',
        'PS001','PS002','PS003','PS004','PS005',
        'PX001','PX002','PX003','PX004','PX005','PX006','PX007','PX008','PX009','PX010',
        'PX011','PX012','PX013','PX014','PX015','PX016','PX017','PX018','PX019','PX020',
        'PX021','PX022','PX023','PX024','PX025','PX026','PX027','PX028','PX029','PX030',
        'PX031','PX032','PX033','PX034','PX035','PX036','PX037','PX038','PX039','PX040',
        'PX041','PX042','PX043','PX044','PX045','PX046','PX047','PX048'
    )) p,
    -- Nguồn 2: Khởi tạo 5 hàng ghế (A, B, C, D là Thường, E là VIP)
    (SELECT 'A' hang FROM DUAL UNION ALL 
     SELECT 'B' FROM DUAL UNION ALL 
     SELECT 'C' FROM DUAL UNION ALL 
     SELECT 'D' FROM DUAL UNION ALL 
     SELECT 'E' FROM DUAL) h,
    -- Nguồn 3: Khởi tạo số lượng 8 ghế cho mỗi hàng
    (SELECT LEVEL stt FROM DUAL CONNECT BY LEVEL <= 8) s;

-- 3. Chốt giao dịch (Xác nhận lưu dữ liệu)
COMMIT;
ALTER TRIGGER TRG_VE_CheckThanhToan DISABLE;
DROP TRIGGER TRG_VE_UPDATETONGTIEN_INSERT;
DROP TRIGGER TRG_VE_UPDATETONGTIEN_UPDATE;
DROP TRIGGER TRG_VE_UPDATETONGTIEN_DELETE;
CREATE OR REPLACE TRIGGER TRG_SYNC_DONHANG_VE
AFTER UPDATE OF TrangThai ON DON_HANG
FOR EACH ROW
WHEN (NEW.TrangThai = 'Đã thanh toán' AND OLD.TrangThai != 'Đã thanh toán')
BEGIN
    -- Chỉ cập nhật trạng thái vé, không đụng vào bảng DON_HANG nữa
    UPDATE VE_XEM_PHIM
    SET TrangThai = 'Đã thanh toán'
    WHERE MaDonHang = :NEW.MaDonHang;
END;
/
PROMPT ============= DATABASE MIGRATION COMPLETE! =============
SPOOL OFF;

-- Display migration summary
SET HEADING ON
SET PAGESIZE 20

PROMPT ========================================================================
PROMPT          ORACLE DATABASE OBJECTS SUMMARY
PROMPT ========================================================================

COLUMN object_type FORMAT A20;
COLUMN object_count FORMAT 9999;

SELECT 
    object_type,
    COUNT(*) as object_count
FROM user_objects
WHERE object_type IN ('TABLE', 'INDEX', 'PROCEDURE', 'FUNCTION', 'TRIGGER', 'VIEW')
GROUP BY object_type
ORDER BY object_type;

PROMPT ========================================================================
PROMPT          Table Structure Summary
PROMPT ========================================================================

COLUMN table_name FORMAT A30;
COLUMN column_count FORMAT 9999;

SELECT 
    table_name,
    COUNT(*) as column_count
FROM user_tab_columns
GROUP BY table_name
ORDER BY table_name;

PROMPT ========================================================================
PROMPT Migration Status: COMPLETED SUCCESSFULLY
PROMPT Database is ready for production use with all functions and triggers
PROMPT ========================================================================