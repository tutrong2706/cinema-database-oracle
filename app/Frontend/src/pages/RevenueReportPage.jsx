import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axiosClient from '../api/axiosClient';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, BarChart, Bar
} from 'recharts';

const Card = ({ children, className = "" }) => (
    <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className={`bg-gray-900/40 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl ${className}`}
    >
        {children}
    </motion.div>
);

const NeonTitle = ({ children, className = "" }) => (
    <h2 className={`text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 font-black tracking-tighter ${className}`}>
        {children}
    </h2>
);

const RevenueReportPage = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    // States Dữ liệu
    const [viewMode, setViewMode] = useState('movie'); // 'movie' or 'combo'
    const [comboViewType, setComboViewType] = useState('item'); // 'item' or 'movie'
    const [movieData, setMovieData] = useState([]);
    const [comboItemData, setComboItemData] = useState([]);
    const [comboMovieData, setComboMovieData] = useState([]);
    const [loading, setLoading] = useState(true);

    // States cho Filter (Bộ lọc)
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('DOANHTHU'); // DOANHTHU, SOLUONG, TEN
    const [sortOrder, setSortOrder] = useState('desc'); // desc (Giảm dần), asc (Tăng dần)
    const [minRevenue, setMinRevenue] = useState(0);
    const [maxRevenue, setMaxRevenue] = useState(2000000000); // Mặc định Max 2 Tỷ

    useEffect(() => {
        if (user.vaiTro !== 'Admin') navigate('/');
    }, [user.vaiTro, navigate]);

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                setLoading(true);
                const [movieRes, comboItemRes, comboMovieRes] = await Promise.all([
                    axiosClient.get(`/admin/revenue/movie`).catch(() => ({ data: { meta: [] } })),
                    axiosClient.get(`/admin/revenue/combo`).catch(() => ({ data: { meta: [] } })),
                    axiosClient.get(`/admin/revenue/combo-by-movie`).catch(() => ({ data: { meta: [] } }))
                ]);
                
                const movieRaw = movieRes.data.meta || [];
                const comboItemRaw = comboItemRes.data.meta || [];
                const comboMovieRaw = comboMovieRes.data.meta || [];

                // CHUẨN HÓA DỮ LIỆU
                setMovieData(movieRaw.map(item => ({
                    TEN: item.TENPHIM,
                    SOLUONG: item.SOVE || item.SOVEDABAN || 0,
                    DOANHTHU: item.DOANHTHU || item.TONGDOANHTHU || 0
                })));

                setComboItemData(comboItemRaw.map(item => ({
                    TEN: item.TENHANG,
                    SOLUONG: item.TONG_SOLUONG || 0,
                    DOANHTHU: item.TONG_DOANHTHU || 0
                })));

                setComboMovieData(comboMovieRaw.map(item => ({
                    TEN: item.TENPHIM,
                    SOLUONG: item.TONG_COMBO || 0,
                    DOANHTHU: item.TONG_DOANHTHU || 0
                })));

            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        if (user.vaiTro === 'Admin') fetchAllData();
    }, [user.vaiTro]);

    // Chọn Data theo Tab hiện tại
    const activeData = viewMode === 'movie' 
        ? movieData 
        : (comboViewType === 'item' ? comboItemData : comboMovieData);

    // BỘ MÁY LỌC VÀ SẮP XẾP DATA (Chạy theo thời gian thực)
    const processedData = useMemo(() => {
        let result = [...activeData];

        // 1. Lọc theo từ khóa (Tên)
        if (searchTerm) {
            result = result.filter(item => 
                item.TEN.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // 2. Lọc theo khoảng Doanh Thu
        result = result.filter(item => 
            item.DOANHTHU >= minRevenue && item.DOANHTHU <= maxRevenue
        );

        // 3. Sắp xếp
        result.sort((a, b) => {
            let valA = a[sortBy];
            let valB = b[sortBy];

            if (typeof valA === 'string') {
                return sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
            } else {
                return sortOrder === 'asc' ? valA - valB : valB - valA;
            }
        });

        return result;
    }, [activeData, searchTerm, sortBy, sortOrder, minRevenue, maxRevenue]);

    // Tính tổng dựa trên Data đã được lọc
    const totals = {
        revenue: processedData.reduce((sum, i) => sum + i.DOANHTHU, 0),
        quantity: processedData.reduce((sum, i) => sum + i.SOLUONG, 0),
    };

    if (loading) return (
        <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center">
            <div className="w-16 h-16 border-4 border-t-cyan-500 rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#050505] text-gray-200 pt-28 px-4 md:px-10 pb-20">
            <div className="max-w-7xl mx-auto relative z-10">
                {/* Header & Toggle */}
                <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <span className="text-cyan-500 font-mono text-sm tracking-widest uppercase">Admin Intelligence System v2.0</span>
                        <h1 className="text-5xl md:text-7xl font-black mt-2 tracking-tighter italic">
                            REVENUE <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">REPORT</span>
                        </h1>
                    </div>
                    
                    {/* View Mode Toggle */}
                    <div className="flex bg-gray-900 border border-gray-800 rounded-xl p-1 shadow-lg">
                        <button 
                            onClick={() => setViewMode('movie')}
                            className={`px-6 py-3 rounded-lg font-bold transition-all ${viewMode === 'movie' ? 'bg-cyan-500 text-cyan-400 shadow-[0_0_15px_rgba(0,229,255,0.4)]' : 'text-gray-400 hover:text-white'}`}
                        >
                            🎬 DOANH THU VÉ
                        </button>
                        <button 
                            onClick={() => setViewMode('combo')}
                            className={`px-6 py-3 rounded-lg font-bold transition-all ${viewMode === 'combo' ? 'bg-amber-500 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.4)]' : 'text-gray-400 hover:text-white'}`}
                        >
                            🍿 DOANH THU F&B
                        </button>
                    </div>
                </header>

                {/* Sub-Toggle for F&B */}
                {viewMode === 'combo' && (
                    <div className="flex gap-4 mb-6">
                        <button onClick={() => setComboViewType('item')} className={`px-4 py-2 rounded-full text-sm font-bold border ${comboViewType === 'item' ? 'bg-amber-500/20 text-amber-400 border-amber-500' : 'border-gray-700 text-gray-500 hover:text-white'}`}>
                            Theo Từng Món
                        </button>
                        <button onClick={() => setComboViewType('movie')} className={`px-4 py-2 rounded-full text-sm font-bold border ${comboViewType === 'movie' ? 'bg-amber-500/20 text-amber-400 border-amber-500' : 'border-gray-700 text-gray-500 hover:text-white'}`}>
                            Theo Phim Khách Xem
                        </button>
                    </div>
                )}

                {/* BẢNG ĐIỀU KHIỂN (FILTER PANEL) */}
                <Card className="p-6 mb-8 border-t-2 border-t-cyan-500/50">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="h-2 w-2 bg-cyan-400 animate-pulse rounded-full"></div>
                        <h3 className="text-sm font-bold text-gray-300 uppercase tracking-widest">Bảng Điều Khiển Báo Cáo</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                        {/* Tìm kiếm */}
                        <div className="lg:col-span-2">
                            <label className="block text-[10px] text-cyan-500 font-bold mb-2 uppercase">Tìm kiếm tên</label>
                            <input 
                                type="text" 
                                placeholder="Nhập tên để lọc nhanh..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-black/50 text-white border border-white/10 rounded-xl p-3 focus:border-cyan-500 outline-none transition"
                            />
                        </div>

                        {/* Tiêu chí sắp xếp */}
                        <div>
                            <label className="block text-[10px] text-cyan-500 font-bold mb-2 uppercase">Sắp xếp theo</label>
                            <select 
                                value={sortBy} onChange={(e) => setSortBy(e.target.value)}
                                className="w-full bg-black/50 text-white border border-white/10 rounded-xl p-3 focus:border-cyan-500 outline-none cursor-pointer appearance-none"
                            >
                                <option value="DOANHTHU">💰 Doanh Thu</option>
                                <option value="SOLUONG">🎫 Số Lượng Bán</option>
                                <option value="TEN">🔤 Bảng Chữ Cái</option>
                            </select>
                        </div>

                        {/* Chiều sắp xếp */}
                        <div>
                            <label className="block text-[10px] text-cyan-500 font-bold mb-2 uppercase">Thứ tự</label>
                            <select 
                                value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}
                                className="w-full bg-black/50 text-white border border-white/10 rounded-xl p-3 focus:border-cyan-500 outline-none cursor-pointer appearance-none"
                            >
                                <option value="desc">📉 Giảm Dần</option>
                                <option value="asc">📈 Tăng Dần</option>
                            </select>
                        </div>

                        {/* Lọc doanh thu tối thiểu */}
                        <div>
                            <label className="block text-[10px] text-cyan-500 font-bold mb-2 uppercase">Min Doanh Thu (VNĐ)</label>
                            <input 
                                type="number" 
                                value={minRevenue}
                                onChange={(e) => setMinRevenue(Number(e.target.value))}
                                className="w-full bg-black/50 text-white border border-white/10 rounded-xl p-3 focus:border-cyan-500 outline-none transition"
                            />
                        </div>
                    </div>
                </Card>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <Card className={`p-8 bg-gradient-to-br ${viewMode === 'movie' ? 'from-cyan-900/50 to-blue-900/50 border-cyan-500/30' : 'from-amber-900/50 to-orange-900/50 border-amber-500/30'}`}>
                        <p className="text-gray-400 text-sm font-bold tracking-widest mb-2">TỔNG DOANH THU (SAU LỌC)</p>
                        <p className="text-5xl font-black text-white">{(totals.revenue / 1000000).toLocaleString()} <span className="text-2xl text-gray-500">Tr VNĐ</span></p>
                    </Card>
                    <Card className="p-8">
                        <p className="text-gray-400 text-sm font-bold tracking-widest mb-2">{viewMode === 'movie' ? 'TỔNG VÉ ĐÃ BÁN (SAU LỌC)' : 'TỔNG SẢN PHẨM (SAU LỌC)'}</p>
                        <p className="text-5xl font-black text-white">{totals.quantity.toLocaleString()} <span className="text-2xl text-gray-500">{viewMode === 'movie' ? 'Vé' : 'Phần'}</span></p>
                    </Card>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                    <Card className="lg:col-span-2 p-6">
                        <NeonTitle className="text-xl mb-6">BIỂU ĐỒ TĂNG TRƯỞNG</NeonTitle>
                        <div className="h-[300px]">
                            {processedData.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={processedData.slice(0, 15)}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                                        <XAxis dataKey="TEN" stroke="#666" tick={{fontSize: 10}} width={100} truncateByClipping={true} />
                                        <YAxis stroke="#444" fontSize={12} tickFormatter={(v) => `${v/1000000}M`} />
                                        <Tooltip contentStyle={{backgroundColor: '#0a0a0a', borderColor: '#333'}} />
                                        <Bar dataKey="DOANHTHU" fill={viewMode === 'movie' ? "#06b6d4" : "#f59e0b"} radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="flex h-full items-center justify-center text-gray-600">Không có dữ liệu phù hợp với bộ lọc</div>
                            )}
                        </div>
                    </Card>

                    <Card className="p-6">
                        <NeonTitle className="text-xl mb-6">TỶ TRỌNG TOP 5</NeonTitle>
                        <div className="h-[300px]">
                            {processedData.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={processedData.slice(0, 5)} innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="DOANHTHU">
                                            {processedData.slice(0, 5).map((_, i) => <Cell key={i} fill={viewMode === 'movie' ? ['#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899', '#10b981'][i%5] : ['#f59e0b', '#d97706', '#b45309', '#fcd34d', '#78350f'][i%5]} />)}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="flex h-full items-center justify-center text-gray-600">Không có dữ liệu</div>
                            )}
                        </div>
                    </Card>
                </div>

                {/* Table */}
                <Card className="overflow-hidden">
                    <div className="p-6 border-b border-white/5 flex justify-between items-center">
                        <NeonTitle className="text-xl">BẢNG CHI TIẾT ({processedData.length} KẾT QUẢ)</NeonTitle>
                    </div>
                    <div className="overflow-x-auto max-h-[500px] overflow-y-auto custom-scrollbar">
                        <table className="w-full text-left">
                            <thead className="bg-black/40 text-xs uppercase tracking-widest text-gray-500 sticky top-0 backdrop-blur-md">
                                <tr>
                                    <th className="px-6 py-4">{viewMode === 'movie' ? 'Tên Phim' : (comboViewType === 'item' ? 'Tên Mặt Hàng' : 'Tên Phim')}</th>
                                    <th className="px-6 py-4 text-right">Số Lượng</th>
                                    <th className="px-6 py-4 text-right">Doanh Thu (VNĐ)</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {processedData.length > 0 ? (
                                    processedData.map((item, idx) => (
                                        <tr key={idx} className="hover:bg-white/5 transition">
                                            <td className="px-6 py-4 font-bold text-white">
                                                {item.TEN}
                                            </td>
                                            <td className="px-6 py-4 text-right text-gray-400 font-mono">
                                                {item.SOLUONG.toLocaleString()}
                                            </td>
                                            <td className={`px-6 py-4 text-right font-bold font-mono ${viewMode === 'movie' ? 'text-cyan-400' : 'text-amber-400'}`}>
                                                {item.DOANHTHU.toLocaleString()} đ
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="3" className="px-6 py-8 text-center text-gray-500">
                                            Không tìm thấy dữ liệu nào thỏa mãn điều kiện lọc.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default RevenueReportPage;