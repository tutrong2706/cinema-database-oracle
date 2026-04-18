#!/usr/bin/env python3
"""
Fetch real movie poster URLs from TMDB API
Generates SQL UPDATE statements for database
"""

import requests
import json
from datetime import datetime

# TMDB API Key (Free tier)
# Sign up at: https://www.themoviedb.org/settings/api
TMDB_API_KEY = "9ac53c5a728d7cb5cd56649b54c39aeb"  # Replace with your API key
TMDB_BASE_URL = "https://api.themoviedb.org/3"
POSTER_BASE_URL = "https://image.tmdb.org/t/p/w500"

# Movie list: Vietnamese + International films
movies = [
    {"ma": "PH001", "ten_en": "Avengers: Endgame", "year": 2019},
    {"ma": "PH002", "ten_en": "Nha Ba Nu", "year": 2023},  # Vietnamese
    {"ma": "PH003", "ten_en": "Fast & Furious 9", "year": 2021},
    {"ma": "PH004", "ten_en": "Detective Conan Movie 26", "year": 2023},
    {"ma": "PH005", "ten_en": "Spider-Man: No Way Home", "year": 2021},
    {"ma": "PH006", "ten_en": "Dune: Part Two", "year": 2024},
    {"ma": "PH007", "ten_en": "Lat Mat 7", "year": 2025},  # Vietnamese
    {"ma": "PH008", "ten_en": "The Conjuring: The Devil Made Me Do It", "year": 2021},
]

def get_poster_url(movie_title, year=None):
    """
    Fetch poster URL from TMDB API
    Returns: poster URL or None if not found
    """
    try:
        # Search for movie
        search_url = f"{TMDB_BASE_URL}/search/movie"
        params = {
            "api_key": TMDB_API_KEY,
            "query": movie_title,
            "year": year
        }
        
        response = requests.get(search_url, params=params, timeout=5)
        response.raise_for_status()
        
        data = response.json()
        
        if data["results"] and len(data["results"]) > 0:
            movie = data["results"][0]
            poster_path = movie.get("poster_path")
            
            if poster_path:
                full_url = f"{POSTER_BASE_URL}{poster_path}"
                return full_url
        
        return None
    
    except Exception as e:
        print(f"❌ Error fetching poster for '{movie_title}': {e}")
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
        title = movie["ten_en"]
        year = movie.get("year")
        
        print(f"  Searching: {title} ({year})...", end=" ")
        poster_url = get_poster_url(title, year)
        
        if poster_url:
            print(f"✅ Found")
            sql_updates.append({
                "ma": ma,
                "ten": title,
                "url": poster_url
            })
        else:
            print(f"❌ Not found (using placeholder)")
            sql_updates.append({
                "ma": ma,
                "ten": title,
                "url": f"https://via.placeholder.com/300x450?text={title.replace(' ', '+')}"
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
