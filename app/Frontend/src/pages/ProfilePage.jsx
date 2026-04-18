import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';

const ProfilePage = () => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({});
    const [isSaving, setIsSaving] = useState(false);

    // Helper function to format dates
    const formatDate = (dateValue) => {
        if (!dateValue) return 'Chưa cập nhật';
        try {
            const date = typeof dateValue === 'string' ? new Date(dateValue) : dateValue;
            if (isNaN(date.getTime())) return 'Lỗi ngày';
            return date.toLocaleString('vi-VN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
        } catch (e) {
            console.error('Date formatting error:', e);
            return 'Lỗi ngày';
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        const fetchData = async () => {
            try {
                setLoading(true);
                const [profileRes, ordersRes] = await Promise.all([
                    axiosClient.get('/auth/profile'),
                    axiosClient.get('/auth/orders')
                ]);
                
                console.log('📋 Profile API Response:', JSON.stringify(profileRes.data, null, 2));
                console.log('📦 Orders API Response:', JSON.stringify(ordersRes.data, null, 2));
                
                const userData = profileRes.data.meta;
                console.log('👤 User data extracted:', JSON.stringify(userData, null, 2));
                
                setProfile(userData);
                setEditData({
                    HoTen: userData.HOTEN,
                    Email: userData.EMAIL,
                    SDT: userData.SDT,
                    DiaChi: userData.DIACHI,
                    GioiTinh: userData.GIOITINH
                });
                setHistory(ordersRes.data.meta || []);
                setError(null);
            } catch (err) {
                setError(err.response?.data?.message || 'Lỗi khi tải dữ liệu');
                console.error('Error fetching data:', err);
                console.error('Error response:', err.response?.data);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [navigate]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-2xl text-gray-400">Đang tải...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-2xl text-red-500">{error}</div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-2xl text-gray-400">Không có dữ liệu</div>
            </div>
        );
    }

    // Gán rank color dựa vào LoaiThanhVien
    const getRankColor = (rank) => {
        switch (rank) {
            case 'Platinum':
                return 'from-purple-500 to-pink-500';
            case 'Gold':
                return 'from-yellow-500 to-orange-500';
            case 'Silver':
                return 'from-gray-400 to-gray-300';
            case 'Bronze':
            default:
                return 'from-amber-700 to-orange-700';
        }
    };

    // Get role display name
    const getRoleDisplay = (role) => {
        return role === 'Admin' ? '👑 Quản Trị Viên' : '👤 Khách Hàng';
    };

    // Handle save profile
    const handleSaveProfile = async () => {
        try {
            setIsSaving(true);
            await axiosClient.put(`/auth/profile/${profile.MANGUOIDUNG}`, editData);
            setProfile({ ...profile, ...editData });
            setIsEditing(false);
            setError(null);
        } catch (err) {
            setError('Lỗi khi cập nhật hồ sơ: ' + (err.response?.data?.message || err.message));
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 pt-20">
            <div className="container mx-auto px-6 py-12">
                <div className="max-w-2xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold text-white mb-2">Hồ Sơ Cá Nhân</h1>
                        <p className="text-gray-400">Quản lý thông tin tài khoản của bạn</p>
                    </div>

                    {/* Avatar & Name */}
                    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl shadow-2xl p-8 mb-8 border border-gray-700">
                        <div className="flex flex-col items-center mb-8">
                            {/* Avatar */}
                            <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${getRankColor(profile.LOAITHANHVIEN)} flex items-center justify-center text-4xl font-bold text-white shadow-xl mb-6`}>
                                {profile.HOTEN?.charAt(0)?.toUpperCase() || 'U'}
                            </div>
                            
                            {/* Name */}
                            <h2 className="text-3xl font-bold text-white mb-2">{profile.HOTEN}</h2>
                            
                            {/* Role Badge - Show Admin/Customer */}
                            <div className="flex gap-4 items-center mb-4">
                                <span className={`inline-block px-6 py-2 rounded-full font-bold text-white ${
                                    profile.VAITRO === 'Admin' 
                                        ? 'bg-gradient-to-r from-red-600 to-red-700' 
                                        : 'bg-gradient-to-r from-blue-600 to-blue-700'
                                } shadow-lg`}>
                                    {getRoleDisplay(profile.VAITRO)}
                                </span>
                                
                                {/* Member Tier Badge - Only show for customers */}
                                {profile.VAITRO === 'Khach' && (
                                    <span className={`inline-block px-6 py-2 rounded-full font-bold text-white bg-gradient-to-r ${getRankColor(profile.LOAITHANHVIEN)} shadow-lg`}>
                                        {profile.LOAITHANHVIEN} Member
                                    </span>
                                )}
                            </div>

                            {/* Edit Button */}
                            <button
                                onClick={() => setIsEditing(!isEditing)}
                                className="mt-4 px-6 py-2 bg-gradient-to-r from-[#00E5FF] to-[#00D4F7] text-black font-bold rounded-lg hover:shadow-lg transition"
                            >
                                {isEditing ? '❌ Hủy' : '✏️ Chỉnh Sửa'}
                            </button>
                        </div>

                        {/* Points Section - Only for customers */}
                        {profile.VAITRO === 'Khach' && (
                            <div className="bg-gray-700/50 rounded-2xl p-6 mt-8 border border-gray-600">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-gray-400 text-sm mb-1">Điểm Tích Lũy</p>
                                        <p className="text-3xl font-bold text-[#00E5FF]">{parseInt(profile.DIEMTICHLUY || 0).toLocaleString('vi-VN')}</p>
                                    </div>
                                    <div className="text-5xl">⭐</div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Information Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        {/* Email */}
                        <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 hover:border-[#00E5FF] transition">
                            <div className="flex items-center mb-2">
                                <span className="text-2xl mr-3">📧</span>
                                <label className="text-sm text-gray-400 font-semibold">Email</label>
                            </div>
                            {isEditing ? (
                                <input
                                    type="email"
                                    value={editData.Email}
                                    onChange={(e) => setEditData({...editData, Email: e.target.value})}
                                    disabled
                                    className="w-full bg-gray-700 text-white p-2 rounded border border-gray-600 opacity-50 cursor-not-allowed"
                                />
                            ) : (
                                <p className="text-white text-lg break-all">{profile.EMAIL}</p>
                            )}
                        </div>
                        
                        {/* Phone */}
                        <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 hover:border-[#00E5FF] transition">
                            <div className="flex items-center mb-2">
                                <span className="text-2xl mr-3">☎️</span>
                                <label className="text-sm text-gray-400 font-semibold">Số Điện Thoại</label>
                            </div>
                            {isEditing ? (
                                <input
                                    type="tel"
                                    value={editData.SDT}
                                    onChange={(e) => setEditData({...editData, SDT: e.target.value})}
                                    className="w-full bg-gray-700 text-white p-2 rounded border border-gray-600 focus:border-[#00E5FF] focus:outline-none"
                                    placeholder="Nhập số điện thoại"
                                />
                            ) : (
                                <p className="text-white text-lg">{profile.SDT || 'Chưa cập nhật'}</p>
                            )}
                        </div>
                        
                        {/* Address */}
                        <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 hover:border-[#00E5FF] transition md:col-span-2">
                            <div className="flex items-center mb-2">
                                <span className="text-2xl mr-3">📍</span>
                                <label className="text-sm text-gray-400 font-semibold">Địa Chỉ</label>
                            </div>
                            {isEditing ? (
                                <textarea
                                    value={editData.DiaChi}
                                    onChange={(e) => setEditData({...editData, DiaChi: e.target.value})}
                                    rows="3"
                                    className="w-full bg-gray-700 text-white p-2 rounded border border-gray-600 focus:border-[#00E5FF] focus:outline-none"
                                    placeholder="Nhập địa chỉ"
                                />
                            ) : (
                                <p className="text-white text-lg">{profile.DIACHI || 'Chưa cập nhật'}</p>
                            )}
                        </div>

                        {/* Gender */}
                        <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 hover:border-[#00E5FF] transition">
                            <div className="flex items-center mb-2">
                                <span className="text-2xl mr-3">👤</span>
                                <label className="text-sm text-gray-400 font-semibold">Giới Tính</label>
                            </div>
                            {isEditing ? (
                                <select
                                    value={editData.GioiTinh || ''}
                                    onChange={(e) => setEditData({...editData, GioiTinh: e.target.value})}
                                    className="w-full bg-gray-700 text-white p-2 rounded border border-gray-600 focus:border-[#00E5FF] focus:outline-none"
                                >
                                    <option value="">Chưa chọn</option>
                                    <option value="M">Nam</option>
                                    <option value="F">Nữ</option>
                                    <option value="O">Khác</option>
                                </select>
                            ) : (
                                <p className="text-white text-lg">
                                    {profile.GIOITINH === 'M' ? 'Nam' : profile.GIOITINH === 'F' ? 'Nữ' : 'Khác'}
                                </p>
                            )}
                        </div>

                        {/* Member ID */}
                        <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 hover:border-[#00E5FF] transition">
                            <div className="flex items-center mb-2">
                                <span className="text-2xl mr-3">🆔</span>
                                <label className="text-sm text-gray-400 font-semibold">ID Thành Viên</label>
                            </div>
                            <p className="text-white text-lg font-mono">{profile.MANGUOIDUNG}</p>
                        </div>
                    </div>

                    {/* Save Changes Button - Show when editing */}
                    {isEditing && (
                        <div className="mb-8 flex justify-center gap-4">
                            <button
                                onClick={handleSaveProfile}
                                disabled={isSaving}
                                className="px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold rounded-lg transition disabled:opacity-50 cursor-disabled shadow-lg"
                            >
                                {isSaving ? '⏳ Đang Lưu...' : '✅ Lưu Thay Đổi'}
                            </button>
                        </div>
                    )}

                    {/* Transaction History */}
                    <div className="bg-gray-800 rounded-3xl shadow-2xl p-8 mb-8 border border-gray-700">
                        <h3 className="text-2xl font-bold text-white mb-6 border-b border-gray-700 pb-4">Lịch Sử Giao Dịch</h3>
                        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                            {history.length === 0 ? (
                                <p className="text-gray-400 text-center py-8">Chưa có giao dịch nào.</p>
                            ) : (
                                history.map((order) => (
                                    <div key={order.MADONHANG} className="bg-gray-700/50 rounded-xl p-5 border border-gray-600 hover:border-[#00E5FF] transition">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <p className="text-[#00E5FF] font-bold text-lg">#{order.MADONHANG}</p>
                                                <p className="text-gray-400 text-sm">{formatDate(order.THOIGIANDAT)}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-white font-bold text-xl">{parseInt(order.TONGTIEN).toLocaleString('vi-VN')} đ</p>
                                                <span 
                                                    onClick={() => {
                                                        if (order.TRANGTHAI === 'Chờ thanh toán') {
                                                            navigate(`/payment?orderId=${order.MADONHANG}`);
                                                        }
                                                    }}
                                                    className={`inline-block px-3 py-1 rounded-full text-xs font-bold mt-1 cursor-pointer ${
                                                    order.TRANGTHAI === 'Đã thanh toán' ? 'bg-green-500/20 text-green-400' :
                                                    order.TRANGTHAI === 'Hủy' ? 'bg-red-500/20 text-red-400' :
                                                    'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/40'
                                                }`}>
                                                    {order.TRANGTHAI} {order.TRANGTHAI === 'Chờ thanh toán' && '(Thanh toán ngay)'}
                                                </span>
                                            </div>
                                        </div>
                                        
                                        {/* Tickets */}
                                        {order.VE_XEM_PHIM && order.VE_XEM_PHIM.length > 0 && (
                                            <div className="mb-3">
                                                <p className="text-gray-300 font-semibold text-sm mb-2">Vé xem phim:</p>
                                                <div className="space-y-2">
                                                    {order.VE_XEM_PHIM.map((ve, idx) => (
                                                        <div key={idx} className="flex justify-between text-sm bg-gray-800/50 p-2 rounded">
                                                            <div>
                                                                <p className="text-white font-medium">{ve.TRAPHIM?.TENPHIM}</p>
                                                                <p className="text-gray-400 text-xs">
                                                                    {ve.SUATCHIEU?.PHONGCHIEU?.RATCHIEOPHIM?.TEN} - {ve.SUATCHIEU?.PHONGCHIEU?.TEN}
                                                                </p>
                                                                <p className="text-gray-400 text-xs">
                                                                    Ghế: {ve.HANGGHE}{ve.SOGHE}
                                                                </p>
                                                            </div>
                                                            <p className="text-gray-300">{parseInt(ve.GIAVECUOI).toLocaleString('vi-VN')} đ</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Items */}
                                        {order.GOM && order.GOM.length > 0 && (
                                            <div>
                                                <p className="text-gray-300 font-semibold text-sm mb-2">Đồ ăn & Thức uống:</p>
                                                <div className="space-y-2">
                                                    {order.GOM.map((item, idx) => (
                                                        <div key={idx} className="flex justify-between text-sm bg-gray-800/50 p-2 rounded">
                                                            <p className="text-white">{item.MATHAN?.TENHANG} x{item.SOLUONG}</p>
                                                            <p className="text-gray-300">{parseInt(item.DONGIA * item.SOLUONG).toLocaleString('vi-VN')} đ</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-4 justify-center">
                        <button
                            onClick={() => navigate('/')}
                            className="px-8 py-3 bg-gradient-to-r from-[#00E5FF] to-[#00D4F7] hover:from-[#00cce6] hover:to-[#00B8D4] text-black font-bold rounded-lg transition transform hover:scale-105 shadow-[0_0_15px_rgba(0,229,255,0.4)]"
                        >
                            ← Quay Lại
                        </button>
                        <button
                            onClick={() => {
                                localStorage.removeItem('token');
                                localStorage.removeItem('user');
                                navigate('/login');
                            }}
                            className="px-8 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold rounded-lg transition transform hover:scale-105 shadow-[0_0_15px_rgba(239,68,68,0.4)]"
                        >
                            Đăng Xuất
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
