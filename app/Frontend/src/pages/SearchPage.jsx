import { useEffect, useState, useCallback } from 'react';
import axiosClient from '../api/axiosClient';
import { useNavigate, useSearchParams } from 'react-router-dom';

const DEFAULT_POSTER = 'https://via.placeholder.com/300x450?text=No+Poster';

/**
 * Search Results Grid Component
 */
const SearchResults = ({ movies, loading, onBooking }) => {
    if (loading) {
        return (
            <div className="min-h-[400px] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-4 border-t-[#00E5FF] border-gray-700 rounded-full animate-spin"></div>
                    <div className="text-[#00E5FF] text-sm tracking-widest uppercase font-bold animate-pulse">Đang quét dữ liệu...</div>
                </div>
            </div>
        );
    }

    if (movies.length === 0) {
        return (
            <div className="min-h-[400px] flex flex-col items-center justify-center text-gray-500">
                <span className="text-4xl mb-4">🔍</span>
                <p className="text-lg">Không tìm thấy dữ liệu phù hợp với bộ lọc</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {movies.map(movie => (
                <div
                    key={movie.MAPHIM}
                    className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:shadow-lg hover:shadow-[#00E5FF]/20 hover:border-[#00E5FF]/50 transition-all cursor-pointer group"
                    onClick={() => onBooking(movie.MAPHIM)}
                >
                    <div className="relative overflow-hidden">
                        <img
                            src={movie.ANH || DEFAULT_POSTER}
                            alt={movie.TENPHIM}
                            className="w-full h-72 object-cover group-hover:scale-110 transition-transform duration-500"
                            onError={(e) => (e.target.src = DEFAULT_POSTER)}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80"></div>
                        
                        {/* Hiển thị điểm nổi bật */}
                        {movie.DIEMTRUNGBINH && (
                            <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm border border-yellow-500/50 text-yellow-400 px-2 py-1 rounded-md text-xs font-bold flex items-center gap-1">
                                ⭐ {movie.DIEMTRUNGBINH}/10
                            </div>
                        )}
                    </div>
                    <div className="p-5 relative">
                        <h3 className="text-[#00E5FF] font-bold text-lg truncate group-hover:text-white transition-colors">{movie.TENPHIM}</h3>
                        <p className="text-gray-400 text-sm mt-1 flex justify-between">
                            <span>🎬 {movie.DAODIEN || 'Chưa cập nhật'}</span>
                            {movie.NAMPHATHANH && <span className="text-gray-500">{movie.NAMPHATHANH}</span>}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
};

const SearchPage = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    // States cho các tham số tìm kiếm đa dạng
    const [keyword, setKeyword] = useState(searchParams.get('q') || '');
    const [genre, setGenre] = useState(searchParams.get('genre') || '');
    const [minRating, setMinRating] = useState(searchParams.get('rating') || '0');
    const [specialFilter, setSpecialFilter] = useState(searchParams.get('special') || '');
    
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    /**
     * Fetch movies based on all complex conditions
     */
    const fetchMovies = useCallback(async (paramsObj) => {
        setLoading(true);
        setError(null);

        try {
            // Loại bỏ các tham số rỗng để URL/Backend gọn gàng
            const cleanParams = Object.fromEntries(
                Object.entries(paramsObj).filter(([, v]) => v != null && v !== '' && v !== '0')
            );

            const response = await axiosClient.get('/phim/search', { params: cleanParams });
            setMovies(response.data.meta || response.data.data || []);
        } catch (err) {
            setError(err.response?.data?.message || 'Hệ thống vệ tinh tìm kiếm đang gặp sự cố');
            setMovies([]);
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Load initial search from URL params
     */
    useEffect(() => {
        fetchMovies({ keyword, genre, rating: minRating, special: specialFilter });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /**
     * Handle search submit
     */
    const handleSearch = (e) => {
        e.preventDefault();
        
        const paramsToUpdate = { q: keyword };
        if (genre) paramsToUpdate.genre = genre;
        if (minRating > 0) paramsToUpdate.rating = minRating;
        if (specialFilter) paramsToUpdate.special = specialFilter;
        
        setSearchParams(paramsToUpdate);
        fetchMovies({ keyword, genre, rating: minRating, special: specialFilter });
    };

    /**
     * Reset Filters
     */
    const handleReset = () => {
        setKeyword('');
        setGenre('');
        setMinRating('0');
        setSpecialFilter('');
        setSearchParams({});
        fetchMovies({});
    };

    return (
        <div className="min-h-screen bg-[#050505] pt-24 pb-12 px-4 selection:bg-[#00E5FF]/30">
            <div className="max-w-7xl mx-auto">
                
                {/* Search Panel */}
                <div className="bg-gray-900/50 border border-gray-800 backdrop-blur-md rounded-2xl p-6 mb-12 shadow-2xl">
                    <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] to-blue-500 mb-6 uppercase tracking-tighter">
                        Kho Dữ Liệu Phim
                    </h1>

                    <form onSubmit={handleSearch}>
                        {/* Main Search Bar - (e. Query with a single condition) */}
                        <div className="flex gap-3 mb-4">
                            <input
                                type="text"
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                                placeholder="Nhập tên phim, đạo diễn..."
                                className="flex-1 px-5 py-4 rounded-xl bg-black/50 text-white border border-gray-700 focus:border-[#00E5FF] focus:ring-1 focus:ring-[#00E5FF] outline-none transition"
                            />
                            <button
                                type="submit"
                                className="px-8 py-4 bg-gradient-to-r from-[#00E5FF] to-blue-600 text-black font-black rounded-xl hover:shadow-[0_0_20px_rgba(0,229,255,0.4)] transition-all uppercase"
                            >
                                Tìm
                            </button>
                        </div>

                        {/* Toggle Advanced */}
                        <div className="flex justify-between items-center text-sm mb-2">
                            <button 
                                type="button" 
                                onClick={() => setShowAdvanced(!showAdvanced)}
                                className="text-[#00E5FF] hover:text-white flex items-center gap-1 transition"
                            >
                                {showAdvanced ? '➖ Ẩn bộ lọc nâng cao' : '➕ Hiện bộ lọc nâng cao (SQL Complex)'}
                            </button>
                            {(keyword || genre || minRating > 0 || specialFilter) && (
                                <button type="button" onClick={handleReset} className="text-gray-500 hover:text-red-400 underline transition">
                                    Xóa bộ lọc
                                </button>
                            )}
                        </div>

                        {/* Advanced Filters */}
                        <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 overflow-hidden transition-all duration-300 ${showAdvanced ? 'max-h-40 opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
                            
                            {/* Thể loại (g. Query with a JOIN) */}
                            <div>
                                <label className="block text-xs text-gray-500 uppercase font-bold mb-1">Thể loại (Yêu cầu JOIN)</label>
                                <select 
                                    value={genre} 
                                    onChange={(e) => setGenre(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg bg-black/50 text-gray-300 border border-gray-700 focus:border-[#00E5FF] outline-none"
                                >
                                    <option value="">Tất cả thể loại</option>
                                    <option value="Hành Động">Hành Động</option>
                                    <option value="Viễn Tưởng">Viễn Tưởng</option>
                                    <option value="Kinh Dị">Kinh Dị</option>
                                    <option value="Tình Cảm">Tình Cảm</option>
                                </select>
                            </div>

                            {/* Điểm tối thiểu (f. Query with composite condition: Tên = X AND Điểm >= Y) */}
                            <div>
                                <label className="block text-xs text-gray-500 uppercase font-bold mb-1">Điểm tối thiểu: {minRating > 0 ? `${minRating}/10` : 'Mọi mức điểm'}</label>
                                <input 
                                    type="range" 
                                    min="0" max="10" step="0.5"
                                    value={minRating}
                                    onChange={(e) => setMinRating(e.target.value)}
                                    className="w-full mt-2 accent-[#00E5FF]"
                                />
                            </div>

                            {/* Bộ lọc đặc biệt (h. Subquery & Aggregate) */}
                            <div>
                                <label className="block text-xs text-gray-500 uppercase font-bold mb-1">Truy vấn đặc biệt (Subquery/Avg)</label>
                                <select 
                                    value={specialFilter} 
                                    onChange={(e) => setSpecialFilter(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg bg-black/50 text-gray-300 border border-gray-700 focus:border-[#00E5FF] outline-none"
                                >
                                    <option value="">Mặc định</option>
                                    <option value="above_avg">🔥 Phim có điểm {'>'} Trung bình toàn hệ thống</option>
                                    <option value="top_sales">🎫 Phim có doanh thu cao nhất (Top 1)</option>
                                </select>
                            </div>

                        </div>
                    </form>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 bg-red-900/20 border-l-4 border-red-500 text-red-400 rounded-r-lg">
                         {error}
                    </div>
                )}

                {/* Results Count */}
                {!loading && movies.length > 0 && (
                    <p className="text-gray-500 text-sm mb-4 border-b border-gray-800 pb-2">
                        Tìm thấy <span className="text-[#00E5FF] font-bold">{movies.length}</span> kết quả
                    </p>
                )}

                {/* Results Grid */}
                <SearchResults
                    movies={movies}
                    loading={loading}
                    onBooking={(id) => navigate(`/movie/${id}`)}
                />
            </div>
        </div>
    );
};

export default SearchPage;