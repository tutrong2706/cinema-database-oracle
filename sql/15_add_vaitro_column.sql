-- Add VaiTro column to TAI_KHOAN table
-- This column stores the user's role: 'Khach' (Customer) or 'Admin' (Administrator)

ALTER TABLE TAI_KHOAN ADD (VaiTro VARCHAR2(20) DEFAULT 'Khach');

-- Add constraint to ensure valid role values
ALTER TABLE TAI_KHOAN ADD CONSTRAINT chk_tk_vaitro CHECK (VaiTro IN ('Khach', 'Admin'));

-- Commit changes
COMMIT;

-- Verify the changes
DESC TAI_KHOAN;
