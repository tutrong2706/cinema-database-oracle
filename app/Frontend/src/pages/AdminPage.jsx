import { useEffect, useState } from 'react';
import axiosClient from '../api/axiosClient';
import { useNavigate } from 'react-router-dom';

const AdminPage = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const DEFAULT_POSTER = 'https://via.placeholder.com/40x56?text=N/A';

    // Helper: Convert camelCase keys to UPPERCASE
    const toUppercaseKeys = (obj) => {
        if (!obj) return obj;
        const result = {};
        for (const key in obj) {
            const uppercaseKey = key.replace(/([A-Z])/g, '_$1').toUpperCase().replace(/^_/, '');
            result[uppercaseKey] = obj[key];
        }
        return result;
    };

    const [activeTab, setActiveTab] = useState('phims'); // phims, suatchieu, thongke, baocao
    const [userStats, setUserStats] = useState(null);
    const [revenue, setRevenue] = useState(null);
    const [orders, setOrders] = useState([]);
    const [suatchieu, setSuatchieu] = useState([]);
    
    // States for suất chiếu modal
    const [isModalSuatChieuOpen, setIsModalSuatChieuOpen] = useState(false);
    const [rapList, setRapList] = useState([]);
    const [phongList, setPhongList] = useState([]);
    const [phimList, setPhimList] = useState([]);
    const [selectedRap, setSelectedRap] = useState('');
    const [formSuatChieu, setFormSuatChieu] = useState({
        MASUATCHIEU: '',
        MAPHIM: '',
        MAPHONG: '',
        NGAYCHIEU: new Date().toISOString().split('T')[0],
        GIOBATDAU: '08:00:00',
        GIOKETTHUC: '10:30:00',
        GIAVECOBAN: 120000,
        TRANGTHAI: 'Đang mở'
    });
    
    // States for detailed stats
    const [detailedStats, setDetailedStats] = useState({
        movieRevenue: [],
        cinemaRevenue: [],
        topMovies: [],
        totalDailyRevenue: 0
    });

    useEffect(() => {
        // Kiểm tra quyền admin
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (user.vaiTro !== 'Admin') {
            alert("Bạn không có quyền truy cập trang này!");
            navigate('/');
        }
        
        // Load dashboard data
        loadDashboardData();
    }, [navigate]);

    const loadDashboardData = async () => {
        try {
            const [statsRes, revenueRes, ordersRes] = await Promise.all([
                axiosClient.get('/admin/users/count').catch(() => null),
                axiosClient.get('/admin/revenue').catch(() => null),
                axiosClient.get('/admin/orders').catch(() => null)
            ]);
            
            if (statsRes?.data?.meta) setUserStats(statsRes.data.meta);
            if (revenueRes?.data?.meta) setRevenue(revenueRes.data.meta);
            if (ordersRes?.data?.meta) setOrders(ordersRes.data.meta);
        } catch (error) {
            console.error('Load dashboard error:', error);
        }
    };

    const [phims, setPhims] = useState([]);
    const [keyword, setKeyword] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPhim, setEditingPhim] = useState(null);
    const [formData, setFormData] = useState({
        MAPHIM: '', TENPHIM: '', THOILUONG: 0, NGONNGU: '', QUOCGIA: '',
        DAODIEN: '', DIENVIENCHINH: '', NGAYKHOICHIEU: '', MOTANOINDUNG: '', DOTUOI: 13, CHUDEPHIM: '', ANH: ''
    });

    const fetchPhims = async () => {
        try {
            // Hiển thị loading state (Nếu có)
            const res = await axiosClient.get('/admin/phims', { params: { keyword } });
            setPhims(res.data.meta);
        } catch (error) { console.error(error); }
    };

    const fetchSuatchieu = async () => {
        try {
            const res = await axiosClient.get('/admin/suats');
            setSuatchieu(res.data.meta || []);
        } catch (error) { console.error('Fetch suất chiếu error:', error); }
    };
    
    const fetchPhongList = async () => {
        try {
            const res = await axiosClient.get('/phong');
            setPhongList(res.data.meta || []);
        } catch (error) { console.error('Fetch phòng error:', error); }
    };
    
    const fetchPhimList = async () => {
        try {
            const res = await axiosClient.get('/phim');
            setPhimList(res.data.meta || []);
        } catch (error) { console.error('Fetch phim error:', error); }
    };
    
    const fetchRapList = async () => {
        try {
            const res = await axiosClient.get('/rap');
            setRapList(res.data.meta || []);
        } catch (error) { console.error('Fetch rạp error:', error); }
    };
    
    const fetchPhongByRap = async (maRap) => {
        try {
            if (!maRap) {
                setPhongList([]);
                return;
            }
            const res = await axiosClient.get(`/phong?rap=${maRap}`);
            setPhongList(res.data.meta || []);
        } catch (error) { console.error('Fetch phòng by rạp error:', error); }
    };
    
    const loadDetailedStats = async () => {
        try {
            
            
            const [movieRevRes, cinemaRevRes, topMoviesRes] = await Promise.all([
                // Gọi API không truyền ngày để lấy All-time
                axiosClient.get(`/admin/revenue/movie`).catch(() => ({ data: { meta: [] } })),
                axiosClient.get(`/admin/revenue/cinema`).catch(() => ({ data: { meta: [] } })),
                axiosClient.get(`/admin/reports/top-movies?limit=5`).catch(() => ({ data: { meta: [] } }))
        ]);
            
            console.log('Movie Revenue:', movieRevRes.data.meta);
            console.log('Cinema Revenue:', cinemaRevRes.data.meta);
            console.log('Top Movies:', topMoviesRes.data.meta);
            
            setDetailedStats({
                movieRevenue: movieRevRes.data.meta || [],
                cinemaRevenue: cinemaRevRes.data.meta || [],
                topMovies: topMoviesRes.data.meta || [],
                totalDailyRevenue: revenue?.TONGDOANHTHU || 0
            });
        } catch (error) {
            console.error('Load detailed stats error:', error);
        }
    };

    useEffect(() => { fetchPhims(); }, [keyword]);
    
    useEffect(() => { 
        if (activeTab === 'suatchieu') {
            fetchSuatchieu();
            fetchPhongList();
            fetchPhimList();
        }
        if (activeTab === 'thongke') {
            loadDetailedStats();
        }
    }, [activeTab]);
    
    useEffect(() => {
        if (isModalSuatChieuOpen) {
            fetchRapList();
            fetchPhimList();
        }
    }, [isModalSuatChieuOpen]);
    
    useEffect(() => {
        if (activeTab === 'thongke') {
            loadDetailedStats();
        }
    }, [activeTab, revenue]);

    // ... (Giữ nguyên handleDelete và handleSubmit) ...
    const handleDelete = async (id) => {
        if (!window.confirm("Bạn có chắc muốn xóa phim này?")) return;
        try {
            await axiosClient.delete(`/admin/phims/${id}`);
            alert("Xóa thành công!");
            fetchPhims();
        } catch (error) { 
            alert("Lỗi: Không thể xóa Phim này. Phim vẫn còn suất chiếu chưa diễn ra hoặc đang chờ/mở."); 
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Chuyển đổi các trường số sang number
            let dataToSubmit = {
                ...formData,
                THOILUONG: parseInt(formData.THOILUONG),
                DOTUOI: parseInt(formData.DOTUOI)
            };

            // Khi tạo mới, bỏ MAPHIM vì sẽ tự sinh trên backend
            if (!editingPhim) {
                const { MAPHIM, ...newData } = dataToSubmit;
                dataToSubmit = newData;
                await axiosClient.post('/admin/phims', dataToSubmit);
            } else {
                await axiosClient.put(`/admin/phims/${editingPhim.MAPHIM}`, dataToSubmit);
            }
            
            alert(editingPhim ? "Cập nhật thành công!" : "Thêm mới thành công!");
            setIsModalOpen(false);
            fetchPhims();
        } catch (error) { 
            console.error(error);
            alert("Lỗi: " + (error.response?.data?.message || error.message)); 
        }
    };

    const openEdit = (phim) => {
        // ... (Giữ nguyên logic) ...
        setEditingPhim(phim);
        setFormData({ ...phim, NGAYKHOICHIEU: phim.NGAYKHOICHIEU.split('T')[0] });
        setIsModalOpen(true);
    };

    const openAdd = () => {
        setEditingPhim(null);
        // Cài đặt giá trị mặc định cho form thêm mới (MAPHIM sẽ tự sinh)
        setFormData({
            MAPHIM: '', // Will be auto-generated on backend
            TENPHIM: '', 
            THOILUONG: 120, // Mặc định 120 phút
            NGONNGU: 'Tiếng Việt', // Mặc định Tiếng Việt
            QUOCGIA: 'Việt Nam', // Mặc định Việt Nam
            DAODIEN: 'Chưa xác định', 
            DIENVIENCHINH: 'Chưa xác định', 
            NGAYKHOICHIEU: new Date().toISOString().split('T')[0], // Mặc định là ngày hôm nay
            MOTANOINDUNG: 'Phim hay', 
            DOTUOI: 13, // Mặc định 13+
            CHUDEPHIM: 'Hành động', // Mặc định thể loại
            ANH: 'https://via.placeholder.com/300x450?text=Poster'
        });
        setIsModalOpen(true);
    };
    
    const handleAddSuatChieu = async (e) => {
        e.preventDefault();
        try {
            // Remove MASUATCHIEU as it will be auto-generated on backend
            const { MASUATCHIEU, ...dataToSubmit } = formSuatChieu;
            dataToSubmit.GIAVECOBAN = parseInt(dataToSubmit.GIAVECOBAN);
            
            await axiosClient.post('/admin/suats', dataToSubmit);
            alert("Thêm suất chiếu thành công!");
            setIsModalSuatChieuOpen(false);
            setSelectedRap('');
            setFormSuatChieu({
                MASUATCHIEU: '',
                MAPHIM: '',
                MAPHONG: '',
                NGAYCHIEU: new Date().toISOString().split('T')[0],
                GIOBATDAU: '08:00:00',
                GIOKETTHUC: '10:30:00',
                GIAVECOBAN: 120000,
                TRANGTHAI: 'Đang mở'
            });
            fetchSuatchieu();
        } catch (error) {
            console.error(error);
            alert("Lỗi: " + (error.response?.data?.message || error.message));
        }
    };

    return (
        <div className="min-h-screen bg-gray-950 pt-24 px-6 pb-10">
            <div className="container mx-auto">
                {/* Header Admin */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <h1 className="text-3xl font-extrabold text-white border-l-4 border-[#00E5FF] pl-4">DASHBOARD QUẢN LÝ</h1>
                    <button 
                        onClick={() => {
                            localStorage.removeItem('token');
                            localStorage.removeItem('user');
                            navigate('/login');
                        }}
                        className="!bg-red-600/30 text-red-300 hover:!bg-red-600 hover:text-white px-5 py-2 rounded-lg font-bold transition"
                    >
                        Đăng Xuất
                    </button>
                </div>

                {/* Tab Navigation */}
                <div className="flex gap-4 mb-8 border-b border-gray-700 pb-4">
                    <button
                        onClick={() => setActiveTab('phims')}
                        className={`px-6 py-2 font-bold rounded-lg transition ${
                            activeTab === 'phims'
                                ? 'bg-gradient-to-r from-[#00E5FF] to-[#00D4F7] text-black shadow-[0_0_15px_rgba(0,229,255,0.4)]'
                                : 'text-gray-400 hover:text-white'
                        }`}
                    >
                        🎬 Quản Lý
                    </button>
                    <button
                        onClick={() => setActiveTab('suatchieu')}
                        className={`px-6 py-2 font-bold rounded-lg transition ${
                            activeTab === 'suatchieu'
                                ? 'bg-gradient-to-r from-[#00E5FF] to-[#00D4F7] text-black shadow-[0_0_15px_rgba(0,229,255,0.4)]'
                                : 'text-gray-400 hover:text-white'
                        }`}
                    >
                        🎞 Quản Lý Suất Chiếu
                    </button>
                    <button
                        onClick={() => setActiveTab('thongke')}
                        className={`px-6 py-2 font-bold rounded-lg transition ${
                            activeTab === 'thongke'
                                ? 'bg-gradient-to-r from-[#00E5FF] to-[#00D4F7] text-black shadow-[0_0_15px_rgba(0,229,255,0.4)]'
                                : 'text-gray-400 hover:text-white'
                        }`}
                    >
                        📊 Thống Kê
                    </button>
                    <button
                        onClick={() => setActiveTab('baocao')}
                        className={`px-6 py-2 font-bold rounded-lg transition ${
                            activeTab === 'baocao'
                                ? 'bg-gradient-to-r from-[#00E5FF] to-[#00D4F7] text-black shadow-[0_0_15px_rgba(0,229,255,0.4)]'
                                : 'text-gray-400 hover:text-white'
                        }`}
                    >
                        📈 Đơn Hàng
                    </button>
                </div>

                {/* TAB 1: PHIMS - Quản Lý Phim */}
                {activeTab === 'phims' && (
                    <>
                        {/* Header Actions */}
                        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                            <input 
                                type="text" 
                                placeholder="Tìm kiếm theo tên phim...." 
                                className="flex-1 p-4 rounded-xl bg-[#1a1a1a] text-white border border-gray-700 focus:border-[#00E5FF] outline-none transition placeholder-gray-500"
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                            />
                            <div className="flex gap-3">
                                <button onClick={openAdd} className="bg-gradient-to-r from-[#00E5FF] to-[#00D4F7] hover:from-[#00cce6] hover:to-[#00B8D4] text-black px-5 py-2 rounded-lg font-bold transition transform hover:scale-105 shadow-[0_0_15px_rgba(0,229,255,0.4)]">
                                    + Thêm Phim Mới
                                </button>
                                <button onClick={fetchPhims} className="!bg-gray-800 text-white px-5 py-2 rounded-lg font-bold hover:bg-gray-700 transition border border-gray-600">
                                    🔄 Refresh
                                </button>
                            </div>
                        </div>

                {/* Table */}
                <div className="bg-[#1a1a1a] rounded-xl overflow-x-auto border border-gray-800 shadow-2xl">
                    <table className="min-w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-900 text-gray-400 text-xs uppercase tracking-wider">
                                <th className="p-4 font-semibold">Mã</th>
                                <th className="p-4 font-semibold">Poster</th>
                                <th className="p-4 font-semibold">Tên Phim</th>
                                <th className="p-4 font-semibold">Năm</th>
                                <th className="p-4 font-semibold">Thời Lượng</th>
                                <th className="p-4 font-semibold">Rating</th>
                                <th className="p-4 font-semibold">Hiệu Quả (Theo ghế)</th>
                                <th className="p-4 font-semibold">Hiệu Quả (Theo doanh thu)</th>
                                <th className="p-4 font-semibold text-right">Chức năng</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                            {phims.map(p => (
                                <tr key={p.MAPHIM} className="hover:bg-gray-800/50 transition">
                                    <td className="p-4 text-gray-400 font-mono text-xs">{p.MAPHIM}</td>
                                    <td className="p-4">
                                        <img 
                                            src={p.ANH && typeof p.ANH === 'string' && p.ANH.startsWith('http') ? p.ANH : DEFAULT_POSTER} 
                                            alt={p.TENPHIM} 
                                            className="w-10 h-14 object-cover rounded bg-gray-700 border border-gray-600"
                                            onError={(e) => { e.target.onerror = null; e.target.src = DEFAULT_POSTER; }}
                                        />
                                    </td>
                                    <td className="p-4 font-bold text-white max-w-[200px] truncate">{p.TENPHIM}</td>
                                    <td className="p-4 text-gray-300">{new Date(p.NGAYKHOICHIEU).getFullYear()}</td>
                                    <td className="p-4 text-gray-300">{p.THOILUONG}p</td>
                                    <td className="p-4 text-yellow-400 font-bold">★ {p.DIEMDANHGIA || 'N/A'}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                                            p.HIEUQUA?.includes('Rất Hot') ? 'bg-red-500/20 text-red-400' :
                                            p.HIEUQUA?.includes('Bình thường') ? 'bg-blue-500/20 text-blue-400' :
                                            'bg-gray-500/20 text-gray-400'
                                        }`}>
                                            {p.HIEUQUA || 'Chưa có dữ liệu'}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                                            p.HIEUQUAMOI?.includes('Tuyệt vời') ? 'bg-purple-500/20 text-purple-400' :
                                            p.HIEUQUAMOI?.includes('Hot') ? 'bg-red-500/20 text-red-400' :
                                            p.HIEUQUAMOI?.includes('Bình thường') ? 'bg-blue-500/20 text-blue-400' :
                                            'bg-gray-500/20 text-gray-400'
                                        }`}>
                                            {p.HIEUQUAMOI || 'Chưa có dữ liệu'}
                                        </span>
                                    </td>
                                    <td className="p-4 flex justify-end gap-2 whitespace-nowrap">
                                        <button onClick={() => openEdit(p)} className="!bg-blue-600/30 text-blue-300 hover:!bg-blue-600 hover:text-white px-3 py-1 rounded transition text-sm font-semibold">Sửa</button>
                                        <button onClick={() => handleDelete(p.MAPHIM)} className="!bg-red-600/30 text-red-300 hover:!bg-red-600 hover:text-white px-3 py-1 rounded transition text-sm font-semibold">Xóa</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                    </>
                )}

                {/* TAB 2: SUẤT CHIẾU */}
                {activeTab === 'suatchieu' && (
                    <>
                    <div className="mb-6 flex justify-between items-center">
                        <h2 className="text-2xl font-bold text-white">🎞 Quản Lý Suất Chiếu</h2>
                        <button 
                            onClick={() => setIsModalSuatChieuOpen(true)}
                            className="bg-gradient-to-r from-[#00E5FF] to-[#00D4F7] hover:from-[#00cce6] hover:to-[#00B8D4] text-black px-5 py-2 rounded-lg font-bold transition transform hover:scale-105 shadow-[0_0_15px_rgba(0,229,255,0.4)]"
                        >
                            + Thêm Suất Chiếu Mới
                        </button>
                    </div>
                    <div className="bg-[#1a1a1a] rounded-xl overflow-x-auto border border-gray-800 shadow-2xl">
                        <table className="min-w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-900 text-gray-400 text-xs uppercase tracking-wider">
                                    <th className="p-4 font-semibold">Mã Suất</th>
                                    <th className="p-4 font-semibold">Phim</th>
                                    <th className="p-4 font-semibold">Phòng</th>
                                    <th className="p-4 font-semibold">Rạp</th>
                                    <th className="p-4 font-semibold">Ngày Chiếu</th>
                                    <th className="p-4 font-semibold">Giờ Bắt Đầu</th>
                                    <th className="p-4 font-semibold">Giá Vé</th>
                                    <th className="p-4 font-semibold">Trạng Thái</th>
                                    <th className="p-4 font-semibold text-right">Chức Năng</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800">
                                {suatchieu.length > 0 ? (
                                    suatchieu.map(sc => (
                                        <tr key={sc.MASUATCHIEU} className="hover:bg-gray-800/50 transition">
                                            <td className="p-4 text-gray-400 font-mono text-xs">{sc.MASUATCHIEU}</td>
                                            <td className="p-4 font-bold text-white">{sc.TENPHIM || 'N/A'}</td>
                                            <td className="p-4 text-gray-300">{sc.TENPHONG || 'N/A'}</td>
                                            <td className="p-4 text-gray-300">{sc.TENRAP || 'N/A'}</td>
                                            <td className="p-4 text-gray-300">{sc.NGAYCHIEU ? new Date(sc.NGAYCHIEU).toLocaleDateString('vi-VN') : 'N/A'}</td>
                                            <td className="p-4 text-gray-300">{sc.GIOBATDAU ? new Date(sc.GIOBATDAU).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : 'N/A'}</td>
                                            <td className="p-4 text-yellow-400 font-bold">{parseInt(sc.GIAVECOBAN || 0).toLocaleString('vi-VN')} đ</td>
                                            <td className="p-4">
                                                <span className={`px-2 py-1 rounded text-xs font-bold ${
                                                    sc.TRANGTHAI === 'Đang mở' ? 'bg-green-500/20 text-green-400' :
                                                    sc.TRANGTHAI === 'Đã chiếu' ? 'bg-gray-500/20 text-gray-400' :
                                                    'bg-yellow-500/20 text-yellow-400'
                                                }`}>
                                                    {sc.TRANGTHAI || 'N/A'}
                                                </span>
                                            </td>
                                            <td className="p-4 flex justify-end gap-2">
                                                <button className="!bg-blue-600/30 text-blue-300 hover:!bg-blue-600 px-3 py-1 rounded text-sm font-semibold">Sửa</button>
                                                <button className="!bg-red-600/30 text-red-300 hover:!bg-red-600 px-3 py-1 rounded text-sm font-semibold">Xóa</button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="9" className="p-8 text-center text-gray-400">Chưa có suất chiếu nào</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    </>
                )}

                {/* TAB 3: THỐNG KÊ */}
                {activeTab === 'thongke' && (
                    <>
                    <div className="space-y-8">
                        {/* Summary Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-2xl p-6 border border-blue-700 shadow-2xl">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-gray-300 text-sm mb-2">👥 Tổng Người Dùng</p>
                                        <p className="text-3xl font-bold text-white">{userStats?.totalUsers || 0}</p>
                                    </div>
                                    <div className="text-4xl opacity-20">👥</div>
                                </div>
                            </div>

                            <div className="bg-gradient-to-br from-red-900 to-red-800 rounded-2xl p-6 border border-red-700 shadow-2xl">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-gray-300 text-sm mb-2">👑 Admin</p>
                                        <p className="text-3xl font-bold text-white">{userStats?.admins || 0}</p>
                                    </div>
                                    <div className="text-4xl opacity-20">👑</div>
                                </div>
                            </div>

                            <div className="bg-gradient-to-br from-green-900 to-green-800 rounded-2xl p-6 border border-green-700 shadow-2xl">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-gray-300 text-sm mb-2">🎫 Khách Hàng</p>
                                        <p className="text-3xl font-bold text-white">{userStats?.customers || 0}</p>
                                    </div>
                                    <div className="text-4xl opacity-20">🎫</div>
                                </div>
                            </div>

                            <div className="bg-gradient-to-br from-purple-900 to-purple-800 rounded-2xl p-6 border border-purple-700 shadow-2xl">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-gray-300 text-sm mb-2">💰 Tổng tiền vé</p>
                                        <p className="text-xl font-bold text-white">
                                            {(detailedStats.movieRevenue?.reduce((sum, item) => sum + (parseInt(item.DOANHTHU) || 0), 0) / 1000000).toFixed(1)}M đ
                                        </p>
                                    </div>
                                    <div className="text-4xl opacity-20">�</div>
                                </div>
                            </div>
                        </div>

                        {/* Detailed Reports */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Top Movies */}
                            <div className="bg-[#1a1a1a] rounded-xl border border-gray-800 shadow-2xl overflow-hidden">
                                <h3 className="text-lg font-bold text-white bg-gray-900 p-4 border-b border-gray-800">🎬 Top 5 Phim Có Doanh Thu Cao Nhất</h3>
                                <div className="p-4 space-y-2 max-h-[300px] overflow-y-auto">
                                    {detailedStats.topMovies && detailedStats.topMovies.length > 0 ? (
                                        detailedStats.topMovies.map((movie, idx) => (
                                            <div key={idx} className="flex justify-between items-center p-3 bg-gray-900/50 rounded-lg hover:bg-gray-900 transition">
                                                <div className="flex-1">
                                                    <p className="font-semibold text-white">{idx + 1}. {movie.TENPHIM || movie.TenPhim}</p>
                                                    <p className="text-xs text-gray-400">🎫 {movie.SOVE || movie.SoVe} vé</p>
                                                </div>
                                                <p className="text-yellow-400 font-bold">{(movie.DOANHTHU ? parseInt(movie.DOANHTHU) / 1000000 : 0).toFixed(1)}M đ</p>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-gray-400 text-center py-4">Chưa có dữ liệu</p>
                                    )}
                                </div>
                            </div>

                            {/* Cinema Revenue */}
                            <div className="bg-[#1a1a1a] rounded-xl border border-gray-800 shadow-2xl overflow-hidden">
                                <h3 className="text-lg font-bold text-white bg-gray-900 p-4 border-b border-gray-800">🏢 Doanh Thu Theo Rạp</h3>
                                <div className="p-4 space-y-2 max-h-[300px] overflow-y-auto">
                                    {detailedStats.cinemaRevenue && detailedStats.cinemaRevenue.length > 0 ? (
                                        detailedStats.cinemaRevenue.map((cinema, idx) => (
                                            <div key={idx} className="flex justify-between items-center p-3 bg-gray-900/50 rounded-lg hover:bg-gray-900 transition">
                                                <div className="flex-1">
                                                    <p className="font-semibold text-white">{cinema.TENRAP || cinema.Ten}</p>
                                                    <p className="text-xs text-gray-400">🎫 {cinema.SOVE || cinema.SoVe} vé</p>
                                                </div>
                                                <p className="text-yellow-400 font-bold">{(cinema.DOANHTHU ? parseInt(cinema.DOANHTHU) / 1000000 : 0).toFixed(1)}M đ</p>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-gray-400 text-center py-4">Chưa có dữ liệu</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Movie Revenue Table */}
                        <div className="bg-[#1a1a1a] rounded-xl border border-gray-800 shadow-2xl overflow-x-auto">
                            <h3 className="text-lg font-bold text-white bg-gray-900 p-4 border-b border-gray-800">📊 Chi Tiết Doanh Thu Theo Phim</h3>
                            <table className="min-w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-900 text-gray-400 text-xs uppercase tracking-wider">
                                        <th className="p-4 font-semibold">Tên Phim</th>
                                        <th className="p-4 font-semibold">Số Vé Bán</th>
                                        <th className="p-4 font-semibold">Doanh Thu</th>
                                        <th className="p-4 font-semibold">Giá Trung Bình</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-800">
                                    {detailedStats.movieRevenue && detailedStats.movieRevenue.length > 0 ? (
                                        detailedStats.movieRevenue.map((movie, idx) => (
                                            <tr key={idx} className="hover:bg-gray-800/50 transition">
                                                <td className="p-4 font-semibold text-white">{movie.TENPHIM || movie.TenPhim}</td>
                                                <td className="p-4 text-gray-300">{movie.SOVE || movie.SoVe}</td>
                                                <td className="p-4 text-yellow-400 font-bold">{(movie.DOANHTHU ? parseInt(movie.DOANHTHU) / 1000000 : 0).toFixed(2)}M đ</td>
                                                <td className="p-4 text-gray-300">{movie.GIAB_TRUNGBINH ? parseInt(movie.GIAB_TRUNGBINH).toLocaleString('vi-VN') : 'N/A'} đ</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" className="p-8 text-center text-gray-400">Chưa có dữ liệu</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    </>
                )}

                {/* TAB 4: BÁO CÁO DOANH THU */}
                {activeTab === 'baocao' && (
                    <>
                    <div className="space-y-6">
                        {/* Revenue Summary */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div className="bg-gradient-to-br from-purple-900 to-purple-800 rounded-2xl p-6 border border-purple-700 shadow-2xl">
                                <p className="text-gray-300 text-sm mb-2">💰 Tổng Doanh Thu</p>
                                <p className="text-3xl font-bold text-white">
                                    {(parseInt(revenue?.TONGDOANHTHU || 0) / 1000000).toFixed(1)}M đ
                                </p>
                                <p className="text-gray-400 text-xs mt-2">Từ các đơn hàng đã thanh toán</p>
                            </div>

                            <div className="bg-gradient-to-br from-orange-900 to-orange-800 rounded-2xl p-6 border border-orange-700 shadow-2xl">
                                <p className="text-gray-300 text-sm mb-2">🛒 Tổng Đơn Hàng</p>
                                <p className="text-3xl font-bold text-white">{revenue?.SODONHANG || 0}</p>
                                <p className="text-gray-400 text-xs mt-2">Đơn hàng đã hoàn tất</p>
                            </div>

                            <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-2xl p-6 border border-blue-700 shadow-2xl">
                                <p className="text-gray-300 text-sm mb-2">📊 Trung Bình/Đơn</p>
                                <p className="text-3xl font-bold text-white">
                                    {revenue?.SODONHANG > 0 ? (parseInt(revenue.TONGDOANHTHU || 0) / revenue.SODONHANG / 1000).toFixed(0) : 0}K đ
                                </p>
                                <p className="text-gray-400 text-xs mt-2">Giá trị trung bình mỗi đơn</p>
                            </div>

                            <div className="bg-gradient-to-br from-green-900 to-green-800 rounded-2xl p-6 border border-green-700 shadow-2xl">
                                <p className="text-gray-300 text-sm mb-2">📈 Tổng Khách</p>
                                <p className="text-3xl font-bold text-white">{userStats?.customers || 0}</p>
                                <p className="text-gray-400 text-xs mt-2">Khách hàng đã mua vé</p>
                            </div>
                        </div>

                        {/* Orders List */}
                        <div className="bg-[#1a1a1a] rounded-xl overflow-x-auto border border-gray-800 shadow-2xl">
                            <h3 className="text-xl font-bold text-white p-6 border-b border-gray-800">📋 Danh Sách Tất Cả Đơn Hàng ({orders.length})</h3>
                            {orders.length > 0 ? (
                                <table className="min-w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-gray-900 text-gray-400 text-xs uppercase tracking-wider">
                                            <th className="p-4 font-semibold">Mã Đơn</th>
                                            <th className="p-4 font-semibold">Khách Hàng</th>
                                            <th className="p-4 font-semibold">Email</th>
                                            <th className="p-4 font-semibold">Điện Thoại</th>
                                            <th className="p-4 font-semibold">Thời Gian Đặt</th>
                                            <th className="p-4 font-semibold">Tổng Tiền</th>
                                            <th className="p-4 font-semibold">Trạng Thái</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-800">
                                        {orders.map(order => (
                                            <tr key={order.MADONHANG} className="hover:bg-gray-800/50 transition">
                                                <td className="p-4 text-gray-400 font-mono text-xs">{order.MADONHANG}</td>
                                                <td className="p-4 font-semibold text-white">{order.HOTEN || 'N/A'}</td>
                                                <td className="p-4 text-gray-300">{order.EMAIL || 'N/A'}</td>
                                                <td className="p-4 text-gray-300">{order.SDT || 'N/A'}</td>
                                                <td className="p-4 text-gray-300 text-sm">{order.THOIGIANDAT ? new Date(order.THOIGIANDAT).toLocaleString('vi-VN') : 'N/A'}</td>
                                                <td className="p-4 text-yellow-400 font-bold">{(parseInt(order.TONGTIEN || 0) / 1000).toFixed(0)}K đ</td>
                                                <td className="p-4">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                                        order.TRANGTHAI === 'Đã thanh toán' ? 'bg-green-500/20 text-green-400' :
                                                        order.TRANGTHAI === 'Hủy' ? 'bg-red-500/20 text-red-400' :
                                                        'bg-yellow-500/20 text-yellow-400'
                                                    }`}>
                                                        {order.TRANGTHAI || 'Chờ thanh toán'}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <div className="p-8 text-center text-gray-400">
                                    <p>📭 Chưa có đơn hàng nào</p>
                                </div>
                            )}
                        </div>
                    </div>
                    </>
                )}
            </div>

            {/* Modal Form for Movie */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex justify-center items-center z-50 p-4">
                    <div className="!bg-gray-900 p-8 rounded-2xl w-full max-w-2xl border border-gray-700 shadow-2xl max-h-[90vh] overflow-y-auto">
                        <h2 className="text-2xl font-bold mb-6 text-white border-b border-gray-700 pb-3">{editingPhim ? 'Chỉnh Sửa Phim' : 'Thêm Phim Mới'}</h2>
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Input Fields (Đã sắp xếp lại và tối ưu style) */}
                            {['TENPHIM', 'THOILUONG', 'NGONNGU', 'QUOCGIA', 'DAODIEN', 'DIENVIENCHINH', 'DOTUOI', 'CHUDEPHIM'].map((field) => (
                                <div key={field}>
                                    <label className="block text-xs text-gray-400 uppercase mb-1 font-semibold">{field}</label>
                                    <input 
                                        type={field === 'THOILUONG' || field === 'DOTUOI' ? 'number' : 'text'}
                                        required
                                        value={formData[field]} 
                                        onChange={e => setFormData({...formData, [field]: e.target.value})} 
                                        className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-[#00E5FF] outline-none transition"
                                    />
                                </div>
                            ))}
                            {/* NGAYKHOICHIEU nằm riêng để đảm bảo loại 'date' */}
                            <div>
                                <label className="block text-xs text-gray-400 uppercase mb-1 font-semibold">Ngày Khởi Chiếu</label>
                                <input 
                                    type="date" 
                                    required 
                                    value={formData.NGAYKHOICHIEU} 
                                    onChange={e => setFormData({...formData, NGAYKHOICHIEU: e.target.value})} 
                                    className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-[#00E5FF] outline-none transition"
                                />
                            </div>

                            <div className="col-span-2">
                                <label className="block text-xs text-gray-400 uppercase mb-1 font-semibold">URL Ảnh Poster</label>
                                <input 
                                    type="text" 
                                    value={formData.ANH} 
                                    onChange={e => setFormData({...formData, ANH: e.target.value})} 
                                    className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-[#00E5FF] outline-none transition" 
                                    placeholder="https://..."
                                />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-xs text-gray-400 uppercase mb-1 font-semibold">Mô Tả Nội Dung</label>
                                <textarea 
                                    rows="4" 
                                    value={formData.MOTANOINDUNG} 
                                    onChange={e => setFormData({...formData, MOTANOINDUNG: e.target.value})} 
                                    className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-[#00E5FF] outline-none transition"
                                ></textarea>
                            </div>

                            <div className="col-span-2 flex justify-end gap-4 mt-4">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold transition">Hủy</button>
                                <button type="submit" className="px-6 py-2 bg-gradient-to-r from-[#00E5FF] to-[#00D4F7] hover:from-[#00cce6] hover:to-[#00B8D4] text-black font-bold rounded-lg transition transform hover:scale-105 shadow-[0_0_15px_rgba(0,229,255,0.4)]">Lưu</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Form for Suất Chiếu */}
            {isModalSuatChieuOpen && (
                <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex justify-center items-center z-50 p-4">
                    <div className="!bg-gray-900 p-8 rounded-2xl w-full max-w-2xl border border-gray-700 shadow-2xl max-h-[90vh] overflow-y-auto">
                        <h2 className="text-2xl font-bold mb-6 text-white border-b border-gray-700 pb-3">➕ Thêm Suất Chiếu Mới</h2>
                        <form onSubmit={handleAddSuatChieu} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Chọn Rạp */}
                            <div>
                                <label className="block text-xs text-gray-400 uppercase mb-1 font-semibold">🎬 Rạp Chiếu Phim</label>
                                <select
                                    required
                                    value={selectedRap}
                                    onChange={(e) => {
                                        setSelectedRap(e.target.value);
                                        fetchPhongByRap(e.target.value);
                                        setFormSuatChieu({...formSuatChieu, MAPHONG: ''});
                                    }}
                                    className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-[#00E5FF] outline-none transition"
                                >
                                    <option value="">-- Chọn Rạp --</option>
                                    {rapList.map(rap => (
                                        <option key={rap.MARAPHIM} value={rap.MARAPHIM}>
                                            {rap.TEN} ({rap.THANHPHO})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Chọn Phim */}
                            <div>
                                <label className="block text-xs text-gray-400 uppercase mb-1 font-semibold">Phim</label>
                                <select
                                    required
                                    value={formSuatChieu.MAPHIM}
                                    onChange={e => setFormSuatChieu({...formSuatChieu, MAPHIM: e.target.value})}
                                    className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-[#00E5FF] outline-none transition"
                                >
                                    <option value="">-- Chọn Phim --</option>
                                    {phimList.map(phim => (
                                        <option key={phim.MAPHIM} value={phim.MAPHIM}>
                                            {phim.TENPHIM}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Chọn Phòng */}
                            <div>
                                <label className="block text-xs text-gray-400 uppercase mb-1 font-semibold">Phòng Chiếu {selectedRap ? '✓' : '(chọn rạp trước)'}</label>
                                <select
                                    required
                                    disabled={!selectedRap}
                                    value={formSuatChieu.MAPHONG}
                                    onChange={e => setFormSuatChieu({...formSuatChieu, MAPHONG: e.target.value})}
                                    className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-[#00E5FF] outline-none transition disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <option value="">-- Chọn Phòng --</option>
                                    {phongList.map(phong => (
                                        <option key={phong.MAPHONG} value={phong.MAPHONG}>
                                            {phong.TEN} (Sức chứa: {phong.SUCCHUA})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Ngày Chiếu */}
                            <div>
                                <label className="block text-xs text-gray-400 uppercase mb-1 font-semibold">Ngày Chiếu</label>
                                <input
                                    type="date"
                                    required
                                    value={formSuatChieu.NGAYCHIEU}
                                    onChange={e => setFormSuatChieu({...formSuatChieu, NGAYCHIEU: e.target.value})}
                                    className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-[#00E5FF] outline-none transition"
                                />
                            </div>

                            {/* Giờ Bắt Đầu */}
                            <div>
                                <label className="block text-xs text-gray-400 uppercase mb-1 font-semibold">Giờ Bắt Đầu</label>
                                <input
                                    type="time"
                                    required
                                    value={formSuatChieu.GIOBATDAU.substring(0, 5)}
                                    onChange={e => setFormSuatChieu({...formSuatChieu, GIOBATDAU: e.target.value + ':00'})}
                                    className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-[#00E5FF] outline-none transition"
                                />
                            </div>

                            {/* Giờ Kết Thúc */}
                            <div>
                                <label className="block text-xs text-gray-400 uppercase mb-1 font-semibold">Giờ Kết Thúc</label>
                                <input
                                    type="time"
                                    required
                                    value={formSuatChieu.GIOKETTHUC.substring(0, 5)}
                                    onChange={e => setFormSuatChieu({...formSuatChieu, GIOKETTHUC: e.target.value + ':00'})}
                                    className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-[#00E5FF] outline-none transition"
                                />
                            </div>

                            {/* Giá Vé Cơ Bản */}
                            <div>
                                <label className="block text-xs text-gray-400 uppercase mb-1 font-semibold">Giá Vé Cơ Bản (VNĐ)</label>
                                <input
                                    type="number"
                                    required
                                    value={formSuatChieu.GIAVECOBAN}
                                    onChange={e => setFormSuatChieu({...formSuatChieu, GIAVECOBAN: e.target.value})}
                                    className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-[#00E5FF] outline-none transition"
                                    placeholder="120000"
                                    min="0"
                                />
                            </div>

                            {/* Trạng Thái */}
                            <div>
                                <label className="block text-xs text-gray-400 uppercase mb-1 font-semibold">Trạng Thái</label>
                                <select
                                    value={formSuatChieu.TRANGTHAI}
                                    onChange={e => setFormSuatChieu({...formSuatChieu, TRANGTHAI: e.target.value})}
                                    className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-[#00E5FF] outline-none transition"
                                >
                                    <option value="Đang mở">Đang mở</option>
                                    <option value="Hủy">Hủy</option>
                                    <option value="Đã chiếu">Đã chiếu</option>
                                </select>
                            </div>

                            <div className="col-span-2 flex justify-end gap-4 mt-4">
                                <button type="button" onClick={() => setIsModalSuatChieuOpen(false)} className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold transition">Hủy</button>
                                <button type="submit" className="px-6 py-2 bg-gradient-to-r from-[#00E5FF] to-[#00D4F7] hover:from-[#00cce6] hover:to-[#00B8D4] text-black font-bold rounded-lg transition transform hover:scale-105 shadow-[0_0_15px_rgba(0,229,255,0.4)]">Lưu</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPage;