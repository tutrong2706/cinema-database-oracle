-- ============================================================================
-- INSERT MORE DATA (CLEAN VERSION)
-- Purpose: Add extra movies (PH009..PH015) with stable poster URLs for testing.
-- Notes:
--   - Idempotent via MERGE.
--   - Does NOT delete PHIM rows, so existing poster data is preserved.
-- ============================================================================

SET DEFINE OFF;
SET ECHO OFF;
SET FEEDBACK OFF;
SET TERMOUT ON;
SET VERIFY OFF;
SET SERVEROUTPUT ON;

-- Update existing rows (keep old poster if already present, fill if NULL).
UPDATE PHIM
SET TenPhim = 'Cô Gái Từ Quá Khứ', ThoiLuong = 105, NgonNgu = 'Tiếng Việt', QuocGia = 'Việt Nam',
    DaoDien = 'Nguyễn Quang Dũng', DienVienChinh = 'Kaity Nguyễn',
    NgayKhoiChieu = TO_DATE('2026-02-14', 'YYYY-MM-DD'),
    MoTaNoiDung = 'Câu chuyện tình yêu xuyên thời gian đầy cảm xúc.',
    DoTuoi = 13, ChuDePhim = 'Tình cảm',
    Anh = NVL(Anh, 'https://image.tmdb.org/t/p/w500/tH92dHWRnzDuQ8jJya8co47PwuI.jpg')
WHERE MaPhim = 'PH009';

UPDATE PHIM
SET TenPhim = 'Hai Phượng 2', ThoiLuong = 110, NgonNgu = 'Tiếng Việt', QuocGia = 'Việt Nam',
    DaoDien = 'Lê Văn Kiệt', DienVienChinh = 'Ngô Thanh Vân',
    NgayKhoiChieu = TO_DATE('2026-03-08', 'YYYY-MM-DD'),
    MoTaNoiDung = 'Nữ chiến binh trở lại với hành trình truy lùng tổ chức tội phạm mới.',
    DoTuoi = 16, ChuDePhim = 'Hành động',
    Anh = NVL(Anh, 'https://image.tmdb.org/t/p/w500/pKGvJ5LFyVGfeRRWzUF8B1u0fEf.jpg')
WHERE MaPhim = 'PH010';

UPDATE PHIM
SET TenPhim = 'Doraemon: Nobita Và Cuộc Phiêu Lưu Vũ Trụ', ThoiLuong = 95, NgonNgu = 'Tiếng Việt', QuocGia = 'Japan',
    DaoDien = 'Takahiro Imamura', DienVienChinh = 'Wasabi Mizuta',
    NgayKhoiChieu = TO_DATE('2026-04-01', 'YYYY-MM-DD'),
    MoTaNoiDung = 'Doraemon và nhóm bạn phiêu lưu ngoài vũ trụ.',
    DoTuoi = 0, ChuDePhim = 'Hoạt hình',
    Anh = NVL(Anh, 'https://image.tmdb.org/t/p/w500/f0cSFvuuEXpQEHXn9jFpCblHyMI.jpg')
WHERE MaPhim = 'PH011';

UPDATE PHIM
SET TenPhim = 'Gái Già Lắm Chiêu 6', ThoiLuong = 100, NgonNgu = 'Tiếng Việt', QuocGia = 'Việt Nam',
    DaoDien = 'Bảo Nhân', DienVienChinh = 'Hồng Vân',
    NgayKhoiChieu = TO_DATE('2026-01-15', 'YYYY-MM-DD'),
    MoTaNoiDung = 'Series hài hước với nhiều tình huống bất ngờ.',
    DoTuoi = 13, ChuDePhim = 'Hài',
    Anh = NVL(Anh, 'https://image.tmdb.org/t/p/w500/LvfFOe7xx9EeHMylpNVLXsYCUA.jpg')
WHERE MaPhim = 'PH012';

UPDATE PHIM
SET TenPhim = 'Kẻ Thứ Ba', ThoiLuong = 118, NgonNgu = 'Tiếng Việt', QuocGia = 'Việt Nam',
    DaoDien = 'Trần Thanh Huy', DienVienChinh = 'Kaity Nguyễn',
    NgayKhoiChieu = TO_DATE('2026-02-28', 'YYYY-MM-DD'),
    MoTaNoiDung = 'Bộ phim tâm lý tội phạm với nhiều nút thắt.',
    DoTuoi = 18, ChuDePhim = 'Tâm lý - Tội phạm',
    Anh = NVL(Anh, 'https://image.tmdb.org/t/p/w500/k4Owgh1qe9F3oLokli4lvw0c4nd.jpg')
WHERE MaPhim = 'PH013';

UPDATE PHIM
SET TenPhim = 'Mission Impossible 8', ThoiLuong = 163, NgonNgu = 'English', QuocGia = 'USA',
    DaoDien = 'Christopher McQuarrie', DienVienChinh = 'Tom Cruise',
    NgayKhoiChieu = TO_DATE('2025-05-22', 'YYYY-MM-DD'),
    MoTaNoiDung = 'Ethan Hunt trở lại với nhiệm vụ bất khả thi mới.',
    DoTuoi = 13, ChuDePhim = 'Hành động',
    Anh = NVL(Anh, 'https://image.tmdb.org/t/p/w500/wxnbCpRKs8FV1SLZYA0mj1x26f9.jpg')
WHERE MaPhim = 'PH014';

UPDATE PHIM
SET TenPhim = 'Ma Da', ThoiLuong = 108, NgonNgu = 'Tiếng Việt', QuocGia = 'Việt Nam',
    DaoDien = 'Tống Phước Lạc', DienVienChinh = 'Thanh Hằng',
    NgayKhoiChieu = TO_DATE('2026-03-20', 'YYYY-MM-DD'),
    MoTaNoiDung = 'Phim kinh dị Việt mang màu sắc dân gian.',
    DoTuoi = 16, ChuDePhim = 'Kinh dị',
    Anh = NVL(Anh, 'https://image.tmdb.org/t/p/w500/gmoA1CpaLxLNK4nLpbszpvm2Dyr.jpg')
WHERE MaPhim = 'PH015';

-- Insert missing rows only.
INSERT INTO PHIM (MaPhim, TenPhim, ThoiLuong, NgonNgu, QuocGia, DaoDien, DienVienChinh, NgayKhoiChieu, MoTaNoiDung, DoTuoi, ChuDePhim, Anh)
SELECT 'PH009', 'Cô Gái Từ Quá Khứ', 105, 'Tiếng Việt', 'Việt Nam', 'Nguyễn Quang Dũng', 'Kaity Nguyễn',
       TO_DATE('2026-02-14', 'YYYY-MM-DD'), 'Câu chuyện tình yêu xuyên thời gian đầy cảm xúc.',
       13, 'Tình cảm', 'https://image.tmdb.org/t/p/w500/tH92dHWRnzDuQ8jJya8co47PwuI.jpg'
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM PHIM WHERE MaPhim = 'PH009');

INSERT INTO PHIM (MaPhim, TenPhim, ThoiLuong, NgonNgu, QuocGia, DaoDien, DienVienChinh, NgayKhoiChieu, MoTaNoiDung, DoTuoi, ChuDePhim, Anh)
SELECT 'PH010', 'Hai Phượng 2', 110, 'Tiếng Việt', 'Việt Nam', 'Lê Văn Kiệt', 'Ngô Thanh Vân',
       TO_DATE('2026-03-08', 'YYYY-MM-DD'), 'Nữ chiến binh trở lại với hành trình truy lùng tổ chức tội phạm mới.',
       16, 'Hành động', 'https://image.tmdb.org/t/p/w500/pKGvJ5LFyVGfeRRWzUF8B1u0fEf.jpg'
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM PHIM WHERE MaPhim = 'PH010');

INSERT INTO PHIM (MaPhim, TenPhim, ThoiLuong, NgonNgu, QuocGia, DaoDien, DienVienChinh, NgayKhoiChieu, MoTaNoiDung, DoTuoi, ChuDePhim, Anh)
SELECT 'PH011', 'Doraemon: Nobita Và Cuộc Phiêu Lưu Vũ Trụ', 95, 'Tiếng Việt', 'Japan', 'Takahiro Imamura', 'Wasabi Mizuta',
       TO_DATE('2026-04-01', 'YYYY-MM-DD'), 'Doraemon và nhóm bạn phiêu lưu ngoài vũ trụ.',
       0, 'Hoạt hình', 'https://image.tmdb.org/t/p/w500/f0cSFvuuEXpQEHXn9jFpCblHyMI.jpg'
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM PHIM WHERE MaPhim = 'PH011');

INSERT INTO PHIM (MaPhim, TenPhim, ThoiLuong, NgonNgu, QuocGia, DaoDien, DienVienChinh, NgayKhoiChieu, MoTaNoiDung, DoTuoi, ChuDePhim, Anh)
SELECT 'PH012', 'Gái Già Lắm Chiêu 6', 100, 'Tiếng Việt', 'Việt Nam', 'Bảo Nhân', 'Hồng Vân',
       TO_DATE('2026-01-15', 'YYYY-MM-DD'), 'Series hài hước với nhiều tình huống bất ngờ.',
       13, 'Hài', 'https://image.tmdb.org/t/p/w500/LvfFOe7xx9EeHMylpNVLXsYCUA.jpg'
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM PHIM WHERE MaPhim = 'PH012');

INSERT INTO PHIM (MaPhim, TenPhim, ThoiLuong, NgonNgu, QuocGia, DaoDien, DienVienChinh, NgayKhoiChieu, MoTaNoiDung, DoTuoi, ChuDePhim, Anh)
SELECT 'PH013', 'Kẻ Thứ Ba', 118, 'Tiếng Việt', 'Việt Nam', 'Trần Thanh Huy', 'Kaity Nguyễn',
       TO_DATE('2026-02-28', 'YYYY-MM-DD'), 'Bộ phim tâm lý tội phạm với nhiều nút thắt.',
       18, 'Tâm lý - Tội phạm', 'https://image.tmdb.org/t/p/w500/k4Owgh1qe9F3oLokli4lvw0c4nd.jpg'
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM PHIM WHERE MaPhim = 'PH013');

INSERT INTO PHIM (MaPhim, TenPhim, ThoiLuong, NgonNgu, QuocGia, DaoDien, DienVienChinh, NgayKhoiChieu, MoTaNoiDung, DoTuoi, ChuDePhim, Anh)
SELECT 'PH014', 'Mission Impossible 8', 163, 'English', 'USA', 'Christopher McQuarrie', 'Tom Cruise',
       TO_DATE('2025-05-22', 'YYYY-MM-DD'), 'Ethan Hunt trở lại với nhiệm vụ bất khả thi mới.',
       13, 'Hành động', 'https://image.tmdb.org/t/p/w500/wxnbCpRKs8FV1SLZYA0mj1x26f9.jpg'
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM PHIM WHERE MaPhim = 'PH014');

INSERT INTO PHIM (MaPhim, TenPhim, ThoiLuong, NgonNgu, QuocGia, DaoDien, DienVienChinh, NgayKhoiChieu, MoTaNoiDung, DoTuoi, ChuDePhim, Anh)
SELECT 'PH015', 'Ma Da', 108, 'Tiếng Việt', 'Việt Nam', 'Tống Phước Lạc', 'Thanh Hằng',
       TO_DATE('2026-03-20', 'YYYY-MM-DD'), 'Phim kinh dị Việt mang màu sắc dân gian.',
       16, 'Kinh dị', 'https://image.tmdb.org/t/p/w500/gmoA1CpaLxLNK4nLpbszpvm2Dyr.jpg'
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM PHIM WHERE MaPhim = 'PH015');

COMMIT;

-- ============================================================================
-- 2) MOVIE GENRES FOR PH009..PH015
-- ============================================================================
DELETE FROM THE_LOAI_PHIM WHERE MaPhim IN ('PH009', 'PH010', 'PH011', 'PH012', 'PH013', 'PH014', 'PH015');

INSERT INTO THE_LOAI_PHIM (MaPhim, TheLoai) VALUES ('PH009', 'Tình cảm');
INSERT INTO THE_LOAI_PHIM (MaPhim, TheLoai) VALUES ('PH010', 'Hành động');
INSERT INTO THE_LOAI_PHIM (MaPhim, TheLoai) VALUES ('PH011', 'Hoạt hình');
INSERT INTO THE_LOAI_PHIM (MaPhim, TheLoai) VALUES ('PH012', 'Hài');
INSERT INTO THE_LOAI_PHIM (MaPhim, TheLoai) VALUES ('PH013', 'Tâm lý');
INSERT INTO THE_LOAI_PHIM (MaPhim, TheLoai) VALUES ('PH014', 'Hành động');
INSERT INTO THE_LOAI_PHIM (MaPhim, TheLoai) VALUES ('PH015', 'Kinh dị');

COMMIT;
