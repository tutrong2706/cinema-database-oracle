-- ============================================================================
-- UPDATE PHIM POSTER IMAGES FROM TMDB API
-- Generated: 2026-04-27 19:57:03
-- ============================================================================

UPDATE PHIM SET Anh = 'https://image.tmdb.org/t/p/w500/ulzhLuWrPK07P1YkdWQLZnQh1JL.jpg' WHERE MaPhim = 'PH001';
UPDATE PHIM SET Anh = 'https://via.placeholder.com/300x450?text=Nha+Ba+Nu' WHERE MaPhim = 'PH002';
UPDATE PHIM SET Anh = 'https://image.tmdb.org/t/p/w500/deEmLILTPejEb6OGsXRJ5MCvyDW.jpg' WHERE MaPhim = 'PH003';
UPDATE PHIM SET Anh = 'https://image.tmdb.org/t/p/w500/ksQ8uNgoWsVH6a0oPB6zx08pOwU.jpg' WHERE MaPhim = 'PH004';
UPDATE PHIM SET Anh = 'https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg' WHERE MaPhim = 'PH005';
UPDATE PHIM SET Anh = 'https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg' WHERE MaPhim = 'PH006';
UPDATE PHIM SET Anh = 'https://via.placeholder.com/300x450?text=Lat+Mat+7' WHERE MaPhim = 'PH007';
UPDATE PHIM SET Anh = 'https://image.tmdb.org/t/p/w500/rQfX2xx8TUoNvyk892yKWNikJaM.jpg' WHERE MaPhim = 'PH008';

COMMIT;

-- Verify:
SELECT MaPhim, TenPhim, Anh FROM PHIM ORDER BY MaPhim;
