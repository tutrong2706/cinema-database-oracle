#!/usr/bin/env python3
"""
Fetch real movie poster URLs from TMDB API
Generates SQL UPDATE statements for database
"""

import requests
import unicodedata
from datetime import datetime
from urllib.parse import quote_plus

# TMDB API Key (Free tier)
# Sign up at: https://www.themoviedb.org/settings/api
TMDB_API_KEY = "9ac53c5a728d7cb5cd56649b54c39aeb"  # Replace with your API key
TMDB_BASE_URL = "https://api.themoviedb.org/3"
POSTER_BASE_URL = "https://image.tmdb.org/t/p/w500"

# Movie list: Vietnamese + International films
# You can add new movies here. Optional keys:
# - ten_vi: Vietnamese title (used as fallback query)
# - tmdb_id: Known TMDB movie ID to bypass search
movies = [
    {"ma": "PH001", "ten_en": "Avengers: Endgame", "year": 2019},
    {"ma": "PH002", "ten_en": "Nha Ba Nu", "ten_vi": "Nhà Bà Nữ", "year": 2023},
    {"ma": "PH003", "ten_en": "Fast & Furious 9", "year": 2021},
    {"ma": "PH004", "ten_en": "Detective Conan Movie 26", "ten_vi": "Conan Movie 26", "year": 2023},
    {"ma": "PH005", "ten_en": "Spider-Man: No Way Home", "year": 2021},
    {"ma": "PH006", "ten_en": "Dune: Part Two", "year": 2024},
    {"ma": "PH007", "ten_en": "Lat Mat 7", "ten_vi": "Lật Mặt 7", "year": 2025},
    {"ma": "PH008", "ten_en": "The Conjuring: The Devil Made Me Do It", "year": 2021},
    {"ma": "PH009", "ten_en": "Camellia Sisters", "ten_vi": "Cô Gái Từ Quá Khứ", "year": 2022},
    {"ma": "PH010", "ten_en": "Furie 2", "ten_vi": "Antboy 2: Revenge of the Red Fury", "year": 2025},
    {"ma": "PH011", "ten_en": "Doraemon: Nobita's Sky Utopia", "ten_vi": "Doraemon: Nobita Và Cuộc Phiêu Lưu Vũ Trụ", "year": 2023},
    {"ma": "PH012", "ten_en": "Camellia Sisters 5", "ten_vi": "Gái Già Lắm Chiêu 5", "year": 2021, "tmdb_id": 806218},
    {"ma": "PH013", "ten_en": "The Third One", "ten_vi": "Kẻ Thứ Ba", "year": 2022, "tmdb_id": 1059722},
    {"ma": "PH014", "ten_en": "Mission: Impossible - The Final Reckoning", "ten_vi": "Mission Impossible 8", "year": 2025},
    {"ma": "PH015", "ten_en": "Ma Da", "ten_vi": "Ma Da", "year": 2024},
]

def strip_accents(text):
    """Convert accented text into ASCII-friendly form."""
    if not text:
        return text
    normalized = unicodedata.normalize("NFD", text)
    return "".join(ch for ch in normalized if unicodedata.category(ch) != "Mn")


def get_movie_from_tmdb(movie_title, year=None):
    """Search TMDB and return first matching movie object or None."""
    try:
        search_url = f"{TMDB_BASE_URL}/search/movie"
        params = {
            "api_key": TMDB_API_KEY,
            "query": movie_title,
            "language": "vi-VN"
        }
        if year:
            params["year"] = year

        response = requests.get(search_url, params=params, timeout=5)
        response.raise_for_status()
        data = response.json()
        if data.get("results"):
            return data["results"][0]

        return None
    except Exception as e:
        print(f"❌ Error searching TMDB for '{movie_title}': {e}")
        return None


def get_movie_by_tmdb_id(tmdb_id):
    """Get a movie object directly from TMDB movie ID."""
    try:
        url = f"{TMDB_BASE_URL}/movie/{tmdb_id}"
        params = {
            "api_key": TMDB_API_KEY,
            "language": "vi-VN"
        }
        response = requests.get(url, params=params, timeout=5)
        response.raise_for_status()
        return response.json()
    except Exception as e:
        print(f"❌ Error fetching TMDB ID {tmdb_id}: {e}")
        return None


def resolve_tmdb_movie(movie):
    """Resolve best TMDB movie match using ID or fallback title strategies."""
    tmdb_id = movie.get("tmdb_id")
    if tmdb_id:
        result = get_movie_by_tmdb_id(tmdb_id)
        if result:
            return result

    title_candidates = []
    ten_en = movie.get("ten_en")
    ten_vi = movie.get("ten_vi")
    year = movie.get("year")

    if ten_en:
        title_candidates.append(ten_en)
        title_candidates.append(strip_accents(ten_en))
    if ten_vi:
        title_candidates.append(ten_vi)
        title_candidates.append(strip_accents(ten_vi))

    # Remove duplicates while preserving order
    unique_titles = []
    seen = set()
    for title in title_candidates:
        if title and title not in seen:
            unique_titles.append(title)
            seen.add(title)

    for title in unique_titles:
        # First try with year for higher precision
        found = get_movie_from_tmdb(title, year)
        if found:
            return found
        # Then try without year for broader matching
        found = get_movie_from_tmdb(title, None)
        if found:
            return found

    return None


def generate_sql_updates():
    """Generate SQL UPDATE statements with real poster URLs"""
    
    print("=" * 80)
    print("🎬 TMDB Movie Poster Fetcher")
    print("=" * 80)
    print()
    
    if TMDB_API_KEY == "YOUR_TMDB_API_KEY_HERE":
        print("⚠️  SETUP REQUIRED:")
        print("   1. Visit: https://www.themoviedb.org/settings/api")
        print("   2. Copy your API Key")
        print("   3. Replace 'YOUR_TMDB_API_KEY_HERE' in this script")
        print()
        return
    
    sql_updates = []
    
    print("🔍 Fetching poster URLs...\n")
    
    for movie in movies:
        ma = movie["ma"]
        title = movie.get("ten_vi") or movie["ten_en"]
        year = movie.get("year")
        
        print(f"  Searching: {title} ({year})...", end=" ")
        tmdb_movie = resolve_tmdb_movie(movie)
        poster_url = None
        tmdb_id = None
        tmdb_title = None
        if tmdb_movie:
            tmdb_id = tmdb_movie.get("id")
            tmdb_title = tmdb_movie.get("title") or tmdb_movie.get("name")
            poster_path = tmdb_movie.get("poster_path")
            if poster_path:
                poster_url = f"{POSTER_BASE_URL}{poster_path}"
        
        if poster_url:
            print(f"✅ Found (TMDB ID: {tmdb_id})")
            sql_updates.append({
                "ma": ma,
                "ten": title,
                "tmdb_id": tmdb_id,
                "tmdb_title": tmdb_title,
                "url": poster_url
            })
        else:
            print(f"❌ Not found (using placeholder)")
            placeholder_text = quote_plus(movie.get("ten_en") or title)
            sql_updates.append({
                "ma": ma,
                "ten": title,
                "tmdb_id": None,
                "tmdb_title": None,
                "url": f"https://placehold.co/300x450/png?text={placeholder_text}"
            })
    
    print("\n" + "=" * 80)
    print("📝 SQL UPDATE Statements:")
    print("=" * 80 + "\n")
    
    # Generate SQL
    sql_file = "-- ============================================================================\n"
    sql_file += "-- UPDATE PHIM POSTER IMAGES FROM TMDB API\n"
    sql_file += f"-- Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n"
    sql_file += "-- ============================================================================\n\n"
    
    for movie in sql_updates:
        if movie["tmdb_id"]:
            sql_file += f"-- {movie['ma']} | {movie['ten']} | TMDB ID: {movie['tmdb_id']} | {movie['tmdb_title']}\n"
        else:
            sql_file += f"-- {movie['ma']} | {movie['ten']} | TMDB ID: NOT_FOUND\n"

        sql_line = f"UPDATE PHIM SET Anh = '{movie['url']}' WHERE MaPhim = '{movie['ma']}';"
        sql_file += sql_line + "\n"
        print(sql_line)
    
    sql_file += "\nCOMMIT;\n"
    sql_file += "\n-- Verify:\n"
    sql_file += "SELECT MaPhim, TenPhim, Anh FROM PHIM ORDER BY MaPhim;\n"
    
    # Save to file
    output_file = "update_phim_posters.sql"
    with open(output_file, "w", encoding="utf-8") as f:
        f.write(sql_file)
    
    print("\n" + "=" * 80)
    print(f"✅ SQL saved to: {output_file}")
    print("=" * 80)
    print("\nNext steps:")
    print("  1. Copy the SQL above")
    print("  2. Run in Oracle SQL*Plus:")
    print("     sqlplus dev/dev123@XEPDB1 @update_phim_posters.sql")
    print()


if __name__ == "__main__":
    generate_sql_updates()
