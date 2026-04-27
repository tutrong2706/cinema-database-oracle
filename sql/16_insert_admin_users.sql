-- ============================================================================
-- INSERT INITIAL ADMIN USER
-- ============================================================================

SET DEFINE OFF;

-- Upsert default Admin account
MERGE INTO TAI_KHOAN TK
USING (
	SELECT 'ADMIN_001' AS MaNguoiDung,
		   'Quản Trị Viên' AS HoTen,
		   'admin@cinema.com' AS Email,
		   'admin123456' AS MatKhau,
		   'Admin' AS VaiTro,
		   '0981234567' AS SDT,
		   'Hà Nội' AS DiaChi,
		   'M' AS GioiTinh
	FROM DUAL
) SRC
ON (TK.MaNguoiDung = SRC.MaNguoiDung)
WHEN MATCHED THEN
	UPDATE SET TK.HoTen = SRC.HoTen,
			   TK.Email = SRC.Email,
			   TK.MatKhau = SRC.MatKhau,
			   TK.VaiTro = SRC.VaiTro,
			   TK.SDT = SRC.SDT,
			   TK.DiaChi = SRC.DiaChi,
			   TK.GioiTinh = SRC.GioiTinh
WHEN NOT MATCHED THEN
	INSERT (MaNguoiDung, HoTen, Email, MatKhau, VaiTro, SDT, DiaChi, GioiTinh)
	VALUES (SRC.MaNguoiDung, SRC.HoTen, SRC.Email, SRC.MatKhau, SRC.VaiTro, SRC.SDT, SRC.DiaChi, SRC.GioiTinh);

-- Upsert test customer account 1
MERGE INTO TAI_KHOAN TK
USING (
	SELECT 'CUST_001' AS MaNguoiDung,
		   'Nguyễn Văn A' AS HoTen,
		   'nguyenvana@gmail.com' AS Email,
		   'password123' AS MatKhau,
		   'Khach' AS VaiTro,
		   '0987654321' AS SDT,
		   'TP Hồ Chí Minh' AS DiaChi,
		   'M' AS GioiTinh
	FROM DUAL
) SRC
ON (TK.MaNguoiDung = SRC.MaNguoiDung)
WHEN MATCHED THEN
	UPDATE SET TK.HoTen = SRC.HoTen,
			   TK.Email = SRC.Email,
			   TK.MatKhau = SRC.MatKhau,
			   TK.VaiTro = SRC.VaiTro,
			   TK.SDT = SRC.SDT,
			   TK.DiaChi = SRC.DiaChi,
			   TK.GioiTinh = SRC.GioiTinh
WHEN NOT MATCHED THEN
	INSERT (MaNguoiDung, HoTen, Email, MatKhau, VaiTro, SDT, DiaChi, GioiTinh)
	VALUES (SRC.MaNguoiDung, SRC.HoTen, SRC.Email, SRC.MatKhau, SRC.VaiTro, SRC.SDT, SRC.DiaChi, SRC.GioiTinh);

-- Upsert test customer account 2
MERGE INTO TAI_KHOAN TK
USING (
	SELECT 'CUST_002' AS MaNguoiDung,
		   'Trần Thị B' AS HoTen,
		   'tranthib@gmail.com' AS Email,
		   'password123' AS MatKhau,
		   'Khach' AS VaiTro,
		   '0912345678' AS SDT,
		   'Đà Nẵng' AS DiaChi,
		   'F' AS GioiTinh
	FROM DUAL
) SRC
ON (TK.MaNguoiDung = SRC.MaNguoiDung)
WHEN MATCHED THEN
	UPDATE SET TK.HoTen = SRC.HoTen,
			   TK.Email = SRC.Email,
			   TK.MatKhau = SRC.MatKhau,
			   TK.VaiTro = SRC.VaiTro,
			   TK.SDT = SRC.SDT,
			   TK.DiaChi = SRC.DiaChi,
			   TK.GioiTinh = SRC.GioiTinh
WHEN NOT MATCHED THEN
	INSERT (MaNguoiDung, HoTen, Email, MatKhau, VaiTro, SDT, DiaChi, GioiTinh)
	VALUES (SRC.MaNguoiDung, SRC.HoTen, SRC.Email, SRC.MatKhau, SRC.VaiTro, SRC.SDT, SRC.DiaChi, SRC.GioiTinh);

-- Ensure direct KHACH_HANG records for test customers
MERGE INTO KHACH_HANG KH
USING (
	SELECT 'CUST_001' AS MaNguoiDung,
		   'Bronze' AS LoaiThanhVien,
		   0 AS DiemTichLuy
	FROM DUAL
) SRC
ON (KH.MaNguoiDung = SRC.MaNguoiDung)
WHEN NOT MATCHED THEN
	INSERT (MaNguoiDung, LoaiThanhVien, DiemTichLuy)
	VALUES (SRC.MaNguoiDung, SRC.LoaiThanhVien, SRC.DiemTichLuy);

MERGE INTO KHACH_HANG KH
USING (
	SELECT 'CUST_002' AS MaNguoiDung,
		   'Bronze' AS LoaiThanhVien,
		   0 AS DiemTichLuy
	FROM DUAL
) SRC
ON (KH.MaNguoiDung = SRC.MaNguoiDung)
WHEN NOT MATCHED THEN
	INSERT (MaNguoiDung, LoaiThanhVien, DiemTichLuy)
	VALUES (SRC.MaNguoiDung, SRC.LoaiThanhVien, SRC.DiemTichLuy);

-- Critical FK fix:
-- Ensure every account with VaiTro = 'Khach' has a corresponding KHACH_HANG row.
MERGE INTO KHACH_HANG KH
USING (
	SELECT MaNguoiDung
	FROM TAI_KHOAN
	WHERE VaiTro = 'Khach'
) TK
ON (KH.MaNguoiDung = TK.MaNguoiDung)
WHEN NOT MATCHED THEN
	INSERT (MaNguoiDung, LoaiThanhVien, DiemTichLuy)
	VALUES (TK.MaNguoiDung, 'Bronze', 0);

COMMIT;

-- Verify data
SELECT MaNguoiDung, HoTen, Email, VaiTro FROM TAI_KHOAN ORDER BY VaiTro DESC;
SELECT * FROM KHACH_HANG;
