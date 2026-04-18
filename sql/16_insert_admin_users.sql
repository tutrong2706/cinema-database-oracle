-- ============================================================================
-- INSERT INITIAL ADMIN USER
-- ============================================================================

-- Insert default Admin account
INSERT INTO TAI_KHOAN (MaNguoiDung, HoTen, Email, MatKhau, VaiTro, SDT, DiaChi, GioiTinh)
VALUES ('ADMIN_001', 'Quản Trị Viên', 'admin@cinema.com', 'admin123456', 'Admin', '0981234567', 'Hà Nội', 'M');

-- Insert test customer accounts
INSERT INTO TAI_KHOAN (MaNguoiDung, HoTen, Email, MatKhau, VaiTro, SDT, DiaChi, GioiTinh)
VALUES ('CUST_001', 'Nguyễn Văn A', 'nguyenvana@gmail.com', 'password123', 'Khach', '0987654321', 'TP Hồ Chí Minh', 'M');

INSERT INTO TAI_KHOAN (MaNguoiDung, HoTen, Email, MatKhau, VaiTro, SDT, DiaChi, GioiTinh)
VALUES ('CUST_002', 'Trần Thị B', 'tranthib@gmail.com', 'password123', 'Khach', '0912345678', 'Đà Nẵng', 'F');

-- Create corresponding KHACH_HANG records for customers
INSERT INTO KHACH_HANG (MaNguoiDung, LoaiThanhVien, DiemTichLuy)
VALUES ('CUST_001', 'Bronze', 0);

INSERT INTO KHACH_HANG (MaNguoiDung, LoaiThanhVien, DiemTichLuy)
VALUES ('CUST_002', 'Bronze', 0);

COMMIT;

-- Verify data
SELECT MaNguoiDung, HoTen, Email, VaiTro FROM TAI_KHOAN ORDER BY VaiTro DESC;
SELECT * FROM KHACH_HANG;
