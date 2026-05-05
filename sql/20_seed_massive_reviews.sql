-- ============================================
-- 20_seed_massive_reviews.sql
-- Thêm 10 đánh giá cho mỗi phim (480 tổng cộng - 48 phim)
-- Đánh giá khách quan, phân hóa điểm
-- ============================================

-- ========== PH001: Avengers: Endgame (Rất Hay - 8-10) ==========
INSERT INTO DANH_GIA (MaDanhGia, MaNguoiDung, MaPhim, NoiDung, NgayDang, DiemSo) VALUES ('DG_PH001_001', 'KH001', 'PH001', 'Bom tấn Marvel vĩ đại! Kết thúc hoàn hảo cho Infinity Saga', SYSDATE, 10);
INSERT INTO DANH_GIA (MaDanhGia, MaNguoiDung, MaPhim, NoiDung, NgayDang, DiemSo) VALUES ('DG_PH001_002', 'KH002', 'PH001', 'Kịch tính, xúc động, hiệu ứng đẹp mắt. Rất hay!', SYSDATE, 9);
INSERT INTO DANH_GIA (MaDanhGia, MaNguoiDung, MaPhim, NoiDung, NgayDang, DiemSo) VALUES ('DG_PH001_003', 'KH003', 'PH001', 'Một tác phẩm điện ảnh lớn nhất từng được làm', SYSDATE, 10);
INSERT INTO DANH_GIA (MaDanhGia, MaNguoiDung, MaPhim, NoiDung, NgayDang, DiemSo) VALUES ('DG_PH001_004', 'KH004', 'PH001', 'Hay quá! Xứng đáng là phim bom tấn thế kỷ', SYSDATE, 9);
INSERT INTO DANH_GIA (MaDanhGia, MaNguoiDung, MaPhim, NoiDung, NgayDang, DiemSo) VALUES ('DG_PH001_005', 'KH005', 'PH001', 'Kết quả không chối cãi được. Siêu phẩm!', SYSDATE, 10);
INSERT INTO DANH_GIA (MaDanhGia, MaNguoiDung, MaPhim, NoiDung, NgayDang, DiemSo) VALUES ('DG_PH001_006', 'KH006', 'PH001', 'Cảm xúc và hành động hoàn hảo. Xứng đáng xem lại', SYSDATE, 9);
INSERT INTO DANH_GIA (MaDanhGia, MaNguoiDung, MaPhim, NoiDung, NgayDang, DiemSo) VALUES ('DG_PH001_007', 'KH007', 'PH001', 'Tuyệt vời! Cảnh hành động liên tục, kịch tính tột độ', SYSDATE, 10);
INSERT INTO DANH_GIA (MaDanhGia, MaNguoiDung, MaPhim, NoiDung, NgayDang, DiemSo) VALUES ('DG_PH001_008', 'KH008', 'PH001', 'Kết thúc Marvel vĩ mệnh. Rất đáng xem', SYSDATE, 9);
INSERT INTO DANH_GIA (MaDanhGia, MaNguoiDung, MaPhim, NoiDung, NgayDang, DiemSo) VALUES ('DG_PH001_009', 'KH009', 'PH001', 'Phim tuyệt vời từ đầu đến cuối. Không có gì chê', SYSDATE, 10);
INSERT INTO DANH_GIA (MaDanhGia, MaNguoiDung, MaPhim, NoiDung, NgayDang, DiemSo) VALUES ('DG_PH001_010', 'KH010', 'PH001', 'Một kiệt tác, xứng đáng với danh vọng của nó', SYSDATE, 8);

-- ========== PH002-PH048: Các phim còn lại (phân hóa 5-10) ==========
-- Sử dụng PL/SQL block để insert nhanh 47 phim còn lại
BEGIN
  FOR j IN 2..48 LOOP
    FOR i IN 1..10 LOOP
      INSERT INTO DANH_GIA (MaDanhGia, MaNguoiDung, MaPhim, NoiDung, NgayDang, DiemSo)
      VALUES (
        'DG_PH' || LPAD(j, 3, '0') || '_' || LPAD(i, 3, '0'),
        'KH' || LPAD(MOD(i + j, 20) + 1, 3, '0'),
        'PH' || LPAD(j, 3, '0'),
        CASE
          WHEN MOD(j, 5) = 1 THEN 'Phim tuyệt vời, không có gì chê'
          WHEN MOD(j, 5) = 2 THEN 'Hay, xứng đáng xem'
          WHEN MOD(j, 5) = 3 THEN 'Phim hay, nội dung tốt'
          WHEN MOD(j, 5) = 4 THEN 'Tạm được, xem được'
          ELSE 'Hay, hấp dẫn'
        END,
        SYSDATE,
        CASE
          WHEN MOD(j, 5) = 1 THEN CASE WHEN i <= 3 THEN 10 WHEN i <= 7 THEN 9 ELSE 8 END
          WHEN MOD(j, 5) = 2 THEN CASE WHEN i <= 4 THEN 8 WHEN i <= 7 THEN 7 ELSE 9 END
          WHEN MOD(j, 5) = 3 THEN CASE WHEN i <= 3 THEN 8 WHEN i <= 6 THEN 7 ELSE 8 END
          WHEN MOD(j, 5) = 4 THEN CASE WHEN i <= 2 THEN 6 WHEN i <= 5 THEN 5 ELSE 6 END
          ELSE CASE WHEN i <= 2 THEN 9 WHEN i <= 5 THEN 8 WHEN i <= 8 THEN 7 ELSE 8 END
        END
      );
    END LOOP;
  END LOOP;
  COMMIT;
END;
/

-- Hiển thị số lượng đánh giá đã insert
SELECT COUNT(*) AS "Tổng đánh giá đã thêm (48 phim x 10 = 480)" FROM DANH_GIA;
