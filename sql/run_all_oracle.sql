-- ============================================================================
-- RUN ALL SCRIPTS FOR ORACLE DATABASE MIGRATION
-- Complete database initialization with all Oracle-compatible components
-- 
-- Execute in Oracle SQL*Plus or SQL Developer:
--   sqlplus dev/dev123@XEPDB1
-- Then: @run_all_oracle.sql
-- ============================================================================

SET ECHO ON;
SET TIMING ON;

SPOOL run_all_oracle.log;

PROMPT ========================================================================
PROMPT          CINEMA DATABASE - ORACLE MIGRATION COMPLETE
PROMPT ========================================================================

-- 0. Create user and grant privileges
-- PROMPT ============= [00] Creating User and Granting Privileges =============
-- @/docker-entrypoint-initdb.d/00_create_user_oracle.sql

-- 1. Create all tables
PROMPT ============= [01] Creating Tables =============
@/docker-entrypoint-initdb.d/01_create_tables_oracle.sql

-- 2. Insert initial data
PROMPT ============= [02] Inserting Sample Data =============
@/docker-entrypoint-initdb.d/02_insert_data_oracle.sql

-- 3. Create stored procedures for movie management
PROMPT ============= [03] Creating Movie Management Procedures =============
@/docker-entrypoint-initdb.d/03_sp_phim_oracle.sql

-- 4. Create stored procedures for order management
PROMPT ============= [04] Creating Order Management Procedures =============
@/docker-entrypoint-initdb.d/04_sp_donhang_oracle.sql

-- 5. Create stored procedures for ticket management
PROMPT ============= [05] Creating Ticket Management Procedures =============
@/docker-entrypoint-initdb.d/05_sp_ve_oracle.sql

-- 6. Create functions
PROMPT ============= [06] Creating Functions =============
@/docker-entrypoint-initdb.d/06_functions_oracle.sql

-- 7. Create business logic triggers
PROMPT ============= [07] Creating Business Logic Triggers =============
@/docker-entrypoint-initdb.d/07_triggers_business_oracle.sql

-- 8. Create order total calculation triggers
PROMPT ============= [08] Creating Order Total Calculation Triggers =============
@/docker-entrypoint-initdb.d/08_triggers_tongtien_oracle.sql

-- 9. Create views and data access procedures
PROMPT ============= [09] Creating Views and Data Access Procedures =============
@/docker-entrypoint-initdb.d/09_sp_view_data_oracle.sql

-- 10. Run demo script (sample operations)
--PROMPT ============= [10] Running Demo Script =============
--@/docker-entrypoint-initdb.d/10_demo_script_oracle.sql

-- 11. Create image management features
PROMPT ============= [11] Creating Image Management System =============
@/docker-entrypoint-initdb.d/11_image_operations_oracle.sql

-- 12. Create API helper procedures
PROMPT ============= [12] Creating API Helper Procedures =============
@/docker-entrypoint-initdb.d/12_api_helper_procedures_oracle.sql

-- 13. Create enhanced views with flexible sorting
PROMPT ============= [13] Creating Enhanced Views with Sorting =============
@/docker-entrypoint-initdb.d/13_enhanced_views_sorting_oracle.sql

PROMPT ============= DATABASE MIGRATION COMPLETE! =============
SPOOL OFF;

-- Display migration summary
SET HEADING ON;
SET PAGESIZE 20;

PROMPT ========================================================================
PROMPT          ORACLE DATABASE OBJECTS SUMMARY
PROMPT ========================================================================

COLUMN object_type FORMAT A20;
COLUMN object_count FORMAT 9999;

SELECT 
    object_type,
    COUNT(*) as object_count
FROM user_objects
WHERE object_type IN ('TABLE', 'INDEX', 'PROCEDURE', 'FUNCTION', 'TRIGGER', 'VIEW')
GROUP BY object_type
ORDER BY object_type;

PROMPT ========================================================================
PROMPT          Table Structure Summary
PROMPT ========================================================================

COLUMN table_name FORMAT A30;
COLUMN column_count FORMAT 9999;

SELECT 
    table_name,
    COUNT(*) as column_count
FROM user_tab_columns
GROUP BY table_name
ORDER BY table_name;

PROMPT ========================================================================
PROMPT Migration Status: COMPLETED SUCCESSFULLY
PROMPT Database is ready for production use with all functions and triggers
PROMPT ========================================================================
