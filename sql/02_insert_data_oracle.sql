-- ============================================================================
-- INSERT DATA - ORACLE SYNTAX
-- ============================================================================

-- Disable constraints temporarily for data loading
ALTER TABLE VE_XEM_PHIM DISABLE CONSTRAINT fk_ve_sc;
ALTER TABLE VE_XEM_PHIM DISABLE CONSTRAINT fk_ve_ghe;
ALTER TABLE VE_XEM_PHIM DISABLE CONSTRAINT fk_ve_kh;
ALTER TABLE VE_XEM_PHIM DISABLE CONSTRAINT fk_ve_dh;
ALTER TABLE AP_DUNG DISABLE CONSTRAINT fk_ad_ve;
ALTER TABLE AP_DUNG DISABLE CONSTRAINT fk_ad_km;

-- ========== 1. TÀI KHOẢN - KHÁCH HÀNG - QUẢN TRỊ VIÊN ==========
INSERT INTO TAI_KHOAN (MaNguoiDung, HoTen, DiaChi, SDT, GioiTinh, Email, MatKhau) VALUES
('KH001', 'Nguyễn Văn A', 'Q1, TP.HCM', '0901111111', 'M', 'a@example.com', 'passA');
INSERT INTO TAI_KHOAN (MaNguoiDung, HoTen, DiaChi, SDT, GioiTinh, Email, MatKhau) VALUES
('KH002', 'Trần Thị B', 'Q3, TP.HCM', '0902222222', 'F', 'b@example.com', 'passB');
INSERT INTO TAI_KHOAN (MaNguoiDung, HoTen, DiaChi, SDT, GioiTinh, Email, MatKhau) VALUES
('KH003', 'Lê Văn C', 'Q5, TP.HCM', '0903333333', 'M', 'c@example.com', 'passC');
INSERT INTO TAI_KHOAN (MaNguoiDung, HoTen, DiaChi, SDT, GioiTinh, Email, MatKhau) VALUES
('KH004', 'Phạm Thị D', 'Q7, TP.HCM', '0904444444', 'F', 'd@example.com', 'passD');
INSERT INTO TAI_KHOAN (MaNguoiDung, HoTen, DiaChi, SDT, GioiTinh, Email, MatKhau) VALUES
('KH005', 'Hoàng Văn E', 'Tân Bình', '0905555555', 'M', 'e@example.com', 'passE');
INSERT INTO TAI_KHOAN (MaNguoiDung, HoTen, DiaChi, SDT, GioiTinh, Email, MatKhau) VALUES
('KH006', 'Vũ Thị F', 'Thủ Đức', '0906666666', 'F', 'f@example.com', 'passF');
INSERT INTO TAI_KHOAN (MaNguoiDung, HoTen, DiaChi, SDT, GioiTinh, Email, MatKhau) VALUES
('KH007', 'Đặng Văn G', 'Bình Thạnh', '0907777777', 'M', 'g@example.com', 'passG');
INSERT INTO TAI_KHOAN (MaNguoiDung, HoTen, DiaChi, SDT, GioiTinh, Email, MatKhau) VALUES
('KH008', 'Bùi Thị H', 'Gò Vấp', '0908888888', 'F', 'h@example.com', 'passH');
INSERT INTO TAI_KHOAN (MaNguoiDung, HoTen, DiaChi, SDT, GioiTinh, Email, MatKhau) VALUES
('KH009', 'Ngô Văn I', 'Q12, TP.HCM', '0909999999', 'M', 'i@example.com', 'passI');
INSERT INTO TAI_KHOAN (MaNguoiDung, HoTen, DiaChi, SDT, GioiTinh, Email, MatKhau) VALUES
('KH010', 'Đỗ Thị K', 'Q10, TP.HCM', '0910101010', 'F', 'k@example.com', 'passK');
INSERT INTO TAI_KHOAN (MaNguoiDung, HoTen, DiaChi, SDT, GioiTinh, Email, MatKhau) VALUES
('KH011', 'Nguyễn Văn L', 'Q1, TP.HCM', '0911111111', 'M', 'l@example.com', 'passL');
INSERT INTO TAI_KHOAN (MaNguoiDung, HoTen, DiaChi, SDT, GioiTinh, Email, MatKhau) VALUES
('KH012', 'Trần Thị M', 'Q3, TP.HCM', '0912222222', 'F', 'm@example.com', 'passM');
INSERT INTO TAI_KHOAN (MaNguoiDung, HoTen, DiaChi, SDT, GioiTinh, Email, MatKhau) VALUES
('KH013', 'Lê Văn N', 'Q5, TP.HCM', '0913333333', 'M', 'n@example.com', 'passN');
INSERT INTO TAI_KHOAN (MaNguoiDung, HoTen, DiaChi, SDT, GioiTinh, Email, MatKhau) VALUES
('KH014', 'Phạm Thị O', 'Q7, TP.HCM', '0914444444', 'F', 'o@example.com', 'passO');
INSERT INTO TAI_KHOAN (MaNguoiDung, HoTen, DiaChi, SDT, GioiTinh, Email, MatKhau) VALUES
('KH015', 'Hoàng Văn P', 'Tân Bình', '0915555555', 'M', 'p@example.com', 'passP');
INSERT INTO TAI_KHOAN (MaNguoiDung, HoTen, DiaChi, SDT, GioiTinh, Email, MatKhau) VALUES
('KH016', 'Vũ Thị Q', 'Thủ Đức', '0916666666', 'F', 'q@example.com', 'passQ');
INSERT INTO TAI_KHOAN (MaNguoiDung, HoTen, DiaChi, SDT, GioiTinh, Email, MatKhau) VALUES
('KH017', 'Đặng Văn R', 'Bình Thạnh', '0917777777', 'M', 'r@example.com', 'passR');
INSERT INTO TAI_KHOAN (MaNguoiDung, HoTen, DiaChi, SDT, GioiTinh, Email, MatKhau) VALUES
('KH018', 'Bùi Thị S', 'Gò Vấp', '0918888888', 'F', 's@example.com', 'passS');
INSERT INTO TAI_KHOAN (MaNguoiDung, HoTen, DiaChi, SDT, GioiTinh, Email, MatKhau) VALUES
('KH019', 'Ngô Văn T', 'Q12, TP.HCM', '0919999999', 'M', 't@example.com', 'passT');
INSERT INTO TAI_KHOAN (MaNguoiDung, HoTen, DiaChi, SDT, GioiTinh, Email, MatKhau) VALUES
('KH020', 'Đỗ Thị U', 'Q10, TP.HCM', '0920202020', 'F', 'u@example.com', 'passU');
INSERT INTO TAI_KHOAN (MaNguoiDung, HoTen, DiaChi, SDT, GioiTinh, Email, MatKhau) VALUES
('AD001', 'Admin Quản Lý', 'Q1, TP.HCM', '0911111111', 'M', 'admin1@example.com', 'admin1');
INSERT INTO TAI_KHOAN (MaNguoiDung, HoTen, DiaChi, SDT, GioiTinh, Email, MatKhau) VALUES
('AD002', 'Admin Trưởng Ca', 'Q1, TP.HCM', '0912222222', 'F', 'admin2@example.com', 'admin2');
INSERT INTO TAI_KHOAN (MaNguoiDung, HoTen, DiaChi, SDT, GioiTinh, Email, MatKhau) VALUES
('AD003', 'Admin Kế Toán', 'Q3, TP.HCM', '0913333333', 'F', 'admin3@example.com', 'admin3');

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
INSERT INTO GHE (MaPhong, HangGhe, SoGhe, LoaiGhe) VALUES ('P001', 'A', 1, 'Thường');
INSERT INTO GHE (MaPhong, HangGhe, SoGhe, LoaiGhe) VALUES ('P001', 'A', 2, 'Thường');
INSERT INTO GHE (MaPhong, HangGhe, SoGhe, LoaiGhe) VALUES ('P001', 'A', 3, 'Thường');
INSERT INTO GHE (MaPhong, HangGhe, SoGhe, LoaiGhe) VALUES ('P001', 'B', 1, 'VIP');
INSERT INTO GHE (MaPhong, HangGhe, SoGhe, LoaiGhe) VALUES ('P001', 'B', 2, 'VIP');
INSERT INTO GHE (MaPhong, HangGhe, SoGhe, LoaiGhe) VALUES ('P002', 'A', 1, 'Thường');
INSERT INTO GHE (MaPhong, HangGhe, SoGhe, LoaiGhe) VALUES ('P002', 'A', 2, 'Thường');
INSERT INTO GHE (MaPhong, HangGhe, SoGhe, LoaiGhe) VALUES ('P003', 'C', 5, 'Đôi');
INSERT INTO GHE (MaPhong, HangGhe, SoGhe, LoaiGhe) VALUES ('P003', 'C', 6, 'Đôi');
INSERT INTO GHE (MaPhong, HangGhe, SoGhe, LoaiGhe) VALUES ('P004', 'A', 1, 'Thường');
INSERT INTO GHE (MaPhong, HangGhe, SoGhe, LoaiGhe) VALUES ('P005', 'A', 1, 'Thường');
INSERT INTO GHE (MaPhong, HangGhe, SoGhe, LoaiGhe) VALUES ('P006', 'D', 1, 'Giường nằm');
INSERT INTO GHE (MaPhong, HangGhe, SoGhe, LoaiGhe) VALUES ('P006', 'D', 2, 'Giường nằm');
INSERT INTO GHE (MaPhong, HangGhe, SoGhe, LoaiGhe) VALUES ('P001', 'E', 1, 'Thường');
INSERT INTO GHE (MaPhong, HangGhe, SoGhe, LoaiGhe) VALUES ('P001', 'E', 2, 'Thường');

COMMIT;

-- ========== PHIM – THỂ LOẠI – KHUYẾN MÃI ==========
INSERT INTO PHIM (MaPhim, TenPhim, ThoiLuong, NgonNgu, QuocGia, DaoDien, DienVienChinh, NgayKhoiChieu, MoTaNoiDung, DoTuoi, ChuDePhim) VALUES
('PH001', 'Avengers: Endgame', 180, 'English', 'USA', 'Anthony Russo', 'Robert Downey Jr.', TO_DATE('2019-04-26', 'YYYY-MM-DD'), 'Siêu anh hùng Marvel', 13, 'Siêu anh hùng');
INSERT INTO PHIM (MaPhim, TenPhim, ThoiLuong, NgonNgu, QuocGia, DaoDien, DienVienChinh, NgayKhoiChieu, MoTaNoiDung, DoTuoi, ChuDePhim) VALUES
('PH002', 'Nhà Bà Nữ', 120, 'Tiếng Việt', 'Việt Nam', 'Tristian', 'Lê Giang', TO_DATE('2023-01-22', 'YYYY-MM-DD'), 'Hài gia đình', 13, 'Gia đình');
INSERT INTO PHIM (MaPhim, TenPhim, ThoiLuong, NgonNgu, QuocGia, DaoDien, DienVienChinh, NgayKhoiChieu, MoTaNoiDung, DoTuoi, ChuDePhim) VALUES
('PH003', 'Fast & Furious 9', 145, 'English', 'USA', 'Justin Lin', 'Vin Diesel', TO_DATE('2021-05-19', 'YYYY-MM-DD'), 'Hành động đua xe', 16, 'Hành động');
INSERT INTO PHIM (MaPhim, TenPhim, ThoiLuong, NgonNgu, QuocGia, DaoDien, DienVienChinh, NgayKhoiChieu, MoTaNoiDung, DoTuoi, ChuDePhim) VALUES
('PH004', 'Conan Movie 26', 110, 'Japanese', 'Japan', 'Yuzuru Tachikawa', 'Minami Takayama', TO_DATE('2023-04-14', 'YYYY-MM-DD'), 'Thám tử lừng danh', 13, 'Hoạt hình');
INSERT INTO PHIM (MaPhim, TenPhim, ThoiLuong, NgonNgu, QuocGia, DaoDien, DienVienChinh, NgayKhoiChieu, MoTaNoiDung, DoTuoi, ChuDePhim) VALUES
('PH005', 'Spider-Man: No Way Home', 150, 'English', 'USA', 'Jon Watts', 'Tom Holland', TO_DATE('2021-12-17', 'YYYY-MM-DD'), 'Anh hùng Marvel', 13, 'Siêu anh hùng');
INSERT INTO PHIM (MaPhim, TenPhim, ThoiLuong, NgonNgu, QuocGia, DaoDien, DienVienChinh, NgayKhoiChieu, MoTaNoiDung, DoTuoi, ChuDePhim) VALUES
('PH006', 'Dune: Messiah', 160, 'English', 'USA', 'Denis Villeneuve', 'Chalamet', TO_DATE('2025-11-15', 'YYYY-MM-DD'), 'Khoa học viễn tưởng', 16, 'Viễn tưởng');
INSERT INTO PHIM (MaPhim, TenPhim, ThoiLuong, NgonNgu, QuocGia, DaoDien, DienVienChinh, NgayKhoiChieu, MoTaNoiDung, DoTuoi, ChuDePhim) VALUES
('PH007', 'Lật Mặt 7', 115, 'Tiếng Việt', 'Việt Nam', 'Lý Hải', 'Lý Hải', TO_DATE('2025-11-25', 'YYYY-MM-DD'), 'Hành động hài', 16, 'Hành động');
INSERT INTO PHIM (MaPhim, TenPhim, ThoiLuong, NgonNgu, QuocGia, DaoDien, DienVienChinh, NgayKhoiChieu, MoTaNoiDung, DoTuoi, ChuDePhim) VALUES
('PH008', 'The Conjuring 3', 100, 'English', 'USA', 'Michael Chaves', 'Patrick Wilson', TO_DATE('2025-10-31', 'YYYY-MM-DD'), 'Ma ám kinh dị', 18, 'Kinh dị');

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
INSERT INTO SUAT_CHIEU (MaSuatChieu, MaPhim, MaPhong, NgayChieu, GioBatDau, GioKetThuc, GiaVeCoBan, TrangThai) VALUES
('SC001', 'PH001', 'P001', TO_DATE('2025-12-20', 'YYYY-MM-DD'), TO_TIMESTAMP('2025-12-20 08:00:00', 'YYYY-MM-DD HH24:MI:SS'), TO_TIMESTAMP('2025-12-20 10:30:00', 'YYYY-MM-DD HH24:MI:SS'), 120000, 'Đang mở');
INSERT INTO SUAT_CHIEU (MaSuatChieu, MaPhim, MaPhong, NgayChieu, GioBatDau, GioKetThuc, GiaVeCoBan, TrangThai) VALUES
('SC002', 'PH002', 'P002', TO_DATE('2025-12-20', 'YYYY-MM-DD'), TO_TIMESTAMP('2025-12-20 10:00:00', 'YYYY-MM-DD HH24:MI:SS'), TO_TIMESTAMP('2025-12-20 12:00:00', 'YYYY-MM-DD HH24:MI:SS'), 100000, 'Đang mở');
INSERT INTO SUAT_CHIEU (MaSuatChieu, MaPhim, MaPhong, NgayChieu, GioBatDau, GioKetThuc, GiaVeCoBan, TrangThai) VALUES
('SC003', 'PH003', 'P003', TO_DATE('2025-12-20', 'YYYY-MM-DD'), TO_TIMESTAMP('2025-12-20 13:00:00', 'YYYY-MM-DD HH24:MI:SS'), TO_TIMESTAMP('2025-12-20 15:15:00', 'YYYY-MM-DD HH24:MI:SS'), 150000, 'Đang mở');
INSERT INTO SUAT_CHIEU (MaSuatChieu, MaPhim, MaPhong, NgayChieu, GioBatDau, GioKetThuc, GiaVeCoBan, TrangThai) VALUES
('SC004', 'PH001', 'P001', TO_DATE('2025-12-24', 'YYYY-MM-DD'), TO_TIMESTAMP('2025-12-24 19:00:00', 'YYYY-MM-DD HH24:MI:SS'), TO_TIMESTAMP('2025-12-24 21:30:00', 'YYYY-MM-DD HH24:MI:SS'), 120000, 'Đang mở');

COMMIT;

-- ========== QUẢN LÝ ==========
INSERT INTO QUAN_LY (MaNguoiDung_QTV, MaRapPhim) VALUES ('AD001', 'RAP001');
INSERT INTO QUAN_LY (MaNguoiDung_QTV, MaRapPhim) VALUES ('AD002', 'RAP002');
INSERT INTO QUAN_LY (MaNguoiDung_QTV, MaRapPhim) VALUES ('AD003', 'RAP003');

COMMIT;

-- Re-enable constraints
ALTER TABLE VE_XEM_PHIM ENABLE CONSTRAINT fk_ve_sc;
ALTER TABLE VE_XEM_PHIM ENABLE CONSTRAINT fk_ve_ghe;
ALTER TABLE VE_XEM_PHIM ENABLE CONSTRAINT fk_ve_kh;
ALTER TABLE VE_XEM_PHIM ENABLE CONSTRAINT fk_ve_dh;
ALTER TABLE AP_DUNG ENABLE CONSTRAINT fk_ad_ve;
ALTER TABLE AP_DUNG ENABLE CONSTRAINT fk_ad_km;

COMMIT;
