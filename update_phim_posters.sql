-- ============================================================================
-- UPDATE PHIM POSTER IMAGES FROM TMDB API
-- Generated: 2026-04-23 17:15:13
-- ============================================================================

-- PH001 | Avengers: Endgame | TMDB ID: 299534 | Avengers 4: Hồi Kết
UPDATE PHIM SET Anh = 'https://image.tmdb.org/t/p/w500/8go3YE9sBMQaCXEx23j6BAfeuxd.jpg' WHERE MaPhim = 'PH001';
-- PH002 | Nhà Bà Nữ | TMDB ID: NOT_FOUND
UPDATE PHIM SET Anh = 'https://placehold.co/300x450/png?text=Nha+Ba+Nu' WHERE MaPhim = 'PH002';
-- PH003 | Fast & Furious 9 | TMDB ID: 385128 | Quá Nhanh Quá Nguy Hiểm 9
UPDATE PHIM SET Anh = 'https://image.tmdb.org/t/p/w500/5oaDTTElswDOTEOaO9NquregYCM.jpg' WHERE MaPhim = 'PH003';
-- PH004 | Conan Movie 26 | TMDB ID: 1047041 | Thám Tử Lừng Danh Conan: Tàu Ngầm Sắt Màu Đen
UPDATE PHIM SET Anh = 'https://image.tmdb.org/t/p/w500/x0Dhf9Ar9mlXDJZLjpBKM7joiXM.jpg' WHERE MaPhim = 'PH004';
-- PH005 | Spider-Man: No Way Home | TMDB ID: 634649 | Người Nhện: Không Còn Nhà
UPDATE PHIM SET Anh = 'https://image.tmdb.org/t/p/w500/y4SQ2dJ1y2LBUnxTH7hCe8sr29c.jpg' WHERE MaPhim = 'PH005';
-- PH006 | Dune: Part Two | TMDB ID: 693134 | Hành Tinh Cát: Phần Hai
UPDATE PHIM SET Anh = 'https://image.tmdb.org/t/p/w500/8QdnKQyZDlN6rBSrfU1V5PctfUu.jpg' WHERE MaPhim = 'PH006';
-- PH007 | Lật Mặt 7 | TMDB ID: 1258626 | Lật Mặt 7: Một Điều Ước
UPDATE PHIM SET Anh = 'https://image.tmdb.org/t/p/w500/2mg6ktvWxsOG9iMBP4P1pwOYltk.jpg' WHERE MaPhim = 'PH007';
-- PH008 | The Conjuring: The Devil Made Me Do It | TMDB ID: 423108 | Ám Ảnh Kinh Hoàng: Ma Xui Quỷ Khiến
UPDATE PHIM SET Anh = 'https://image.tmdb.org/t/p/w500/5boXtxQjExJ7EsVvqICt0vZTGRC.jpg' WHERE MaPhim = 'PH008';
-- PH009 | Cô Gái Từ Quá Khứ | TMDB ID: 663745 | Gái Già Lắm Chiêu 3
UPDATE PHIM SET Anh = 'https://image.tmdb.org/t/p/w500/tH92dHWRnzDuQ8jJya8co47PwuI.jpg' WHERE MaPhim = 'PH009';
-- PH010 | Hai Phượng 2 | TMDB ID: 314285 | Antboy II: Den røde furies hævn
UPDATE PHIM SET Anh = 'https://image.tmdb.org/t/p/w500/pKGvJ5LFyVGfeRRWzUF8B1u0fEf.jpg' WHERE MaPhim = 'PH010';
-- PH011 | Doraemon: Nobita Và Cuộc Phiêu Lưu Vũ Trụ | TMDB ID: 1030587 | Doraemon: Nobita và Vùng Đất Lý Tưởng Trên Bầu Trời
UPDATE PHIM SET Anh = 'https://image.tmdb.org/t/p/w500/f0cSFvuuEXpQEHXn9jFpCblHyMI.jpg' WHERE MaPhim = 'PH011';
-- PH012 | Gái Già Lắm Chiêu 5 | TMDB ID: 806218 | Gái Già Lắm Chiêu V: Những Cuộc Đời Vương Giả
UPDATE PHIM SET Anh = 'https://image.tmdb.org/t/p/w500/LvfFOe7xx9EeHMylpNVLXsYCUA.jpg' WHERE MaPhim = 'PH012';
-- PH013 | Kẻ Thứ Ba | TMDB ID: 1059722 | Kẻ Thứ Ba
UPDATE PHIM SET Anh = 'https://image.tmdb.org/t/p/w500/k4Owgh1qe9F3oLokli4lvw0c4nd.jpg' WHERE MaPhim = 'PH013';
-- PH014 | Mission Impossible 8 | TMDB ID: 575265 | Nhiệm Vụ: Bất Khả Thi - Nghiệp Báo Cuối Cùng
UPDATE PHIM SET Anh = 'https://image.tmdb.org/t/p/w500/wxnbCpRKs8FV1SLZYA0mj1x26f9.jpg' WHERE MaPhim = 'PH014';
-- PH015 | Ma Da | TMDB ID: 1309123 | MA DA
UPDATE PHIM SET Anh = 'https://image.tmdb.org/t/p/w500/gmoA1CpaLxLNK4nLpbszpvm2Dyr.jpg' WHERE MaPhim = 'PH015';

COMMIT;

-- Verify:
SELECT MaPhim, TenPhim, Anh FROM PHIM ORDER BY MaPhim;
