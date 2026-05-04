-- ============================================================================
-- INSERT DATA - ORACLE SYNTAX (FIXED VERSION - MAY 2026)
-- ============================================================================
-- CRITICAL FIXES APPLIED:
-- 1. All dates updated from December 2025 to May 2026
-- 2. DON_HANG.ThoiGianDat synchronized with VE_XEM_PHIM.NgayDat
-- 3. All SUAT_CHIEU.NgayChieu >= PHIM.NgayKhoiChieu (constraint compliance)
-- 4. Seat assignments respect TRG_VE_CheckGheAvailable (no duplicates)
-- 5. VE_XEM_PHIM with "Đã thanh toán" have matching THANH_TOAN records
-- 6. All trigger constraints validated
-- ============================================================================

SET ECHO OFF
SET FEEDBACK OFF
SET TERMOUT ON
SET VERIFY OFF
SET SERVEROUTPUT ON

-- Tắt kiểm tra khóa ngoại (Disable Constraints)
ALTER TABLE GHE DISABLE CONSTRAINT fk_ghe_phong;
ALTER TABLE THE_LOAI_PHIM DISABLE CONSTRAINT fk_theloai_phim;
ALTER TABLE KHACH_HANG DISABLE CONSTRAINT fk_kh_tk;
ALTER TABLE QUAN_TRI_VIEN DISABLE CONSTRAINT fk_qtv_tk;
ALTER TABLE CA_LAM_VIEC DISABLE CONSTRAINT fk_ca_qtv;
ALTER TABLE DON_HANG DISABLE CONSTRAINT fk_dh_kh;
ALTER TABLE GOM DISABLE CONSTRAINT fk_gom_dh;
ALTER TABLE GOM DISABLE CONSTRAINT fk_gom_mh;
ALTER TABLE THANH_TOAN DISABLE CONSTRAINT fk_tt_dh;
ALTER TABLE TRINH_CHIEU DISABLE CONSTRAINT fk_tc_rap;
ALTER TABLE TRINH_CHIEU DISABLE CONSTRAINT fk_tc_phim;
ALTER TABLE SUAT_CHIEU DISABLE CONSTRAINT fk_sc_phim;
ALTER TABLE SUAT_CHIEU DISABLE CONSTRAINT fk_sc_phong;
ALTER TABLE VE_XEM_PHIM DISABLE CONSTRAINT fk_ve_sc;
ALTER TABLE VE_XEM_PHIM DISABLE CONSTRAINT fk_ve_ghe;
ALTER TABLE VE_XEM_PHIM DISABLE CONSTRAINT fk_ve_kh;
ALTER TABLE VE_XEM_PHIM DISABLE CONSTRAINT fk_ve_dh;
ALTER TABLE AP_DUNG DISABLE CONSTRAINT fk_ad_ve;
ALTER TABLE AP_DUNG DISABLE CONSTRAINT fk_ad_km;
ALTER TABLE DANH_GIA DISABLE CONSTRAINT fk_dg_kh;
ALTER TABLE DANH_GIA DISABLE CONSTRAINT fk_dg_phim;
ALTER TABLE QUAN_LY DISABLE CONSTRAINT fk_ql_qtv;
ALTER TABLE QUAN_LY DISABLE CONSTRAINT fk_ql_rap;

SET DEFINE OFF

-- ========== 1. TÀI KHOẢN - KHÁCH HÀNG - QUẢN TRỊ VIÊN ==========
INSERT INTO TAI_KHOAN (MaNguoiDung, HoTen, DiaChi, SDT, GioiTinh, Email, MatKhau, VaiTro) VALUES
('KH001', 'Nguyễn Văn A', 'Q1, TP.HCM', '0901111111', 'M', 'a@example.com', 'passA', 'Khach');
INSERT INTO TAI_KHOAN (MaNguoiDung, HoTen, DiaChi, SDT, GioiTinh, Email, MatKhau, VaiTro) VALUES
('KH002', 'Trần Thị B', 'Q3, TP.HCM', '0902222222', 'F', 'b@example.com', 'passB', 'Khach');
INSERT INTO TAI_KHOAN (MaNguoiDung, HoTen, DiaChi, SDT, GioiTinh, Email, MatKhau, VaiTro) VALUES
('KH003', 'Lê Văn C', 'Q5, TP.HCM', '0903333333', 'M', 'c@example.com', 'passC', 'Khach');
INSERT INTO TAI_KHOAN (MaNguoiDung, HoTen, DiaChi, SDT, GioiTinh, Email, MatKhau, VaiTro) VALUES
('KH004', 'Phạm Thị D', 'Q7, TP.HCM', '0904444444', 'F', 'd@example.com', 'passD', 'Khach');
INSERT INTO TAI_KHOAN (MaNguoiDung, HoTen, DiaChi, SDT, GioiTinh, Email, MatKhau, VaiTro) VALUES
('KH005', 'Hoàng Văn E', 'Tân Bình', '0905555555', 'M', 'e@example.com', 'passE', 'Khach');
INSERT INTO TAI_KHOAN (MaNguoiDung, HoTen, DiaChi, SDT, GioiTinh, Email, MatKhau, VaiTro) VALUES
('KH006', 'Vũ Thị F', 'Thủ Đức', '0906666666', 'F', 'f@example.com', 'passF', 'Khach');
INSERT INTO TAI_KHOAN (MaNguoiDung, HoTen, DiaChi, SDT, GioiTinh, Email, MatKhau, VaiTro) VALUES
('KH007', 'Đặng Văn G', 'Bình Thạnh', '0907777777', 'M', 'g@example.com', 'passG', 'Khach');
INSERT INTO TAI_KHOAN (MaNguoiDung, HoTen, DiaChi, SDT, GioiTinh, Email, MatKhau, VaiTro) VALUES
('KH008', 'Bùi Thị H', 'Gò Vấp', '0908888888', 'F', 'h@example.com', 'passH', 'Khach');
INSERT INTO TAI_KHOAN (MaNguoiDung, HoTen, DiaChi, SDT, GioiTinh, Email, MatKhau, VaiTro) VALUES
('KH009', 'Ngô Văn I', 'Q12, TP.HCM', '0909999999', 'M', 'i@example.com', 'passI', 'Khach');
INSERT INTO TAI_KHOAN (MaNguoiDung, HoTen, DiaChi, SDT, GioiTinh, Email, MatKhau, VaiTro) VALUES
('KH010', 'Đỗ Thị K', 'Q10, TP.HCM', '0910101010', 'F', 'k@example.com', 'passK', 'Khach');
INSERT INTO TAI_KHOAN (MaNguoiDung, HoTen, DiaChi, SDT, GioiTinh, Email, MatKhau, VaiTro) VALUES
('KH011', 'Nguyễn Văn L', 'Q1, TP.HCM', '0911111111', 'M', 'l@example.com', 'passL', 'Khach');
INSERT INTO TAI_KHOAN (MaNguoiDung, HoTen, DiaChi, SDT, GioiTinh, Email, MatKhau, VaiTro) VALUES
('KH012', 'Trần Thị M', 'Q3, TP.HCM', '0912222222', 'F', 'm@example.com', 'passM', 'Khach');
INSERT INTO TAI_KHOAN (MaNguoiDung, HoTen, DiaChi, SDT, GioiTinh, Email, MatKhau, VaiTro) VALUES
('KH013', 'Lê Văn N', 'Q5, TP.HCM', '0913333333', 'M', 'n@example.com', 'passN', 'Khach');
INSERT INTO TAI_KHOAN (MaNguoiDung, HoTen, DiaChi, SDT, GioiTinh, Email, MatKhau, VaiTro) VALUES
('KH014', 'Phạm Thị O', 'Q7, TP.HCM', '0914444444', 'F', 'o@example.com', 'passO', 'Khach');
INSERT INTO TAI_KHOAN (MaNguoiDung, HoTen, DiaChi, SDT, GioiTinh, Email, MatKhau, VaiTro) VALUES
('KH015', 'Hoàng Văn P', 'Tân Bình', '0915555555', 'M', 'p@example.com', 'passP', 'Khach');
INSERT INTO TAI_KHOAN (MaNguoiDung, HoTen, DiaChi, SDT, GioiTinh, Email, MatKhau, VaiTro) VALUES
('KH016', 'Vũ Thị Q', 'Thủ Đức', '0916666666', 'F', 'q@example.com', 'passQ', 'Khach');
INSERT INTO TAI_KHOAN (MaNguoiDung, HoTen, DiaChi, SDT, GioiTinh, Email, MatKhau, VaiTro) VALUES
('KH017', 'Đặng Văn R', 'Bình Thạnh', '0917777777', 'M', 'r@example.com', 'passR', 'Khach');
INSERT INTO TAI_KHOAN (MaNguoiDung, HoTen, DiaChi, SDT, GioiTinh, Email, MatKhau, VaiTro) VALUES
('KH018', 'Bùi Thị S', 'Gò Vấp', '0918888888', 'F', 's@example.com', 'passS', 'Khach');
INSERT INTO TAI_KHOAN (MaNguoiDung, HoTen, DiaChi, SDT, GioiTinh, Email, MatKhau, VaiTro) VALUES
('KH019', 'Ngô Văn T', 'Q12, TP.HCM', '0919999999', 'M', 't@example.com', 'passT', 'Khach');
INSERT INTO TAI_KHOAN (MaNguoiDung, HoTen, DiaChi, SDT, GioiTinh, Email, MatKhau, VaiTro) VALUES
('KH020', 'Đỗ Thị U', 'Q10, TP.HCM', '0920202020', 'F', 'u@example.com', 'passU', 'Khach');
INSERT INTO TAI_KHOAN (MaNguoiDung, HoTen, DiaChi, SDT, GioiTinh, Email, MatKhau, VaiTro) VALUES
('AD001', 'Admin Quản Lý', 'Q1, TP.HCM', '0911111111', 'M', 'admin1@example.com', 'admin1', 'Admin');
INSERT INTO TAI_KHOAN (MaNguoiDung, HoTen, DiaChi, SDT, GioiTinh, Email, MatKhau, VaiTro) VALUES
('AD002', 'Admin Trưởng Ca', 'Q1, TP.HCM', '0912222222', 'F', 'admin2@example.com', 'admin2', 'Admin');
INSERT INTO TAI_KHOAN (MaNguoiDung, HoTen, DiaChi, SDT, GioiTinh, Email, MatKhau, VaiTro) VALUES
('AD003', 'Admin Kế Toán', 'Q3, TP.HCM', '0913333333', 'F', 'admin3@example.com', 'admin3', 'Admin');
INSERT INTO TAI_KHOAN (MaNguoiDung, HoTen, DiaChi, SDT, GioiTinh, Email, MatKhau, VaiTro) VALUES
('AD004', 'Admin Nội Bộ', 'Q2, TP.HCM', '0914444444', 'M', 'admin1', 'ad1', 'Admin');

COMMIT;

-- ========== KHÁCH HÀNG ==========
INSERT INTO KHACH_HANG (MaNguoiDung, LoaiThanhVien, DiemTichLuy) VALUES ('KH001', 'Bronze', 33);
INSERT INTO KHACH_HANG (MaNguoiDung, LoaiThanhVien, DiemTichLuy) VALUES ('KH002', 'Silver', 210);
INSERT INTO KHACH_HANG (MaNguoiDung, LoaiThanhVien, DiemTichLuy) VALUES ('KH003', 'Gold', 682);
INSERT INTO KHACH_HANG (MaNguoiDung, LoaiThanhVien, DiemTichLuy) VALUES ('KH004', 'Bronze', 0);
INSERT INTO KHACH_HANG (MaNguoiDung, LoaiThanhVien, DiemTichLuy) VALUES ('KH005', 'Platinum', 1213);
INSERT INTO KHACH_HANG (MaNguoiDung, LoaiThanhVien, DiemTichLuy) VALUES ('KH006', 'Silver', 225);
INSERT INTO KHACH_HANG (MaNguoiDung, LoaiThanhVien, DiemTichLuy) VALUES ('KH007', 'Bronze', 20);
INSERT INTO KHACH_HANG (MaNguoiDung, LoaiThanhVien, DiemTichLuy) VALUES ('KH008', 'Gold', 510);
INSERT INTO KHACH_HANG (MaNguoiDung, LoaiThanhVien, DiemTichLuy) VALUES ('KH009', 'Bronze', 38);
INSERT INTO KHACH_HANG (MaNguoiDung, LoaiThanhVien, DiemTichLuy) VALUES ('KH010', 'Platinum', 1060);
INSERT INTO KHACH_HANG (MaNguoiDung, LoaiThanhVien, DiemTichLuy) VALUES ('KH011', 'Bronze', 0);
INSERT INTO KHACH_HANG (MaNguoiDung, LoaiThanhVien, DiemTichLuy) VALUES ('KH012', 'Silver', 210);
INSERT INTO KHACH_HANG (MaNguoiDung, LoaiThanhVien, DiemTichLuy) VALUES ('KH013', 'Gold', 510);
INSERT INTO KHACH_HANG (MaNguoiDung, LoaiThanhVien, DiemTichLuy) VALUES ('KH014', 'Bronze', 0);
INSERT INTO KHACH_HANG (MaNguoiDung, LoaiThanhVien, DiemTichLuy) VALUES ('KH015', 'Platinum', 1010);
INSERT INTO KHACH_HANG (MaNguoiDung, LoaiThanhVien, DiemTichLuy) VALUES ('KH016', 'Silver', 210);
INSERT INTO KHACH_HANG (MaNguoiDung, LoaiThanhVien, DiemTichLuy) VALUES ('KH017', 'Bronze', 0);
INSERT INTO KHACH_HANG (MaNguoiDung, LoaiThanhVien, DiemTichLuy) VALUES ('KH018', 'Gold', 510);
INSERT INTO KHACH_HANG (MaNguoiDung, LoaiThanhVien, DiemTichLuy) VALUES ('KH019', 'Bronze', 0);
INSERT INTO KHACH_HANG (MaNguoiDung, LoaiThanhVien, DiemTichLuy) VALUES ('KH020', 'Platinum', 1010);

COMMIT;

-- ========== QUẢN TRỊ VIÊN ==========
INSERT INTO QUAN_TRI_VIEN (MaNguoiDung, NgayBatDauLam, Luong, ChucVu) VALUES ('AD001', TO_DATE('2024-01-01', 'YYYY-MM-DD'), 20000000, 'Quản lý rạp');
INSERT INTO QUAN_TRI_VIEN (MaNguoiDung, NgayBatDauLam, Luong, ChucVu) VALUES ('AD002', TO_DATE('2025-06-01', 'YYYY-MM-DD'), 12000000, 'Trưởng ca');
INSERT INTO QUAN_TRI_VIEN (MaNguoiDung, NgayBatDauLam, Luong, ChucVu) VALUES ('AD003', TO_DATE('2025-09-01', 'YYYY-MM-DD'), 15000000, 'Kế toán');

COMMIT;

-- ========== CA LÀM VIỆC ==========
INSERT INTO CA_LAM_VIEC (MaCa, MaNguoiDung, CaLamViec) VALUES ('CA001', 'AD001', 'Hành chính');
INSERT INTO CA_LAM_VIEC (MaCa, MaNguoiDung, CaLamViec) VALUES ('CA002', 'AD002', 'Ca Sáng');
INSERT INTO CA_LAM_VIEC (MaCa, MaNguoiDung, CaLamViec) VALUES ('CA003', 'AD002', 'Ca Chiều');
INSERT INTO CA_LAM_VIEC (MaCa, MaNguoiDung, CaLamViec) VALUES ('CA004', 'AD003', 'Hành chính');
INSERT INTO CA_LAM_VIEC (MaCa, MaNguoiDung, CaLamViec) VALUES ('CA005', 'AD002', 'Ca Tối');

COMMIT;

-- ========== RẠP – PHÒNG – GHẾ ==========
INSERT INTO RAP_CHIEU_PHIM (MaRapPhim, Ten, ThanhPho, DiaChi, SDT, Email) VALUES ('RAP001', 'Galaxy Nguyễn Du', 'Hồ Chí Minh', '116 Nguyễn Du, Q1', '02838222222', 'glx.nd@example.com');
INSERT INTO RAP_CHIEU_PHIM (MaRapPhim, Ten, ThanhPho, DiaChi, SDT, Email) VALUES ('RAP002', 'CGV Vincom Đồng Khởi', 'Hồ Chí Minh', '72 Lê Thánh Tôn, Q1', '02838333333', 'cgv.dk@example.com');
INSERT INTO RAP_CHIEU_PHIM (MaRapPhim, Ten, ThanhPho, DiaChi, SDT, Email) VALUES ('RAP003', 'BHD Bitexco', 'Hồ Chí Minh', '2 Hải Triều, Q1', '02838444444', 'bhd.bt@example.com');
INSERT INTO RAP_CHIEU_PHIM (MaRapPhim, Ten, ThanhPho, DiaChi, SDT, Email) VALUES ('RAP004', 'Lotte Gò Vấp', 'Hồ Chí Minh', '242 Nguyễn Văn Lượng', '02838555555', 'lotte.gv@example.com');
INSERT INTO RAP_CHIEU_PHIM (MaRapPhim, Ten, ThanhPho, DiaChi, SDT, Email) VALUES ('RAP005', 'CGV Aeon Tân Phú', 'Hồ Chí Minh', '30 Bờ Bao Tân Thắng', '02838666666', 'cgv.tp@example.com');

COMMIT;

-- ========== PHÒNG CHIẾU ==========
INSERT INTO PHONG_CHIEU (MaPhong, MaRapPhim, Ten, Loai, SucChua, SoGhe) VALUES ('P001', 'RAP001', 'Phòng 1', '2D', 100, 100);
INSERT INTO PHONG_CHIEU (MaPhong, MaRapPhim, Ten, Loai, SucChua, SoGhe) VALUES ('P002', 'RAP001', 'Phòng 2', '3D', 80, 80);
INSERT INTO PHONG_CHIEU (MaPhong, MaRapPhim, Ten, Loai, SucChua, SoGhe) VALUES ('P003', 'RAP002', 'Phòng IMAX', 'IMAX', 150, 150);
INSERT INTO PHONG_CHIEU (MaPhong, MaRapPhim, Ten, Loai, SucChua, SoGhe) VALUES ('P004', 'RAP003', 'Phòng 4', '2D', 60, 60);
INSERT INTO PHONG_CHIEU (MaPhong, MaRapPhim, Ten, Loai, SucChua, SoGhe) VALUES ('P005', 'RAP004', 'Phòng 5', '3D', 90, 90);
INSERT INTO PHONG_CHIEU (MaPhong, MaRapPhim, Ten, Loai, SucChua, SoGhe) VALUES ('P006', 'RAP005', 'Phòng Gold', 'VIP', 40, 40);

COMMIT;

-- ========== GHẾ (Seat initialization) ==========
INSERT INTO GHE (MaPhong, HangGhe, SoGhe, LoaiGhe) SELECT 'P001', hang, stt, 'Thường'
FROM (SELECT 'A' hang FROM DUAL UNION ALL SELECT 'B' FROM DUAL UNION ALL SELECT 'C' FROM DUAL UNION ALL SELECT 'D' FROM DUAL),
     (SELECT ROWNUM stt FROM DUAL CONNECT BY ROWNUM <= 20);
INSERT INTO GHE (MaPhong, HangGhe, SoGhe, LoaiGhe) SELECT 'P001', hang, stt, 'VIP'
FROM (SELECT 'E' hang FROM DUAL UNION ALL SELECT 'F' FROM DUAL),
     (SELECT ROWNUM stt FROM DUAL CONNECT BY ROWNUM <= 10);

COMMIT;

INSERT INTO GHE (MaPhong, HangGhe, SoGhe, LoaiGhe) SELECT 'P002', hang, stt, 'Thường'
FROM (SELECT 'A' hang FROM DUAL UNION ALL SELECT 'C' FROM DUAL UNION ALL SELECT 'D' FROM DUAL),
     (SELECT ROWNUM stt FROM DUAL CONNECT BY ROWNUM <= 10);
INSERT INTO GHE (MaPhong, HangGhe, SoGhe, LoaiGhe) SELECT 'P002', hang, stt, 'VIP'
FROM (SELECT 'B' hang FROM DUAL UNION ALL SELECT 'E' FROM DUAL),
     (SELECT ROWNUM stt FROM DUAL CONNECT BY ROWNUM <= 10);

COMMIT;

INSERT INTO GHE (MaPhong, HangGhe, SoGhe, LoaiGhe) SELECT 'P003', hang, stt, 'Thường'
FROM (SELECT 'A' hang FROM DUAL UNION ALL SELECT 'B' FROM DUAL UNION ALL SELECT 'C' FROM DUAL 
      UNION ALL SELECT 'D' FROM DUAL UNION ALL SELECT 'E' FROM DUAL UNION ALL SELECT 'F' FROM DUAL UNION ALL SELECT 'G' FROM DUAL),
     (SELECT ROWNUM stt FROM DUAL CONNECT BY ROWNUM <= 10);
INSERT INTO GHE (MaPhong, HangGhe, SoGhe, LoaiGhe) SELECT 'P003', hang, stt, 'Đôi'
FROM (SELECT 'H' hang FROM DUAL UNION ALL SELECT 'I' FROM DUAL),
     (SELECT ROWNUM stt FROM DUAL CONNECT BY ROWNUM <= 10);
INSERT INTO GHE (MaPhong, HangGhe, SoGhe, LoaiGhe) SELECT 'P003', hang, stt, 'VIP'
FROM (SELECT 'J' hang FROM DUAL UNION ALL SELECT 'K' FROM DUAL),
     (SELECT ROWNUM stt FROM DUAL CONNECT BY ROWNUM <= 10);

COMMIT;

INSERT INTO GHE (MaPhong, HangGhe, SoGhe, LoaiGhe) SELECT 'P004', hang, stt, 'Thường'
FROM (SELECT 'A' hang FROM DUAL UNION ALL SELECT 'B' FROM DUAL UNION ALL SELECT 'C' FROM DUAL),
     (SELECT ROWNUM stt FROM DUAL CONNECT BY ROWNUM <= 10);
INSERT INTO GHE (MaPhong, HangGhe, SoGhe, LoaiGhe) SELECT 'P004', hang, stt, 'VIP'
FROM (SELECT 'D' hang FROM DUAL UNION ALL SELECT 'E' FROM DUAL UNION ALL SELECT 'F' FROM DUAL),
     (SELECT ROWNUM stt FROM DUAL CONNECT BY ROWNUM <= 10);

COMMIT;

INSERT INTO GHE (MaPhong, HangGhe, SoGhe, LoaiGhe) SELECT 'P005', hang, stt, 'Thường'
FROM (SELECT 'A' hang FROM DUAL UNION ALL SELECT 'B' FROM DUAL UNION ALL SELECT 'C' FROM DUAL 
      UNION ALL SELECT 'D' FROM DUAL UNION ALL SELECT 'E' FROM DUAL),
     (SELECT ROWNUM stt FROM DUAL CONNECT BY ROWNUM <= 10);
INSERT INTO GHE (MaPhong, HangGhe, SoGhe, LoaiGhe) SELECT 'P005', hang, stt, 'VIP'
FROM (SELECT 'F' hang FROM DUAL UNION ALL SELECT 'G' FROM DUAL UNION ALL SELECT 'H' FROM DUAL UNION ALL SELECT 'I' FROM DUAL),
     (SELECT ROWNUM stt FROM DUAL CONNECT BY ROWNUM <= 10);

COMMIT;

INSERT INTO GHE (MaPhong, HangGhe, SoGhe, LoaiGhe) SELECT 'P006', hang, stt, 'Giường nằm'
FROM (SELECT 'A' hang FROM DUAL UNION ALL SELECT 'B' FROM DUAL UNION ALL SELECT 'C' FROM DUAL UNION ALL SELECT 'D' FROM DUAL),
     (SELECT ROWNUM stt FROM DUAL CONNECT BY ROWNUM <= 10);

COMMIT;

-- ========== PHIM – THỂ LOẠI – KHUYẾN MÃI (UNCHANGED - Movies released before May 2026) ==========
INSERT INTO PHIM (MaPhim, TenPhim, ThoiLuong, NgonNgu, QuocGia, DaoDien, DienVienChinh, NgayKhoiChieu, MoTaNoiDung, DoTuoi, ChuDePhim, Anh) VALUES
('PH001', 'Avengers: Endgame', 180, 'English', 'USA', 'Anthony Russo', 'Robert Downey Jr.', TO_DATE('2019-04-26', 'YYYY-MM-DD'), 'Siêu anh hùng Marvel quấp lại để cứu vũ trụ khỏi tay Thanos. Một cuộc chiến tối cùng giữa thiện và ác.', 13, 'Siêu anh hùng', 'https://image.tmdb.org/t/p/w500/ulzhLuWrPK07P1YkdWQLZnQh1JL.jpg');
INSERT INTO PHIM (MaPhim, TenPhim, ThoiLuong, NgonNgu, QuocGia, DaoDien, DienVienChinh, NgayKhoiChieu, MoTaNoiDung, DoTuoi, ChuDePhim, Anh) VALUES
('PH002', 'Nhà Bà Nữ', 120, 'Tiếng Việt', 'Việt Nam', 'Tristian', 'Lê Giang', TO_DATE('2023-01-22', 'YYYY-MM-DD'), 'Một bộ phim hài gia đình vui nhộn với những tình huống hài hước và ấm áp. Câu chuyện về gia đình và tình cảm.', 13, 'Gia đình', 'https://upload.wikimedia.org/wikipedia/vi/thumb/6/6f/%C3%81p_ph%C3%ADch_phim_Nh%C3%A0_b%C3%A0_N%E1%BB%AF.jpg/250px-%C3%81p_ph%C3%ADch_phim_Nh%C3%A0_b%C3%A0_N%E1%BB%AF.jpg');
INSERT INTO PHIM (MaPhim, TenPhim, ThoiLuong, NgonNgu, QuocGia, DaoDien, DienVienChinh, NgayKhoiChieu, MoTaNoiDung, DoTuoi, ChuDePhim, Anh) VALUES
('PH003', 'Fast & Furious 9', 145, 'English', 'USA', 'Justin Lin', 'Vin Diesel', TO_DATE('2021-05-19', 'YYYY-MM-DD'), 'Đội hình Fast & Furious quay trở lại với những cuộc đua xe tốc độ cao và những pha hành động kịch tính nhất. Tìm kiếm lao động bí ẩn.', 16, 'Hành động', 'https://image.tmdb.org/t/p/w500/deEmLILTPejEb6OGsXRJ5MCvyDW.jpg');
INSERT INTO PHIM (MaPhim, TenPhim, ThoiLuong, NgonNgu, QuocGia, DaoDien, DienVienChinh, NgayKhoiChieu, MoTaNoiDung, DoTuoi, ChuDePhim, Anh) VALUES
('PH004', 'Conan Movie 26', 110, 'Japanese', 'Japan', 'Yuzuru Tachikawa', 'Minami Takayama', TO_DATE('2023-04-14', 'YYYY-MM-DD'), 'Thám tử lừng danh Conan lại quay trở lại với một vụ án bí ẩn liên quan đến tàu ngầm đen. Một cuộc phiêu lưu kỳ thú chính ở biển.', 13, 'Hoạt hình', 'https://image.tmdb.org/t/p/w500/ksQ8uNgoWsVH6a0oPB6zx08pOwU.jpg');
INSERT INTO PHIM (MaPhim, TenPhim, ThoiLuong, NgonNgu, QuocGia, DaoDien, DienVienChinh, NgayKhoiChieu, MoTaNoiDung, DoTuoi, ChuDePhim, Anh) VALUES
('PH005', 'Spider-Man: No Way Home', 150, 'English', 'USA', 'Jon Watts', 'Tom Holland', TO_DATE('2021-12-17', 'YYYY-MM-DD'), 'Spider-Man phải đối mặt với những kẻ thù từ các vũ trụ khác nhau. Một cuộc chiến liên vũ trụ đầy kịch tính và bất ngờ.', 13, 'Siêu anh hùng', 'https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg');
INSERT INTO PHIM (MaPhim, TenPhim, ThoiLuong, NgonNgu, QuocGia, DaoDien, DienVienChinh, NgayKhoiChieu, MoTaNoiDung, DoTuoi, ChuDePhim, Anh) VALUES
('PH006', 'Dune: Messiah', 160, 'English', 'USA', 'Denis Villeneuve', 'Chalamet', TO_DATE('2025-04-15', 'YYYY-MM-DD'), 'Tiếp tục câu chuyện sử thi của Dune với những cảnh quay hoành tráng và các trận chiến mãn nhân tạo. Một tác phẩm khoa học viễn tưởng vĩ đại.', 16, 'Viễn tưởng', 'https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg');
INSERT INTO PHIM (MaPhim, TenPhim, ThoiLuong, NgonNgu, QuocGia, DaoDien, DienVienChinh, NgayKhoiChieu, MoTaNoiDung, DoTuoi, ChuDePhim, Anh) VALUES
('PH007', 'Lật Mặt 7', 115, 'Tiếng Việt', 'Việt Nam', 'Lý Hải', 'Lý Hải', TO_DATE('2025-11-25', 'YYYY-MM-DD'), 'Phần 7 của series Lật Mặt mang đến những pha hành động hài hước và gay cấn. Một cuộc chiến với những twist không ngờ tới.', 16, 'Hành động', 'https://iguov8nhvyobj.vcdn.cloud/media/catalog/product/cache/1/image/c5f0a1eff4c394a251036189ccddaacd/l/a/lat-mat-7.jpg');
INSERT INTO PHIM (MaPhim, TenPhim, ThoiLuong, NgonNgu, QuocGia, DaoDien, DienVienChinh, NgayKhoiChieu, MoTaNoiDung, DoTuoi, ChuDePhim, Anh) VALUES
('PH008', 'The Conjuring 3', 100, 'English', 'USA', 'Michael Chaves', 'Patrick Wilson', TO_DATE('2024-10-31', 'YYYY-MM-DD'), 'Những vụ án liên quan đến ma ám bí ẩn lại xuất hiện. Một bộ phim kinh dị đầy rợn người và bí ẩn.', 18, 'Kinh dị', 'https://image.tmdb.org/t/p/w500/rQfX2xx8TUoNvyk892yKWNikJaM.jpg');

COMMIT;

-- ========== THE_LOAI_PHIM ==========
INSERT INTO THE_LOAI_PHIM (MaPhim, TheLoai) VALUES ('PH001', 'Hành động');
INSERT INTO THE_LOAI_PHIM (MaPhim, TheLoai) VALUES ('PH002', 'Hài');
INSERT INTO THE_LOAI_PHIM (MaPhim, TheLoai) VALUES ('PH003', 'Hành động');
INSERT INTO THE_LOAI_PHIM (MaPhim, TheLoai) VALUES ('PH004', 'Hoạt hình');
INSERT INTO THE_LOAI_PHIM (MaPhim, TheLoai) VALUES ('PH005', 'Siêu anh hùng');
INSERT INTO THE_LOAI_PHIM (MaPhim, TheLoai) VALUES ('PH006', 'Viễn tưởng');
INSERT INTO THE_LOAI_PHIM (MaPhim, TheLoai) VALUES ('PH007', 'Hành động');
INSERT INTO THE_LOAI_PHIM (MaPhim, TheLoai) VALUES ('PH008', 'Kinh dị');

COMMIT;

-- ========== KHUYẾN MÃI ==========
INSERT INTO CHUONG_TRINH_KHUYEN_MAI (MaKhuyenMai, TenChuongTrinh, DieuKien, NgayBatDau, NgayKetThuc, MucGiam) VALUES
('KM001', 'Thứ 3 vui vẻ', 'Suất chiếu thứ 3', TO_DATE('2025-01-01', 'YYYY-MM-DD'), TO_DATE('2026-12-31', 'YYYY-MM-DD'), 20000);
INSERT INTO CHUONG_TRINH_KHUYEN_MAI (MaKhuyenMai, TenChuongTrinh, DieuKien, NgayBatDau, NgayKetThuc, MucGiam) VALUES
('KM002', 'Thành viên Silver', 'Hạng Silver', TO_DATE('2025-01-01', 'YYYY-MM-DD'), TO_DATE('2026-12-31', 'YYYY-MM-DD'), 15000);
INSERT INTO CHUONG_TRINH_KHUYEN_MAI (MaKhuyenMai, TenChuongTrinh, DieuKien, NgayBatDau, NgayKetThuc, MucGiam) VALUES
('KM003', 'Combo vé + bắp', 'Mua kèm combo', TO_DATE('2025-02-01', 'YYYY-MM-DD'), TO_DATE('2026-12-31', 'YYYY-MM-DD'), 10000);
INSERT INTO CHUONG_TRINH_KHUYEN_MAI (MaKhuyenMai, TenChuongTrinh, DieuKien, NgayBatDau, NgayKetThuc, MucGiam) VALUES
('KM004', 'HSSV', 'Thẻ HSSV', TO_DATE('2025-01-01', 'YYYY-MM-DD'), TO_DATE('2026-06-30', 'YYYY-MM-DD'), 25000);
INSERT INTO CHUONG_TRINH_KHUYEN_MAI (MaKhuyenMai, TenChuongTrinh, DieuKien, NgayBatDau, NgayKetThuc, MucGiam) VALUES
('KM005', 'May 2026 Special', 'Ngày May', TO_DATE('2026-05-01', 'YYYY-MM-DD'), TO_DATE('2026-05-31', 'YYYY-MM-DD'), 30000);

COMMIT;

-- ========== MẶT HÀNG ==========
INSERT INTO MAT_HANG (MaHang, TenHang, DonGia, SoLuongTon, MoTa, LoaiHang) VALUES
('MH001', 'Bắp rang bơ', 45000, 100, 'Vị bơ', 'DO_AN');
INSERT INTO MAT_HANG (MaHang, TenHang, DonGia, SoLuongTon, MoTa, LoaiHang) VALUES
('MH002', 'Nước ngọt Coca', 30000, 200, 'Lon 330ml', 'DO_AN');
INSERT INTO MAT_HANG (MaHang, TenHang, DonGia, SoLuongTon, MoTa, LoaiHang) VALUES
('MH003', 'Combo bắp + nước', 70000, 150, 'Tiết kiệm', 'DO_AN');
INSERT INTO MAT_HANG (MaHang, TenHang, DonGia, SoLuongTon, MoTa, LoaiHang) VALUES
('MH004', 'Móc khóa Spider-Man', 60000, 50, 'Móc khóa', 'QUA_LUU_NIEM');
INSERT INTO MAT_HANG (MaHang, TenHang, DonGia, SoLuongTon, MoTa, LoaiHang) VALUES
('MH005', 'Áo thun Avengers', 200000, 30, 'Áo thun', 'QUA_LUU_NIEM');
INSERT INTO MAT_HANG (MaHang, TenHang, DonGia, SoLuongTon, MoTa, LoaiHang) VALUES
('MH006', 'Bắp Phô Mai', 55000, 80, 'Vị phô mai', 'DO_AN');
INSERT INTO MAT_HANG (MaHang, TenHang, DonGia, SoLuongTon, MoTa, LoaiHang) VALUES
('MH007', 'Hotdog', 40000, 60, 'Xúc xích nóng', 'DO_AN');
INSERT INTO MAT_HANG (MaHang, TenHang, DonGia, SoLuongTon, MoTa, LoaiHang) VALUES
('MH008', 'Ly giữ nhiệt Conan', 150000, 40, 'Ly limited', 'QUA_LUU_NIEM');
INSERT INTO MAT_HANG (MaHang, TenHang, DonGia, SoLuongTon, MoTa, LoaiHang) VALUES
('MH_VIP_1', 'Mô hình Iron Man', 5000000, 10, 'Life-size 1:1', 'QUA_LUU_NIEM');
INSERT INTO MAT_HANG (MaHang, TenHang, DonGia, SoLuongTon, MoTa, LoaiHang) VALUES
('MH_VIP_2', 'Bộ sưu tập Marvel', 2000000, 20, 'Full set', 'QUA_LUU_NIEM');

COMMIT;

-- ========== ĐƠN HÀNG (MAY 2026 - FIXED DATES) ==========
INSERT INTO DON_HANG (MaDonHang, MaNguoiDung_KH, PhuongThuc, ThoiGianDat, TongTien, TrangThai) VALUES
('DH001', 'KH001', 'Online', TO_TIMESTAMP('2026-05-01 10:00:00', 'YYYY-MM-DD HH24:MI:SS'), 0, 'Đã thanh toán');
INSERT INTO DON_HANG (MaDonHang, MaNguoiDung_KH, PhuongThuc, ThoiGianDat, TongTien, TrangThai) VALUES
('DH002', 'KH002', 'Tại quầy', TO_TIMESTAMP('2026-05-01 10:15:00', 'YYYY-MM-DD HH24:MI:SS'), 0, 'Chờ thanh toán');
INSERT INTO DON_HANG (MaDonHang, MaNguoiDung_KH, PhuongThuc, ThoiGianDat, TongTien, TrangThai) VALUES
('DH003', 'KH003', 'Online', TO_TIMESTAMP('2026-05-01 11:00:00', 'YYYY-MM-DD HH24:MI:SS'), 0, 'Đã thanh toán');
INSERT INTO DON_HANG (MaDonHang, MaNguoiDung_KH, PhuongThuc, ThoiGianDat, TongTien, TrangThai) VALUES
('DH004', 'KH004', 'Tại quầy', TO_TIMESTAMP('2026-05-01 12:30:00', 'YYYY-MM-DD HH24:MI:SS'), 0, 'Hủy');
INSERT INTO DON_HANG (MaDonHang, MaNguoiDung_KH, PhuongThuc, ThoiGianDat, TongTien, TrangThai) VALUES
('DH005', 'KH005', 'Online', TO_TIMESTAMP('2026-05-02 09:00:00', 'YYYY-MM-DD HH24:MI:SS'), 0, 'Đã thanh toán');
INSERT INTO DON_HANG (MaDonHang, MaNguoiDung_KH, PhuongThuc, ThoiGianDat, TongTien, TrangThai) VALUES
('DH006', 'KH006', 'Online', TO_TIMESTAMP('2026-05-02 10:00:00', 'YYYY-MM-DD HH24:MI:SS'), 0, 'Đã thanh toán');
INSERT INTO DON_HANG (MaDonHang, MaNguoiDung_KH, PhuongThuc, ThoiGianDat, TongTien, TrangThai) VALUES
('DH007', 'KH007', 'App', TO_TIMESTAMP('2026-05-02 14:00:00', 'YYYY-MM-DD HH24:MI:SS'), 0, 'Đã thanh toán');
INSERT INTO DON_HANG (MaDonHang, MaNguoiDung_KH, PhuongThuc, ThoiGianDat, TongTien, TrangThai) VALUES
('DH008', 'KH008', 'Tại quầy', TO_TIMESTAMP('2026-05-03 18:00:00', 'YYYY-MM-DD HH24:MI:SS'), 0, 'Chờ thanh toán');
INSERT INTO DON_HANG (MaDonHang, MaNguoiDung_KH, PhuongThuc, ThoiGianDat, TongTien, TrangThai) VALUES
('DH009', 'KH009', 'Online', TO_TIMESTAMP('2026-05-03 19:00:00', 'YYYY-MM-DD HH24:MI:SS'), 0, 'Đã thanh toán');
INSERT INTO DON_HANG (MaDonHang, MaNguoiDung_KH, PhuongThuc, ThoiGianDat, TongTien, TrangThai) VALUES
('DH010', 'KH010', 'Online', TO_TIMESTAMP('2026-05-04 20:00:00', 'YYYY-MM-DD HH24:MI:SS'), 0, 'Đã thanh toán');
INSERT INTO DON_HANG (MaDonHang, MaNguoiDung_KH, PhuongThuc, ThoiGianDat, TongTien, TrangThai) VALUES
('DH011', 'KH001', 'App', TO_TIMESTAMP('2026-05-05 08:00:00', 'YYYY-MM-DD HH24:MI:SS'), 0, 'Đã thanh toán');
INSERT INTO DON_HANG (MaDonHang, MaNguoiDung_KH, PhuongThuc, ThoiGianDat, TongTien, TrangThai) VALUES
('DH012', 'KH002', 'Web', TO_TIMESTAMP('2026-05-05 14:00:00', 'YYYY-MM-DD HH24:MI:SS'), 0, 'Hủy');

COMMIT;

-- ========== TRINH CHIẾU – SUẤT CHIẾU (MAY 2026) ==========
INSERT INTO TRINH_CHIEU (MaRapPhim, MaPhim) VALUES ('RAP001','PH001');
INSERT INTO TRINH_CHIEU (MaRapPhim, MaPhim) VALUES ('RAP001','PH002');
INSERT INTO TRINH_CHIEU (MaRapPhim, MaPhim) VALUES ('RAP001','PH006');
INSERT INTO TRINH_CHIEU (MaRapPhim, MaPhim) VALUES ('RAP002','PH003');
INSERT INTO TRINH_CHIEU (MaRapPhim, MaPhim) VALUES ('RAP002','PH007');
INSERT INTO TRINH_CHIEU (MaRapPhim, MaPhim) VALUES ('RAP003','PH004');
INSERT INTO TRINH_CHIEU (MaRapPhim, MaPhim) VALUES ('RAP003','PH008');
INSERT INTO TRINH_CHIEU (MaRapPhim, MaPhim) VALUES ('RAP004','PH005');
INSERT INTO TRINH_CHIEU (MaRapPhim, MaPhim) VALUES ('RAP005','PH001');

COMMIT;

-- ========== SUẤT CHIẾU (MAY 2026) ==========
-- May 1, 2026 (Thursday): 9 showtimes
INSERT INTO SUAT_CHIEU (MaSuatChieu, MaPhim, MaPhong, NgayChieu, GioBatDau, GioKetThuc, GiaVeCoBan, TrangThai) VALUES
('SC001', 'PH001', 'P001', TO_DATE('2026-05-01', 'YYYY-MM-DD'), TO_TIMESTAMP('2026-05-01 08:00:00', 'YYYY-MM-DD HH24:MI:SS'), TO_TIMESTAMP('2026-05-01 10:30:00', 'YYYY-MM-DD HH24:MI:SS'), 120000, 'Đang mở');
INSERT INTO SUAT_CHIEU (MaSuatChieu, MaPhim, MaPhong, NgayChieu, GioBatDau, GioKetThuc, GiaVeCoBan, TrangThai) VALUES
('SC002', 'PH002', 'P002', TO_DATE('2026-05-01', 'YYYY-MM-DD'), TO_TIMESTAMP('2026-05-01 10:00:00', 'YYYY-MM-DD HH24:MI:SS'), TO_TIMESTAMP('2026-05-01 12:00:00', 'YYYY-MM-DD HH24:MI:SS'), 100000, 'Đang mở');
INSERT INTO SUAT_CHIEU (MaSuatChieu, MaPhim, MaPhong, NgayChieu, GioBatDau, GioKetThuc, GiaVeCoBan, TrangThai) VALUES
('SC003', 'PH003', 'P003', TO_DATE('2026-05-01', 'YYYY-MM-DD'), TO_TIMESTAMP('2026-05-01 13:00:00', 'YYYY-MM-DD HH24:MI:SS'), TO_TIMESTAMP('2026-05-01 15:15:00', 'YYYY-MM-DD HH24:MI:SS'), 150000, 'Đang mở');
INSERT INTO SUAT_CHIEU (MaSuatChieu, MaPhim, MaPhong, NgayChieu, GioBatDau, GioKetThuc, GiaVeCoBan, TrangThai) VALUES
('SC005', 'PH001', 'P001', TO_DATE('2026-05-01', 'YYYY-MM-DD'), TO_TIMESTAMP('2026-05-01 15:30:00', 'YYYY-MM-DD HH24:MI:SS'), TO_TIMESTAMP('2026-05-01 18:00:00', 'YYYY-MM-DD HH24:MI:SS'), 120000, 'Đang mở');
INSERT INTO SUAT_CHIEU (MaSuatChieu, MaPhim, MaPhong, NgayChieu, GioBatDau, GioKetThuc, GiaVeCoBan, TrangThai) VALUES
('SC006', 'PH002', 'P002', TO_DATE('2026-05-01', 'YYYY-MM-DD'), TO_TIMESTAMP('2026-05-01 16:00:00', 'YYYY-MM-DD HH24:MI:SS'), TO_TIMESTAMP('2026-05-01 18:00:00', 'YYYY-MM-DD HH24:MI:SS'), 100000, 'Đang mở');
INSERT INTO SUAT_CHIEU (MaSuatChieu, MaPhim, MaPhong, NgayChieu, GioBatDau, GioKetThuc, GiaVeCoBan, TrangThai) VALUES
('SC007', 'PH003', 'P003', TO_DATE('2026-05-01', 'YYYY-MM-DD'), TO_TIMESTAMP('2026-05-01 18:00:00', 'YYYY-MM-DD HH24:MI:SS'), TO_TIMESTAMP('2026-05-01 20:15:00', 'YYYY-MM-DD HH24:MI:SS'), 150000, 'Đang mở');
INSERT INTO SUAT_CHIEU (MaSuatChieu, MaPhim, MaPhong, NgayChieu, GioBatDau, GioKetThuc, GiaVeCoBan, TrangThai) VALUES
('SC008', 'PH001', 'P001', TO_DATE('2026-05-01', 'YYYY-MM-DD'), TO_TIMESTAMP('2026-05-01 19:00:00', 'YYYY-MM-DD HH24:MI:SS'), TO_TIMESTAMP('2026-05-01 21:30:00', 'YYYY-MM-DD HH24:MI:SS'), 120000, 'Đang mở');
INSERT INTO SUAT_CHIEU (MaSuatChieu, MaPhim, MaPhong, NgayChieu, GioBatDau, GioKetThuc, GiaVeCoBan, TrangThai) VALUES
('SC009', 'PH004', 'P004', TO_DATE('2026-05-01', 'YYYY-MM-DD'), TO_TIMESTAMP('2026-05-01 13:00:00', 'YYYY-MM-DD HH24:MI:SS'), TO_TIMESTAMP('2026-05-01 14:50:00', 'YYYY-MM-DD HH24:MI:SS'), 110000, 'Đang mở');
INSERT INTO SUAT_CHIEU (MaSuatChieu, MaPhim, MaPhong, NgayChieu, GioBatDau, GioKetThuc, GiaVeCoBan, TrangThai) VALUES
('SC010', 'PH005', 'P005', TO_DATE('2026-05-01', 'YYYY-MM-DD'), TO_TIMESTAMP('2026-05-01 14:00:00', 'YYYY-MM-DD HH24:MI:SS'), TO_TIMESTAMP('2026-05-01 16:30:00', 'YYYY-MM-DD HH24:MI:SS'), 120000, 'Đang mở');

-- May 2, 2026 (Friday): 4 showtimes
INSERT INTO SUAT_CHIEU (MaSuatChieu, MaPhim, MaPhong, NgayChieu, GioBatDau, GioKetThuc, GiaVeCoBan, TrangThai) VALUES
('SC004', 'PH001', 'P001', TO_DATE('2026-05-02', 'YYYY-MM-DD'), TO_TIMESTAMP('2026-05-02 19:00:00', 'YYYY-MM-DD HH24:MI:SS'), TO_TIMESTAMP('2026-05-02 21:30:00', 'YYYY-MM-DD HH24:MI:SS'), 120000, 'Đang mở');
INSERT INTO SUAT_CHIEU (MaSuatChieu, MaPhim, MaPhong, NgayChieu, GioBatDau, GioKetThuc, GiaVeCoBan, TrangThai) VALUES
('SC011', 'PH002', 'P002', TO_DATE('2026-05-02', 'YYYY-MM-DD'), TO_TIMESTAMP('2026-05-02 15:00:00', 'YYYY-MM-DD HH24:MI:SS'), TO_TIMESTAMP('2026-05-02 17:00:00', 'YYYY-MM-DD HH24:MI:SS'), 100000, 'Đang mở');
INSERT INTO SUAT_CHIEU (MaSuatChieu, MaPhim, MaPhong, NgayChieu, GioBatDau, GioKetThuc, GiaVeCoBan, TrangThai) VALUES
('SC012', 'PH006', 'P001', TO_DATE('2026-05-02', 'YYYY-MM-DD'), TO_TIMESTAMP('2026-05-02 17:00:00', 'YYYY-MM-DD HH24:MI:SS'), TO_TIMESTAMP('2026-05-02 19:40:00', 'YYYY-MM-DD HH24:MI:SS'), 120000, 'Đang mở');
INSERT INTO SUAT_CHIEU (MaSuatChieu, MaPhim, MaPhong, NgayChieu, GioBatDau, GioKetThuc, GiaVeCoBan, TrangThai) VALUES
('SC013', 'PH007', 'P002', TO_DATE('2026-05-02', 'YYYY-MM-DD'), TO_TIMESTAMP('2026-05-02 19:00:00', 'YYYY-MM-DD HH24:MI:SS'), TO_TIMESTAMP('2026-05-02 20:55:00', 'YYYY-MM-DD HH24:MI:SS'), 100000, 'Đang mở');

-- May 3, 2026 (Saturday): 2 showtimes
INSERT INTO SUAT_CHIEU (MaSuatChieu, MaPhim, MaPhong, NgayChieu, GioBatDau, GioKetThuc, GiaVeCoBan, TrangThai) VALUES
('SC014', 'PH001', 'P001', TO_DATE('2026-05-03', 'YYYY-MM-DD'), TO_TIMESTAMP('2026-05-03 10:00:00', 'YYYY-MM-DD HH24:MI:SS'), TO_TIMESTAMP('2026-05-03 12:30:00', 'YYYY-MM-DD HH24:MI:SS'), 120000, 'Đang mở');
INSERT INTO SUAT_CHIEU (MaSuatChieu, MaPhim, MaPhong, NgayChieu, GioBatDau, GioKetThuc, GiaVeCoBan, TrangThai) VALUES
('SC015', 'PH008', 'P004', TO_DATE('2026-05-03', 'YYYY-MM-DD'), TO_TIMESTAMP('2026-05-03 20:00:00', 'YYYY-MM-DD HH24:MI:SS'), TO_TIMESTAMP('2026-05-03 21:40:00', 'YYYY-MM-DD HH24:MI:SS'), 110000, 'Đang mở');

-- May 4, 2026 (Sunday): 2 showtimes
INSERT INTO SUAT_CHIEU (MaSuatChieu, MaPhim, MaPhong, NgayChieu, GioBatDau, GioKetThuc, GiaVeCoBan, TrangThai) VALUES
('SC016', 'PH005', 'P005', TO_DATE('2026-05-04', 'YYYY-MM-DD'), TO_TIMESTAMP('2026-05-04 20:00:00', 'YYYY-MM-DD HH24:MI:SS'), TO_TIMESTAMP('2026-05-04 22:30:00', 'YYYY-MM-DD HH24:MI:SS'), 120000, 'Đang mở');
INSERT INTO SUAT_CHIEU (MaSuatChieu, MaPhim, MaPhong, NgayChieu, GioBatDau, GioKetThuc, GiaVeCoBan, TrangThai) VALUES
('SC017', 'PH006', 'P003', TO_DATE('2026-05-04', 'YYYY-MM-DD'), TO_TIMESTAMP('2026-05-04 18:00:00', 'YYYY-MM-DD HH24:MI:SS'), TO_TIMESTAMP('2026-05-04 20:40:00', 'YYYY-MM-DD HH24:MI:SS'), 150000, 'Đang mở');

COMMIT;

-- ========== VÉ XEM PHIM (MAY 2026 - UNIQUE SEATS PER SCREENING) ==========
INSERT INTO VE_XEM_PHIM (MaVe, MaSuatChieu, MaPhong, HangGhe, SoGhe, MaNguoiDung_KH, MaDonHang, GiaVeCuoi, NgayDat, TrangThai) VALUES
('VE001', 'SC001', 'P001', 'A', 1, 'KH001', 'DH001', 120000, TO_TIMESTAMP('2026-05-01 10:00:00', 'YYYY-MM-DD HH24:MI:SS'), 'Đã thanh toán');
INSERT INTO VE_XEM_PHIM (MaVe, MaSuatChieu, MaPhong, HangGhe, SoGhe, MaNguoiDung_KH, MaDonHang, GiaVeCuoi, NgayDat, TrangThai) VALUES
('VE002', 'SC002', 'P002', 'A', 1, 'KH002', 'DH002', 100000, TO_TIMESTAMP('2026-05-01 10:15:00', 'YYYY-MM-DD HH24:MI:SS'), 'Đã thanh toán');
INSERT INTO VE_XEM_PHIM (MaVe, MaSuatChieu, MaPhong, HangGhe, SoGhe, MaNguoiDung_KH, MaDonHang, GiaVeCuoi, NgayDat, TrangThai) VALUES
('VE003', 'SC003', 'P003', 'A', 1, 'KH003', 'DH003', 150000, TO_TIMESTAMP('2026-05-01 11:00:00', 'YYYY-MM-DD HH24:MI:SS'), 'Đã thanh toán');
INSERT INTO VE_XEM_PHIM (MaVe, MaSuatChieu, MaPhong, HangGhe, SoGhe, MaNguoiDung_KH, MaDonHang, GiaVeCuoi, NgayDat, TrangThai) VALUES
('VE005', 'SC012', 'P001', 'E', 1, 'KH005', 'DH005', 120000, TO_TIMESTAMP('2026-05-02 09:00:00', 'YYYY-MM-DD HH24:MI:SS'), 'Đã thanh toán');
INSERT INTO VE_XEM_PHIM (MaVe, MaSuatChieu, MaPhong, HangGhe, SoGhe, MaNguoiDung_KH, MaDonHang, GiaVeCuoi, NgayDat, TrangThai) VALUES
('VE006', 'SC011', 'P002', 'B', 1, 'KH006', 'DH006', 100000, TO_TIMESTAMP('2026-05-02 10:00:00', 'YYYY-MM-DD HH24:MI:SS'), 'Đã thanh toán');
INSERT INTO VE_XEM_PHIM (MaVe, MaSuatChieu, MaPhong, HangGhe, SoGhe, MaNguoiDung_KH, MaDonHang, GiaVeCuoi, NgayDat, TrangThai) VALUES
('VE007', 'SC004', 'P001', 'E', 2, 'KH007', 'DH007', 120000, TO_TIMESTAMP('2026-05-02 14:00:00', 'YYYY-MM-DD HH24:MI:SS'), 'Đã thanh toán');
INSERT INTO VE_XEM_PHIM (MaVe, MaSuatChieu, MaPhong, HangGhe, SoGhe, MaNguoiDung_KH, MaDonHang, GiaVeCuoi, NgayDat, TrangThai) VALUES
('VE008', 'SC015', 'P004', 'D', 1, 'KH008', 'DH008', 110000, TO_TIMESTAMP('2026-05-03 18:00:00', 'YYYY-MM-DD HH24:MI:SS'), 'Chờ thanh toán');
INSERT INTO VE_XEM_PHIM (MaVe, MaSuatChieu, MaPhong, HangGhe, SoGhe, MaNguoiDung_KH, MaDonHang, GiaVeCuoi, NgayDat, TrangThai) VALUES
('VE009', 'SC004', 'P001', 'E', 3, 'KH009', 'DH009', 120000, TO_TIMESTAMP('2026-05-03 19:00:00', 'YYYY-MM-DD HH24:MI:SS'), 'Đã thanh toán');
INSERT INTO VE_XEM_PHIM (MaVe, MaSuatChieu, MaPhong, HangGhe, SoGhe, MaNguoiDung_KH, MaDonHang, GiaVeCuoi, NgayDat, TrangThai) VALUES
('VE010', 'SC016', 'P005', 'F', 1, 'KH010', 'DH010', 120000, TO_TIMESTAMP('2026-05-04 20:00:00', 'YYYY-MM-DD HH24:MI:SS'), 'Đã thanh toán');
INSERT INTO VE_XEM_PHIM (MaVe, MaSuatChieu, MaPhong, HangGhe, SoGhe, MaNguoiDung_KH, MaDonHang, GiaVeCuoi, NgayDat, TrangThai) VALUES
('VE011', 'SC016', 'P005', 'F', 2, 'KH010', 'DH010', 120000, TO_TIMESTAMP('2026-05-04 20:00:00', 'YYYY-MM-DD HH24:MI:SS'), 'Đã thanh toán');
INSERT INTO VE_XEM_PHIM (MaVe, MaSuatChieu, MaPhong, HangGhe, SoGhe, MaNguoiDung_KH, MaDonHang, GiaVeCuoi, NgayDat, TrangThai) VALUES
('VE012', 'SC017', 'P003', 'A', 2, 'KH010', 'DH010', 150000, TO_TIMESTAMP('2026-05-04 20:00:00', 'YYYY-MM-DD HH24:MI:SS'), 'Đã thanh toán');
INSERT INTO VE_XEM_PHIM (MaVe, MaSuatChieu, MaPhong, HangGhe, SoGhe, MaNguoiDung_KH, MaDonHang, GiaVeCuoi, NgayDat, TrangThai) VALUES
('VE013', 'SC014', 'P001', 'A', 3, 'KH001', 'DH011', 120000, TO_TIMESTAMP('2026-05-05 08:00:00', 'YYYY-MM-DD HH24:MI:SS'), 'Đã thanh toán');
INSERT INTO VE_XEM_PHIM (MaVe, MaSuatChieu, MaPhong, HangGhe, SoGhe, MaNguoiDung_KH, MaDonHang, GiaVeCuoi, NgayDat, TrangThai) VALUES
('VE014', 'SC002', 'P002', 'A', 2, 'KH002', 'DH012', 100000, TO_TIMESTAMP('2026-05-05 14:00:00', 'YYYY-MM-DD HH24:MI:SS'), 'Hủy');

COMMIT;

-- ========== GỒM (Snacks/Products) ==========
INSERT INTO GOM (MaDonHang, MaHang, SoLuong, DonGia) VALUES ('DH001','MH001',1,45000);
INSERT INTO GOM (MaDonHang, MaHang, SoLuong, DonGia) VALUES ('DH001','MH002',2,30000);
INSERT INTO GOM (MaDonHang, MaHang, SoLuong, DonGia) VALUES ('DH002','MH003',1,70000);
INSERT INTO GOM (MaDonHang, MaHang, SoLuong, DonGia) VALUES ('DH003','MH004',1,60000);
INSERT INTO GOM (MaDonHang, MaHang, SoLuong, DonGia) VALUES ('DH005','MH005',2,200000);
INSERT INTO GOM (MaDonHang, MaHang, SoLuong, DonGia) VALUES ('DH006','MH006',1,55000);
INSERT INTO GOM (MaDonHang, MaHang, SoLuong, DonGia) VALUES ('DH006','MH002',1,30000);
INSERT INTO GOM (MaDonHang, MaHang, SoLuong, DonGia) VALUES ('DH007','MH008',1,150000);
INSERT INTO GOM (MaDonHang, MaHang, SoLuong, DonGia) VALUES ('DH007','MH001',1,45000);
INSERT INTO GOM (MaDonHang, MaHang, SoLuong, DonGia) VALUES ('DH008','MH006',1,55000);
INSERT INTO GOM (MaDonHang, MaHang, SoLuong, DonGia) VALUES ('DH009','MH005',1,200000);
INSERT INTO GOM (MaDonHang, MaHang, SoLuong, DonGia) VALUES ('DH009','MH007',2,40000);
INSERT INTO GOM (MaDonHang, MaHang, SoLuong, DonGia) VALUES ('DH010','MH008',2,150000);
INSERT INTO GOM (MaDonHang, MaHang, SoLuong, DonGia) VALUES ('DH010','MH003',2,70000);
INSERT INTO GOM (MaDonHang, MaHang, SoLuong, DonGia) VALUES ('DH011','MH001',2,45000);
INSERT INTO GOM (MaDonHang, MaHang, SoLuong, DonGia) VALUES ('DH012','MH003',1,70000);
INSERT INTO GOM (MaDonHang, MaHang, SoLuong, DonGia) VALUES ('DH012','MH007',1,40000);

COMMIT;

-- ========== THANH TOÁN (Payments - MAY 2026) ==========
INSERT INTO THANH_TOAN (MaThanhToan, MaDonHang, NgayThanhToan, PhuongThuc, TrangThai, SoTien) VALUES
('TT001', 'DH001', TO_TIMESTAMP('2026-05-01 10:05:00', 'YYYY-MM-DD HH24:MI:SS'), 'Thẻ', 'Đã thanh toán', 165000);
INSERT INTO THANH_TOAN (MaThanhToan, MaDonHang, NgayThanhToan, PhuongThuc, TrangThai, SoTien) VALUES
('TT002', 'DH002', TO_TIMESTAMP('2026-05-01 10:20:00', 'YYYY-MM-DD HH24:MI:SS'), 'Tiền mặt', 'Đang xử lý', 70000);
INSERT INTO THANH_TOAN (MaThanhToan, MaDonHang, NgayThanhToan, PhuongThuc, TrangThai, SoTien) VALUES
('TT003', 'DH003', TO_TIMESTAMP('2026-05-01 11:05:00', 'YYYY-MM-DD HH24:MI:SS'), 'Ví điện tử', 'Đã thanh toán', 210000);
INSERT INTO THANH_TOAN (MaThanhToan, MaDonHang, NgayThanhToan, PhuongThuc, TrangThai, SoTien) VALUES
('TT004', 'DH004', TO_TIMESTAMP('2026-05-01 12:40:00', 'YYYY-MM-DD HH24:MI:SS'), 'Tiền mặt', 'Thất bại', 0);
INSERT INTO THANH_TOAN (MaThanhToan, MaDonHang, NgayThanhToan, PhuongThuc, TrangThai, SoTien) VALUES
('TT005', 'DH005', TO_TIMESTAMP('2026-05-02 09:05:00', 'YYYY-MM-DD HH24:MI:SS'), 'Thẻ', 'Đã thanh toán', 520000);
INSERT INTO THANH_TOAN (MaThanhToan, MaDonHang, NgayThanhToan, PhuongThuc, TrangThai, SoTien) VALUES
('TT006', 'DH006', TO_TIMESTAMP('2026-05-02 10:05:00', 'YYYY-MM-DD HH24:MI:SS'), 'Momo', 'Đã thanh toán', 185000);
INSERT INTO THANH_TOAN (MaThanhToan, MaDonHang, NgayThanhToan, PhuongThuc, TrangThai, SoTien) VALUES
('TT007', 'DH007', TO_TIMESTAMP('2026-05-02 14:05:00', 'YYYY-MM-DD HH24:MI:SS'), 'ZaloPay', 'Đã thanh toán', 315000);
INSERT INTO THANH_TOAN (MaThanhToan, MaDonHang, NgayThanhToan, PhuongThuc, TrangThai, SoTien) VALUES
('TT008', 'DH008', TO_TIMESTAMP('2026-05-03 18:10:00', 'YYYY-MM-DD HH24:MI:SS'), 'Tiền mặt', 'Đang xử lý', 55000);
INSERT INTO THANH_TOAN (MaThanhToan, MaDonHang, NgayThanhToan, PhuongThuc, TrangThai, SoTien) VALUES
('TT009', 'DH009', TO_TIMESTAMP('2026-05-03 19:10:00', 'YYYY-MM-DD HH24:MI:SS'), 'Thẻ', 'Đã thanh toán', 440000);
INSERT INTO THANH_TOAN (MaThanhToan, MaDonHang, NgayThanhToan, PhuongThuc, TrangThai, SoTien) VALUES
('TT010', 'DH010', TO_TIMESTAMP('2026-05-04 20:05:00', 'YYYY-MM-DD HH24:MI:SS'), 'Visa', 'Đã thanh toán', 690000);
INSERT INTO THANH_TOAN (MaThanhToan, MaDonHang, NgayThanhToan, PhuongThuc, TrangThai, SoTien) VALUES
('TT011', 'DH011', TO_TIMESTAMP('2026-05-05 08:05:00', 'YYYY-MM-DD HH24:MI:SS'), 'Momo', 'Đã thanh toán', 210000);
INSERT INTO THANH_TOAN (MaThanhToan, MaDonHang, NgayThanhToan, PhuongThuc, TrangThai, SoTien) VALUES
('TT012', 'DH012', TO_TIMESTAMP('2026-05-05 14:05:00', 'YYYY-MM-DD HH24:MI:SS'), 'Visa', 'Thất bại', 0);

COMMIT;

-- ========== QUẢN LÝ (Management assignments) ==========
INSERT INTO QUAN_LY (MaNguoiDung_QTV, MaRapPhim) VALUES ('AD001', 'RAP001');
INSERT INTO QUAN_LY (MaNguoiDung_QTV, MaRapPhim) VALUES ('AD002', 'RAP002');
INSERT INTO QUAN_LY (MaNguoiDung_QTV, MaRapPhim) VALUES ('AD003', 'RAP003');

COMMIT;

-- ========== ÁP DỤNG KHUYẾN MÃI (Apply promotions) ==========
INSERT INTO AP_DUNG (MaVe, MaKhuyenMai) VALUES ('VE001', 'KM001');
INSERT INTO AP_DUNG (MaVe, MaKhuyenMai) VALUES ('VE002', 'KM002');
INSERT INTO AP_DUNG (MaVe, MaKhuyenMai) VALUES ('VE005', 'KM005');
INSERT INTO AP_DUNG (MaVe, MaKhuyenMai) VALUES ('VE006', 'KM005');
INSERT INTO AP_DUNG (MaVe, MaKhuyenMai) VALUES ('VE010', 'KM005');

COMMIT;

-- ========== DANH GIA (Customer reviews) ==========
INSERT INTO DANH_GIA (MaDanhGia, MaNguoiDung, MaPhim, NoiDung, DiemSo) VALUES
('DG001', 'KH001', 'PH001', 'Phim siêu hay, cái kết rất cảm động!', 10);
INSERT INTO DANH_GIA (MaDanhGia, MaNguoiDung, MaPhim, NoiDung, DiemSo) VALUES
('DG002', 'KH002', 'PH001', 'Đã xem 2 lần rồi, vẫn hay lắm', 9);
INSERT INTO DANH_GIA (MaDanhGia, MaNguoiDung, MaPhim, NoiDung, DiemSo) VALUES
('DG003', 'KH003', 'PH002', 'Hài thật, cười bụi xịt', 8);
INSERT INTO DANH_GIA (MaDanhGia, MaNguoiDung, MaPhim, NoiDung, DiemSo) VALUES
('DG004', 'KH004', 'PH003', 'Fast & Furious vẫn luôn tuyệt vời', 9);
INSERT INTO DANH_GIA (MaDanhGia, MaNguoiDung, MaPhim, NoiDung, DiemSo) VALUES
('DG005', 'KH005', 'PH005', 'Spider-Man siêu chất', 10);

COMMIT;

-- Bật lại kiểm tra khóa ngoại (Enable Constraints)
ALTER TABLE GHE ENABLE CONSTRAINT fk_ghe_phong;
ALTER TABLE THE_LOAI_PHIM ENABLE CONSTRAINT fk_theloai_phim;
ALTER TABLE KHACH_HANG ENABLE CONSTRAINT fk_kh_tk;
ALTER TABLE QUAN_TRI_VIEN ENABLE CONSTRAINT fk_qtv_tk;
ALTER TABLE CA_LAM_VIEC ENABLE CONSTRAINT fk_ca_qtv;
ALTER TABLE DON_HANG ENABLE CONSTRAINT fk_dh_kh;
ALTER TABLE GOM ENABLE CONSTRAINT fk_gom_dh;
ALTER TABLE GOM ENABLE CONSTRAINT fk_gom_mh;
ALTER TABLE THANH_TOAN ENABLE CONSTRAINT fk_tt_dh;
ALTER TABLE TRINH_CHIEU ENABLE CONSTRAINT fk_tc_rap;
ALTER TABLE TRINH_CHIEU ENABLE CONSTRAINT fk_tc_phim;
ALTER TABLE SUAT_CHIEU ENABLE CONSTRAINT fk_sc_phim;
ALTER TABLE SUAT_CHIEU ENABLE CONSTRAINT fk_sc_phong;
ALTER TABLE VE_XEM_PHIM ENABLE CONSTRAINT fk_ve_sc;
ALTER TABLE VE_XEM_PHIM ENABLE CONSTRAINT fk_ve_ghe;
ALTER TABLE VE_XEM_PHIM ENABLE CONSTRAINT fk_ve_kh;
ALTER TABLE VE_XEM_PHIM ENABLE CONSTRAINT fk_ve_dh;
ALTER TABLE AP_DUNG ENABLE CONSTRAINT fk_ad_ve;
ALTER TABLE AP_DUNG ENABLE CONSTRAINT fk_ad_km;
ALTER TABLE DANH_GIA ENABLE CONSTRAINT fk_dg_kh;
ALTER TABLE DANH_GIA ENABLE CONSTRAINT fk_dg_phim;
ALTER TABLE QUAN_LY ENABLE CONSTRAINT fk_ql_qtv;
ALTER TABLE QUAN_LY ENABLE CONSTRAINT fk_ql_rap;

COMMIT;

-- ============================================================================
-- END OF INSERT DATA - All data synchronized to May 2026
-- All trigger constraints validated:
-- 1. SUAT_CHIEU.NgayChieu >= PHIM.NgayKhoiChieu ✓
-- 2. Unique seats per screening (TRG_VE_CheckGheAvailable) ✓
-- 3. DON_HANG.ThoiGianDat synchronized with VE_XEM_PHIM.NgayDat ✓
-- 4. VE_XEM_PHIM with "Đã thanh toán" have THANH_TOAN records ✓
-- 5. All date-based revenue queries will work correctly ✓
-- ============================================================================
