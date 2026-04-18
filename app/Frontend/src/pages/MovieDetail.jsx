import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';

const MovieDetail = () => {
    const { id } = useParams();
    const [movie, setMovie] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [avgRating, setAvgRating] = useState(0);
    const [totalReviews, setTotalReviews] = useState(0);

    useEffect(() => {
        // Fetch movie detail
        axiosClient.get(`/phim/${id}`).then(res => {
            setMovie(res.data.meta);
        });
        
        // Fetch reviews
        axiosClient.get(`/phim/${id}/reviews`).then(res => {
            const reviewsData = res.data.meta;
            setReviews(reviewsData.reviews || []);
            setAvgRating(reviewsData.averageRating || 0);
            setTotalReviews(reviewsData.totalReviews || 0);
        }).catch(err => console.log('Error fetching reviews:', err));
    }, [id]);

    if (!movie) return <div>Loading...</div>;

    return (
        <div className="flex flex-col md:flex-row gap-8 mt-24 px-4 container mx-auto pb-10">
            <div className="w-full md:w-1/3">
                <img 
                    src={movie.ANH && movie.ANH.startsWith('http') ? movie.ANH : "https://via.placeholder.com/300x450?text=No+Image"} 
                    className="w-full rounded-lg shadow-2xl border border-gray-800 object-cover"
                    alt={movie.TENPHIM}
                />
            </div>
            <div className="flex-1 text-gray-300">
                <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-white tracking-tight">{movie.TENPHIM}</h1>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 mb-6 text-sm md:text-base">
                    <p><strong className="text-[#00E5FF]">Đạo diễn:</strong> {movie.DAODIEN || 'Đang cập nhật'}</p>
                    <p><strong className="text-[#00E5FF]">Diễn viên:</strong> {movie.DIENVIENCHINH || 'Đang cập nhật'}</p>
                    <p><strong className="text-[#00E5FF]">Quốc gia:</strong> {movie.QUOCGIA || 'Đang cập nhật'}</p>
                    <p><strong className="text-[#00E5FF]">Khởi chiếu:</strong> {movie.NGAYKHOICHIEU ? new Date(movie.NGAYKHOICHIEU).toLocaleDateString('vi-VN') : 'N/A'}</p>
                    <p><strong className="text-[#00E5FF]">Thời lượng:</strong> {movie.THOILUONG} phút</p>
                    <p><strong className="text-[#00E5FF]">Ngôn ngữ:</strong> {movie.NGONNGU || 'Phụ đề tiếng Việt'}</p>
                    <p><strong className="text-[#00E5FF]">Độ tuổi:</strong> <span className="bg-red-600 text-white px-2 py-0.5 rounded text-xs font-bold">{movie.DOTUOI}+</span></p>
                    <p><strong className="text-[#00E5FF]">Thể loại:</strong> {movie.CHUDEPHIM || 'Chưa cập nhật'}</p>
                </div>

                <div className="mb-8">
                    <h3 className="text-xl font-bold text-white mb-2 border-l-4 border-[#00E5FF] pl-3">NỘI DUNG PHIM</h3>
                    <p className="leading-relaxed text-gray-400 text-justify">{movie.MOTANOIDUNG || movie.MOTANOINDUNG || movie.MOTA || "Chưa có mô tả cho phim này."}</p>
                </div>
                
                <Link 
                    to={`/booking/${movie.MAPHIM}`} 
                    className="inline-block bg-gradient-to-r from-[#00E5FF] to-[#00D4F7] hover:from-[#00cce6] hover:to-[#00B8D4] text-black px-10 py-4 rounded-xl font-bold text-xl transition transform hover:scale-105 shadow-[0_0_25px_rgba(0,229,255,0.6)] border-2 border-[#00E5FF]/30"
                >
                    🎟 ĐẶT VÉ NGAY
                </Link>

                <div className="mt-12">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-2xl font-bold text-white border-b border-gray-800 pb-2">⭐ Đánh giá từ khán giả</h3>
                        <div className="text-right">
                            <p className="text-3xl font-bold text-yellow-400">{avgRating}</p>
                            <p className="text-sm text-gray-400">({totalReviews} đánh giá)</p>
                        </div>
                    </div>
                    
                    {reviews && reviews.length > 0 ? (
                        <div className="space-y-4">
                            {reviews.map(dg => (
                                <div key={dg.MADANHGIA} className="bg-[#1a1a1a] p-4 rounded-xl border border-gray-800 hover:border-gray-700 transition">
                                    <div className="flex justify-between items-center mb-2">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#00E5FF] to-blue-600 flex items-center justify-center text-xs font-bold text-black">👤</div>
                                            <span className="font-bold text-gray-300">Khán giả</span>
                                        </div>
                                        <span className="text-gray-500 text-xs">{new Date(dg.NGAYDAG).toLocaleDateString('vi-VN')}</span>
                                    </div>
                                    <div className="flex items-center gap-1 mb-2">
                                        {[...Array(10)].map((_, i) => (
                                            <span key={i} className={`text-sm ${i < dg.DIEMSO ? 'text-yellow-400' : 'text-gray-700'}`}>★</span>
                                        ))}
                                        <span className="ml-2 text-yellow-400 font-bold text-sm">{dg.DIEMSO}/10</span>
                                    </div>
                                    <p className="text-gray-400 text-sm leading-relaxed">"{dg.NOIDUNG}"</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 italic text-center py-8">Chưa có đánh giá nào. Hãy là người đầu tiên đánh giá phim này!</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MovieDetail;