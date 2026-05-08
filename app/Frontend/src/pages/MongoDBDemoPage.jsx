import { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';

const MongoDBDemoPage = () => {
    // State quản lý booking
    const [bookingId] = useState(`demo_${Date.now()}`);
    const [booking, setBooking] = useState(null);
    const [currentVersion, setCurrentVersion] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState(''); // 'success', 'error', 'info'

    // Input để modify booking
    const [newSeats, setNewSeats] = useState('');
    const [newPrice, setNewPrice] = useState('');

    // History của operations
    const [history, setHistory] = useState([]);

    /**
     * 📖 STEP 1: Get booking từ MongoDB (lấy version)
     */
    const handleGetBooking = async () => {
        setLoading(true);
        try {
            // First, init booking nếu chưa tồn tại
            try {
                await axiosClient.post('/mongo/booking/init', {
                    bookingId,
                    tenPhim: 'Avatar: The Way of Water',
                    gheDaDat: ['A1', 'A2'],
                    tongtien: 400000
                });
                addHistory('✅ Khởi tạo booking mới trên MongoDB');
            } catch (e) {
                // Booking có thể đã tồn tại
            }

            // Get booking + version
            const res = await axiosClient.get('/mongo/booking', {
                params: { bookingId }
            });

            setBooking(res.data.meta);
            setCurrentVersion(res.data.meta.__v);
            setNewSeats(res.data.meta.gheDaDat.join(', '));
            setNewPrice(res.data.meta.tongtien);

            setMessage(`✅ Lấy booking thành công! (Version: ${res.data.meta.__v})`);
            setMessageType('success');
            addHistory(`📖 GET: Booking lấy version ${res.data.meta.__v}`);
        } catch (error) {
            setMessage(`❌ ${error.response?.data?.message || error.message}`);
            setMessageType('error');
            addHistory(`❌ GET FAILED: ${error.response?.data?.message}`);
        }
        setLoading(false);
    };

    /**
     * ✏️ STEP 2: Update booking (với Optimistic Lock)
     */
    const handleUpdateBooking = async () => {
        if (!currentVersion && currentVersion !== 0) {
            setMessage('⚠️ Vui lòng lấy booking trước!');
            setMessageType('info');
            return;
        }

        setLoading(true);
        try {
            const res = await axiosClient.post('/mongo/booking/update', {
                bookingId,
                gheDaDat: newSeats.split(',').map(s => s.trim()),
                tongtien: parseInt(newPrice),
                __v: currentVersion  // 🔑 Gửi version cũ
            });

            setBooking(res.data.meta);
            setCurrentVersion(res.data.meta.__v);
            setMessage(
                `✅ Update thành công!\n🔄 Version: ${currentVersion} → ${res.data.meta.__v}`
            );
            setMessageType('success');
            addHistory(
                `✏️ UPDATE: SUCCESS (v${currentVersion} → v${res.data.meta.__v})`
            );
        } catch (error) {
            if (error.response?.status === 409) {
                // Conflict!
                const currentData = error.response.data.meta;
                setMessage(
                    `⚠️ CONFLICT! Booking đã bị sửa bởi người khác!\n\n` +
                    `Bạn cầm: Version ${currentVersion}\n` +
                    `Database có: Version ${currentData.currentVersion}\n\n` +
                    `💡 Hãy nhấn "Lấy Booking" lại để cập nhật!`
                );
                setMessageType('error');
                addHistory(
                    `❌ UPDATE CONFLICT: v${currentVersion} vs DB v${currentData.currentVersion}`
                );
            } else {
                setMessage(`❌ ${error.response?.data?.message || error.message}`);
                setMessageType('error');
                addHistory(`❌ UPDATE FAILED: ${error.response?.data?.message}`);
            }
        }
        setLoading(false);
    };

    /**
     * 🔄 Reset demo
     */
    const handleReset = () => {
        setBooking(null);
        setCurrentVersion(null);
        setNewSeats('');
        setNewPrice('');
        setMessage('');
        setHistory([]);
        setMessageType('');
    };

    /**
     * Add event to history
     */
    const addHistory = (event) => {
        setHistory(prev => [...prev, {
            id: Date.now(),
            time: new Date().toLocaleTimeString('vi-VN'),
            event
        }]);
    };

    /**
     * Get demo info từ API
     */
    const [demoInfo, setDemoInfo] = useState(null);
    useEffect(() => {
        axiosClient.get('/mongo/booking/demo-info')
            .then(res => setDemoInfo(res.data.meta))
            .catch(err => console.error('Failed to fetch demo info:', err));
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 pt-24 pb-10 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-2">
                        🍃 MongoDB Demo
                    </h1>
                    <p className="text-gray-300 text-lg">
                        Optimistic Concurrency Control - Không khóa, chỉ kiểm tra lúc ghi
                    </p>
                </div>

                {/* Main Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left: Demo Controls */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Booking Info Card */}
                        <div className="bg-gray-800 border-2 border-purple-500 rounded-xl p-6">
                            <h2 className="text-2xl font-bold text-purple-300 mb-4">📋 Booking Info</h2>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-gray-400 text-sm">Booking ID</p>
                                    <p className="text-white font-mono text-lg break-all">{bookingId}</p>
                                </div>

                                {booking && (
                                    <>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-gray-400 text-sm">Phim</p>
                                                <p className="text-white font-bold">{booking.tenPhim}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-400 text-sm">🔄 Version</p>
                                                <p className="text-yellow-300 font-bold text-xl">{booking.__v}</p>
                                            </div>
                                        </div>
                                        <div className="bg-gray-900 p-3 rounded-lg border border-gray-700">
                                            <p className="text-gray-400 text-sm">Ghế hiện tại</p>
                                            <p className="text-cyan-300 font-mono">
                                                {booking.gheDaDat?.join(', ') || 'Chưa chọn'}
                                            </p>
                                        </div>
                                        <div className="bg-gray-900 p-3 rounded-lg border border-gray-700">
                                            <p className="text-gray-400 text-sm">Giá hiện tại</p>
                                            <p className="text-green-300 font-bold text-lg">
                                                {booking.tongtien?.toLocaleString('vi-VN')} VNĐ
                                            </p>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Modify Form */}
                        <div className="bg-gray-800 border-2 border-pink-500 rounded-xl p-6">
                            <h2 className="text-2xl font-bold text-pink-300 mb-4">✏️ Chỉnh Sửa Booking</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-gray-300 block mb-2">Ghế (cách nhau bằng dấu phẩy)</label>
                                    <input
                                        type="text"
                                        value={newSeats}
                                        onChange={(e) => setNewSeats(e.target.value)}
                                        placeholder="A1, A2, A3"
                                        className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-pink-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="text-gray-300 block mb-2">Giá tiền (VNĐ)</label>
                                    <input
                                        type="number"
                                        value={newPrice}
                                        onChange={(e) => setNewPrice(e.target.value)}
                                        placeholder="400000"
                                        className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-pink-500 outline-none"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="grid grid-cols-3 gap-4">
                            <button
                                onClick={handleGetBooking}
                                disabled={loading}
                                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 text-white font-bold py-3 px-4 rounded-lg transition transform hover:scale-105"
                            >
                                📖 Lấy Booking
                            </button>
                            <button
                                onClick={handleUpdateBooking}
                                disabled={loading || !currentVersion}
                                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:opacity-50 text-white font-bold py-3 px-4 rounded-lg transition transform hover:scale-105"
                            >
                                ✅ Update
                            </button>
                            <button
                                onClick={handleReset}
                                disabled={loading}
                                className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-bold py-3 px-4 rounded-lg transition transform hover:scale-105"
                            >
                                🔄 Reset
                            </button>
                        </div>

                        {/* Message Alert */}
                        {message && (
                            <div className={`rounded-lg p-4 border-2 whitespace-pre-wrap ${
                                messageType === 'success' ? 'bg-green-900/30 border-green-500 text-green-200' :
                                messageType === 'error' ? 'bg-red-900/30 border-red-500 text-red-200' :
                                'bg-blue-900/30 border-blue-500 text-blue-200'
                            }`}>
                                {message}
                            </div>
                        )}

                        {/* Version Warning */}
                        {currentVersion !== null && (
                            <div className="bg-purple-900/50 border-2 border-purple-500 rounded-lg p-4">
                                <p className="text-purple-200">
                                    <strong>💾 Bạn đang cầm Version {currentVersion}</strong>
                                </p>
                                <p className="text-purple-300 text-sm mt-1">
                                    💡 Mở tab khác và sửa booking để thấy CONFLICT khi cập nhật!
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Right: Info & History */}
                    <div className="space-y-6">
                        {/* Demo Info */}
                        <div className="bg-gray-800 border-2 border-yellow-500 rounded-xl p-6 max-h-96 overflow-y-auto">
                            <h3 className="text-xl font-bold text-yellow-300 mb-3">📚 Cơ Chế</h3>
                            {demoInfo ? (
                                <div className="space-y-3 text-sm">
                                    <div>
                                        <p className="text-gray-400 font-semibold mb-1">Bước:</p>
                                        {demoInfo.steps.map((step, i) => (
                                            <p key={i} className="text-gray-300 text-xs mb-1 font-mono">{step}</p>
                                        ))}
                                    </div>
                                    <div className="border-t border-gray-700 pt-3">
                                        <p className="text-gray-400 font-semibold mb-1">✅ Ưu điểm:</p>
                                        {demoInfo.advantages.map((adv, i) => (
                                            <p key={i} className="text-gray-300 text-xs mb-1">{adv}</p>
                                        ))}
                                    </div>
                                    <div className="border-t border-gray-700 pt-3">
                                        <p className="text-gray-400 font-semibold mb-1">⚠️ Nhược điểm:</p>
                                        {demoInfo.disadvantages.map((dis, i) => (
                                            <p key={i} className="text-gray-300 text-xs mb-1">{dis}</p>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <p className="text-gray-400">Loading...</p>
                            )}
                        </div>

                        {/* History */}
                        <div className="bg-gray-800 border-2 border-cyan-500 rounded-xl p-6 max-h-96 overflow-y-auto">
                            <h3 className="text-xl font-bold text-cyan-300 mb-3">📝 Lịch Sử</h3>
                            {history.length === 0 ? (
                                <p className="text-gray-400 text-sm">Chưa có hoạt động nào</p>
                            ) : (
                                <div className="space-y-2">
                                    {history.map(item => (
                                        <div key={item.id} className="bg-gray-900 rounded p-2 border-l-2 border-cyan-500">
                                            <p className="text-cyan-400 text-xs font-mono">{item.time}</p>
                                            <p className="text-gray-300 text-xs">{item.event}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* How to Test */}
                        <div className="bg-purple-900/30 border-2 border-purple-400 rounded-xl p-4">
                            <h4 className="font-bold text-purple-300 mb-2">🧪 Cách Test Conflict:</h4>
                            <ol className="text-sm text-purple-200 space-y-1 list-decimal list-inside">
                                <li>Nhấn "Lấy Booking"</li>
                                <li>Mở tab 2 (Ctrl+T)</li>
                                <li>Vào trang này ở tab 2</li>
                                <li>Cả 2 tab: nhấn "Lấy Booking"</li>
                                <li>Tab 1: sửa ghế → nhấn "Update" → ✅ Success</li>
                                <li>Tab 2: sửa ghế → nhấn "Update" → ❌ CONFLICT!</li>
                            </ol>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MongoDBDemoPage;
