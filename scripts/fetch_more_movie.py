#!/usr/bin/env python3
"""
TMDB Movie Master Tool cho Oracle Database
1. Cập nhật ảnh Poster thực tế cho các phim có sẵn (PH001 - PH008)
2. Lấy thêm phim mới từ TMDB và tạo lệnh INSERT (từ PH009 trở đi)
"""

import requests
import random
from datetime import datetime

# ==========================================
# CẤU HÌNH API
# ==========================================
TMDB_API_KEY = "9ac53c5a728d7cb5cd56649b54c39aeb"  # Key của bạn
TMDB_BASE_URL = "https://api.themoviedb.org/3"
POSTER_BASE_URL = "https://image.tmdb.org/t/p/w500"

# ==========================================
# CẤU HÌNH DỮ LIỆU
# ==========================================
# Danh sách phim cũ cần Update ảnh (PH001 - PH008)
EXISTING_MOVIES = [
    {"ma": "PH001", "ten_en": "Avengers: Endgame", "year": 2019},
    {"ma": "PH002", "ten_en": "Nha Ba Nu", "year": 2023}, 
    {"ma": "PH003", "ten_en": "Fast & Furious 9", "year": 2021},
    {"ma": "PH004", "ten_en": "Detective Conan Movie 26", "year": 2023},
    {"ma": "PH005", "ten_en": "Spider-Man: No Way Home", "year": 2021},
    {"ma": "PH006", "ten_en": "Dune: Part Two", "year": 2024},
    {"ma": "PH007", "ten_en": "Lat Mat 7", "year": 2025},
    {"ma": "PH008", "ten_en": "The Conjuring: The Devil Made Me Do It", "year": 2021},
]

# Cấu hình Insert phim mới
PAGES_TO_FETCH = 2  # Lấy 2 trang (40 phim mới)
START_ID = 9        # Bắt đầu INSERT từ PH009

# Dữ liệu giả lập cho các trường TMDB không cung cấp ở API Popular
MOCK_DAO_DIEN = ['Christopher Nolan', 'James Cameron', 'Zack Snyder', 'Trấn Thành', 'Lý Hải', 'Victor Vũ', 'Michael Bay']
MOCK_DIEN_VIEN = ['Tom Cruise', 'Robert Downey Jr.', 'Keanu Reeves', 'Thái Hòa', 'Kiều Minh Tuấn', 'Scarlett Johansson']
MOCK_QUOC_GIA = ['USA', 'Việt Nam', 'Japan', 'Korea', 'UK']
MOCK_NGON_NGU = ['English', 'Tiếng Việt', 'Japanese', 'Korean']
MOCK_THE_LOAI = ['Hành động', 'Hài', 'Viễn tưởng', 'Tình cảm', 'Kinh dị', 'Hoạt hình', 'Siêu anh hùng']

# ==========================================
# HÀM HỖ TRỢ
# ==========================================
def escape_sql_string(text):
    """Xử lý dấu nháy đơn trong Oracle SQL (thay ' bằng '')"""
    if not text:
        return "Nội dung đang cập nhật..."
    return text.replace("'", "''")

def get_poster_url(movie_title, year=None):
    """Tìm poster chính xác cho 1 bộ phim cụ thể"""
    try:
        search_url = f"{TMDB_BASE_URL}/search/movie"
        params = {"api_key": TMDB_API_KEY, "query": movie_title, "year": year}
        response = requests.get(search_url, params=params, timeout=5)
        response.raise_for_status()
        data = response.json()
        
        if data["results"] and len(data["results"]) > 0:
            poster_path = data["results"][0].get("poster_path")
            if poster_path:
                return f"{POSTER_BASE_URL}{poster_path}"
        return None
    except Exception as e:
        print(f"❌ Lỗi khi tìm poster '{movie_title}': {e}")
        return None

# ==========================================
# CHƯƠNG TRÌNH CHÍNH
# ==========================================
def generate_master_sql():
    print("=" * 60)
    print("🎬 TMDB MOVIE MASTER TOOL FOR ORACLE")
    print("=" * 60 + "\n")
    
    sql_statements = []
    
    # Header cho file SQL Oracle
    sql_statements.append("-- ============================================================================")
    sql_statements.append(f"-- AUTO GENERATED SQL TOOL - {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    sql_statements.append("-- ============================================================================")
    sql_statements.append("SET DEFINE OFF;\n") # Tắt biến & trong Oracle
    
    # ---------------------------------------------------------
    # PHASE 1: UPDATE POSTER CHO PHIM CŨ
    # ---------------------------------------------------------
    print("🔄 PHASE 1: Đang lấy Poster cho các phim hiện tại (PH001 - PH008)...")
    sql_statements.append("-- 1. CẬP NHẬT POSTER CHO CÁC PHIM ĐÃ CÓ")
    
    for movie in EXISTING_MOVIES:
        print(f"  🔍 Đang tìm: {movie['ten_en']} ({movie['year']})...", end=" ")
        poster_url = get_poster_url(movie["ten_en"], movie.get("year"))
        
        if poster_url:
            print("✅ Đã thấy")
        else:
            print("⚠️ Không thấy (dùng ảnh mặc định)")
            poster_url = f"https://via.placeholder.com/300x450?text={movie['ten_en'].replace(' ', '+')}"
            
        sql_line = f"UPDATE PHIM SET Anh = '{poster_url}' WHERE MaPhim = '{movie['ma']}';"
        sql_statements.append(sql_line)
        
    sql_statements.append("COMMIT;\n")
    
    # ---------------------------------------------------------
    # PHASE 2: INSERT THÊM PHIM MỚI
    # ---------------------------------------------------------
    print("\n🚀 PHASE 2: Đang cào thêm phim mới từ TMDB (Từ PH009 trở đi)...")
    sql_statements.append("-- 2. THÊM DỮ LIỆU PHIM MỚI TỪ TMDB")
    
    current_id = START_ID
    
    for page in range(1, PAGES_TO_FETCH + 1):
        response = requests.get(f"{TMDB_BASE_URL}/movie/popular?api_key={TMDB_API_KEY}&language=vi-VN&page={page}")
        
        if response.status_code != 200:
            print(f"❌ Lỗi gọi API trang {page}: {response.status_code}")
            continue
            
        data = response.json()
        
        for item in data.get('results', []):
            ma_phim = f"PH{current_id:03d}"
            
            ten_phim = escape_sql_string(item.get('title', ''))
            mo_ta = escape_sql_string(item.get('overview', ''))
            if len(mo_ta) < 5: mo_ta = "Siêu phẩm điện ảnh không thể bỏ lỡ trong năm nay."
            if len(mo_ta) > 500: mo_ta = mo_ta[:497] + "..."
            
            thoi_luong = random.randint(90, 180)
            ngon_ngu = random.choice(MOCK_NGON_NGU)
            quoc_gia = random.choice(MOCK_QUOC_GIA)
            dao_dien = random.choice(MOCK_DAO_DIEN)
            dien_vien = random.choice(MOCK_DIEN_VIEN)
            
            release_date = item.get('release_date', '2025-01-01')
            if not release_date: release_date = '2025-01-01'
            ngay_khoi_chieu = f"TO_DATE('{release_date}', 'YYYY-MM-DD')"
            
            do_tuoi = random.choice([13, 16, 18])
            chu_de = random.choice(MOCK_THE_LOAI)
            
            poster_path = item.get('poster_path')
            anh = f"{POSTER_BASE_URL}{poster_path}" if poster_path else f"https://via.placeholder.com/300x450?text={ten_phim.replace(' ', '+')}"
            
            # Câu lệnh INSERT Bảng Phim
            sql_insert = f"INSERT INTO PHIM (MaPhim, TenPhim, ThoiLuong, NgonNgu, QuocGia, DaoDien, DienVienChinh, NgayKhoiChieu, MoTaNoiDung, DoTuoi, ChuDePhim, Anh) VALUES " \
                         f"('{ma_phim}', '{ten_phim}', {thoi_luong}, '{ngon_ngu}', '{quoc_gia}', '{dao_dien}', '{dien_vien}', {ngay_khoi_chieu}, '{mo_ta}', {do_tuoi}, '{chu_de}', '{anh}');"
            sql_statements.append(sql_insert)
            
            # Câu lệnh INSERT Bảng Thể loại (Bảng phụ)
            sql_theloai = f"INSERT INTO THE_LOAI_PHIM (MaPhim, TheLoai) VALUES ('{ma_phim}', '{chu_de}');"
            sql_statements.append(sql_theloai)
            
            current_id += 1
            
        print(f"  ✅ Đã lấy xong dữ liệu trang {page} (+20 phim)")
        
    sql_statements.append("\nCOMMIT;\n")
    
    # ---------------------------------------------------------
    # LƯU FILE
    # ---------------------------------------------------------
    output_file = "oracle_movie_master.sql"
    with open(output_file, "w", encoding="utf-8") as f:
        f.write("\n".join(sql_statements))
        
    print("\n" + "=" * 60)
    print(f"🎉 HOÀN TẤT! Đã lưu file: {output_file}")
    print(f"   - Số phim được Update: {len(EXISTING_MOVIES)}")
    print(f"   - Số phim chèn thêm: {current_id - START_ID}")
    print("=" * 60)
    print("👉 Hãy mở file SQL trên và chạy trong Oracle SQL Developer!")

if __name__ == "__main__":
    generate_master_sql()