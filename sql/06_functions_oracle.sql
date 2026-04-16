-- ORACLE VERSION: Functions for Movie Cinema Management
-- ============================================================================

-- 1. Function to evaluate movie performance (using CURSOR & LOOP)
CREATE OR REPLACE FUNCTION FUNC_DanhGiaHieuQuaPhim(p_MaPhim IN VARCHAR2) 
RETURN VARCHAR2
DETERMINISTIC
IS
    v_TongGheBan        NUMBER := 0;
    v_TongGheRap        NUMBER := 0;
    v_SoGheSuat         NUMBER;
    v_SucChuaPhong      NUMBER;
    v_TyLe              NUMBER;
    v_KetQua            VARCHAR2(50);
    
    CURSOR cur_suatchieu IS 
        SELECT 
            (SELECT COUNT(*) FROM VE_XEM_PHIM 
             WHERE MaSuatChieu = s.MaSuatChieu AND TrangThai <> 'Hủy') as sold_seats,
            pc.SucChua
        FROM SUAT_CHIEU s
        JOIN PHONG_CHIEU pc ON s.MaPhong = pc.MaPhong
        WHERE s.MaPhim = p_MaPhim AND s.TrangThai <> 'Hủy';
BEGIN
    -- Accumulate seat data
    FOR rec IN cur_suatchieu LOOP
        v_TongGheBan := v_TongGheBan + NVL(rec.sold_seats, 0);
        v_TongGheRap := v_TongGheRap + NVL(rec.SucChua, 0);
    END LOOP;
    
    -- Evaluate based on fill rate
    IF v_TongGheRap = 0 THEN
        RETURN 'Chưa có dữ liệu';
    ELSE
        v_TyLe := (v_TongGheBan / v_TongGheRap) * 100;
        
        IF v_TyLe >= 80 THEN
            v_KetQua := 'Rất Hot (' || ROUND(v_TyLe, 2) || '%)';
        ELSIF v_TyLe >= 50 THEN
            v_KetQua := 'Bình thường (' || ROUND(v_TyLe, 2) || '%)';
        ELSE
            v_KetQua := 'Cần cải thiện (' || ROUND(v_TyLe, 2) || '%)';
        END IF;
    END IF;
    
    RETURN v_KetQua;
END FUNC_DanhGiaHieuQuaPhim;
/

-- 2. Function to calculate ticket price with discount
CREATE OR REPLACE FUNCTION FUNC_TinhGiaVeVoiKhuyenMai(
    p_GiaGoc        IN NUMBER,
    p_MaKhuyenMai   IN VARCHAR2
)
RETURN NUMBER
DETERMINISTIC
IS
    v_PhanTramGiam  KHUYẾN_MÃI.PhanTramGiam%TYPE;
    v_GiaCuoi       NUMBER;
BEGIN
    -- Get discount percentage
    SELECT NVL(PhanTramGiam, 0) 
    INTO v_PhanTramGiam
    FROM KHUYẾN_MÃI 
    WHERE MaKhuyenMai = p_MaKhuyenMai 
    AND TRUNC(SYSDATE) BETWEEN NgayBatDau AND NgayKetThuc;

    -- Calculate final price
    v_GiaCuoi := p_GiaGoc * (1 - v_PhanTramGiam / 100);
    
    RETURN v_GiaCuoi;
END FUNC_TinhGiaVeVoiKhuyenMai;
/

-- 3. Function to get movie popularity score
CREATE OR REPLACE FUNCTION FUNC_DiemPhoBien(p_MaPhim IN VARCHAR2)
RETURN NUMBER
DETERMINISTIC
IS
    v_TongVe        NUMBER;
    v_DoanhThu      NUMBER;
    v_DiemPhoBien   NUMBER;
BEGIN
    -- Get total tickets sold
    SELECT COUNT(*) 
    INTO v_TongVe
    FROM VE_XEM_PHIM v
    JOIN SUAT_CHIEU s ON v.MaSuatChieu = s.MaSuatChieu
    WHERE s.MaPhim = p_MaPhim AND v.TrangThai IN ('Đã thanh toán', 'Đã xem');

    -- Get total revenue
    SELECT NVL(SUM(v.GiaVe), 0)
    INTO v_DoanhThu
    FROM VE_XEM_PHIM v
    JOIN SUAT_CHIEU s ON v.MaSuatChieu = s.MaSuatChieu
    WHERE s.MaPhim = p_MaPhim AND v.TrangThai IN ('Đã thanh toán', 'Đã xem');

    -- Calculate popularity score (weighted)
    v_DiemPhoBien := (v_TongVe * 0.4) + (v_DoanhThu * 0.6) / 100;
    
    RETURN ROUND(v_DiemPhoBien, 2);
END FUNC_DiemPhoBien;
/

-- 4. Function to calculate order total
CREATE OR REPLACE FUNCTION FUNC_TinhTongTienDonHang(p_MaDonHang IN VARCHAR2)
RETURN NUMBER
DETERMINISTIC
IS
    v_TongTien NUMBER := 0;
BEGIN
    -- Calculate from GOM (snacks/drinks)
    SELECT NVL(SUM(SoLuong * DonGia), 0)
    INTO v_TongTien
    FROM GOM
    WHERE MaDonHang = p_MaDonHang;
    
    -- Add from VE_XEM_PHIM (tickets)
    SELECT v_TongTien + NVL(SUM(GiaVe), 0)
    INTO v_TongTien
    FROM VE_XEM_PHIM
    WHERE MaDonHang = p_MaDonHang AND TrangThai IN ('Đã thanh toán', 'Đã xem');

    RETURN v_TongTien;
END FUNC_TinhTongTienDonHang;
/

-- 5. Function to get next screening day for a movie
CREATE OR REPLACE FUNCTION FUNC_NgayChieuTiepTheo(p_MaPhim IN VARCHAR2)
RETURN DATE
DETERMINISTIC
IS
    v_NgayChieu DATE;
BEGIN
    SELECT MIN(NgayChieu)
    INTO v_NgayChieu
    FROM SUAT_CHIEU
    WHERE MaPhim = p_MaPhim 
    AND NgayChieu >= TRUNC(SYSDATE)
    AND TrangThai <> 'Hủy';

    RETURN NVL(v_NgayChieu, NULL);
END FUNC_NgayChieuTiepTheo;
/

-- 6. Function to count available seats for a showtimes
CREATE OR REPLACE FUNCTION FUNC_SoGheTrong(p_MaSuatChieu IN VARCHAR2)
RETURN NUMBER
DETERMINISTIC
IS
    v_SoGheTrong NUMBER;
BEGIN
    SELECT COUNT(*)
    INTO v_SoGheTrong
    FROM GHE
    WHERE MaPhong = (SELECT MaPhong FROM SUAT_CHIEU WHERE MaSuatChieu = p_MaSuatChieu)
    AND TrangThai IN ('Trống', 'Có thể đặt');

    RETURN NVL(v_SoGheTrong, 0);
END FUNC_SoGheTrong;
/

-- 7. Function to format currency
CREATE OR REPLACE FUNCTION FUNC_FormatCurrency(p_GiaTri IN NUMBER)
RETURN VARCHAR2
DETERMINISTIC
IS
BEGIN
    RETURN TO_CHAR(p_GiaTri, 'FM9,999,999.00', 'NLS_NUMERIC_CHARACTERS=''.,''');
END FUNC_FormatCurrency;
/

-- 8. Function to calculate age group from DOB
CREATE OR REPLACE FUNCTION FUNC_NhomTuoi(p_NgaySinh IN DATE)
RETURN VARCHAR2
DETERMINISTIC
IS
    v_Tuoi NUMBER;
BEGIN
    v_Tuoi := TRUNC((SYSDATE - p_NgaySinh) / 365.25);
    
    IF v_Tuoi < 13 THEN
        RETURN 'Dưới 13';
    ELSIF v_Tuoi < 18 THEN
        RETURN '13-17';
    ELSIF v_Tuoi < 25 THEN
        RETURN '18-24';
    ELSIF v_Tuoi < 35 THEN
        RETURN '25-34';
    ELSIF v_Tuoi < 50 THEN
        RETURN '35-49';
    ELSE
        RETURN 'Từ 50+';
    END IF;
END FUNC_NhomTuoi;
/
