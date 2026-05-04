import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axiosClient from '../api/axiosClient';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';

// --- Styled Components con ---

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

/**
 * Filter Panel Component - Hiện đại hơn với hiệu ứng Glass
 */
const FilterPanel = ({ sortBy, setSortBy, sortOrder, setSortOrder, filterMinRevenue, setFilterMinRevenue, filterMaxRevenue, setFilterMaxRevenue, dataCount, totalCount }) => {
    return (
        <Card className="p-6 mb-8 border-t-cyan-500/50 border-t-2">
            <div className="flex items-center gap-2 mb-6">
                <div className="h-2 w-2 bg-cyan-400 animate-pulse rounded-full"></div>
                <h3 className="text-sm font-bold text-gray-300 uppercase tracking-widest">Bảng Điều Khiển</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: "Sắp Xếp", value: sortBy, setter: setSortBy, type: "select", options: [{v: "revenue", l: "💰 Doanh Thu"}, {v: "tickets", l: "🎫 Số Vé"}, {v: "name", l: "🎬 Tên Phim"}] },
                    { label: "Thứ Tự", value: sortOrder, setter: setSortOrder, type: "select", options: [{v: "desc", l: "📉 Giảm Dần"}, {v: "asc", l: "📈 Tăng Dần"}] },
                    { label: "Min (Triệu VNĐ)", value: filterMinRevenue, setter: setFilterMinRevenue, type: "number" },
                    { label: "Max (Triệu VNĐ)", value: filterMaxRevenue, setter: setFilterMaxRevenue, type: "number" },
                ].map((input, idx) => (
                    <div key={idx}>
                        <label className="block text-[10px] text-cyan-500 font-bold mb-2 uppercase">{input.label}</label>
                        {input.type === "select" ? (
                            <select
                                value={input.value}
                                onChange={(e) => input.setter(e.target.value)}
                                className="w-full bg-black/50 text-white border border-white/10 rounded-xl p-3 focus:ring-2 ring-cyan-500 outline-none transition-all cursor-pointer hover:bg-gray-800"
                            >
                                {input.options.map(opt => <option key={opt.v} value={opt.v}>{opt.l}</option>)}
                            </select>
                        ) : (
                            <input
                                type="number"
                                value={input.value / 1000000}
                                onChange={(e) => input.setter(parseInt(e.target.value) * 1000000 || 0)}
                                className="w-full bg-black/50 text-white border border-white/10 rounded-xl p-3 focus:ring-2 ring-cyan-500 outline-none transition-all"
                            />
                        )}
                    </div>
                ))}
            </div>
            <div className="mt-6 text-xs text-gray-500 flex justify-between items-center border-t border-white/5 pt-4">
                <span>Đang lọc: <b className="text-cyan-400">{dataCount}</b> / {totalCount} phim</span>
                <span className="italic">Cập nhật thời gian thực</span>
            </div>
        </Card>
    );
};

/**
 * Stats Cards - Hiệu ứng Glow rực rỡ
 */
const StatsCards = ({ totalRevenue, totalTickets, avgRevenue }) => {
    const stats = [
        { label: "TỔNG DOANH THU", value: totalRevenue, unit: "Tr", color: "from-cyan-500 to-blue-600", shadow: "shadow-cyan-500/20" },
        { label: "VÉ ĐÃ BÁN", value: totalTickets, unit: "Vé", color: "from-amber-400 to-orange-600", shadow: "shadow-amber-500/20" },
        { label: "TRUNG BÌNH/PHIM", value: avgRevenue, unit: "Tr", color: "from-purple-500 to-pink-600", shadow: "shadow-purple-500/20" },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {stats.map((s, i) => (
                <motion.div
                    key={i}
                    whileHover={{ scale: 1.03, y: -5 }}
                    className={`p-6 rounded-2xl bg-gradient-to-br ${s.color} ${s.shadow} shadow-2xl relative overflow-hidden group`}
                >
                    <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-150 transition-transform duration-500">
                        <svg width="120" height="120" fill="white" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
                    </div>
                    <p className="text-white/80 text-xs font-bold tracking-widest">{s.label}</p>
                    <div className="flex items-baseline gap-2 mt-2">
                        <span className="text-3xl font-black text-white">
                            {s.unit === "Tr" ? (s.value / 1000000).toLocaleString('vi-VN', { maximumFractionDigits: 1 }) : s.value.toLocaleString('vi-VN')}
                        </span>
                        <span className="text-white/70 font-bold">{s.unit}</span>
                    </div>
                </motion.div>
            ))}
        </div>
    );
};

/**
 * Main Page Component
 */
const RevenueReportPage = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [sortBy, setSortBy] = useState('revenue');
    const [sortOrder, setSortOrder] = useState('desc');
    const [filterMinRevenue, setFilterMinRevenue] = useState(0);
    const [filterMaxRevenue, setFilterMaxRevenue] = useState(2000000000);

    useEffect(() => {
        if (user.vaiTro !== 'Admin') {
            navigate('/');
        }
    }, [user.vaiTro, navigate]);

    useEffect(() => {
        const fetchRevenueReport = async () => {
            try {
                setLoading(true);
                const response = await axiosClient.get(`/admin/revenue/movie`);
                const revenueData = response.data.meta || response.data.data || [];
                setData(revenueData.map(item => ({
                    ...item,
                    TONGDOANHTHU: item.TONGDOANHTHU ?? item.DOANHTHU,
                    SOVEDABAN: item.SOVEDABAN ?? item.SOVE
                })));
            } catch (err) {
                setError("Hệ thống đang bận, vui lòng thử lại sau.");
            } finally {
                setLoading(false);
            }
        };
        if (user.vaiTro === 'Admin') fetchRevenueReport();
    }, [user.vaiTro]);
    const getProcessedData = useCallback(() => {
        return [...data]
            .filter(item => (item.TONGDOANHTHU || 0) >= filterMinRevenue && (item.TONGDOANHTHU || 0) <= filterMaxRevenue)
            .sort((a, b) => {
                let aVal = sortBy === 'revenue' ? a.TONGDOANHTHU : sortBy === 'tickets' ? a.SOVEDABAN : a.TENPHIM;
                let bVal = sortBy === 'revenue' ? b.TONGDOANHTHU : sortBy === 'tickets' ? b.SOVEDABAN : b.TENPHIM;
                if (typeof aVal === 'string') return sortOrder === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
                return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
            });
    }, [data, sortBy, sortOrder, filterMinRevenue, filterMaxRevenue]);

    const processedData = getProcessedData();
    const totals = {
        revenue: processedData.reduce((sum, i) => sum + (i.TONGDOANHTHU || 0), 0),
        tickets: processedData.reduce((sum, i) => sum + (i.SOVEDABAN || 0), 0),
        avg: processedData.length > 0 ? Math.round(processedData.reduce((sum, i) => sum + (i.TONGDOANHTHU || 0), 0) / processedData.length) : 0
    };

    if (loading) return (
        <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center">
            <div className="relative w-24 h-24">
                <div className="absolute inset-0 border-4 border-cyan-500/20 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-t-cyan-500 rounded-full animate-spin"></div>
            </div>
            <p className="mt-6 text-cyan-500 font-mono tracking-tighter animate-pulse text-xl">INITIALIZING DATA...</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#050505] text-gray-200 pt-28 px-4 md:px-10 pb-20 selection:bg-cyan-500/30">
            {/* Background Decorative Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-900/20 blur-[120px] rounded-full"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-900/10 blur-[120px] rounded-full"></div>
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Header Section */}
                <header className="mb-12">
                    <motion.div initial={{ x: -50 }} animate={{ x: 0 }}>
                        <span className="text-cyan-500 font-mono text-sm tracking-widest uppercase">Admin Intelligence System v2.0</span>
                        <h1 className="text-5xl md:text-7xl font-black mt-2 tracking-tighter italic">
                            REVENUE <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">REPORT</span>
                        </h1>
                        <div className="h-1 w-32 bg-cyan-500 mt-4"></div>
                    </motion.div>
                </header>

                <StatsCards totalRevenue={totals.revenue} totalTickets={totals.tickets} avgRevenue={totals.avg} />
                
                <FilterPanel 
                    {...{sortBy, setSortBy, sortOrder, setSortOrder, filterMinRevenue, setFilterMinRevenue, filterMaxRevenue, setFilterMaxRevenue}}
                    dataCount={processedData.length} totalCount={data.length}
                />

                {/* Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                    <Card className="lg:col-span-2 p-6">
                        <NeonTitle className="text-xl mb-6">DOANH THU CHI TIẾT</NeonTitle>
                        <div className="h-[400px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={processedData}>
                                    <defs>
                                        <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                                    <XAxis dataKey="TENPHIM" hide />
                                    <YAxis stroke="#444" fontSize={12} tickFormatter={(v) => `${v/1000000}M`} />
                                    <Tooltip 
                                        contentStyle={{backgroundColor: '#0a0a0a', border: '1px solid #222', borderRadius: '12px'}}
                                        itemStyle={{color: '#00E5FF'}}
                                    />
                                    <Area type="monotone" dataKey="TONGDOANHTHU" stroke="#06b6d4" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>

                    <Card className="p-6">
                        <NeonTitle className="text-xl mb-6">TỶ TRỌNG</NeonTitle>
                        <div className="h-[400px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={processedData} innerRadius={80} outerRadius={110} paddingAngle={5} dataKey="TONGDOANHTHU">
                                        {processedData.map((_, i) => <Cell key={i} fill={['#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b'][i % 5]} stroke="none" />)}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                </div>

                {/* Detailed Table */}
                <Card className="overflow-hidden">
                    <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
                        <NeonTitle className="text-xl">DANH SÁCH CHI TIẾT</NeonTitle>
                        <button className="text-xs bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 px-4 py-2 rounded-full transition border border-cyan-500/20">
                            XUẤT EXCEL
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-black/40 text-[10px] uppercase tracking-[0.2em] text-gray-500">
                                    <th className="px-8 py-5">Phim</th>
                                    <th className="px-8 py-5 text-right">Vé bán</th>
                                    <th className="px-8 py-5 text-right">Doanh thu</th>
                                    <th className="px-8 py-5 text-right">Giá TB</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                <AnimatePresence>
                                    {processedData.map((item, idx) => (
                                        <motion.tr 
                                            initial={{ opacity: 0 }} 
                                            animate={{ opacity: 1 }} 
                                            exit={{ opacity: 0 }}
                                            key={idx} 
                                            className="hover:bg-cyan-500/5 transition-colors group"
                                        >
                                            <td className="px-8 py-6">
                                                <div className="font-bold text-white group-hover:text-cyan-400 transition">{item.TENPHIM}</div>
                                                <div className="text-[10px] text-gray-600 font-mono mt-1">{item.MAPHIM}</div>
                                            </td>
                                            <td className="px-8 py-6 text-right font-mono text-amber-500/80">{item.SOVEDABAN?.toLocaleString()}</td>
                                            <td className="px-8 py-6 text-right font-bold text-cyan-400">
                                                {(item.TONGDOANHTHU / 1000000).toLocaleString()} <span className="text-[10px]">Tr</span>
                                            </td>
                                            <td className="px-8 py-6 text-right text-gray-400 italic">
                                                {item.SOVEDABAN > 0 ? Math.round(item.TONGDOANHTHU / item.SOVEDABAN / 1000) : 0}k
                                            </td>
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default RevenueReportPage;