-- ============================================================================
-- ORACLE DATABASE MIGRATION: Cinema Database
-- FROM: MySQL TO Oracle Database
-- Version: 1.0
-- ============================================================================

-- 1. Cấu hình môi trường
SET DEFINE OFF;
SET ECHO ON;

-- 2. Xóa toàn bộ các đối tượng cũ để tránh lỗi "Name already used"
BEGIN
  -- Xóa toàn bộ Bảng (Tables)
  FOR rec IN (SELECT table_name FROM user_tables) LOOP
    EXECUTE IMMEDIATE 'DROP TABLE ' || rec.table_name || ' CASCADE CONSTRAINTS';
  END LOOP;
  
  -- Xóa toàn bộ Sequence
  FOR rec IN (SELECT sequence_name FROM user_sequences) LOOP
    EXECUTE IMMEDIATE 'DROP SEQUENCE ' || rec.sequence_name;
  END LOOP;
END;
/

-- 3. Dọn dẹp thùng rác để giải phóng bộ nhớ
PURGE RECYCLEBIN;

-- Create tablespace for sequences
CREATE SEQUENCE seq_ma_nguoi_dung START WITH 1000 INCREMENT BY 1;
CREATE SEQUENCE seq_ma_phim START WITH 1000 INCREMENT BY 1;
CREATE SEQUENCE seq_ma_phong START WITH 1000 INCREMENT BY 1;
CREATE SEQUENCE seq_ma_ve START WITH 1000 INCREMENT BY 1;
CREATE SEQUENCE seq_ma_don_hang START WITH 1000 INCREMENT BY 1;
CREATE SEQUENCE seq_ma_thanh_toan START WITH 1000 INCREMENT BY 1;

-- ============================================================================
-- TABLE CREATION - ORACLE SYNTAX
-- ============================================================================

-- RẠP CHIẾU PHIM
CREATE TABLE RAP_CHIEU_PHIM (
    MaRapPhim  VARCHAR2(20) PRIMARY KEY,
    Ten        VARCHAR2(20) NOT NULL,
    ThanhPho   VARCHAR2(25) NOT NULL,
    DiaChi     VARCHAR2(50) NOT NULL,
    SDT        VARCHAR2(15) NOT NULL,
    Email      VARCHAR2(50) NOT NULL UNIQUE,
    CONSTRAINT chk_rap_sdt CHECK (REGEXP_LIKE(SDT, '^[0-9]+$')),
    CONSTRAINT chk_rap_email CHECK (REGEXP_LIKE(Email, '^[^@\s]+@[^@\s]+\.[^@\s]+$'))
);

-- PHÒNG CHIẾU
CREATE TABLE PHONG_CHIEU (
    MaPhong   VARCHAR2(20) PRIMARY KEY,
    MaRapPhim VARCHAR2(20) NOT NULL,
    Ten       VARCHAR2(20) NOT NULL,
    Loai      VARCHAR2(20) NOT NULL,
    SucChua   INT NOT NULL,
    SoGhe     INT NOT NULL,
    CONSTRAINT chk_phong_suchua CHECK (SucChua > 0),
    CONSTRAINT chk_phong_soghe CHECK (SoGhe > 0),
    CONSTRAINT fk_phong_rap FOREIGN KEY (MaRapPhim) REFERENCES RAP_CHIEU_PHIM(MaRapPhim)
);

-- GHẾ
CREATE TABLE GHE (
    MaPhong VARCHAR2(20) NOT NULL,
    HangGhe VARCHAR2(10) NOT NULL,
    SoGhe INT NOT NULL,
    LoaiGhe VARCHAR2(10) NOT NULL,
    CONSTRAINT pk_ghe PRIMARY KEY (MaPhong, HangGhe, SoGhe),
    CONSTRAINT chk_ghe_soghe CHECK (SoGhe > 0),
    CONSTRAINT fk_ghe_phong FOREIGN KEY (MaPhong) REFERENCES PHONG_CHIEU(MaPhong)
);

-- PHIM
CREATE TABLE PHIM (
    MaPhim VARCHAR2(20) PRIMARY KEY,
    TenPhim VARCHAR2(200) NOT NULL,
    ThoiLuong INT NOT NULL,
    NgonNgu VARCHAR2(50) NOT NULL,
    QuocGia VARCHAR2(50) NOT NULL,
    DaoDien VARCHAR2(100),
    DienVienChinh VARCHAR2(200),
    NgayKhoiChieu DATE NOT NULL,
    MoTaNoiDung CLOB,
    DoTuoi INT NOT NULL,
    ChuDePhim VARCHAR2(100),
    Anh VARCHAR2(500),
    CONSTRAINT chk_phim_thoiluong CHECK (ThoiLuong > 0),
    CONSTRAINT chk_phim_dotuoi CHECK (DoTuoi >= 0)
);

-- THỂ LOẠI
CREATE TABLE THE_LOAI_PHIM (
    MaPhim VARCHAR2(20) NOT NULL,
    TheLoai VARCHAR2(50) NOT NULL,
    CONSTRAINT pk_theloai PRIMARY KEY (MaPhim, TheLoai),
    CONSTRAINT fk_theloai_phim FOREIGN KEY (MaPhim) REFERENCES PHIM(MaPhim)
);

-- KHUYẾN MÃI
CREATE TABLE CHUONG_TRINH_KHUYEN_MAI (
    MaKhuyenMai VARCHAR2(20) PRIMARY KEY,
    TenChuongTrinh VARCHAR2(200) NOT NULL,
    DieuKien VARCHAR2(250),
    NgayBatDau DATE NOT NULL,
    NgayKetThuc DATE NOT NULL,
    MucGiam DECIMAL(18,2) NOT NULL,
    CONSTRAINT chk_km_dates CHECK (NgayKetThuc >= NgayBatDau),
    CONSTRAINT chk_km_mucgiam CHECK (MucGiam >= 0)
);

-- TÀI KHOẢN
CREATE TABLE TAI_KHOAN (
    MaNguoiDung VARCHAR2(20) PRIMARY KEY,
    HoTen VARCHAR2(50) NOT NULL,
    DiaChi VARCHAR2(200),
    SDT VARCHAR2(15),
    GioiTinh CHAR(1),
    Email VARCHAR2(50) NOT NULL UNIQUE,
    MatKhau VARCHAR2(255) NOT NULL,
    CONSTRAINT chk_tk_gioitinh CHECK (GioiTinh IN ('M','F','O') OR GioiTinh IS NULL),
    CONSTRAINT chk_tk_sdt CHECK (NOT REGEXP_LIKE(SDT, '[^0-9]', 'i') OR SDT IS NULL)
);

-- KHÁCH HÀNG
CREATE TABLE KHACH_HANG (
    MaNguoiDung VARCHAR2(20) PRIMARY KEY,
    LoaiThanhVien VARCHAR2(20) NOT NULL,
    DiemTichLuy INT DEFAULT 0,
    CONSTRAINT chk_kh_diemtich CHECK (DiemTichLuy >= 0),
    CONSTRAINT chk_kh_loaitv CHECK (LoaiThanhVien IN ('Bronze','Silver','Gold','Platinum')),
    CONSTRAINT fk_kh_tk FOREIGN KEY (MaNguoiDung) REFERENCES TAI_KHOAN(MaNguoiDung)
);

-- QUẢN TRỊ VIÊN
CREATE TABLE QUAN_TRI_VIEN (
    MaNguoiDung VARCHAR2(20) PRIMARY KEY,
    NgayBatDauLam DATE NOT NULL,
    Luong DECIMAL(18,2) NOT NULL,
    ChucVu VARCHAR2(50) NOT NULL,
    CONSTRAINT chk_qtv_luong CHECK (Luong > 0),
    CONSTRAINT fk_qtv_tk FOREIGN KEY (MaNguoiDung) REFERENCES TAI_KHOAN(MaNguoiDung)
);

-- CA LÀM VIỆC
CREATE TABLE CA_LAM_VIEC (
    MaCa VARCHAR2(20) PRIMARY KEY,
    MaNguoiDung VARCHAR2(20) NOT NULL,
    CaLamViec VARCHAR2(50) NOT NULL,
    CONSTRAINT fk_ca_qtv FOREIGN KEY (MaNguoiDung) REFERENCES QUAN_TRI_VIEN(MaNguoiDung)
);

-- MẶT HÀNG
CREATE TABLE MAT_HANG (
    MaHang VARCHAR2(20) PRIMARY KEY,
    TenHang VARCHAR2(200) NOT NULL,
    DonGia DECIMAL(18,2) NOT NULL,
    SoLuongTon INT NOT NULL,
    MoTa VARCHAR2(500),
    LoaiHang VARCHAR2(20) NOT NULL,
    CONSTRAINT chk_mh_dongia CHECK (DonGia >= 0),
    CONSTRAINT chk_mh_soluong CHECK (SoLuongTon >= 0),
    CONSTRAINT chk_mh_loai CHECK (LoaiHang IN ('DO_AN','QUA_LUU_NIEM'))
);

-- ĐƠN HÀNG
CREATE TABLE DON_HANG (
    MaDonHang VARCHAR2(20) PRIMARY KEY,
    MaNguoiDung_KH VARCHAR2(20) NOT NULL,
    PhuongThuc VARCHAR2(50) NOT NULL,
    ThoiGianDat TIMESTAMP DEFAULT SYSDATE NOT NULL,
    TongTien DECIMAL(18,2) NOT NULL,
    TrangThai VARCHAR2(20) NOT NULL,
    CONSTRAINT chk_dh_tongtien CHECK (TongTien >= 0),
    CONSTRAINT chk_dh_trangthai CHECK (TrangThai IN ('Chờ thanh toán','Đã thanh toán','Hủy')),
    CONSTRAINT fk_dh_kh FOREIGN KEY (MaNguoiDung_KH) REFERENCES KHACH_HANG(MaNguoiDung)
);

-- GỒM
CREATE TABLE GOM (
    MaDonHang VARCHAR2(20) NOT NULL,
    MaHang VARCHAR2(20) NOT NULL,
    SoLuong INT NOT NULL,
    DonGia DECIMAL(18,2) NOT NULL,
    CONSTRAINT pk_gom PRIMARY KEY (MaDonHang, MaHang),
    CONSTRAINT chk_gom_soluong CHECK (SoLuong > 0),
    CONSTRAINT chk_gom_dongia CHECK (DonGia >= 0),
    CONSTRAINT fk_gom_dh FOREIGN KEY (MaDonHang) REFERENCES DON_HANG(MaDonHang),
    CONSTRAINT fk_gom_mh FOREIGN KEY (MaHang) REFERENCES MAT_HANG(MaHang)
);

-- THANH TOÁN
CREATE TABLE THANH_TOAN (
    MaThanhToan VARCHAR2(20) PRIMARY KEY,
    MaDonHang VARCHAR2(20) NOT NULL UNIQUE,
    NgayThanhToan TIMESTAMP DEFAULT SYSDATE NOT NULL,
    PhuongThuc VARCHAR2(50) NOT NULL,
    TrangThai VARCHAR2(20) NOT NULL,
    SoTien DECIMAL(18,2) NOT NULL,
    CONSTRAINT chk_tt_sotien CHECK (SoTien >= 0),
    CONSTRAINT chk_tt_trangthai CHECK (TrangThai IN ('Đang xử lý','Đã thanh toán','Thất bại')),
    CONSTRAINT fk_tt_dh FOREIGN KEY (MaDonHang) REFERENCES DON_HANG(MaDonHang)
);

-- TRÌNH CHIẾU
CREATE TABLE TRINH_CHIEU (
    MaRapPhim VARCHAR2(20) NOT NULL,
    MaPhim VARCHAR2(20) NOT NULL,
    CONSTRAINT pk_trinhchieu PRIMARY KEY (MaRapPhim, MaPhim),
    CONSTRAINT fk_tc_rap FOREIGN KEY (MaRapPhim) REFERENCES RAP_CHIEU_PHIM(MaRapPhim),
    CONSTRAINT fk_tc_phim FOREIGN KEY (MaPhim) REFERENCES PHIM(MaPhim)
);

-- SUẤT CHIẾU
CREATE TABLE SUAT_CHIEU (
    MaSuatChieu VARCHAR2(20) PRIMARY KEY,
    MaPhim VARCHAR2(20) NOT NULL,
    MaPhong VARCHAR2(20) NOT NULL,
    NgayChieu DATE NOT NULL,
    GioBatDau TIMESTAMP DEFAULT SYSDATE NOT NULL,
    GioKetThuc TIMESTAMP DEFAULT SYSDATE NOT NULL,
    GiaVeCoBan DECIMAL(18,2) NOT NULL,
    TrangThai VARCHAR2(20) NOT NULL,
    CONSTRAINT chk_sc_gio CHECK (GioKetThuc > GioBatDau),
    CONSTRAINT chk_sc_gia CHECK (GiaVeCoBan >= 0),
    CONSTRAINT chk_sc_trangthai CHECK (TrangThai IN ('Đang mở','Hủy','Đã chiếu')),
    CONSTRAINT fk_sc_phim FOREIGN KEY (MaPhim) REFERENCES PHIM(MaPhim) ON DELETE CASCADE,
    CONSTRAINT fk_sc_phong FOREIGN KEY (MaPhong) REFERENCES PHONG_CHIEU(MaPhong)
);

-- VÉ XEM PHIM
CREATE TABLE VE_XEM_PHIM (
    MaVe VARCHAR2(20) PRIMARY KEY,
    MaSuatChieu VARCHAR2(20) NOT NULL,
    MaPhong VARCHAR2(20) NOT NULL,
    HangGhe VARCHAR2(10) NOT NULL,
    SoGhe INT NOT NULL,
    MaNguoiDung_KH VARCHAR2(20) NOT NULL,
    MaDonHang VARCHAR2(20) NOT NULL,
    GiaVeCuoi DECIMAL(18,2) NOT NULL,
    NgayDat TIMESTAMP DEFAULT SYSDATE NOT NULL,
    TrangThai VARCHAR2(20) NOT NULL,
    CONSTRAINT chk_ve_gia CHECK (GiaVeCuoi >= 0),
    CONSTRAINT chk_ve_trangthai CHECK (TrangThai IN ('Đã đặt','Đã thanh toán','Hủy')),
    CONSTRAINT fk_ve_sc FOREIGN KEY (MaSuatChieu) REFERENCES SUAT_CHIEU(MaSuatChieu) ON DELETE CASCADE,
    CONSTRAINT fk_ve_ghe FOREIGN KEY (MaPhong, HangGhe, SoGhe) REFERENCES GHE(MaPhong, HangGhe, SoGhe),
    CONSTRAINT fk_ve_kh FOREIGN KEY (MaNguoiDung_KH) REFERENCES KHACH_HANG(MaNguoiDung),
    CONSTRAINT fk_ve_dh FOREIGN KEY (MaDonHang) REFERENCES DON_HANG(MaDonHang)
);

-- ÁP DỤNG KHUYẾN MÃI
CREATE TABLE AP_DUNG (
    MaVe VARCHAR2(20) NOT NULL UNIQUE,
    MaKhuyenMai VARCHAR2(20) NOT NULL,
    CONSTRAINT pk_apdung PRIMARY KEY (MaVe, MaKhuyenMai),
    CONSTRAINT fk_ad_ve FOREIGN KEY (MaVe) REFERENCES VE_XEM_PHIM(MaVe),
    CONSTRAINT fk_ad_km FOREIGN KEY (MaKhuyenMai) REFERENCES CHUONG_TRINH_KHUYEN_MAI(MaKhuyenMai)
);

-- ĐÁNH GIÁ
CREATE TABLE DANH_GIA (
    MaDanhGia VARCHAR2(20) PRIMARY KEY,
    MaNguoiDung VARCHAR2(20) NOT NULL,
    MaPhim VARCHAR2(20) NOT NULL,
    NoiDung VARCHAR2(1000),
    NgayDang TIMESTAMP DEFAULT SYSDATE NOT NULL,
    DiemSo INT NOT NULL,
    CONSTRAINT chk_dg_diem CHECK (DiemSo BETWEEN 1 AND 10),
    CONSTRAINT fk_dg_kh FOREIGN KEY (MaNguoiDung) REFERENCES KHACH_HANG(MaNguoiDung),
    CONSTRAINT fk_dg_phim FOREIGN KEY (MaPhim) REFERENCES PHIM(MaPhim) ON DELETE CASCADE
);

-- QUẢN LÝ
CREATE TABLE QUAN_LY (
    MaNguoiDung_QTV VARCHAR2(20) NOT NULL,
    MaRapPhim VARCHAR2(20) NOT NULL,
    CONSTRAINT pk_quanly PRIMARY KEY (MaNguoiDung_QTV, MaRapPhim),
    CONSTRAINT fk_ql_qtv FOREIGN KEY (MaNguoiDung_QTV) REFERENCES QUAN_TRI_VIEN(MaNguoiDung),
    CONSTRAINT fk_ql_rap FOREIGN KEY (MaRapPhim) REFERENCES RAP_CHIEU_PHIM(MaRapPhim)
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

CREATE INDEX idx_phong_rap ON PHONG_CHIEU(MaRapPhim);
CREATE INDEX idx_ghe_phong ON GHE(MaPhong);
CREATE INDEX idx_phim_ngay ON PHIM(NgayKhoiChieu);
CREATE INDEX idx_donhang_kh ON DON_HANG(MaNguoiDung_KH);
CREATE INDEX idx_gom_hang ON GOM(MaHang);
CREATE INDEX idx_suat_phim ON SUAT_CHIEU(MaPhim);
CREATE INDEX idx_suat_phong ON SUAT_CHIEU(MaPhong);
CREATE INDEX idx_suat_ngay ON SUAT_CHIEU(NgayChieu);
CREATE INDEX idx_ve_suat ON VE_XEM_PHIM(MaSuatChieu);
CREATE INDEX idx_ve_kh ON VE_XEM_PHIM(MaNguoiDung_KH);
CREATE INDEX idx_ve_dh ON VE_XEM_PHIM(MaDonHang);
CREATE INDEX idx_danhgia_kh ON DANH_GIA(MaNguoiDung);
CREATE INDEX idx_danhgia_phim ON DANH_GIA(MaPhim);
CREATE INDEX idx_thanhtoan_dh ON THANH_TOAN(MaDonHang);

COMMIT;
