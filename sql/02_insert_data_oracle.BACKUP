-- ============================================================================
-- INSERT DATA - ORACLE SYNTAX
-- ============================================================================
SET ECHO OFF          -- Không nhắc lại câu lệnh đang chạy
SET FEEDBACK OFF      -- Không hiện thông báo "1 row created" hoặc "Table created"
SET TERMOUT ON        -- Vẫn hiện kết quả ra màn hình
SET VERIFY OFF        -- Không hiện chi tiết thay đổi biến &
SET SERVEROUTPUT ON   -- Bật để hiện thông báo từ DBMS_OUTPUT
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

-- Đảm bảo không bị dừng ở ký tự &
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
INSERT INTO KHACH_HANG (MaNguoiDung, LoaiThanhVien, DiemTichLuy) VALUES
('KH001', 'Bronze', 33);
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

-- ========== GHẾ ==========
-- P001: 100 ghế (hàng A-D: 80 × Thường, hàng E-F: 20 × VIP)
INSERT INTO GHE (MaPhong, HangGhe, SoGhe, LoaiGhe) SELECT 'P001', hang, stt, 'Thường'
FROM (SELECT 'A' hang FROM DUAL UNION ALL SELECT 'B' FROM DUAL UNION ALL SELECT 'C' FROM DUAL UNION ALL SELECT 'D' FROM DUAL),
     (SELECT ROWNUM stt FROM DUAL CONNECT BY ROWNUM <= 20);
INSERT INTO GHE (MaPhong, HangGhe, SoGhe, LoaiGhe) SELECT 'P001', hang, stt, 'VIP'
FROM (SELECT 'E' hang FROM DUAL UNION ALL SELECT 'F' FROM DUAL),
     (SELECT ROWNUM stt FROM DUAL CONNECT BY ROWNUM <= 10);

COMMIT;

-- P002: 80 ghế (hàng A,C,D: 30 × Thường; hàng B,E: 20 × VIP)
INSERT INTO GHE (MaPhong, HangGhe, SoGhe, LoaiGhe) SELECT 'P002', hang, stt, 'Thường'
FROM (SELECT 'A' hang FROM DUAL UNION ALL SELECT 'C' FROM DUAL UNION ALL SELECT 'D' FROM DUAL),
     (SELECT ROWNUM stt FROM DUAL CONNECT BY ROWNUM <= 10);
INSERT INTO GHE (MaPhong, HangGhe, SoGhe, LoaiGhe) SELECT 'P002', hang, stt, 'VIP'
FROM (SELECT 'B' hang FROM DUAL UNION ALL SELECT 'E' FROM DUAL),
     (SELECT ROWNUM stt FROM DUAL CONNECT BY ROWNUM <= 10);

COMMIT;

-- P003: 150 ghế (hàng A-G: 70 × Thường; hàng H-I: 20 × Đôi; hàng J-K: 20 × VIP)
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
    FOR stt IN 1..10 LOOP

COMMIT;

-- P004: 60 ghế (hàng A-C: 30 × Thường; hàng D-F: 30 × VIP)
INSERT INTO GHE (MaPhong, HangGhe, SoGhe, LoaiGhe) SELECT 'P004', hang, stt, 'Thường'
FROM (SELECT 'A' hang FROM DUAL UNION ALL SELECT 'B' FROM DUAL UNION ALL SELECT 'C' FROM DUAL),
     (SELECT ROWNUM stt FROM DUAL CONNECT BY ROWNUM <= 10);
INSERT INTO GHE (MaPhong, HangGhe, SoGhe, LoaiGhe) SELECT 'P004', hang, stt, 'VIP'
FROM (SELECT 'D' hang FROM DUAL UNION ALL SELECT 'E' FROM DUAL UNION ALL SELECT 'F' FROM DUAL),
     (SELECT ROWNUM stt FROM DUAL CONNECT BY ROWNUM <= 10);

COMMIT;

-- P005: 90 ghế (hàng A-E: 50 × Thường; hàng F-I: 40 × VIP)
INSERT INTO GHE (MaPhong, HangGhe, SoGhe, LoaiGhe) SELECT 'P005', hang, stt, 'Thường'
FROM (SELECT 'A' hang FROM DUAL UNION ALL SELECT 'B' FROM DUAL UNION ALL SELECT 'C' FROM DUAL 
      UNION ALL SELECT 'D' FROM DUAL UNION ALL SELECT 'E' FROM DUAL),
     (SELECT ROWNUM stt FROM DUAL CONNECT BY ROWNUM <= 10);
INSERT INTO GHE (MaPhong, HangGhe, SoGhe, LoaiGhe) SELECT 'P005', hang, stt, 'VIP'
FROM (SELECT 'F' hang FROM DUAL UNION ALL SELECT 'G' FROM DUAL UNION ALL SELECT 'H' FROM DUAL UNION ALL SELECT 'I' FROM DUAL),
     (SELECT ROWNUM stt FROM DUAL CONNECT BY ROWNUM <= 10);

COMMIT;

-- P006: 40 ghế (hàng A-D: 40 × Giường nằm VIP cao cấp)
INSERT INTO GHE (MaPhong, HangGhe, SoGhe, LoaiGhe) SELECT 'P006', hang, stt, 'Giường nằm'
FROM (SELECT 'A' hang FROM DUAL UNION ALL SELECT 'B' FROM DUAL UNION ALL SELECT 'C' FROM DUAL UNION ALL SELECT 'D' FROM DUAL),
     (SELECT ROWNUM stt FROM DUAL CONNECT BY ROWNUM <= 10);

COMMIT;

-- ========== PHIM – THỂ LOẠI – KHUYẾN MÃI ==========
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
('PH006', 'Dune: Messiah', 160, 'English', 'USA', 'Denis Villeneuve', 'Chalamet', TO_DATE('2025-11-15', 'YYYY-MM-DD'), 'Tiếp tục câu chuyện sử thi của Dune với những cảnh quay hoành tráng và các trận chiến mãn nhân tạo. Một tác phẩm khoa học viễn tưởng vĩ đại.', 16, 'Viễn tưởng', 'https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg');
INSERT INTO PHIM (MaPhim, TenPhim, ThoiLuong, NgonNgu, QuocGia, DaoDien, DienVienChinh, NgayKhoiChieu, MoTaNoiDung, DoTuoi, ChuDePhim, Anh) VALUES
('PH007', 'Lật Mặt 7', 115, 'Tiếng Việt', 'Việt Nam', 'Lý Hải', 'Lý Hải', TO_DATE('2025-11-25', 'YYYY-MM-DD'), 'Phần 7 của series Lật Mặt mang đến những pha hành động hài hước và gay cấn. Một cuộc chiến với những twist không ngờ tới.', 16, 'Hành động', 'https://iguov8nhvyobj.vcdn.cloud/media/catalog/product/cache/1/image/c5f0a1eff4c394a251036189ccddaacd/l/a/lat-mat-7.jpg');
INSERT INTO PHIM (MaPhim, TenPhim, ThoiLuong, NgonNgu, QuocGia, DaoDien, DienVienChinh, NgayKhoiChieu, MoTaNoiDung, DoTuoi, ChuDePhim, Anh) VALUES
('PH008', 'The Conjuring 3', 100, 'English', 'USA', 'Michael Chaves', 'Patrick Wilson', TO_DATE('2025-10-31', 'YYYY-MM-DD'), 'Những vụ án liên quan đến ma ám bí ẩn lại xuất hiện. Một bộ phim kinh dị đầy rợn người và bí ẩn.', 18, 'Kinh dị', 'https://image.tmdb.org/t/p/w500/rQfX2xx8TUoNvyk892yKWNikJaM.jpg');

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
('KM005', 'Giáng Sinh 2025', '24-25/12', TO_DATE('2025-12-24', 'YYYY-MM-DD'), TO_DATE('2025-12-25', 'YYYY-MM-DD'), 50000);

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

-- ========== ĐƠN HÀNG ==========
INSERT INTO DON_HANG (MaDonHang, MaNguoiDung_KH, PhuongThuc, ThoiGianDat, TongTien, TrangThai) VALUES
('DH001', 'KH001', 'Online', TO_TIMESTAMP('2025-12-20 10:00:00', 'YYYY-MM-DD HH24:MI:SS'), 165000, 'Đã thanh toán');
INSERT INTO DON_HANG (MaDonHang, MaNguoiDung_KH, PhuongThuc, ThoiGianDat, TongTien, TrangThai) VALUES
('DH002', 'KH002', 'Tại quầy', TO_TIMESTAMP('2025-12-20 10:15:00', 'YYYY-MM-DD HH24:MI:SS'), 160000, 'Chờ thanh toán');
INSERT INTO DON_HANG (MaDonHang, MaNguoiDung_KH, PhuongThuc, ThoiGianDat, TongTien, TrangThai) VALUES
('DH003', 'KH003', 'Online', TO_TIMESTAMP('2025-12-20 11:00:00', 'YYYY-MM-DD HH24:MI:SS'), 100000, 'Đã thanh toán');
INSERT INTO DON_HANG (MaDonHang, MaNguoiDung_KH, PhuongThuc, ThoiGianDat, TongTien, TrangThai) VALUES
('DH004', 'KH004', 'Tại quầy', TO_TIMESTAMP('2025-12-20 12:30:00', 'YYYY-MM-DD HH24:MI:SS'), 95000, 'Hủy');
INSERT INTO DON_HANG (MaDonHang, MaNguoiDung_KH, PhuongThuc, ThoiGianDat, TongTien, TrangThai) VALUES
('DH005', 'KH005', 'Online', TO_TIMESTAMP('2025-12-24 09:00:00', 'YYYY-MM-DD HH24:MI:SS'), 500000, 'Đã thanh toán');
INSERT INTO DON_HANG (MaDonHang, MaNguoiDung_KH, PhuongThuc, ThoiGianDat, TongTien, TrangThai) VALUES
('DH006', 'KH006', 'Online', TO_TIMESTAMP('2025-12-24 10:00:00', 'YYYY-MM-DD HH24:MI:SS'), 175000, 'Đã thanh toán');
INSERT INTO DON_HANG (MaDonHang, MaNguoiDung_KH, PhuongThuc, ThoiGianDat, TongTien, TrangThai) VALUES
('DH007', 'KH007', 'App', TO_TIMESTAMP('2025-12-24 14:00:00', 'YYYY-MM-DD HH24:MI:SS'), 280000, 'Đã thanh toán');
INSERT INTO DON_HANG (MaDonHang, MaNguoiDung_KH, PhuongThuc, ThoiGianDat, TongTien, TrangThai) VALUES
('DH008', 'KH008', 'Tại quầy', TO_TIMESTAMP('2025-12-25 18:00:00', 'YYYY-MM-DD HH24:MI:SS'), 145000, 'Chờ thanh toán');
INSERT INTO DON_HANG (MaDonHang, MaNguoiDung_KH, PhuongThuc, ThoiGianDat, TongTien, TrangThai) VALUES
('DH009', 'KH009', 'Online', TO_TIMESTAMP('2025-12-25 19:00:00', 'YYYY-MM-DD HH24:MI:SS'), 380000, 'Đã thanh toán');
INSERT INTO DON_HANG (MaDonHang, MaNguoiDung_KH, PhuongThuc, ThoiGianDat, TongTien, TrangThai) VALUES
('DH010', 'KH010', 'Online', TO_TIMESTAMP('2025-12-31 20:00:00', 'YYYY-MM-DD HH24:MI:SS'), 785000, 'Đã thanh toán');
INSERT INTO DON_HANG (MaDonHang, MaNguoiDung_KH, PhuongThuc, ThoiGianDat, TongTien, TrangThai) VALUES
('DH011', 'KH001', 'App', TO_TIMESTAMP('2026-01-01 08:00:00', 'YYYY-MM-DD HH24:MI:SS'), 155000, 'Đã thanh toán');
INSERT INTO DON_HANG (MaDonHang, MaNguoiDung_KH, PhuongThuc, ThoiGianDat, TongTien, TrangThai) VALUES
('DH012', 'KH002', 'Web', TO_TIMESTAMP('2026-01-01 14:00:00', 'YYYY-MM-DD HH24:MI:SS'), 200000, 'Hủy');

COMMIT;

-- ========== VÉ XEM PHIM (Thêm vào đây - ĐÂY LÀ PHẦN MỚI) ==========
INSERT INTO VE_XEM_PHIM (MaVe, MaSuatChieu, MaPhong, HangGhe, SoGhe, MaNguoiDung_KH, MaDonHang, GiaVeCuoi, NgayDat, TrangThai) VALUES
('VE001', 'SC001', 'P001', 'A', 1, 'KH001', 'DH001', 60000, TO_TIMESTAMP('2025-12-20 10:00:00', 'YYYY-MM-DD HH24:MI:SS'), 'Đã thanh toán');

INSERT INTO VE_XEM_PHIM (MaVe, MaSuatChieu, MaPhong, HangGhe, SoGhe, MaNguoiDung_KH, MaDonHang, GiaVeCuoi, NgayDat, TrangThai) VALUES
('VE002', 'SC002', 'P002', 'A', 1, 'KH002', 'DH002', 90000, TO_TIMESTAMP('2025-12-20 10:15:00', 'YYYY-MM-DD HH24:MI:SS'), 'Đã thanh toán');

INSERT INTO VE_XEM_PHIM (MaVe, MaSuatChieu, MaPhong, HangGhe, SoGhe, MaNguoiDung_KH, MaDonHang, GiaVeCuoi, NgayDat, TrangThai) VALUES
('VE003', 'SC003', 'P003', 'J', 1, 'KH003', 'DH003', 40000, TO_TIMESTAMP('2025-12-20 11:00:00', 'YYYY-MM-DD HH24:MI:SS'), 'Đã thanh toán');

INSERT INTO VE_XEM_PHIM (MaVe, MaSuatChieu, MaPhong, HangGhe, SoGhe, MaNguoiDung_KH, MaDonHang, GiaVeCuoi, NgayDat, TrangThai) VALUES
('VE005', 'SC012', 'P001', 'E', 1, 'KH005', 'DH005', 100000, TO_TIMESTAMP('2025-12-24 09:00:00', 'YYYY-MM-DD HH24:MI:SS'), 'Đã thanh toán');

INSERT INTO VE_XEM_PHIM (MaVe, MaSuatChieu, MaPhong, HangGhe, SoGhe, MaNguoiDung_KH, MaDonHang, GiaVeCuoi, NgayDat, TrangThai) VALUES
('VE006', 'SC011', 'P002', 'B', 1, 'KH006', 'DH006', 90000, TO_TIMESTAMP('2025-12-24 10:00:00', 'YYYY-MM-DD HH24:MI:SS'), 'Đã thanh toán');

INSERT INTO VE_XEM_PHIM (MaVe, MaSuatChieu, MaPhong, HangGhe, SoGhe, MaNguoiDung_KH, MaDonHang, GiaVeCuoi, NgayDat, TrangThai) VALUES
('VE007', 'SC004', 'P001', 'E', 2, 'KH007', 'DH007', 85000, TO_TIMESTAMP('2025-12-24 14:00:00', 'YYYY-MM-DD HH24:MI:SS'), 'Đã thanh toán');

INSERT INTO VE_XEM_PHIM (MaVe, MaSuatChieu, MaPhong, HangGhe, SoGhe, MaNguoiDung_KH, MaDonHang, GiaVeCuoi, NgayDat, TrangThai) VALUES
('VE008', 'SC015', 'P004', 'D', 1, 'KH008', 'DH008', 90000, TO_TIMESTAMP('2025-12-25 18:00:00', 'YYYY-MM-DD HH24:MI:SS'), 'Chờ thanh toán');

INSERT INTO VE_XEM_PHIM (MaVe, MaSuatChieu, MaPhong, HangGhe, SoGhe, MaNguoiDung_KH, MaDonHang, GiaVeCuoi, NgayDat, TrangThai) VALUES
('VE009', 'SC004', 'P001', 'E', 3, 'KH009', 'DH009', 100000, TO_TIMESTAMP('2025-12-25 19:00:00', 'YYYY-MM-DD HH24:MI:SS'), 'Đã thanh toán');

INSERT INTO VE_XEM_PHIM (MaVe, MaSuatChieu, MaPhong, HangGhe, SoGhe, MaNguoiDung_KH, MaDonHang, GiaVeCuoi, NgayDat, TrangThai) VALUES
('VE010', 'SC016', 'P005', 'F', 1, 'KH010', 'DH010', 120000, TO_TIMESTAMP('2025-12-31 20:00:00', 'YYYY-MM-DD HH24:MI:SS'), 'Đã thanh toán');

INSERT INTO VE_XEM_PHIM (MaVe, MaSuatChieu, MaPhong, HangGhe, SoGhe, MaNguoiDung_KH, MaDonHang, GiaVeCuoi, NgayDat, TrangThai) VALUES
('VE011', 'SC016', 'P005', 'F', 2, 'KH010', 'DH010', 120000, TO_TIMESTAMP('2025-12-31 20:00:00', 'YYYY-MM-DD HH24:MI:SS'), 'Đã thanh toán');

INSERT INTO VE_XEM_PHIM (MaVe, MaSuatChieu, MaPhong, HangGhe, SoGhe, MaNguoiDung_KH, MaDonHang, GiaVeCuoi, NgayDat, TrangThai) VALUES
('VE012', 'SC017', 'P003', 'J', 2, 'KH010', 'DH010', 105000, TO_TIMESTAMP('2025-12-31 20:00:00', 'YYYY-MM-DD HH24:MI:SS'), 'Đã thanh toán');

INSERT INTO VE_XEM_PHIM (MaVe, MaSuatChieu, MaPhong, HangGhe, SoGhe, MaNguoiDung_KH, MaDonHang, GiaVeCuoi, NgayDat, TrangThai) VALUES
('VE013', 'SC014', 'P001', 'A', 3, 'KH001', 'DH011', 65000, TO_TIMESTAMP('2026-01-01 08:00:00', 'YYYY-MM-DD HH24:MI:SS'), 'Đã thanh toán');

INSERT INTO VE_XEM_PHIM (MaVe, MaSuatChieu, MaPhong, HangGhe, SoGhe, MaNguoiDung_KH, MaDonHang, GiaVeCuoi, NgayDat, TrangThai) VALUES
('VE014', 'SC002', 'P002', 'A', 2, 'KH002', 'DH012', 90000, TO_TIMESTAMP('2026-01-01 14:00:00', 'YYYY-MM-DD HH24:MI:SS'), 'Hủy');

COMMIT;

-- ========== GỒM ==========
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

-- ========== THANH TOÁN ==========
INSERT INTO THANH_TOAN (MaThanhToan, MaDonHang, NgayThanhToan, PhuongThuc, TrangThai, SoTien) VALUES
('TT001', 'DH001', TO_TIMESTAMP('2025-12-20 10:05:00', 'YYYY-MM-DD HH24:MI:SS'), 'Thẻ', 'Đã thanh toán', 165000);
INSERT INTO THANH_TOAN (MaThanhToan, MaDonHang, NgayThanhToan, PhuongThuc, TrangThai, SoTien) VALUES
('TT002', 'DH002', TO_TIMESTAMP('2025-12-20 10:20:00', 'YYYY-MM-DD HH24:MI:SS'), 'Tiền mặt', 'Đang xử lý', 160000);
INSERT INTO THANH_TOAN (MaThanhToan, MaDonHang, NgayThanhToan, PhuongThuc, TrangThai, SoTien) VALUES
('TT003', 'DH003', TO_TIMESTAMP('2025-12-20 11:05:00', 'YYYY-MM-DD HH24:MI:SS'), 'Ví điện tử', 'Đã thanh toán', 100000);
INSERT INTO THANH_TOAN (MaThanhToan, MaDonHang, NgayThanhToan, PhuongThuc, TrangThai, SoTien) VALUES
('TT004', 'DH004', TO_TIMESTAMP('2025-12-20 12:40:00', 'YYYY-MM-DD HH24:MI:SS'), 'Tiền mặt', 'Thất bại', 95000);
INSERT INTO THANH_TOAN (MaThanhToan, MaDonHang, NgayThanhToan, PhuongThuc, TrangThai, SoTien) VALUES
('TT005', 'DH005', TO_TIMESTAMP('2025-12-24 09:05:00', 'YYYY-MM-DD HH24:MI:SS'), 'Thẻ', 'Đã thanh toán', 500000);
INSERT INTO THANH_TOAN (MaThanhToan, MaDonHang, NgayThanhToan, PhuongThuc, TrangThai, SoTien) VALUES
('TT006', 'DH006', TO_TIMESTAMP('2025-12-24 10:05:00', 'YYYY-MM-DD HH24:MI:SS'), 'Momo', 'Đã thanh toán', 175000);
INSERT INTO THANH_TOAN (MaThanhToan, MaDonHang, NgayThanhToan, PhuongThuc, TrangThai, SoTien) VALUES
('TT007', 'DH007', TO_TIMESTAMP('2025-12-24 14:05:00', 'YYYY-MM-DD HH24:MI:SS'), 'ZaloPay', 'Đã thanh toán', 280000);
INSERT INTO THANH_TOAN (MaThanhToan, MaDonHang, NgayThanhToan, PhuongThuc, TrangThai, SoTien) VALUES
('TT008', 'DH008', TO_TIMESTAMP('2025-12-25 18:10:00', 'YYYY-MM-DD HH24:MI:SS'), 'Tiền mặt', 'Đang xử lý', 145000);
INSERT INTO THANH_TOAN (MaThanhToan, MaDonHang, NgayThanhToan, PhuongThuc, TrangThai, SoTien) VALUES
('TT009', 'DH009', TO_TIMESTAMP('2025-12-25 19:10:00', 'YYYY-MM-DD HH24:MI:SS'), 'Thẻ', 'Đã thanh toán', 380000);
INSERT INTO THANH_TOAN (MaThanhToan, MaDonHang, NgayThanhToan, PhuongThuc, TrangThai, SoTien) VALUES
('TT010', 'DH010', TO_TIMESTAMP('2025-12-31 20:05:00', 'YYYY-MM-DD HH24:MI:SS'), 'Visa', 'Đã thanh toán', 785000);
INSERT INTO THANH_TOAN (MaThanhToan, MaDonHang, NgayThanhToan, PhuongThuc, TrangThai, SoTien) VALUES
('TT011', 'DH011', TO_TIMESTAMP('2026-01-01 08:05:00', 'YYYY-MM-DD HH24:MI:SS'), 'Momo', 'Đã thanh toán', 155000);
INSERT INTO THANH_TOAN (MaThanhToan, MaDonHang, NgayThanhToan, PhuongThuc, TrangThai, SoTien) VALUES
('TT012', 'DH012', TO_TIMESTAMP('2026-01-01 14:05:00', 'YYYY-MM-DD HH24:MI:SS'), 'Visa', 'Thất bại', 200000);

COMMIT;

-- ========== TRÌNH CHIẾU – SUẤT CHIẾU ==========
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

-- ========== SUẤT CHIẾU ==========
-- Ngày 20/12/2025 (Thứ 6): 9 suất
INSERT INTO SUAT_CHIEU (MaSuatChieu, MaPhim, MaPhong, NgayChieu, GioBatDau, GioKetThuc, GiaVeCoBan, TrangThai) VALUES
('SC001', 'PH001', 'P001', TO_DATE('2025-12-20', 'YYYY-MM-DD'), TO_TIMESTAMP('2025-12-20 08:00:00', 'YYYY-MM-DD HH24:MI:SS'), TO_TIMESTAMP('2025-12-20 10:30:00', 'YYYY-MM-DD HH24:MI:SS'), 120000, 'Đang mở');

INSERT INTO SUAT_CHIEU (MaSuatChieu, MaPhim, MaPhong, NgayChieu, GioBatDau, GioKetThuc, GiaVeCoBan, TrangThai) VALUES
('SC002', 'PH002', 'P002', TO_DATE('2025-12-20', 'YYYY-MM-DD'), TO_TIMESTAMP('2025-12-20 10:00:00', 'YYYY-MM-DD HH24:MI:SS'), TO_TIMESTAMP('2025-12-20 12:00:00', 'YYYY-MM-DD HH24:MI:SS'), 100000, 'Đang mở');

INSERT INTO SUAT_CHIEU (MaSuatChieu, MaPhim, MaPhong, NgayChieu, GioBatDau, GioKetThuc, GiaVeCoBan, TrangThai) VALUES
('SC003', 'PH003', 'P003', TO_DATE('2025-12-20', 'YYYY-MM-DD'), TO_TIMESTAMP('2025-12-20 13:00:00', 'YYYY-MM-DD HH24:MI:SS'), TO_TIMESTAMP('2025-12-20 15:15:00', 'YYYY-MM-DD HH24:MI:SS'), 150000, 'Đang mở');

INSERT INTO SUAT_CHIEU (MaSuatChieu, MaPhim, MaPhong, NgayChieu, GioBatDau, GioKetThuc, GiaVeCoBan, TrangThai) VALUES
('SC005', 'PH001', 'P001', TO_DATE('2025-12-20', 'YYYY-MM-DD'), TO_TIMESTAMP('2025-12-20 15:30:00', 'YYYY-MM-DD HH24:MI:SS'), TO_TIMESTAMP('2025-12-20 18:00:00', 'YYYY-MM-DD HH24:MI:SS'), 120000, 'Đang mở');

INSERT INTO SUAT_CHIEU (MaSuatChieu, MaPhim, MaPhong, NgayChieu, GioBatDau, GioKetThuc, GiaVeCoBan, TrangThai) VALUES
('SC006', 'PH002', 'P002', TO_DATE('2025-12-20', 'YYYY-MM-DD'), TO_TIMESTAMP('2025-12-20 16:00:00', 'YYYY-MM-DD HH24:MI:SS'), TO_TIMESTAMP('2025-12-20 18:00:00', 'YYYY-MM-DD HH24:MI:SS'), 100000, 'Đang mở');

INSERT INTO SUAT_CHIEU (MaSuatChieu, MaPhim, MaPhong, NgayChieu, GioBatDau, GioKetThuc, GiaVeCoBan, TrangThai) VALUES
('SC007', 'PH003', 'P003', TO_DATE('2025-12-20', 'YYYY-MM-DD'), TO_TIMESTAMP('2025-12-20 18:00:00', 'YYYY-MM-DD HH24:MI:SS'), TO_TIMESTAMP('2025-12-20 20:15:00', 'YYYY-MM-DD HH24:MI:SS'), 150000, 'Đang mở');

INSERT INTO SUAT_CHIEU (MaSuatChieu, MaPhim, MaPhong, NgayChieu, GioBatDau, GioKetThuc, GiaVeCoBan, TrangThai) VALUES
('SC008', 'PH001', 'P001', TO_DATE('2025-12-20', 'YYYY-MM-DD'), TO_TIMESTAMP('2025-12-20 19:00:00', 'YYYY-MM-DD HH24:MI:SS'), TO_TIMESTAMP('2025-12-20 21:30:00', 'YYYY-MM-DD HH24:MI:SS'), 120000, 'Đang mở');

INSERT INTO SUAT_CHIEU (MaSuatChieu, MaPhim, MaPhong, NgayChieu, GioBatDau, GioKetThuc, GiaVeCoBan, TrangThai) VALUES
('SC009', 'PH004', 'P004', TO_DATE('2025-12-20', 'YYYY-MM-DD'), TO_TIMESTAMP('2025-12-20 13:00:00', 'YYYY-MM-DD HH24:MI:SS'), TO_TIMESTAMP('2025-12-20 14:50:00', 'YYYY-MM-DD HH24:MI:SS'), 110000, 'Đang mở');

INSERT INTO SUAT_CHIEU (MaSuatChieu, MaPhim, MaPhong, NgayChieu, GioBatDau, GioKetThuc, GiaVeCoBan, TrangThai) VALUES
('SC010', 'PH005', 'P005', TO_DATE('2025-12-20', 'YYYY-MM-DD'), TO_TIMESTAMP('2025-12-20 14:00:00', 'YYYY-MM-DD HH24:MI:SS'), TO_TIMESTAMP('2025-12-20 16:30:00', 'YYYY-MM-DD HH24:MI:SS'), 120000, 'Đang mở');

-- Ngày 24/12/2025 (Thứ 3 - Giáng Sinh): 4 suất
INSERT INTO SUAT_CHIEU (MaSuatChieu, MaPhim, MaPhong, NgayChieu, GioBatDau, GioKetThuc, GiaVeCoBan, TrangThai) VALUES
('SC004', 'PH001', 'P001', TO_DATE('2025-12-24', 'YYYY-MM-DD'), TO_TIMESTAMP('2025-12-24 19:00:00', 'YYYY-MM-DD HH24:MI:SS'), TO_TIMESTAMP('2025-12-24 21:30:00', 'YYYY-MM-DD HH24:MI:SS'), 120000, 'Đang mở');

INSERT INTO SUAT_CHIEU (MaSuatChieu, MaPhim, MaPhong, NgayChieu, GioBatDau, GioKetThuc, GiaVeCoBan, TrangThai) VALUES
('SC011', 'PH002', 'P002', TO_DATE('2025-12-24', 'YYYY-MM-DD'), TO_TIMESTAMP('2025-12-24 15:00:00', 'YYYY-MM-DD HH24:MI:SS'), TO_TIMESTAMP('2025-12-24 17:00:00', 'YYYY-MM-DD HH24:MI:SS'), 100000, 'Đang mở');

INSERT INTO SUAT_CHIEU (MaSuatChieu, MaPhim, MaPhong, NgayChieu, GioBatDau, GioKetThuc, GiaVeCoBan, TrangThai) VALUES
('SC012', 'PH006', 'P001', TO_DATE('2025-12-24', 'YYYY-MM-DD'), TO_TIMESTAMP('2025-12-24 17:00:00', 'YYYY-MM-DD HH24:MI:SS'), TO_TIMESTAMP('2025-12-24 19:40:00', 'YYYY-MM-DD HH24:MI:SS'), 120000, 'Đang mở');

INSERT INTO SUAT_CHIEU (MaSuatChieu, MaPhim, MaPhong, NgayChieu, GioBatDau, GioKetThuc, GiaVeCoBan, TrangThai) VALUES
('SC013', 'PH007', 'P002', TO_DATE('2025-12-24', 'YYYY-MM-DD'), TO_TIMESTAMP('2025-12-24 19:00:00', 'YYYY-MM-DD HH24:MI:SS'), TO_TIMESTAMP('2025-12-24 20:55:00', 'YYYY-MM-DD HH24:MI:SS'), 100000, 'Đang mở');

-- Ngày 25/12/2025 (Thứ 4 - tiếp Giáng Sinh): 2 suất
INSERT INTO SUAT_CHIEU (MaSuatChieu, MaPhim, MaPhong, NgayChieu, GioBatDau, GioKetThuc, GiaVeCoBan, TrangThai) VALUES
('SC014', 'PH001', 'P001', TO_DATE('2025-12-25', 'YYYY-MM-DD'), TO_TIMESTAMP('2025-12-25 10:00:00', 'YYYY-MM-DD HH24:MI:SS'), TO_TIMESTAMP('2025-12-25 12:30:00', 'YYYY-MM-DD HH24:MI:SS'), 120000, 'Đang mở');

INSERT INTO SUAT_CHIEU (MaSuatChieu, MaPhim, MaPhong, NgayChieu, GioBatDau, GioKetThuc, GiaVeCoBan, TrangThai) VALUES
('SC015', 'PH008', 'P004', TO_DATE('2025-12-25', 'YYYY-MM-DD'), TO_TIMESTAMP('2025-12-25 20:00:00', 'YYYY-MM-DD HH24:MI:SS'), TO_TIMESTAMP('2025-12-25 21:40:00', 'YYYY-MM-DD HH24:MI:SS'), 110000, 'Đang mở');

-- Ngày 31/12/2025 (Thứ 3 - Đêm Giao thừa): 2 suất
INSERT INTO SUAT_CHIEU (MaSuatChieu, MaPhim, MaPhong, NgayChieu, GioBatDau, GioKetThuc, GiaVeCoBan, TrangThai) VALUES
('SC016', 'PH005', 'P005', TO_DATE('2025-12-31', 'YYYY-MM-DD'), TO_TIMESTAMP('2025-12-31 20:00:00', 'YYYY-MM-DD HH24:MI:SS'), TO_TIMESTAMP('2025-12-31 22:30:00', 'YYYY-MM-DD HH24:MI:SS'), 120000, 'Đang mở');

INSERT INTO SUAT_CHIEU (MaSuatChieu, MaPhim, MaPhong, NgayChieu, GioBatDau, GioKetThuc, GiaVeCoBan, TrangThai) VALUES
('SC017', 'PH006', 'P003', TO_DATE('2025-12-31', 'YYYY-MM-DD'), TO_TIMESTAMP('2025-12-31 18:00:00', 'YYYY-MM-DD HH24:MI:SS'), TO_TIMESTAMP('2025-12-31 20:40:00', 'YYYY-MM-DD HH24:MI:SS'), 150000, 'Đang mở');

COMMIT;

-- ========== DỮ LIỆU BỔ SUNG DEMO TRANSACTION (MỨC VỪA) ==========
-- Dọn dữ liệu demo cũ để block này có thể chạy lại nhiều lần
DELETE FROM AP_DUNG WHERE MaVe BETWEEN 'VE101' AND 'VE124';
DELETE FROM VE_XEM_PHIM WHERE MaVe BETWEEN 'VE101' AND 'VE124';
DELETE FROM GOM WHERE MaDonHang BETWEEN 'DH101' AND 'DH124';
DELETE FROM THANH_TOAN WHERE MaThanhToan BETWEEN 'TT101' AND 'TT124';
DELETE FROM DON_HANG WHERE MaDonHang BETWEEN 'DH101' AND 'DH124';

COMMIT;

-- ========== ĐƠN HÀNG BỔ SUNG ==========
INSERT INTO DON_HANG (MaDonHang, MaNguoiDung_KH, PhuongThuc, ThoiGianDat, TongTien, TrangThai) VALUES
('DH101', 'KH001', 'Online', TO_TIMESTAMP('2026-01-02 09:15:00', 'YYYY-MM-DD HH24:MI:SS'), 165000, 'Đã thanh toán');
INSERT INTO DON_HANG (MaDonHang, MaNguoiDung_KH, PhuongThuc, ThoiGianDat, TongTien, TrangThai) VALUES
('DH102', 'KH002', 'App', TO_TIMESTAMP('2026-01-02 10:00:00', 'YYYY-MM-DD HH24:MI:SS'), 130000, 'Đã thanh toán');
INSERT INTO DON_HANG (MaDonHang, MaNguoiDung_KH, PhuongThuc, ThoiGianDat, TongTien, TrangThai) VALUES
('DH103', 'KH003', 'Web', TO_TIMESTAMP('2026-01-02 10:40:00', 'YYYY-MM-DD HH24:MI:SS'), 220000, 'Đã thanh toán');
INSERT INTO DON_HANG (MaDonHang, MaNguoiDung_KH, PhuongThuc, ThoiGianDat, TongTien, TrangThai) VALUES
('DH104', 'KH004', 'Tại quầy', TO_TIMESTAMP('2026-01-03 08:30:00', 'YYYY-MM-DD HH24:MI:SS'), 175000, 'Đã thanh toán');
INSERT INTO DON_HANG (MaDonHang, MaNguoiDung_KH, PhuongThuc, ThoiGianDat, TongTien, TrangThai) VALUES
('DH105', 'KH005', 'Online', TO_TIMESTAMP('2026-01-03 09:20:00', 'YYYY-MM-DD HH24:MI:SS'), 140000, 'Đã thanh toán');
INSERT INTO DON_HANG (MaDonHang, MaNguoiDung_KH, PhuongThuc, ThoiGianDat, TongTien, TrangThai) VALUES
('DH106', 'KH006', 'App', TO_TIMESTAMP('2026-01-03 10:10:00', 'YYYY-MM-DD HH24:MI:SS'), 210000, 'Đã thanh toán');
INSERT INTO DON_HANG (MaDonHang, MaNguoiDung_KH, PhuongThuc, ThoiGianDat, TongTien, TrangThai) VALUES
('DH107', 'KH007', 'Web', TO_TIMESTAMP('2026-01-03 11:00:00', 'YYYY-MM-DD HH24:MI:SS'), 270000, 'Đã thanh toán');
INSERT INTO DON_HANG (MaDonHang, MaNguoiDung_KH, PhuongThuc, ThoiGianDat, TongTien, TrangThai) VALUES
('DH108', 'KH008', 'Online', TO_TIMESTAMP('2026-01-04 08:45:00', 'YYYY-MM-DD HH24:MI:SS'), 300000, 'Đã thanh toán');
INSERT INTO DON_HANG (MaDonHang, MaNguoiDung_KH, PhuongThuc, ThoiGianDat, TongTien, TrangThai) VALUES
('DH109', 'KH009', 'Tại quầy', TO_TIMESTAMP('2026-01-04 09:30:00', 'YYYY-MM-DD HH24:MI:SS'), 175000, 'Đã thanh toán');
INSERT INTO DON_HANG (MaDonHang, MaNguoiDung_KH, PhuongThuc, ThoiGianDat, TongTien, TrangThai) VALUES
('DH110', 'KH010', 'App', TO_TIMESTAMP('2026-01-04 10:15:00', 'YYYY-MM-DD HH24:MI:SS'), 130000, 'Đã thanh toán');
INSERT INTO DON_HANG (MaDonHang, MaNguoiDung_KH, PhuongThuc, ThoiGianDat, TongTien, TrangThai) VALUES
('DH111', 'KH011', 'Online', TO_TIMESTAMP('2026-01-05 08:20:00', 'YYYY-MM-DD HH24:MI:SS'), 220000, 'Đã thanh toán');
INSERT INTO DON_HANG (MaDonHang, MaNguoiDung_KH, PhuongThuc, ThoiGianDat, TongTien, TrangThai) VALUES
('DH112', 'KH012', 'Web', TO_TIMESTAMP('2026-01-05 09:10:00', 'YYYY-MM-DD HH24:MI:SS'), 165000, 'Đã thanh toán');
INSERT INTO DON_HANG (MaDonHang, MaNguoiDung_KH, PhuongThuc, ThoiGianDat, TongTien, TrangThai) VALUES
('DH113', 'KH013', 'Online', TO_TIMESTAMP('2026-01-06 10:00:00', 'YYYY-MM-DD HH24:MI:SS'), 270000, 'Chờ thanh toán');
INSERT INTO DON_HANG (MaDonHang, MaNguoiDung_KH, PhuongThuc, ThoiGianDat, TongTien, TrangThai) VALUES
('DH114', 'KH014', 'App', TO_TIMESTAMP('2026-01-06 10:40:00', 'YYYY-MM-DD HH24:MI:SS'), 175000, 'Chờ thanh toán');
INSERT INTO DON_HANG (MaDonHang, MaNguoiDung_KH, PhuongThuc, ThoiGianDat, TongTien, TrangThai) VALUES
('DH115', 'KH015', 'Web', TO_TIMESTAMP('2026-01-06 11:20:00', 'YYYY-MM-DD HH24:MI:SS'), 140000, 'Chờ thanh toán');
INSERT INTO DON_HANG (MaDonHang, MaNguoiDung_KH, PhuongThuc, ThoiGianDat, TongTien, TrangThai) VALUES
('DH116', 'KH016', 'Tại quầy', TO_TIMESTAMP('2026-01-07 08:10:00', 'YYYY-MM-DD HH24:MI:SS'), 210000, 'Chờ thanh toán');
INSERT INTO DON_HANG (MaDonHang, MaNguoiDung_KH, PhuongThuc, ThoiGianDat, TongTien, TrangThai) VALUES
('DH117', 'KH017', 'Online', TO_TIMESTAMP('2026-01-07 08:55:00', 'YYYY-MM-DD HH24:MI:SS'), 300000, 'Chờ thanh toán');
INSERT INTO DON_HANG (MaDonHang, MaNguoiDung_KH, PhuongThuc, ThoiGianDat, TongTien, TrangThai) VALUES
('DH118', 'KH018', 'App', TO_TIMESTAMP('2026-01-07 09:35:00', 'YYYY-MM-DD HH24:MI:SS'), 130000, 'Chờ thanh toán');
INSERT INTO DON_HANG (MaDonHang, MaNguoiDung_KH, PhuongThuc, ThoiGianDat, TongTien, TrangThai) VALUES
('DH119', 'KH019', 'Web', TO_TIMESTAMP('2026-01-08 10:05:00', 'YYYY-MM-DD HH24:MI:SS'), 220000, 'Chờ thanh toán');
INSERT INTO DON_HANG (MaDonHang, MaNguoiDung_KH, PhuongThuc, ThoiGianDat, TongTien, TrangThai) VALUES
('DH120', 'KH020', 'Tại quầy', TO_TIMESTAMP('2026-01-08 10:50:00', 'YYYY-MM-DD HH24:MI:SS'), 165000, 'Chờ thanh toán');
INSERT INTO DON_HANG (MaDonHang, MaNguoiDung_KH, PhuongThuc, ThoiGianDat, TongTien, TrangThai) VALUES
('DH121', 'KH001', 'Online', TO_TIMESTAMP('2026-01-09 09:25:00', 'YYYY-MM-DD HH24:MI:SS'), 140000, 'Hủy');
INSERT INTO DON_HANG (MaDonHang, MaNguoiDung_KH, PhuongThuc, ThoiGianDat, TongTien, TrangThai) VALUES
('DH122', 'KH002', 'App', TO_TIMESTAMP('2026-01-09 10:15:00', 'YYYY-MM-DD HH24:MI:SS'), 175000, 'Hủy');
INSERT INTO DON_HANG (MaDonHang, MaNguoiDung_KH, PhuongThuc, ThoiGianDat, TongTien, TrangThai) VALUES
('DH123', 'KH003', 'Web', TO_TIMESTAMP('2026-01-09 11:05:00', 'YYYY-MM-DD HH24:MI:SS'), 210000, 'Hủy');
INSERT INTO DON_HANG (MaDonHang, MaNguoiDung_KH, PhuongThuc, ThoiGianDat, TongTien, TrangThai) VALUES
('DH124', 'KH004', 'Tại quầy', TO_TIMESTAMP('2026-01-10 08:40:00', 'YYYY-MM-DD HH24:MI:SS'), 270000, 'Hủy');

COMMIT;

-- ========== GỒM BỔ SUNG ==========
INSERT INTO GOM (MaDonHang, MaHang, SoLuong, DonGia) VALUES ('DH101','MH001',1,45000);
INSERT INTO GOM (MaDonHang, MaHang, SoLuong, DonGia) VALUES ('DH102','MH002',1,30000);
INSERT INTO GOM (MaDonHang, MaHang, SoLuong, DonGia) VALUES ('DH103','MH003',1,70000);
INSERT INTO GOM (MaDonHang, MaHang, SoLuong, DonGia) VALUES ('DH104','MH006',1,55000);
INSERT INTO GOM (MaDonHang, MaHang, SoLuong, DonGia) VALUES ('DH105','MH007',1,40000);
INSERT INTO GOM (MaDonHang, MaHang, SoLuong, DonGia) VALUES ('DH106','MH004',1,60000);
INSERT INTO GOM (MaDonHang, MaHang, SoLuong, DonGia) VALUES ('DH107','MH008',1,150000);
INSERT INTO GOM (MaDonHang, MaHang, SoLuong, DonGia) VALUES ('DH108','MH005',1,200000);
INSERT INTO GOM (MaDonHang, MaHang, SoLuong, DonGia) VALUES ('DH109','MH006',1,55000);
INSERT INTO GOM (MaDonHang, MaHang, SoLuong, DonGia) VALUES ('DH110','MH002',1,30000);
INSERT INTO GOM (MaDonHang, MaHang, SoLuong, DonGia) VALUES ('DH111','MH003',1,70000);
INSERT INTO GOM (MaDonHang, MaHang, SoLuong, DonGia) VALUES ('DH112','MH001',1,45000);
INSERT INTO GOM (MaDonHang, MaHang, SoLuong, DonGia) VALUES ('DH113','MH008',1,150000);
INSERT INTO GOM (MaDonHang, MaHang, SoLuong, DonGia) VALUES ('DH114','MH006',1,55000);
INSERT INTO GOM (MaDonHang, MaHang, SoLuong, DonGia) VALUES ('DH115','MH007',1,40000);
INSERT INTO GOM (MaDonHang, MaHang, SoLuong, DonGia) VALUES ('DH116','MH004',1,60000);
INSERT INTO GOM (MaDonHang, MaHang, SoLuong, DonGia) VALUES ('DH117','MH005',1,200000);
INSERT INTO GOM (MaDonHang, MaHang, SoLuong, DonGia) VALUES ('DH118','MH002',1,30000);
INSERT INTO GOM (MaDonHang, MaHang, SoLuong, DonGia) VALUES ('DH119','MH003',1,70000);
INSERT INTO GOM (MaDonHang, MaHang, SoLuong, DonGia) VALUES ('DH120','MH001',1,45000);
INSERT INTO GOM (MaDonHang, MaHang, SoLuong, DonGia) VALUES ('DH121','MH007',1,40000);
INSERT INTO GOM (MaDonHang, MaHang, SoLuong, DonGia) VALUES ('DH122','MH006',1,55000);
INSERT INTO GOM (MaDonHang, MaHang, SoLuong, DonGia) VALUES ('DH123','MH004',1,60000);
INSERT INTO GOM (MaDonHang, MaHang, SoLuong, DonGia) VALUES ('DH124','MH008',1,150000);

COMMIT;

-- ========== VÉ XEM PHIM BỔ SUNG ==========
INSERT INTO VE_XEM_PHIM (MaVe, MaSuatChieu, MaPhong, HangGhe, SoGhe, MaNguoiDung_KH, MaDonHang, GiaVeCuoi, NgayDat, TrangThai) VALUES
('VE101', 'SC001', 'P001', 'A', 1, 'KH001', 'DH101', 120000, TO_TIMESTAMP('2026-01-02 09:17:00', 'YYYY-MM-DD HH24:MI:SS'), 'Đã thanh toán');
INSERT INTO VE_XEM_PHIM (MaVe, MaSuatChieu, MaPhong, HangGhe, SoGhe, MaNguoiDung_KH, MaDonHang, GiaVeCuoi, NgayDat, TrangThai) VALUES
('VE102', 'SC002', 'P002', 'A', 1, 'KH002', 'DH102', 100000, TO_TIMESTAMP('2026-01-02 10:02:00', 'YYYY-MM-DD HH24:MI:SS'), 'Đã thanh toán');
INSERT INTO VE_XEM_PHIM (MaVe, MaSuatChieu, MaPhong, HangGhe, SoGhe, MaNguoiDung_KH, MaDonHang, GiaVeCuoi, NgayDat, TrangThai) VALUES
('VE103', 'SC003', 'P003', 'C', 5, 'KH003', 'DH103', 150000, TO_TIMESTAMP('2026-01-02 10:42:00', 'YYYY-MM-DD HH24:MI:SS'), 'Đã thanh toán');
INSERT INTO VE_XEM_PHIM (MaVe, MaSuatChieu, MaPhong, HangGhe, SoGhe, MaNguoiDung_KH, MaDonHang, GiaVeCuoi, NgayDat, TrangThai) VALUES
('VE104', 'SC004', 'P001', 'A', 2, 'KH004', 'DH104', 120000, TO_TIMESTAMP('2026-01-03 08:32:00', 'YYYY-MM-DD HH24:MI:SS'), 'Đã thanh toán');
INSERT INTO VE_XEM_PHIM (MaVe, MaSuatChieu, MaPhong, HangGhe, SoGhe, MaNguoiDung_KH, MaDonHang, GiaVeCuoi, NgayDat, TrangThai) VALUES
('VE105', 'SC002', 'P002', 'A', 2, 'KH005', 'DH105', 100000, TO_TIMESTAMP('2026-01-03 09:22:00', 'YYYY-MM-DD HH24:MI:SS'), 'Đã thanh toán');
INSERT INTO VE_XEM_PHIM (MaVe, MaSuatChieu, MaPhong, HangGhe, SoGhe, MaNguoiDung_KH, MaDonHang, GiaVeCuoi, NgayDat, TrangThai) VALUES
('VE106', 'SC003', 'P003', 'C', 6, 'KH006', 'DH106', 150000, TO_TIMESTAMP('2026-01-03 10:12:00', 'YYYY-MM-DD HH24:MI:SS'), 'Đã thanh toán');
INSERT INTO VE_XEM_PHIM (MaVe, MaSuatChieu, MaPhong, HangGhe, SoGhe, MaNguoiDung_KH, MaDonHang, GiaVeCuoi, NgayDat, TrangThai) VALUES
('VE107', 'SC001', 'P001', 'A', 3, 'KH007', 'DH107', 120000, TO_TIMESTAMP('2026-01-03 11:02:00', 'YYYY-MM-DD HH24:MI:SS'), 'Đã thanh toán');
INSERT INTO VE_XEM_PHIM (MaVe, MaSuatChieu, MaPhong, HangGhe, SoGhe, MaNguoiDung_KH, MaDonHang, GiaVeCuoi, NgayDat, TrangThai) VALUES
('VE108', 'SC002', 'P002', 'A', 1, 'KH008', 'DH108', 100000, TO_TIMESTAMP('2026-01-04 08:47:00', 'YYYY-MM-DD HH24:MI:SS'), 'Đã thanh toán');
INSERT INTO VE_XEM_PHIM (MaVe, MaSuatChieu, MaPhong, HangGhe, SoGhe, MaNguoiDung_KH, MaDonHang, GiaVeCuoi, NgayDat, TrangThai) VALUES
('VE109', 'SC004', 'P001', 'B', 1, 'KH009', 'DH109', 120000, TO_TIMESTAMP('2026-01-04 09:32:00', 'YYYY-MM-DD HH24:MI:SS'), 'Đã thanh toán');
INSERT INTO VE_XEM_PHIM (MaVe, MaSuatChieu, MaPhong, HangGhe, SoGhe, MaNguoiDung_KH, MaDonHang, GiaVeCuoi, NgayDat, TrangThai) VALUES
('VE110', 'SC002', 'P002', 'A', 2, 'KH010', 'DH110', 100000, TO_TIMESTAMP('2026-01-04 10:17:00', 'YYYY-MM-DD HH24:MI:SS'), 'Đã thanh toán');
INSERT INTO VE_XEM_PHIM (MaVe, MaSuatChieu, MaPhong, HangGhe, SoGhe, MaNguoiDung_KH, MaDonHang, GiaVeCuoi, NgayDat, TrangThai) VALUES
('VE111', 'SC003', 'P003', 'C', 5, 'KH011', 'DH111', 150000, TO_TIMESTAMP('2026-01-05 08:22:00', 'YYYY-MM-DD HH24:MI:SS'), 'Đã thanh toán');
INSERT INTO VE_XEM_PHIM (MaVe, MaSuatChieu, MaPhong, HangGhe, SoGhe, MaNguoiDung_KH, MaDonHang, GiaVeCuoi, NgayDat, TrangThai) VALUES
('VE112', 'SC001', 'P001', 'B', 2, 'KH012', 'DH112', 120000, TO_TIMESTAMP('2026-01-05 09:12:00', 'YYYY-MM-DD HH24:MI:SS'), 'Đã thanh toán');
INSERT INTO VE_XEM_PHIM (MaVe, MaSuatChieu, MaPhong, HangGhe, SoGhe, MaNguoiDung_KH, MaDonHang, GiaVeCuoi, NgayDat, TrangThai) VALUES
('VE113', 'SC004', 'P001', 'E', 1, 'KH013', 'DH113', 120000, TO_TIMESTAMP('2026-01-06 10:02:00', 'YYYY-MM-DD HH24:MI:SS'), 'Đã đặt');
INSERT INTO VE_XEM_PHIM (MaVe, MaSuatChieu, MaPhong, HangGhe, SoGhe, MaNguoiDung_KH, MaDonHang, GiaVeCuoi, NgayDat, TrangThai) VALUES
('VE114', 'SC001', 'P001', 'E', 2, 'KH014', 'DH114', 120000, TO_TIMESTAMP('2026-01-06 10:42:00', 'YYYY-MM-DD HH24:MI:SS'), 'Đã đặt');
INSERT INTO VE_XEM_PHIM (MaVe, MaSuatChieu, MaPhong, HangGhe, SoGhe, MaNguoiDung_KH, MaDonHang, GiaVeCuoi, NgayDat, TrangThai) VALUES
('VE115', 'SC002', 'P002', 'A', 1, 'KH015', 'DH115', 100000, TO_TIMESTAMP('2026-01-06 11:22:00', 'YYYY-MM-DD HH24:MI:SS'), 'Đã đặt');
INSERT INTO VE_XEM_PHIM (MaVe, MaSuatChieu, MaPhong, HangGhe, SoGhe, MaNguoiDung_KH, MaDonHang, GiaVeCuoi, NgayDat, TrangThai) VALUES
('VE116', 'SC003', 'P003', 'C', 6, 'KH016', 'DH116', 150000, TO_TIMESTAMP('2026-01-07 08:12:00', 'YYYY-MM-DD HH24:MI:SS'), 'Đã đặt');
INSERT INTO VE_XEM_PHIM (MaVe, MaSuatChieu, MaPhong, HangGhe, SoGhe, MaNguoiDung_KH, MaDonHang, GiaVeCuoi, NgayDat, TrangThai) VALUES
('VE117', 'SC002', 'P002', 'A', 2, 'KH017', 'DH117', 100000, TO_TIMESTAMP('2026-01-07 08:57:00', 'YYYY-MM-DD HH24:MI:SS'), 'Đã đặt');
INSERT INTO VE_XEM_PHIM (MaVe, MaSuatChieu, MaPhong, HangGhe, SoGhe, MaNguoiDung_KH, MaDonHang, GiaVeCuoi, NgayDat, TrangThai) VALUES
('VE118', 'SC001', 'P001', 'A', 1, 'KH018', 'DH118', 120000, TO_TIMESTAMP('2026-01-07 09:37:00', 'YYYY-MM-DD HH24:MI:SS'), 'Đã đặt');
INSERT INTO VE_XEM_PHIM (MaVe, MaSuatChieu, MaPhong, HangGhe, SoGhe, MaNguoiDung_KH, MaDonHang, GiaVeCuoi, NgayDat, TrangThai) VALUES
('VE119', 'SC003', 'P003', 'C', 5, 'KH019', 'DH119', 150000, TO_TIMESTAMP('2026-01-08 10:07:00', 'YYYY-MM-DD HH24:MI:SS'), 'Đã đặt');
INSERT INTO VE_XEM_PHIM (MaVe, MaSuatChieu, MaPhong, HangGhe, SoGhe, MaNguoiDung_KH, MaDonHang, GiaVeCuoi, NgayDat, TrangThai) VALUES
('VE120', 'SC004', 'P001', 'A', 2, 'KH020', 'DH120', 120000, TO_TIMESTAMP('2026-01-08 10:52:00', 'YYYY-MM-DD HH24:MI:SS'), 'Đã đặt');
INSERT INTO VE_XEM_PHIM (MaVe, MaSuatChieu, MaPhong, HangGhe, SoGhe, MaNguoiDung_KH, MaDonHang, GiaVeCuoi, NgayDat, TrangThai) VALUES
('VE121', 'SC002', 'P002', 'A', 1, 'KH001', 'DH121', 100000, TO_TIMESTAMP('2026-01-09 09:27:00', 'YYYY-MM-DD HH24:MI:SS'), 'Hủy');
INSERT INTO VE_XEM_PHIM (MaVe, MaSuatChieu, MaPhong, HangGhe, SoGhe, MaNguoiDung_KH, MaDonHang, GiaVeCuoi, NgayDat, TrangThai) VALUES
('VE122', 'SC004', 'P001', 'B', 1, 'KH002', 'DH122', 120000, TO_TIMESTAMP('2026-01-09 10:17:00', 'YYYY-MM-DD HH24:MI:SS'), 'Hủy');
INSERT INTO VE_XEM_PHIM (MaVe, MaSuatChieu, MaPhong, HangGhe, SoGhe, MaNguoiDung_KH, MaDonHang, GiaVeCuoi, NgayDat, TrangThai) VALUES
('VE123', 'SC003', 'P003', 'C', 6, 'KH003', 'DH123', 150000, TO_TIMESTAMP('2026-01-09 11:07:00', 'YYYY-MM-DD HH24:MI:SS'), 'Hủy');
INSERT INTO VE_XEM_PHIM (MaVe, MaSuatChieu, MaPhong, HangGhe, SoGhe, MaNguoiDung_KH, MaDonHang, GiaVeCuoi, NgayDat, TrangThai) VALUES
('VE124', 'SC001', 'P001', 'A', 3, 'KH004', 'DH124', 120000, TO_TIMESTAMP('2026-01-10 08:42:00', 'YYYY-MM-DD HH24:MI:SS'), 'Hủy');

COMMIT;

-- ========== THANH TOÁN BỔ SUNG ==========
INSERT INTO THANH_TOAN (MaThanhToan, MaDonHang, NgayThanhToan, PhuongThuc, TrangThai, SoTien) VALUES
('TT101', 'DH101', TO_TIMESTAMP('2026-01-02 09:20:00', 'YYYY-MM-DD HH24:MI:SS'), 'Thẻ', 'Đã thanh toán', 165000);
INSERT INTO THANH_TOAN (MaThanhToan, MaDonHang, NgayThanhToan, PhuongThuc, TrangThai, SoTien) VALUES
('TT102', 'DH102', TO_TIMESTAMP('2026-01-02 10:05:00', 'YYYY-MM-DD HH24:MI:SS'), 'Momo', 'Đã thanh toán', 130000);
INSERT INTO THANH_TOAN (MaThanhToan, MaDonHang, NgayThanhToan, PhuongThuc, TrangThai, SoTien) VALUES
('TT103', 'DH103', TO_TIMESTAMP('2026-01-02 10:45:00', 'YYYY-MM-DD HH24:MI:SS'), 'ZaloPay', 'Đã thanh toán', 220000);
INSERT INTO THANH_TOAN (MaThanhToan, MaDonHang, NgayThanhToan, PhuongThuc, TrangThai, SoTien) VALUES
('TT104', 'DH104', TO_TIMESTAMP('2026-01-03 08:35:00', 'YYYY-MM-DD HH24:MI:SS'), 'Tiền mặt', 'Đã thanh toán', 175000);
INSERT INTO THANH_TOAN (MaThanhToan, MaDonHang, NgayThanhToan, PhuongThuc, TrangThai, SoTien) VALUES
('TT105', 'DH105', TO_TIMESTAMP('2026-01-03 09:25:00', 'YYYY-MM-DD HH24:MI:SS'), 'Visa', 'Đã thanh toán', 140000);
INSERT INTO THANH_TOAN (MaThanhToan, MaDonHang, NgayThanhToan, PhuongThuc, TrangThai, SoTien) VALUES
('TT106', 'DH106', TO_TIMESTAMP('2026-01-03 10:15:00', 'YYYY-MM-DD HH24:MI:SS'), 'Thẻ', 'Đã thanh toán', 210000);
INSERT INTO THANH_TOAN (MaThanhToan, MaDonHang, NgayThanhToan, PhuongThuc, TrangThai, SoTien) VALUES
('TT107', 'DH107', TO_TIMESTAMP('2026-01-03 11:05:00', 'YYYY-MM-DD HH24:MI:SS'), 'Momo', 'Đã thanh toán', 270000);
INSERT INTO THANH_TOAN (MaThanhToan, MaDonHang, NgayThanhToan, PhuongThuc, TrangThai, SoTien) VALUES
('TT108', 'DH108', TO_TIMESTAMP('2026-01-04 08:50:00', 'YYYY-MM-DD HH24:MI:SS'), 'Visa', 'Đã thanh toán', 300000);
INSERT INTO THANH_TOAN (MaThanhToan, MaDonHang, NgayThanhToan, PhuongThuc, TrangThai, SoTien) VALUES
('TT109', 'DH109', TO_TIMESTAMP('2026-01-04 09:35:00', 'YYYY-MM-DD HH24:MI:SS'), 'Tiền mặt', 'Đã thanh toán', 175000);
INSERT INTO THANH_TOAN (MaThanhToan, MaDonHang, NgayThanhToan, PhuongThuc, TrangThai, SoTien) VALUES
('TT110', 'DH110', TO_TIMESTAMP('2026-01-04 10:20:00', 'YYYY-MM-DD HH24:MI:SS'), 'ZaloPay', 'Đã thanh toán', 130000);
INSERT INTO THANH_TOAN (MaThanhToan, MaDonHang, NgayThanhToan, PhuongThuc, TrangThai, SoTien) VALUES
('TT111', 'DH111', TO_TIMESTAMP('2026-01-05 08:25:00', 'YYYY-MM-DD HH24:MI:SS'), 'Thẻ', 'Đã thanh toán', 220000);
INSERT INTO THANH_TOAN (MaThanhToan, MaDonHang, NgayThanhToan, PhuongThuc, TrangThai, SoTien) VALUES
('TT112', 'DH112', TO_TIMESTAMP('2026-01-05 09:15:00', 'YYYY-MM-DD HH24:MI:SS'), 'Momo', 'Đã thanh toán', 165000);
INSERT INTO THANH_TOAN (MaThanhToan, MaDonHang, NgayThanhToan, PhuongThuc, TrangThai, SoTien) VALUES
('TT113', 'DH113', TO_TIMESTAMP('2026-01-06 10:05:00', 'YYYY-MM-DD HH24:MI:SS'), 'Momo', 'Đang xử lý', 70000);
INSERT INTO THANH_TOAN (MaThanhToan, MaDonHang, NgayThanhToan, PhuongThuc, TrangThai, SoTien) VALUES
('TT114', 'DH114', TO_TIMESTAMP('2026-01-06 10:45:00', 'YYYY-MM-DD HH24:MI:SS'), 'ZaloPay', 'Đang xử lý', 50000);
INSERT INTO THANH_TOAN (MaThanhToan, MaDonHang, NgayThanhToan, PhuongThuc, TrangThai, SoTien) VALUES
('TT115', 'DH115', TO_TIMESTAMP('2026-01-06 11:25:00', 'YYYY-MM-DD HH24:MI:SS'), 'Tiền mặt', 'Đang xử lý', 40000);
INSERT INTO THANH_TOAN (MaThanhToan, MaDonHang, NgayThanhToan, PhuongThuc, TrangThai, SoTien) VALUES
('TT116', 'DH116', TO_TIMESTAMP('2026-01-07 08:15:00', 'YYYY-MM-DD HH24:MI:SS'), 'Visa', 'Đang xử lý', 90000);
INSERT INTO THANH_TOAN (MaThanhToan, MaDonHang, NgayThanhToan, PhuongThuc, TrangThai, SoTien) VALUES
('TT117', 'DH117', TO_TIMESTAMP('2026-01-07 09:00:00', 'YYYY-MM-DD HH24:MI:SS'), 'Thẻ', 'Đang xử lý', 120000);
INSERT INTO THANH_TOAN (MaThanhToan, MaDonHang, NgayThanhToan, PhuongThuc, TrangThai, SoTien) VALUES
('TT118', 'DH118', TO_TIMESTAMP('2026-01-07 09:40:00', 'YYYY-MM-DD HH24:MI:SS'), 'Momo', 'Đang xử lý', 60000);
INSERT INTO THANH_TOAN (MaThanhToan, MaDonHang, NgayThanhToan, PhuongThuc, TrangThai, SoTien) VALUES
('TT119', 'DH119', TO_TIMESTAMP('2026-01-08 10:10:00', 'YYYY-MM-DD HH24:MI:SS'), 'ZaloPay', 'Đang xử lý', 80000);
INSERT INTO THANH_TOAN (MaThanhToan, MaDonHang, NgayThanhToan, PhuongThuc, TrangThai, SoTien) VALUES
('TT120', 'DH120', TO_TIMESTAMP('2026-01-08 10:55:00', 'YYYY-MM-DD HH24:MI:SS'), 'Tiền mặt', 'Đang xử lý', 50000);
INSERT INTO THANH_TOAN (MaThanhToan, MaDonHang, NgayThanhToan, PhuongThuc, TrangThai, SoTien) VALUES
('TT121', 'DH121', TO_TIMESTAMP('2026-01-09 09:30:00', 'YYYY-MM-DD HH24:MI:SS'), 'Visa', 'Thất bại', 0);
INSERT INTO THANH_TOAN (MaThanhToan, MaDonHang, NgayThanhToan, PhuongThuc, TrangThai, SoTien) VALUES
('TT122', 'DH122', TO_TIMESTAMP('2026-01-09 10:20:00', 'YYYY-MM-DD HH24:MI:SS'), 'Thẻ', 'Thất bại', 0);
INSERT INTO THANH_TOAN (MaThanhToan, MaDonHang, NgayThanhToan, PhuongThuc, TrangThai, SoTien) VALUES
('TT123', 'DH123', TO_TIMESTAMP('2026-01-09 11:10:00', 'YYYY-MM-DD HH24:MI:SS'), 'Momo', 'Thất bại', 0);
INSERT INTO THANH_TOAN (MaThanhToan, MaDonHang, NgayThanhToan, PhuongThuc, TrangThai, SoTien) VALUES
('TT124', 'DH124', TO_TIMESTAMP('2026-01-10 08:45:00', 'YYYY-MM-DD HH24:MI:SS'), 'ZaloPay', 'Thất bại', 0);

COMMIT;

-- ========== BỔ SUNG THÊM 100 ĐƠN HÀNG DEMO ==========
-- Dọn dữ liệu cũ để block này có thể chạy lại
DELETE FROM GOM WHERE MaDonHang BETWEEN 'DH201' AND 'DH300';
DELETE FROM THANH_TOAN WHERE MaDonHang BETWEEN 'DH201' AND 'DH300';
DELETE FROM DON_HANG WHERE MaDonHang BETWEEN 'DH201' AND 'DH300';

COMMIT;

DECLARE
	v_ma_don_hang    VARCHAR2(20);
	v_ma_nguoi_dung  VARCHAR2(20);
	v_phuong_thuc    VARCHAR2(50);
	v_trang_thai     VARCHAR2(20);
	v_thoi_gian_dat  TIMESTAMP;
	v_tong_tien      NUMBER;
BEGIN
	FOR i IN 201 .. 300 LOOP
		v_ma_don_hang := 'DH' || TO_CHAR(i);
		v_ma_nguoi_dung := 'KH' || LPAD(TO_CHAR(MOD(i - 201, 20) + 1), 3, '0');

		v_phuong_thuc := CASE MOD(i, 4)
			WHEN 0 THEN 'Online'
			WHEN 1 THEN 'App'
			WHEN 2 THEN 'Web'
			ELSE 'Tại quầy'
		END;

		v_trang_thai := CASE
			WHEN i <= 260 THEN 'Đã thanh toán'
			WHEN i <= 285 THEN 'Chờ thanh toán'
			ELSE 'Hủy'
		END;

		v_thoi_gian_dat := TO_TIMESTAMP('2026-02-01 08:00:00', 'YYYY-MM-DD HH24:MI:SS')
						  + NUMTODSINTERVAL((i - 200) * 7, 'MINUTE');

		v_tong_tien := CASE MOD(i, 6)
			WHEN 0 THEN 95000
			WHEN 1 THEN 130000
			WHEN 2 THEN 165000
			WHEN 3 THEN 175000
			WHEN 4 THEN 220000
			ELSE 300000
		END;

		INSERT INTO DON_HANG (MaDonHang, MaNguoiDung_KH, PhuongThuc, ThoiGianDat, TongTien, TrangThai)
		VALUES (v_ma_don_hang, v_ma_nguoi_dung, v_phuong_thuc, v_thoi_gian_dat, v_tong_tien, v_trang_thai);
	END LOOP;

	COMMIT;
END;
/

-- ========== DATA MẪU TƯƠNG TÁC TRANSACTION ==========
-- Mục tiêu: để bạn tự INSERT/UPDATE/DELETE vào GOM, VE_XEM_PHIM, THANH_TOAN
-- rồi quan sát trigger tự cập nhật TongTien + TrangThai đơn hàng.
DELETE FROM AP_DUNG WHERE MaVe BETWEEN 'VE901' AND 'VE906';
DELETE FROM VE_XEM_PHIM WHERE MaVe BETWEEN 'VE901' AND 'VE906';
DELETE FROM SUAT_CHIEU WHERE MaSuatChieu = 'SC901';
DELETE FROM GHE WHERE MaPhong = 'P006' AND HangGhe = 'D' AND SoGhe BETWEEN 3 AND 6;
DELETE FROM AP_DUNG WHERE MaVe BETWEEN 'VE901' AND 'VE912';
DELETE FROM VE_XEM_PHIM WHERE MaVe BETWEEN 'VE901' AND 'VE912';
DELETE FROM GOM WHERE MaDonHang BETWEEN 'DH901' AND 'DH912';
DELETE FROM THANH_TOAN WHERE MaThanhToan BETWEEN 'TT901' AND 'TT930';
DELETE FROM DON_HANG WHERE MaDonHang BETWEEN 'DH901' AND 'DH912';

COMMIT;

-- 12 đơn ở trạng thái mở để thao tác transaction thủ công
INSERT INTO DON_HANG (MaDonHang, MaNguoiDung_KH, PhuongThuc, ThoiGianDat, TongTien, TrangThai) VALUES ('DH901', 'KH001', 'Online', TO_TIMESTAMP('2026-03-01 09:00:00', 'YYYY-MM-DD HH24:MI:SS'), 0, 'Chờ thanh toán');
INSERT INTO DON_HANG (MaDonHang, MaNguoiDung_KH, PhuongThuc, ThoiGianDat, TongTien, TrangThai) VALUES ('DH902', 'KH002', 'App', TO_TIMESTAMP('2026-03-01 09:05:00', 'YYYY-MM-DD HH24:MI:SS'), 0, 'Chờ thanh toán');
INSERT INTO DON_HANG (MaDonHang, MaNguoiDung_KH, PhuongThuc, ThoiGianDat, TongTien, TrangThai) VALUES ('DH903', 'KH003', 'Web', TO_TIMESTAMP('2026-03-01 09:10:00', 'YYYY-MM-DD HH24:MI:SS'), 0, 'Chờ thanh toán');
INSERT INTO DON_HANG (MaDonHang, MaNguoiDung_KH, PhuongThuc, ThoiGianDat, TongTien, TrangThai) VALUES ('DH904', 'KH004', 'Tại quầy', TO_TIMESTAMP('2026-03-01 09:15:00', 'YYYY-MM-DD HH24:MI:SS'), 0, 'Chờ thanh toán');
INSERT INTO DON_HANG (MaDonHang, MaNguoiDung_KH, PhuongThuc, ThoiGianDat, TongTien, TrangThai) VALUES ('DH905', 'KH005', 'Online', TO_TIMESTAMP('2026-03-01 09:20:00', 'YYYY-MM-DD HH24:MI:SS'), 0, 'Chờ thanh toán');
INSERT INTO DON_HANG (MaDonHang, MaNguoiDung_KH, PhuongThuc, ThoiGianDat, TongTien, TrangThai) VALUES ('DH906', 'KH006', 'App', TO_TIMESTAMP('2026-03-01 09:25:00', 'YYYY-MM-DD HH24:MI:SS'), 0, 'Chờ thanh toán');
INSERT INTO DON_HANG (MaDonHang, MaNguoiDung_KH, PhuongThuc, ThoiGianDat, TongTien, TrangThai) VALUES ('DH907', 'KH007', 'Web', TO_TIMESTAMP('2026-03-01 09:30:00', 'YYYY-MM-DD HH24:MI:SS'), 0, 'Chờ thanh toán');
INSERT INTO DON_HANG (MaDonHang, MaNguoiDung_KH, PhuongThuc, ThoiGianDat, TongTien, TrangThai) VALUES ('DH908', 'KH008', 'Online', TO_TIMESTAMP('2026-03-01 09:35:00', 'YYYY-MM-DD HH24:MI:SS'), 0, 'Chờ thanh toán');
INSERT INTO DON_HANG (MaDonHang, MaNguoiDung_KH, PhuongThuc, ThoiGianDat, TongTien, TrangThai) VALUES ('DH909', 'KH009', 'Tại quầy', TO_TIMESTAMP('2026-03-01 09:40:00', 'YYYY-MM-DD HH24:MI:SS'), 0, 'Chờ thanh toán');
INSERT INTO DON_HANG (MaDonHang, MaNguoiDung_KH, PhuongThuc, ThoiGianDat, TongTien, TrangThai) VALUES ('DH910', 'KH010', 'App', TO_TIMESTAMP('2026-03-01 09:45:00', 'YYYY-MM-DD HH24:MI:SS'), 0, 'Chờ thanh toán');
INSERT INTO DON_HANG (MaDonHang, MaNguoiDung_KH, PhuongThuc, ThoiGianDat, TongTien, TrangThai) VALUES ('DH911', 'KH011', 'Web', TO_TIMESTAMP('2026-03-01 09:50:00', 'YYYY-MM-DD HH24:MI:SS'), 0, 'Chờ thanh toán');
INSERT INTO DON_HANG (MaDonHang, MaNguoiDung_KH, PhuongThuc, ThoiGianDat, TongTien, TrangThai) VALUES ('DH912', 'KH012', 'Online', TO_TIMESTAMP('2026-03-01 09:55:00', 'YYYY-MM-DD HH24:MI:SS'), 0, 'Chờ thanh toán');

COMMIT;

-- Dữ liệu nền ban đầu để bạn dễ thao tác tăng/giảm tổng tiền
INSERT INTO GOM (MaDonHang, MaHang, SoLuong, DonGia) VALUES ('DH901', 'MH001', 1, 45000);
INSERT INTO GOM (MaDonHang, MaHang, SoLuong, DonGia) VALUES ('DH902', 'MH003', 1, 70000);
INSERT INTO GOM (MaDonHang, MaHang, SoLuong, DonGia) VALUES ('DH903', 'MH006', 1, 55000);
INSERT INTO GOM (MaDonHang, MaHang, SoLuong, DonGia) VALUES ('DH904', 'MH007', 1, 40000);
INSERT INTO GOM (MaDonHang, MaHang, SoLuong, DonGia) VALUES ('DH905', 'MH002', 1, 30000);
INSERT INTO GOM (MaDonHang, MaHang, SoLuong, DonGia) VALUES ('DH906', 'MH004', 1, 60000);

INSERT INTO GHE (MaPhong, HangGhe, SoGhe, LoaiGhe) VALUES ('P006', 'D', 3, 'Giường nằm');
INSERT INTO GHE (MaPhong, HangGhe, SoGhe, LoaiGhe) VALUES ('P006', 'D', 4, 'Giường nằm');
INSERT INTO GHE (MaPhong, HangGhe, SoGhe, LoaiGhe) VALUES ('P006', 'D', 5, 'Giường nằm');
INSERT INTO GHE (MaPhong, HangGhe, SoGhe, LoaiGhe) VALUES ('P006', 'D', 6, 'Giường nằm');

INSERT INTO SUAT_CHIEU (MaSuatChieu, MaPhim, MaPhong, NgayChieu, GioBatDau, GioKetThuc, GiaVeCoBan, TrangThai) VALUES
('SC901', 'PH001', 'P006', TO_DATE('2026-03-01', 'YYYY-MM-DD'), TO_TIMESTAMP('2026-03-01 19:00:00', 'YYYY-MM-DD HH24:MI:SS'), TO_TIMESTAMP('2026-03-01 22:00:00', 'YYYY-MM-DD HH24:MI:SS'), 120000, 'Đang mở');

INSERT INTO VE_XEM_PHIM (MaVe, MaSuatChieu, MaPhong, HangGhe, SoGhe, MaNguoiDung_KH, MaDonHang, GiaVeCuoi, NgayDat, TrangThai) VALUES ('VE901', 'SC901', 'P006', 'D', 1, 'KH001', 'DH901', 120000, TO_TIMESTAMP('2026-03-01 09:01:00', 'YYYY-MM-DD HH24:MI:SS'), 'Đã đặt');
INSERT INTO VE_XEM_PHIM (MaVe, MaSuatChieu, MaPhong, HangGhe, SoGhe, MaNguoiDung_KH, MaDonHang, GiaVeCuoi, NgayDat, TrangThai) VALUES ('VE902', 'SC901', 'P006', 'D', 2, 'KH002', 'DH902', 120000, TO_TIMESTAMP('2026-03-01 09:06:00', 'YYYY-MM-DD HH24:MI:SS'), 'Đã đặt');
INSERT INTO VE_XEM_PHIM (MaVe, MaSuatChieu, MaPhong, HangGhe, SoGhe, MaNguoiDung_KH, MaDonHang, GiaVeCuoi, NgayDat, TrangThai) VALUES ('VE903', 'SC901', 'P006', 'D', 3, 'KH003', 'DH903', 120000, TO_TIMESTAMP('2026-03-01 09:11:00', 'YYYY-MM-DD HH24:MI:SS'), 'Đã đặt');
INSERT INTO VE_XEM_PHIM (MaVe, MaSuatChieu, MaPhong, HangGhe, SoGhe, MaNguoiDung_KH, MaDonHang, GiaVeCuoi, NgayDat, TrangThai) VALUES ('VE904', 'SC901', 'P006', 'D', 4, 'KH004', 'DH904', 120000, TO_TIMESTAMP('2026-03-01 09:16:00', 'YYYY-MM-DD HH24:MI:SS'), 'Đã đặt');
INSERT INTO VE_XEM_PHIM (MaVe, MaSuatChieu, MaPhong, HangGhe, SoGhe, MaNguoiDung_KH, MaDonHang, GiaVeCuoi, NgayDat, TrangThai) VALUES ('VE905', 'SC901', 'P006', 'D', 5, 'KH005', 'DH905', 120000, TO_TIMESTAMP('2026-03-01 09:21:00', 'YYYY-MM-DD HH24:MI:SS'), 'Đã đặt');
INSERT INTO VE_XEM_PHIM (MaVe, MaSuatChieu, MaPhong, HangGhe, SoGhe, MaNguoiDung_KH, MaDonHang, GiaVeCuoi, NgayDat, TrangThai) VALUES ('VE906', 'SC901', 'P006', 'D', 6, 'KH006', 'DH906', 120000, TO_TIMESTAMP('2026-03-01 09:26:00', 'YYYY-MM-DD HH24:MI:SS'), 'Đã đặt');

COMMIT;

-- Thanh toán mẫu rất ít để giữ không gian tương tác
-- DH901 đã thanh toán đủ để bạn demo trạng thái tự chuyển qua trigger
INSERT INTO THANH_TOAN (MaThanhToan, MaDonHang, NgayThanhToan, PhuongThuc, TrangThai, SoTien) VALUES ('TT901', 'DH901', TO_TIMESTAMP('2026-03-01 09:03:00', 'YYYY-MM-DD HH24:MI:SS'), 'Thẻ', 'Đã thanh toán', 165000);
-- DH902 mới thanh toán một phần, bạn có thể tự thêm TT mới để đủ tiền
INSERT INTO THANH_TOAN (MaThanhToan, MaDonHang, NgayThanhToan, PhuongThuc, TrangThai, SoTien) VALUES ('TT902', 'DH902', TO_TIMESTAMP('2026-03-01 09:08:00', 'YYYY-MM-DD HH24:MI:SS'), 'Momo', 'Đang xử lý', 50000);

COMMIT;

-- Gợi ý thao tác demo nhanh:
-- 1) INSERT thêm GOM/VE vào DH910 -> TongTien tăng tự động
-- 2) DELETE GOM của DH903 -> TongTien giảm tự động
-- 3) INSERT THANH_TOAN cho DH902 đủ tổng -> TrangThai DH902 tự đổi 'Đã thanh toán'
-- 4) UPDATE GOM SoLuong ở DH904 -> TongTien cập nhật theo chênh lệch

-- ========== QUẢN LÝ ==========
INSERT INTO QUAN_LY (MaNguoiDung_QTV, MaRapPhim) VALUES ('AD001', 'RAP001');
INSERT INTO QUAN_LY (MaNguoiDung_QTV, MaRapPhim) VALUES ('AD002', 'RAP002');
INSERT INTO QUAN_LY (MaNguoiDung_QTV, MaRapPhim) VALUES ('AD003', 'RAP003');

COMMIT;

-- ========== ÁP DỤNG KHUYẾN MÃI (AP_DUNG) ==========
-- Áp dụng KM005 (Giáng Sinh 50k) cho vé ngày 24-25/12
INSERT INTO AP_DUNG (MaVe, MaKhuyenMai) VALUES ('VE005', 'KM005');
INSERT INTO AP_DUNG (MaVe, MaKhuyenMai) VALUES ('VE006', 'KM005');
INSERT INTO AP_DUNG (MaVe, MaKhuyenMai) VALUES ('VE007', 'KM005');
INSERT INTO AP_DUNG (MaVe, MaKhuyenMai) VALUES ('VE008', 'KM005');
INSERT INTO AP_DUNG (MaVe, MaKhuyenMai) VALUES ('VE009', 'KM005');

-- Áp dụng KM002 (Silver 15k) cho vé của khách Silver
INSERT INTO AP_DUNG (MaVe, MaKhuyenMai) VALUES ('VE002', 'KM002');
INSERT INTO AP_DUNG (MaVe, MaKhuyenMai) VALUES ('VE006', 'KM002');

COMMIT;

-- Bật lại kiểm tra khóa ngoại (Enable Constraints)
ALTER TABLE GHE ENABLE CONSTRAINT fk_ghe_phong;
ALTER TABLE THE_LOAI_PHIM ENABLE CONSTRAINT fk_theloai_phim;
ALTER TABLE KHACH_HANG ENABLE CONSTRAINT fk_kh_tk;
ALTER TABLE QUAN_TRI_VIEN ENABLE CONSTRAINT fk_qtv_tk;
-- ========== DANH GIA ==========
-- Sample reviews from customers
INSERT INTO DANH_GIA (MaDanhGia, MaNguoiDung, MaPhim, NoiDung, DiemSo) VALUES
('DG001', 'KH001', 'PH001', 'Phim siêu hay, cái kết rất cảm động!', 10);
INSERT INTO DANH_GIA (MaDanhGia, MaNguoiDung, MaPhim, NoiDung, DiemSo) VALUES
('DG002', 'KH002', 'PH001', 'Đã xem 2 lần rồi, vẫn hay lắm', 9);
INSERT INTO DANH_GIA (MaDanhGia, MaNguoiDung, MaPhim, NoiDung, DiemSo) VALUES
('DG003', 'KH003', 'PH001', 'Bom tấn Marvel xứng đáng', 10);
INSERT INTO DANH_GIA (MaDanhGia, MaNguoiDung, MaPhim, NoiDung, DiemSo) VALUES
('DG004', 'KH004', 'PH002', 'Hài thật, cười bụi xịt', 8);
INSERT INTO DANH_GIA (MaDanhGia, MaNguoiDung, MaPhim, NoiDung, DiemSo) VALUES
('DG005', 'KH005', 'PH002', 'Phim Việt hay hiếm khi thấy', 9);
INSERT INTO DANH_GIA (MaDanhGia, MaNguoiDung, MaPhim, NoiDung, DiemSo) VALUES
('DG006', 'KH006', 'PH003', 'Fast & Furious vẫn luôn tuyệt vời', 9);
INSERT INTO DANH_GIA (MaDanhGia, MaNguoiDung, MaPhim, NoiDung, DiemSo) VALUES
('DG007', 'KH007', 'PH003', 'Action hay, nhạc hay, đáng xem', 9);
INSERT INTO DANH_GIA (MaDanhGia, MaNguoiDung, MaPhim, NoiDung, DiemSo) VALUES
('DG008', 'KH008', 'PH004', 'Conan lại xuất sắc, điều tra hay', 10);
INSERT INTO DANH_GIA (MaDanhGia, MaNguoiDung, MaPhim, NoiDung, DiemSo) VALUES
('DG009', 'KH009', 'PH005', 'Spider-Man siêu chất, đặc biệt có 3 nhân vật chính', 10);
INSERT INTO DANH_GIA (MaDanhGia, MaNguoiDung, MaPhim, NoiDung, DiemSo) VALUES
('DG010', 'KH010', 'PH005', 'Marvel Fan sẽ yêu phim này', 10);
INSERT INTO DANH_GIA (MaDanhGia, MaNguoiDung, MaPhim, NoiDung, DiemSo) VALUES
('DG011', 'KH011', 'PH006', 'Dune 2 tuyệt vời, sử thi điện ảnh', 10);
INSERT INTO DANH_GIA (MaDanhGia, MaNguoiDung, MaPhim, NoiDung, DiemSo) VALUES
('DG012', 'KH012', 'PH006', 'Hình ảnh đẹp, kinh tế về lịch sử', 9);
INSERT INTO DANH_GIA (MaDanhGia, MaNguoiDung, MaPhim, NoiDung, DiemSo) VALUES
('DG013', 'KH013', 'PH007', 'Lật Mặt 7 hay, hài và hành động mix vừa', 8);
INSERT INTO DANH_GIA (MaDanhGia, MaNguoiDung, MaPhim, NoiDung, DiemSo) VALUES
('DG014', 'KH014', 'PH008', 'Phim kinh dị hay, sợ xanh mặt', 8);
INSERT INTO DANH_GIA (MaDanhGia, MaNguoiDung, MaPhim, NoiDung, DiemSo) VALUES
('DG015', 'KH015', 'PH008', 'Hãng Conjuring luôn đáng tin cậy', 9);

COMMIT;

ALTER TABLE CA_LAM_VIEC ENABLE CONSTRAINT fk_ca_qtv;
ALTER TABLE DON_HANG ENABLE CONSTRAINT fk_dh_kh;
ALTER TABLE GOM ENABLE CONSTRAINT fk_gom_dh;
ALTER TABLE GOM ENABLE CONSTRAINT fk_gom_mh;
ALTER TABLE THANH_TOAN ENABLE CONSTRAINT fk_tt_dh;
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


COMMIT;
-- =============================================
-- SESSION 1: Thực hiện transaction
-- =============================================
BEGIN
    INSERT INTO VE_XEM_PHIM (MaVe, MaSuatChieu, MaPhong, HangGhe, SoGhe,
                              MaNguoiDung_KH, MaDonHang, GiaVeCuoi, NgayDat, TrangThai)
    VALUES ('VE923', 'SC001', 'P001', 'A', 2,
            'KH001', 'DH903', 120000, SYSTIMESTAMP, 'Da dat');

    -- DUNG LAI O DAY, CHUA COMMIT
    -- Qua Session 2 chay SELECT de thay trang thai tam thoi
    DBMS_OUTPUT.PUT_LINE('Da INSERT - chua COMMIT');

    COMMIT;
    DBMS_OUTPUT.PUT_LINE('Da COMMIT - trang thai chinh thuc!');
EXCEPTION
    WHEN OTHERS THEN
        ROLLBACK;
        DBMS_OUTPUT.PUT_LINE('Loi: ' || SQLERRM);
END;
/
ROLLBACK;
-- =============================================
-- SESSION 2: Quan sat (chay song song voi Session 1)
-- =============================================

-- Chay TRUOC khi Session 1 COMMIT -> khong thay VE999 (trang thai tam thoi)
SELECT MaVe, HangGhe, SoGhe, TrangThai
FROM VE_XEM_PHIM
WHERE MaDonHang = 'DH903';

-- Chay SAU khi Session 1 COMMIT -> thay VE999 (trang thai chinh thuc)
SELECT MaVe, HangGhe, SoGhe, TrangThai
FROM VE_XEM_PHIM
WHERE MaDonHang = 'DH923';

INSERT INTO VE_XEM_PHIM (MaVe, MaSuatChieu, MaPhong, HangGhe, SoGhe,
                          MaNguoiDung_KH, MaDonHang, GiaVeCuoi, NgayDat, TrangThai)
VALUES ('VE923', 'SC001', 'P001', 'B', 1,
        'KH001', 'DH903', 120000, SYSTIMESTAMP, 'Đã đặt');

ROLLBACK;

select * from VE_XEM_PHIM where maphong = 'P001' and masuatchieu = 'SC001';
delete from VE_XEM_PHIM where mave = 'VE923';

SELECT * FROM suat_chieu FOR UPDATE;
COMMIT;

-- ============================================================================
-- DEMO LOCKING RO RANG (2 SESSION)
-- ============================================================================
UPDATE DON_HANG
SET TrangThai = 'Chờ thanh toán'
WHERE MaDonHang IN ('DH113', 'DH114', 'DH115', 'DH116');

COMMIT;

-- SESSION 1: Khoa ro rang 1 dong DH113 (giu transaction, chua COMMIT)
SELECT *
FROM DON_HANG
WHERE MaDonHang = 'DH113'
FOR UPDATE;

-- SESSION 2: Chay cau nay se gap ORA-00054 vi DH113 dang bi Session 1 khoa
SELECT *
FROM DON_HANG
WHERE MaDonHang = 'DH113'
FOR UPDATE NOWAIT;

-- SESSION 2: Bo qua dong dang bi khoa, se lay cac dong con lai (DH114..DH116)
SELECT *
FROM DON_HANG
WHERE MaDonHang IN ('DH113', 'DH114', 'DH115', 'DH116')
FOR UPDATE SKIP LOCKED;

-- KET THUC:
-- 1) COMMIT o Session 2
-- 2) COMMIT o Session 1 (dong duoi)

SELECT *
FROM DON_HANG
WHERE MaDonHang = 'DH113';

COMMIT;

COMMIT;