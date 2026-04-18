-- ORACLE VERSION: Stored Procedures for PHIM (Movie) Management
-- ============================================================================
set echo on;
-- 1. INSERT NEW MOVIE
CREATE OR REPLACE PROCEDURE SP_Insert_PHIM (
    p_MaPhim      IN PHIM.MaPhim%TYPE,
    p_TenPhim     IN PHIM.TenPhim%TYPE,
    p_ThoiLuong   IN PHIM.ThoiLuong%TYPE,
    p_NgonNgu     IN PHIM.NgonNgu%TYPE,
    p_QuocGia     IN PHIM.QuocGia%TYPE,
    p_DaoDien     IN PHIM.DaoDien%TYPE,
    p_DienVienChinh IN PHIM.DienVienChinh%TYPE,
    p_NgayKhoiChieu IN PHIM.NgayKhoiChieu%TYPE,
    p_MoTaNoiDung IN PHIM.MoTaNoiDung%TYPE,
    p_DoTuoi      IN PHIM.DoTuoi%TYPE,
    p_ChuDePhim   IN PHIM.ChuDePhim%TYPE
)
AS
    v_count NUMBER;
BEGIN
    -- Check if movie code already exists
    SELECT COUNT(*) INTO v_count FROM PHIM WHERE MaPhim = p_MaPhim;
    IF v_count > 0 THEN
        RAISE_APPLICATION_ERROR(-20001, 'Lỗi: Mã Phim đã tồn tại. Vui lòng chọn mã khác.');
    END IF;

    -- Validate duration > 0
    IF p_ThoiLuong <= 0 THEN
        RAISE_APPLICATION_ERROR(-20002, 'Lỗi: Thời lượng phim phải lớn hơn 0 phút.');
    END IF;

    -- Validate age >= 0
    IF p_DoTuoi < 0 THEN
        RAISE_APPLICATION_ERROR(-20003, 'Lỗi: Độ tuổi giới hạn phải lớn hơn hoặc bằng 0.');
    END IF;

    -- Validate movie name not empty
    IF p_TenPhim IS NULL OR TRIM(p_TenPhim) = '' THEN
        RAISE_APPLICATION_ERROR(-20004, 'Lỗi: Tên phim không được để trống.');
    END IF;

    INSERT INTO PHIM (MaPhim, TenPhim, ThoiLuong, NgonNgu, QuocGia, DaoDien, 
                      DienVienChinh, NgayKhoiChieu, MoTaNoiDung, DoTuoi, ChuDePhim)
    VALUES (p_MaPhim, p_TenPhim, p_ThoiLuong, p_NgonNgu, p_QuocGia, p_DaoDien,
            p_DienVienChinh, p_NgayKhoiChieu, p_MoTaNoiDung, p_DoTuoi, p_ChuDePhim);

    COMMIT;
END SP_Insert_PHIM;
/

-- 2. UPDATE EXISTING MOVIE
CREATE OR REPLACE PROCEDURE SP_Update_PHIM (
    p_MaPhim          IN PHIM.MaPhim%TYPE,
    p_TenPhim_New     IN PHIM.TenPhim%TYPE,
    p_ThoiLuong_New   IN PHIM.ThoiLuong%TYPE,
    p_NgonNgu_New     IN PHIM.NgonNgu%TYPE,
    p_QuocGia_New     IN PHIM.QuocGia%TYPE,
    p_DaoDien_New     IN PHIM.DaoDien%TYPE,
    p_DienVienChinh_New IN PHIM.DienVienChinh%TYPE,
    p_NgayKhoiChieu_New IN PHIM.NgayKhoiChieu%TYPE,
    p_MoTaNoiDung_New IN PHIM.MoTaNoiDung%TYPE,
    p_DoTuoi_New      IN PHIM.DoTuoi%TYPE,
    p_ChuDePhim_New   IN PHIM.ChuDePhim%TYPE
)
AS
    v_count NUMBER;
BEGIN
    -- Check if movie exists
    SELECT COUNT(*) INTO v_count FROM PHIM WHERE MaPhim = p_MaPhim;
    IF v_count = 0 THEN
        RAISE_APPLICATION_ERROR(-20005, 'Lỗi: Không tìm thấy Mã Phim cần cập nhật.');
    END IF;

    -- Validate duration > 0
    IF p_ThoiLuong_New <= 0 THEN
        RAISE_APPLICATION_ERROR(-20002, 'Lỗi: Thời lượng phim phải lớn hơn 0 phút.');
    END IF;

    -- Validate age >= 0
    IF p_DoTuoi_New < 0 THEN
        RAISE_APPLICATION_ERROR(-20003, 'Lỗi: Độ tuổi giới hạn phải lớn hơn hoặc bằng 0.');
    END IF;

    -- Validate movie name not empty
    IF p_TenPhim_New IS NULL OR TRIM(p_TenPhim_New) = '' THEN
        RAISE_APPLICATION_ERROR(-20004, 'Lỗi: Tên phim không được để trống.');
    END IF;

    UPDATE PHIM
    SET
        TenPhim = p_TenPhim_New,
        ThoiLuong = p_ThoiLuong_New,
        NgonNgu = p_NgonNgu_New,
        QuocGia = p_QuocGia_New,
        DaoDien = p_DaoDien_New,
        DienVienChinh = p_DienVienChinh_New,
        NgayKhoiChieu = p_NgayKhoiChieu_New,
        MoTaNoiDung = p_MoTaNoiDung_New,
        DoTuoi = p_DoTuoi_New,
        ChuDePhim = p_ChuDePhim_New
    WHERE MaPhim = p_MaPhim;

    COMMIT;
END SP_Update_PHIM;
/

-- 3. DELETE MOVIE
CREATE OR REPLACE PROCEDURE SP_Delete_PHIM (
    p_MaPhim IN PHIM.MaPhim%TYPE
)
AS
    v_count NUMBER;
BEGIN
    -- Check if movie exists
    SELECT COUNT(*) INTO v_count FROM PHIM WHERE MaPhim = p_MaPhim;
    IF v_count = 0 THEN
        RAISE_APPLICATION_ERROR(-20005, 'Lỗi: Không tìm thấy Mã Phim cần xóa.');
    END IF;

    -- Check for active screening schedules
    SELECT COUNT(*) INTO v_count FROM SUAT_CHIEU WHERE MaPhim = p_MaPhim AND TrangThai <> 'Hủy';
    IF v_count > 0 THEN
        RAISE_APPLICATION_ERROR(-20006, 'Lỗi: Không thể xóa phim có suất chiếu đang hoạt động.');
    END IF;

    DELETE FROM PHIM WHERE MaPhim = p_MaPhim;
    COMMIT;
END SP_Delete_PHIM;
/

-- 4. GET MOVIE BY CODE
CREATE OR REPLACE PROCEDURE SP_Get_PHIM_ByCode (
    p_MaPhim IN PHIM.MaPhim%TYPE,
    p_cursor OUT SYS_REFCURSOR
)
AS
BEGIN
    OPEN p_cursor FOR
    SELECT * FROM PHIM WHERE MaPhim = p_MaPhim;
END SP_Get_PHIM_ByCode;
/

-- 5. GET ALL MOVIES
CREATE OR REPLACE PROCEDURE SP_Get_All_PHIM (
    p_cursor OUT SYS_REFCURSOR
)
AS
BEGIN
    OPEN p_cursor FOR
    SELECT * FROM PHIM ORDER BY NgayKhoiChieu DESC;
END SP_Get_All_PHIM;
/

-- 6. SEARCH MOVIES BY NAME OR GENRE
CREATE OR REPLACE PROCEDURE SP_Search_PHIM (
    p_KeyWord IN VARCHAR2,
    p_cursor OUT SYS_REFCURSOR
)
AS
BEGIN
    OPEN p_cursor FOR
    SELECT * FROM PHIM 
    WHERE LOWER(TenPhim) LIKE LOWER('%' || p_KeyWord || '%') 
       OR LOWER(ChuDePhim) LIKE LOWER('%' || p_KeyWord || '%')
    ORDER BY NgayKhoiChieu DESC;
END SP_Search_PHIM;
/
