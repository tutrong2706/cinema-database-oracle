-- ============================================================================
-- EXTRA SEED FOR PURCHASE FLOW TESTING (Oracle)
-- Purpose: Add many pending orders/tickets for currently open screenings.
-- Idempotent prefixes: DHTxxxxxx / VETxxxxxx
-- ============================================================================

SET DEFINE OFF;
SET ECHO OFF;
SET FEEDBACK OFF;
SET TERMOUT ON;
SET VERIFY OFF;
SET SERVEROUTPUT ON;

DECLARE
    TYPE t_customer_tab IS TABLE OF KHACH_HANG.MaNguoiDung%TYPE;

    v_customers t_customer_tab;
    v_customer_idx NUMBER := 1;

    v_order_counter NUMBER := 1;
    v_ticket_counter NUMBER := 1;

    v_ma_don_hang DON_HANG.MaDonHang%TYPE;
    v_ma_ve VE_XEM_PHIM.MaVe%TYPE;

    v_created_orders NUMBER := 0;
    v_created_tickets NUMBER := 0;
BEGIN
    DBMS_OUTPUT.PUT_LINE('=== START EXTRA PURCHASE TEST SEED ===');

    -- Cleanup previous generated rows for re-run safety.
    DELETE FROM AP_DUNG WHERE MaVe LIKE 'VET%';
    DELETE FROM VE_XEM_PHIM WHERE MaVe LIKE 'VET%';
    DELETE FROM THANH_TOAN WHERE MaDonHang LIKE 'DHT%';
    DELETE FROM GOM WHERE MaDonHang LIKE 'DHT%';
    DELETE FROM DON_HANG WHERE MaDonHang LIKE 'DHT%';
    COMMIT;

    SELECT MaNguoiDung
    BULK COLLECT INTO v_customers
    FROM KHACH_HANG
    ORDER BY MaNguoiDung;

    IF v_customers.COUNT = 0 THEN
        RAISE_APPLICATION_ERROR(-20031, 'KHONG TIM THAY KHACH_HANG DE SEED DON TEST MUA VE.');
    END IF;

    -- For each open screening, create up to 4 pending bookings on available seats.
    FOR sc IN (
        SELECT MaSuatChieu, MaPhong, GiaVeCoBan
        FROM SUAT_CHIEU
        WHERE TrangThai = 'Đang mở'
        ORDER BY NgayChieu, GioBatDau, MaSuatChieu
    ) LOOP
        FOR seat_rec IN (
            SELECT *
            FROM (
                SELECT g.HangGhe, g.SoGhe
                FROM GHE g
                WHERE g.MaPhong = sc.MaPhong
                  AND NOT EXISTS (
                      SELECT 1
                      FROM VE_XEM_PHIM v
                      WHERE v.MaSuatChieu = sc.MaSuatChieu
                        AND v.MaPhong = g.MaPhong
                        AND v.HangGhe = g.HangGhe
                        AND v.SoGhe = g.SoGhe
                        AND v.TrangThai IN ('Đã đặt', 'Đã thanh toán')
                  )
                ORDER BY g.HangGhe, g.SoGhe
            )
            WHERE ROWNUM <= 4
        ) LOOP
            v_ma_don_hang := 'DHT' || LPAD(v_order_counter, 6, '0');
            v_ma_ve := 'VET' || LPAD(v_ticket_counter, 6, '0');

            INSERT INTO DON_HANG (
                MaDonHang,
                MaNguoiDung_KH,
                PhuongThuc,
                ThoiGianDat,
                TongTien,
                TrangThai
            ) VALUES (
                v_ma_don_hang,
                v_customers(v_customer_idx),
                CASE MOD(v_order_counter, 3)
                    WHEN 0 THEN 'Online'
                    WHEN 1 THEN 'App'
                    ELSE 'Tại quầy'
                END,
                SYSTIMESTAMP,
                sc.GiaVeCoBan,
                'Chờ thanh toán'
            );

            INSERT INTO VE_XEM_PHIM (
                MaVe,
                MaSuatChieu,
                MaPhong,
                HangGhe,
                SoGhe,
                MaNguoiDung_KH,
                MaDonHang,
                GiaVeCuoi,
                NgayDat,
                TrangThai
            ) VALUES (
                v_ma_ve,
                sc.MaSuatChieu,
                sc.MaPhong,
                seat_rec.HangGhe,
                seat_rec.SoGhe,
                v_customers(v_customer_idx),
                v_ma_don_hang,
                sc.GiaVeCoBan,
                SYSTIMESTAMP,
                'Đã đặt'
            );

            v_order_counter := v_order_counter + 1;
            v_ticket_counter := v_ticket_counter + 1;
            v_created_orders := v_created_orders + 1;
            v_created_tickets := v_created_tickets + 1;

            v_customer_idx := v_customer_idx + 1;
            IF v_customer_idx > v_customers.COUNT THEN
                v_customer_idx := 1;
            END IF;
        END LOOP;
    END LOOP;

    COMMIT;

    DBMS_OUTPUT.PUT_LINE('Created pending orders  : ' || TO_CHAR(v_created_orders));
    DBMS_OUTPUT.PUT_LINE('Created reserved tickets: ' || TO_CHAR(v_created_tickets));
    DBMS_OUTPUT.PUT_LINE('=== EXTRA PURCHASE TEST SEED COMPLETED ===');
END;
/

SELECT COUNT(*) AS SO_DON_TEST_MUA_VE FROM DON_HANG WHERE MaDonHang LIKE 'DHT%';
SELECT COUNT(*) AS SO_VE_TEST_MUA_VE FROM VE_XEM_PHIM WHERE MaVe LIKE 'VET%';
