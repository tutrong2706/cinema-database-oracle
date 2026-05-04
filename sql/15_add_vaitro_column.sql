-- ============================================================================
-- Add VaiTro column to TAI_KHOAN table
-- This column stores the user's role: 'Khach' (Customer) or 'Admin' (Administrator)
-- ============================================================================

-- Check if column exists, if not add it
BEGIN
   EXECUTE IMMEDIATE 'ALTER TABLE TAI_KHOAN ADD (VaiTro VARCHAR2(20) DEFAULT ''Khach'')';
EXCEPTION
   WHEN OTHERS THEN
      IF SQLCODE = -1430 THEN
         -- Column already exists, ignore error
         NULL;
      ELSE
         RAISE;
      END IF;
END;
/

-- Add constraint to ensure valid role values
BEGIN
   EXECUTE IMMEDIATE 'ALTER TABLE TAI_KHOAN ADD CONSTRAINT chk_tk_vaitro CHECK (VaiTro IN (''Khach'', ''Admin''))';
EXCEPTION
   WHEN OTHERS THEN
      IF SQLCODE = -2264 THEN
         -- Constraint already exists, ignore error
         NULL;
      ELSE
         RAISE;
      END IF;
END;
/

-- Commit changes
COMMIT;

-- Verify the changes
DESC TAI_KHOAN;
