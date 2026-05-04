-- Active: 1775405888174@@127.0.0.1@5432
-- ============================================================================
-- ORACLE DATABASE: CREATE USER AND GRANT PRIVILEGES
-- Cinema Database Setup
-- Version: 1.0
-- ============================================================================

-- ============================================================================
-- 1. CREATE USER 'dev' IF NOT EXISTS
-- ============================================================================

BEGIN
  DECLARE
    user_exists EXCEPTION;
    PRAGMA EXCEPTION_INIT(user_exists, -1920);
  BEGIN
    EXECUTE IMMEDIATE 'CREATE USER dev IDENTIFIED BY dev123';
    DBMS_OUTPUT.PUT_LINE('User dev created successfully');
  EXCEPTION
    WHEN user_exists THEN
      DBMS_OUTPUT.PUT_LINE('User dev already exists');
    WHEN OTHERS THEN
      DBMS_OUTPUT.PUT_LINE('Error: ' || SQLERRM);
  END;
END;
/

-- ============================================================================
-- 2. GRANT BASIC PRIVILEGES TO USER 'dev'
-- ============================================================================

GRANT CREATE SESSION TO dev;
GRANT CREATE TABLE TO dev;
GRANT CREATE VIEW TO dev;
GRANT CREATE SEQUENCE TO dev;
GRANT CREATE PROCEDURE TO dev;
GRANT CREATE FUNCTION TO dev;
GRANT CREATE TRIGGER TO dev;
GRANT EXECUTE ON DBMS_LOB TO dev;

-- ============================================================================
-- 3. GRANT UNLIMITED QUOTA ON TABLESPACE
-- ============================================================================

ALTER USER dev QUOTA UNLIMITED ON SYSTEM;
ALTER USER dev QUOTA UNLIMITED ON USERS;

-- ============================================================================
-- 4. GRANT SYSTEM PRIVILEGES FOR SYSDBA OPERATIONS
-- ============================================================================

GRANT SYSDBA TO dev;

-- ============================================================================
-- 5. VERIFY USER CREATION
-- ============================================================================

SELECT username, account_status FROM dba_users WHERE username = 'DEV';

COMMIT;

-- ============================================================================
-- Success Message
-- ============================================================================
BEGIN
  DBMS_OUTPUT.PUT_LINE('✅ User DEV created and privileges granted successfully!');
  DBMS_OUTPUT.PUT_LINE('Connection Details:');
  DBMS_OUTPUT.PUT_LINE('  Username: dev');
  DBMS_OUTPUT.PUT_LINE('  Password: dev123');
  DBMS_OUTPUT.PUT_LINE('  Service: XEPDB1');
END;
/
