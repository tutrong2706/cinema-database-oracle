import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    LineChart,
    Line
} from 'recharts';

const RevenueReportPage = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Filter & Sort states
    const [sortBy, setSortBy] = useState('revenue');  // 'revenue', 'tickets', 'name'
    const [sortOrder, setSortOrder] = useState('desc');  // 'asc', 'desc'
    const [filterMinRevenue, setFilterMinRevenue] = useState(0);
    const [filterMaxRevenue, setFilterMaxRevenue] = useState(999999999);

    // Kiểm tra quyền Admin
    useEffect(() => {
        if (user.vaiTro !== 'Admin') {  // ✅ FIXED: Changed from role to vaiTro
            alert("Bạn không có quyền truy cập báo cáo doanh thu!");
            navigate('/');
        }
    }, [user.vaiTro, navigate]);

    // Fetch báo cáo doanh thu
    useEffect(() => {
        const fetchRevenueReport = async () => {
            try {
                setLoading(true);
                // ✅ FIXED: Using correct endpoint
                const response = await axiosClient.get('/admin/revenue');
                setData(response.data.meta || []);
                setError(null);
            } catch (err) {
                setError("Lỗi khi tải báo cáo doanh thu: " + (err.response?.data?.message || err.message));
                setData([]);
            } finally {
                setLoading(false);
            }
        };

        if (user.vaiTro === 'Admin') {  // ✅ FIXED: Changed from role to vaiTro
            fetchRevenueReport();
        }
    }, [user.vaiTro]);

    // ✅ ADDED: Filter and Sort function
    const getFilteredAndSortedData = () => {
        let filtered = data.filter(item => {
            const revenue = item.TongDoanhThu || 0;
            return revenue >= filterMinRevenue && revenue <= filterMaxRevenue;
        });

        // Sort
        const sorted = [...filtered].sort((a, b) => {
            let aVal, bVal;
            
            if (sortBy === 'revenue') {
                aVal = a.TongDoanhThu || 0;
                bVal = b.TongDoanhThu || 0;
            } else if (sortBy === 'tickets') {
                aVal = a.SoVeDaBan || 0;
                bVal = b.SoVeDaBan || 0;
            } else if (sortBy === 'name') {
                aVal = (a.TenPhim || '').toLowerCase();
                bVal = (b.TenPhim || '').toLowerCase();
                return sortOrder === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
            }
            
            if (sortOrder === 'asc') {
                return aVal - bVal;
            } else {
                return bVal - aVal;
            }
        });

        return sorted;
    };

    const processedData = getFilteredAndSortedData();

    // Tính toán thống kê (từ dữ liệu đã filter)
    const totalRevenue = processedData.reduce((sum, item) => sum + (item.TongDoanhThu || 0), 0);
    const totalTickets = processedData.reduce((sum, item) => sum + (item.SoVeDaBan || 0), 0);
    const avgRevenue = processedData.length > 0 ? Math.round(totalRevenue / processedData.length) : 0;

    // Màu sắc cho biểu đồ
    const COLORS = ['#00E5FF', '#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3', '#F38181', '#AA96DA', '#FCBAD3'];

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-950 pt-24 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#00E5FF]"></div>
                    <p className="mt-4 text-gray-400">Đang tải báo cáo...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-950 pt-24 px-6 pb-10">
            <div className="container mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-extrabold text-white border-l-4 border-[#00E5FF] pl-4 mb-2">
                         BÁO CÁO DOANH THU PHIM
                    </h1>
                    <p className="text-gray-400 text-sm ml-4">
                    </p>
                </div>

                {/* Filter & Sort Controls */}
                <div className="bg-[#1a1a1a] rounded-xl p-6 border border-gray-800 shadow-lg mb-8">
                    <h3 className="text-lg font-bold text-white mb-4">🔍 Bộ Lọc & Sắp Xếp</h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {/* Sort By */}
                        <div>
                            <label className="block text-xs text-gray-400 uppercase mb-2 font-semibold">Sắp Xếp Theo</label>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="w-full p-2 bg-gray-800 text-white border border-gray-700 rounded-lg focus:border-[#00E5FF] outline-none transition"
                            >
                                <option value="revenue">💰 Doanh Thu</option>
                                <option value="tickets">🎫 Số Vé</option>
                                <option value="name">🎬 Tên Phim</option>
                            </select>
                        </div>

                        {/* Sort Order */}
                        <div>
                            <label className="block text-xs text-gray-400 uppercase mb-2 font-semibold">Thứ Tự</label>
                            <select
                                value={sortOrder}
                                onChange={(e) => setSortOrder(e.target.value)}
                                className="w-full p-2 bg-gray-800 text-white border border-gray-700 rounded-lg focus:border-[#00E5FF] outline-none transition"
                            >
                                <option value="desc">📉 Giảm Dần (Cao → Thấp)</option>
                                <option value="asc">📈 Tăng Dần (Thấp → Cao)</option>
                            </select>
                        </div>

                        {/* Min Revenue */}
                        <div>
                            <label className="block text-xs text-gray-400 uppercase mb-2 font-semibold">Doanh Thu Min (Triệu)</label>
                            <input
                                type="number"
                                value={filterMinRevenue / 1000000}
                                onChange={(e) => setFilterMinRevenue(parseInt(e.target.value) * 1000000 || 0)}
                                className="w-full p-2 bg-gray-800 text-white border border-gray-700 rounded-lg focus:border-[#00E5FF] outline-none transition"
                                placeholder="0"
                            />
                        </div>

                        {/* Max Revenue */}
                        <div>
                            <label className="block text-xs text-gray-400 uppercase mb-2 font-semibold">Doanh Thu Max (Triệu)</label>
                            <input
                                type="number"
                                value={filterMaxRevenue / 1000000}
                                onChange={(e) => setFilterMaxRevenue(parseInt(e.target.value) * 1000000 || 999999999)}
                                className="w-full p-2 bg-gray-800 text-white border border-gray-700 rounded-lg focus:border-[#00E5FF] outline-none transition"
                                placeholder="999999"
                            />
                        </div>
                    </div>
                    
                    {/* Filter Info */}
                    <div className="mt-4 p-3 bg-gray-900/50 rounded-lg border border-gray-700">
                        <p className="text-sm text-gray-300">
                            📊 Hiển thị <span className="font-bold text-[#00E5FF]">{processedData.length}</span> trên <span className="font-bold">{data.length}</span> phim
                            {filterMinRevenue > 0 || filterMaxRevenue < 999999999 ? 
                                ` (Lọc: ${(filterMinRevenue/1000000).toFixed(0)} - ${(filterMaxRevenue/1000000).toFixed(0)} triệu)` 
                                : ''
                            }
                        </p>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-900/20 border border-red-600 text-red-400 px-4 py-3 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                {/* Thống kê tổng quát */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-gradient-to-br from-[#00E5FF] to-cyan-500 rounded-lg p-6 shadow-lg">
                        <p className="text-gray-900 text-sm font-semibold">TỔNG DOANH THU</p>
                        <p className="text-2xl font-extrabold text-gray-900 mt-2">
                            {(totalRevenue / 1000000).toLocaleString('vi-VN', { maximumFractionDigits: 1 })} Tr
                        </p>
                        <p className="text-xs text-gray-700 mt-1">Tất cả phim</p>
                    </div>

                    <div className="bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg p-6 shadow-lg">
                        <p className="text-gray-900 text-sm font-semibold">TỔNG VÉ ĐÃ BÁN</p>
                        <p className="text-2xl font-extrabold text-gray-900 mt-2">
                            {totalTickets.toLocaleString('vi-VN')} Vé
                        </p>
                        <p className="text-xs text-gray-700 mt-1">Đã thanh toán</p>
                    </div>

                    <div className="bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg p-6 shadow-lg">
                        <p className="text-gray-900 text-sm font-semibold">DOANH THU TB/PHIM</p>
                        <p className="text-2xl font-extrabold text-gray-900 mt-2">
                            {(avgRevenue / 1000000).toLocaleString('vi-VN', { maximumFractionDigits: 1 })} Tr
                        </p>
                        <p className="text-xs text-gray-700 mt-1">Trung bình cộng</p>
                    </div>
                </div>

                {/* Biểu đồ Cột - Doanh thu theo phim */}
                <div className="bg-[#1a1a1a] rounded-xl p-6 border border-gray-800 shadow-lg mb-8">
                    <h2 className="text-xl font-bold text-white mb-4">💰 Doanh Thu Theo Phim</h2>
                    {processedData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={400}>
                            <BarChart data={processedData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                                <XAxis 
                                    dataKey="TenPhim" 
                                    angle={-45} 
                                    textAnchor="end" 
                                    height={100}
                                    tick={{ fill: '#999', fontSize: 12, fontFamily: 'Tahoma, Arial, sans-serif' }}
                                />
                                <YAxis tick={{ fill: '#999' }} />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#2a2a2a', border: '1px solid #00E5FF', borderRadius: '8px' }}
                                    formatter={(value) => [(value / 1000000).toLocaleString('vi-VN', { maximumFractionDigits: 1 }) + ' Tr', 'Doanh thu']}
                                    labelStyle={{ color: '#00E5FF' }}
                                />
                                <Legend />
                                <Bar dataKey="TongDoanhThu" fill="#00E5FF" name="Doanh Thu" />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <p className="text-gray-400 text-center py-10">Không có dữ liệu</p>
                    )}
                </div>

                {/* Biểu đồ Hình Tròn - Tỷ lệ doanh thu */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    <div className="bg-[#1a1a1a] rounded-xl p-6 border border-gray-800 shadow-lg">
                        <h2 className="text-xl font-bold text-white mb-4">🥧 Tỷ Lệ Doanh Thu Các Phim</h2>
                        {processedData.length > 0 ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={processedData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ TenPhim, percent }) => `${TenPhim}: ${(percent * 100).toFixed(0)}%`}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="TongDoanhThu"
                                        style={{ fontFamily: 'Tahoma, Arial, sans-serif', fontSize: '12px' }}
                                    >
                                        {processedData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip 
                                        contentStyle={{ 
                                            backgroundColor: '#2a2a2a', 
                                            border: '1px solid #00E5FF', 
                                            borderRadius: '8px',
                                            fontFamily: 'Tahoma, Arial, sans-serif',
                                            fontSize: '14px'
                                        }}
                                        formatter={(value) => [(value / 1000000).toLocaleString('vi-VN', { maximumFractionDigits: 1 }) + ' Tr']}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <p className="text-gray-400 text-center py-10">Không có dữ liệu</p>
                        )}
                    </div>

                    {/* Biểu đồ Cột - Số vé bán */}
                    <div className="bg-[#1a1a1a] rounded-xl p-6 border border-gray-800 shadow-lg">
                        <h2 className="text-xl font-bold text-white mb-4">🎫 Số Vé Đã Bán Theo Phim</h2>
                        {processedData.length > 0 ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={processedData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                                    <XAxis 
                                        dataKey="TenPhim" 
                                        angle={-45} 
                                        textAnchor="end" 
                                        height={80}
                                        tick={{ fill: '#999', fontSize: 11 }}
                                    />
                                    <YAxis tick={{ fill: '#999' }} />
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: '#2a2a2a', border: '1px solid #FFE66D', borderRadius: '8px' }}
                                        formatter={(value) => [value, 'Số vé']}
                                    />
                                    <Bar dataKey="SoVeDaBan" fill="#FFE66D" name="Số Vé" />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <p className="text-gray-400 text-center py-10">Không có dữ liệu</p>
                        )}
                    </div>
                </div>

                {/* Bảng chi tiết */}
                <div className="bg-[#1a1a1a] rounded-xl overflow-hidden border border-gray-800 shadow-lg">
                    <h2 className="text-xl font-bold text-white p-6 border-b border-gray-800">📋 Chi Tiết Báo Cáo</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-900">
                                    <th className="px-6 py-4 text-xs text-gray-400 font-semibold uppercase">Mã Phim</th>
                                    <th className="px-6 py-4 text-xs text-gray-400 font-semibold uppercase">Tên Phim</th>
                                    <th className="px-6 py-4 text-xs text-gray-400 font-semibold uppercase text-right">Số Vé Bán</th>
                                    <th className="px-6 py-4 text-xs text-gray-400 font-semibold uppercase text-right">Doanh Thu</th>
                                    <th className="px-6 py-4 text-xs text-gray-400 font-semibold uppercase text-right">Giá Bình Quân</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800">
                                {processedData && processedData.map((item, idx) => {
                                    const soVe = item?.SoVeDaBan ?? 0;
                                    const doanhThu = item?.TongDoanhThu ?? 0;
                                    const avgPrice = soVe > 0 ? Math.round(doanhThu / soVe) : 0;
                                    return (
                                        <tr key={idx} className="hover:bg-gray-800/50 transition">
                                            <td className="px-6 py-4 text-gray-400 font-mono text-sm">{item?.MaPhim || 'N/A'}</td>
                                            <td className="px-6 py-4 font-bold text-white">{item?.TenPhim || 'N/A'}</td>
                                            <td className="px-6 py-4 text-right text-amber-400 font-semibold">
                                                {soVe.toLocaleString('vi-VN')}
                                            </td>
                                            <td className="px-6 py-4 text-right text-[#00E5FF] font-bold">
                                                {(doanhThu / 1000000).toLocaleString('vi-VN', { maximumFractionDigits: 1 })} Tr
                                            </td>
                                            <td className="px-6 py-4 text-right text-purple-400 font-semibold">
                                                {(avgPrice / 1000).toLocaleString('vi-VN', { maximumFractionDigits: 0 })} K
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RevenueReportPage;
