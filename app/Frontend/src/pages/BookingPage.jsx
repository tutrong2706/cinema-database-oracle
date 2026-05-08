import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';

const BookingPage = () => {
    const { id: MaPhim } = useParams();
    const navigate = useNavigate();

    // State cho các bước chọn
    const [raps, setRaps] = useState([]);
    const [selectedRap, setSelectedRap] = useState('');
    // Đảm bảo NgayChieu là chuỗi YYYY-MM-DD
    const [ngayChieu, setNgayChieu] = useState(''); 
    const [suatChieus, setSuatChieus] = useState([]);
    const [selectedSuat, setSelectedSuat] = useState(null);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [combos, setCombos] = useState([]);
    const [selectedCombos, setSelectedCombos] = useState({}); // { MaHang: quantity }
    const [bookedSeats, setBookedSeats] = useState([]);

    // 1. Load danh sách rạp để chọn
    useEffect(() => {
        axiosClient.get('/auth/raps').then(res => setRaps(res.data.meta));
        axiosClient.get('/auth/combos').then(res => setCombos(res.data.meta || []));
        handleFindSuatChieu(); // Tự động tìm suất chiếu khi vào trang
    }, []);

    // Khi ngày chiếu thay đổi cũng tự tìm lại
    useEffect(() => {
        handleFindSuatChieu();
    }, [ngayChieu]);

    // Fetch ghế đã đặt khi chọn suất chiếu
    useEffect(() => {
        if (selectedSuat) {
            // SỬA API ENDPOINT TẠI ĐÂY:
            // Gọi đúng API lấy ghế ĐÃ ĐẶT CỦA 1 SUẤT CHIẾU CỤ THỂ
            // (Lưu ý: Thay /auth/suat-chieus bằng tiền tố route thực tế trong file route của bạn nếu khác)
            axiosClient.get(`/auth/suat-chieus/${selectedSuat.MASUATCHIEU}/booked-seats`)
                .then(res => setBookedSeats(res.data.meta || res.data.data || []))
                .catch(err => console.error('Lỗi tải ghế đã đặt:', err));
        } else {
            setBookedSeats([]);
        }
    }, [selectedSuat]);

    // 2. Tìm suất chiếu khi chọn Rạp + Ngày
    const handleFindSuatChieu = () => {
        // Reset Suất và Ghế khi tìm kiếm suất mới
        setSelectedSuat(null);
        setSelectedSeats([]);

        const params = { MaPhim };
        if (selectedRap) params.MaRapPhim = selectedRap;
        if (ngayChieu) params.NgayChieu = ngayChieu;

        axiosClient.get('/auth/suat-chieus', { params })
        .then(res => {
            if (res.data.meta && res.data.meta.length > 0) {
                setSuatChieus(res.data.meta);
            } else {
                setSuatChieus([]);
            }
        })
        .catch(error => {
            console.error(error);
            setSuatChieus([]);
        });
    };

    // 3. Xử lý chọn ghế (Giả lập sơ đồ ghế 5 hàng x 8 ghế)
    const rows = ['A', 'B', 'C', 'D', 'E'];
    const seatsPerRow = 8;

    const toggleSeat = (row, num) => {
        const seatId = `${row}${num}`;
        const isSelected = selectedSeats.some(s => s.HangGhe === row && s.SoGhe === num);
        
        if (isSelected) {
            setSelectedSeats(selectedSeats.filter(s => !(s.HangGhe === row && s.SoGhe === num)));
        } else {
            // Giới hạn số lượng ghế có thể chọn (ví dụ: tối đa 8 ghế)
            if (selectedSeats.length >= 8) return alert("Chỉ có thể chọn tối đa 8 ghế cho một lần đặt!");
            setSelectedSeats([...selectedSeats, { HangGhe: row, SoGhe: num }]);
        }
    };

    const handleComboChange = (maHang, delta) => {
        setSelectedCombos(prev => {
            const currentQty = prev[maHang] || 0;
            const newQty = Math.max(0, currentQty + delta);
            if (newQty === 0) {
                const { [maHang]: _, ...rest } = prev;
                return rest;
            }
            return { ...prev, [maHang]: newQty };
        });
    };

    const calculateTotal = () => {
        const ticketTotal = selectedSeats.length * (selectedSuat?.GIAVECOBAN || 0);
        const comboTotal = Object.entries(selectedCombos).reduce((sum, [maHang, qty]) => {
            const combo = combos.find(c => c.MAHANG === maHang);
            return sum + (combo ? Number(combo.DONGIA) * qty : 0);
        }, 0);
        return ticketTotal + comboTotal;
    };

    // 4. Chuyển sang trang thanh toán
    const handleConfirm = () => {
        if (!selectedSuat) return alert("Vui lòng chọn suất chiếu!");
        if (selectedSeats.length === 0) return alert("Vui lòng chọn ít nhất một ghế!");
        
        // Lưu tạm vào localStorage để trang Payment lấy ra dùng
        const bookingData = {
            suatChieu: selectedSuat,
            seats: selectedSeats.sort((a, b) => a.HangGhe.localeCompare(b.HangGhe) || a.SoGhe - b.SoGhe),
            combos: Object.entries(selectedCombos).map(([maHang, qty]) => ({
                ...combos.find(c => c.MAHANG === maHang),
                SoLuong: qty
            })),
            totalPrice: calculateTotal()
        };
        localStorage.setItem('bookingTemp', JSON.stringify(bookingData));
        navigate('/payment');
    };

    // MongoDB Booking - Demo Optimistic Concurrency Control
    const handleMongoBooking = async () => {
        if (!selectedSuat) return alert("Vui lòng chọn suất chiếu!");
        if (selectedSeats.length === 0) return alert("Vui lòng chọn ít nhất một ghế!");

        try {
            const bookingId = `booking_${Date.now()}`;
            const totalPrice = calculateTotal();
            const seatList = selectedSeats.map(s => `${s.HangGhe}${s.SoGhe}`).join(', ');

            // 1. Khởi tạo booking trên MongoDB
            const initRes = await axiosClient.post('/mongo/booking/init', {
                bookingId,
                tenPhim: selectedSuat?.TENPHIM || 'Unknown',
                gheDaDat: selectedSeats.sort((a, b) => a.HangGhe.localeCompare(b.HangGhe) || a.SoGhe - b.SoGhe),
                tongtien: totalPrice
            });

            if (initRes.status !== 201) {
                alert('Lỗi tạo booking trên MongoDB');
                return;
            }

            alert(`✅ Booking tạo thành công! (MongoDB)\n\nID: ${bookingId}\nGhế: ${seatList}\nTổng tiền: ${totalPrice.toLocaleString('vi-VN')} VNĐ\n\nVersion: ${initRes.data.meta.__v}`);

            // Có thể chuyển đến trang thanh toán hoặc hiển thị thêm thông tin
            // navigate('/payment');
        } catch (error) {
            alert(`❌ Lỗi MongoDB: ${error.response?.data?.message || error.message}`);
        }
    };

    return (
        <div className="max-w-5xl mx-auto pt-24 pb-10 px-4">
            <h2 className="text-3xl font-extrabold mb-8 text-center text-[#00E5FF] border-b border-gray-700 pb-3">ĐẶT VÉ XEM PHIM</h2>

            {/* Bước 1: Chọn Rạp & Ngày */}
            <div className="!bg-gray-900 p-6 rounded-xl shadow-lg border border-gray-800 mb-8 flex flex-col md:flex-row gap-4 items-center">
                <label className="text-gray-300 font-semibold md:w-1/4">Chọn Rạp/Ngày:</label>
                <select 
                    className="!bg-gray-800 p-3 rounded-lg flex-1 border border-gray-700 text-white focus:border-[#00E5FF] outline-none"
                    onChange={(e) => setSelectedRap(e.target.value)}
                    value={selectedRap}
                >
                    <option value="" className="bg-gray-900">-- Chọn Rạp --</option>
                    {raps.map(r => <option key={r.MARAPHIM} value={r.MARAPHIM} className="!bg-gray-900">{r.TEN}</option>)}
                </select>
                <input 
                    type="date" 
                    className="!bg-gray-800 p-3 rounded-lg border border-gray-700 text-white focus:border-[#00E5FF] outline-none md:w-auto"
                    value={ngayChieu}
                    onChange={(e) => setNgayChieu(e.target.value)}
                />
                <button 
                    onClick={handleFindSuatChieu} 
                    className="!bg-blue-600 px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition md:w-auto w-full"
                >
                    Tìm Suất
                </button>
            </div>

            {/* Bước 2: Chọn Suất Chiếu */}
            {suatChieus.length > 0 && (
                <div className="mb-10 space-y-6">
                    {Object.entries(
                        suatChieus.reduce((acc, sc) => {
                            // Nhóm theo cả NGÀY và RẠP
                            const dateStr = sc.NGAYCHIEU ? new Date(sc.NGAYCHIEU).toLocaleDateString('vi-VN') : "";
                            const tenRap = sc.TENRAP || "Rạp";
                            const groupKey = `📅 ${dateStr} - 🏢 ${tenRap}`; // Gộp thành 1 Key
                            
                            if (!acc[groupKey]) acc[groupKey] = [];
                            acc[groupKey].push(sc);
                            return acc;
                        }, {})
                    ).map(([groupKey, listSuat]) => (
                        <div key={groupKey} className="!bg-gray-900 p-6 rounded-xl shadow-lg border border-gray-800">
                            <h3 className="text-xl font-bold mb-4 text-[#00E5FF] border-b border-gray-700 pb-2">
                                {groupKey}
                            </h3>
                            <div className="flex flex-wrap gap-4">
                                {/* ... (Đoạn button hiển thị giờ giữ nguyên như cũ) ... */}
                                {listSuat.map(sc => (
                                    <button
                                        key={sc.MASUATCHIEU}
                                        onClick={() => { setSelectedSuat(sc); setSelectedSeats([]); }}
                                        className={`px-5 py-2 rounded-lg font-semibold transition text-sm ${
                                            selectedSuat?.MASUATCHIEU === sc.MASUATCHIEU 
                                            ? '!bg-green-600 text-white shadow-md shadow-green-600/40 border-green-600' 
                                            : '!bg-gray-800 border border-gray-700 hover:bg-gray-700 text-gray-300'
                                        }`}
                                    >
                                        {sc.GIOBATDAU 
                                            ? new Date(sc.GIOBATDAU).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) 
                                            : 'N/A'} 
                                        - {sc.TENPHONG || 'Phòng'}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Bước 3: Chọn Ghế (Chỉ hiện khi đã chọn suất) */}
            {selectedSuat && (
                <div className="!bg-gray-900 p-8 rounded-xl text-center shadow-2xl border border-gray-800">
                    <h3 className="text-xl font-bold mb-6 text-white">Sơ Đồ Ghế Ngồi: {selectedSuat.TENPHONG}</h3>

                    {/* Màn Hình */}
                    <div className="w-full !bg-gray-700/50 text-gray-400 py-2 mb-10 rounded-t-xl border-b-4 border-gray-500 font-bold uppercase tracking-wider">
                        MÀN HÌNH
                    </div>
                    
                    {/* Sơ đồ Ghế */}
                    <div className="flex flex-col gap-3 items-center">
                        {rows.map(row => (
                            <div key={row} className="flex gap-2 items-center">
                                <span className="w-6 text-left text-sm font-bold text-gray-400">{row}</span>
                                {Array.from({ length: seatsPerRow }).map((_, i) => {
                                    const num = i + 1;
                                    const isSelected = selectedSeats.some(s => s.HangGhe === row && s.SoGhe === num);
                                    
                                    // Kiểm tra ghế đã bán từ API
                                    const bookedSeat = bookedSeats.find(s => 
                                        (s.HangGhe === row || s.HANGGHE === row) && 
                                        (s.SoGhe === num || s.SOGHE === num)
                                    );

                                    // Phân loại trạng thái ghế dựa vào dữ liệu Backend trả về
                                    const isPending = bookedSeat && (bookedSeat.TrangThai === 'Chờ thanh toán' || bookedSeat.TRANGTHAI === 'Chờ thanh toán');
                                    const isSold = bookedSeat && !isPending; // Những trạng thái còn lại (như Đã thanh toán)
                                    const isDisabled = !!bookedSeat; // Cả chờ và đã bán đều khóa không cho người khác click

                                    return (
                                        <button
                                            key={`${row}${num}`}
                                            onClick={() => !isDisabled && toggleSeat(row, num)}
                                            disabled={isDisabled}
                                            className={`w-10 h-10 rounded-md text-sm font-bold border ${
                                                isSold ? '!bg-gray-600 text-gray-400 cursor-not-allowed border-gray-500' // Đã bán -> Đen
                                                : isPending ? '!bg-yellow-500 text-white cursor-not-allowed border-yellow-600' // Chờ thanh toán -> Vàng
                                                : isSelected ? '!bg-red-600 text-white border-red-700 hover:bg-red-700 shadow-md shadow-red-600/40' // Đang chọn -> Đỏ
                                                : '!bg-gray-300 text-black border-gray-400 hover:bg-gray-200' // Trống -> Trắng
                                            } transition duration-150`}
                                        >
                                            {num}
                                        </button>
                                    );
                                })}
                                <span className="w-6 text-right text-sm font-bold text-gray-400">{row}</span>
                            </div>
                        ))} 
                    </div>

                    {/* Chú thích */}
                    <div className="flex justify-center gap-8 mt-8 text-sm">
                    <div className="flex items-center gap-2"><span className="w-4 h-4 rounded-sm bg-gray-300 border"></span> Ghế trống</div>
                    <div className="flex items-center gap-2"><span className="w-4 h-4 rounded-sm bg-red-600"></span> Đang chọn</div>
                    <div className="flex items-center gap-2"><span className="w-4 h-4 rounded-sm bg-yellow-500"></span> Chờ thanh toán</div>
                    <div className="flex items-center gap-2"><span className="w-4 h-4 rounded-sm bg-gray-600"></span> Đã bán</div>
                </div>

                    {/* Bước 4: Chọn Combo */}
                    <div className="mt-8 border-t border-gray-700 pt-6">
                        <h3 className="text-xl font-bold mb-4 text-white text-left">🍿 Chọn Combo Bắp Nước</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {combos.map(combo => (
                                <div key={combo.MAHANG} className="!bg-gray-800 p-4 rounded-lg flex justify-between items-center border border-gray-700">
                                    <div className="text-left">
                                        <p className="font-bold text-white">{combo.TENHANG}</p>
                                        <p className="text-sm text-gray-400">{combo.MOTA}</p>
                                        <p className="text-[#00E5FF] font-bold mt-1">{Number(combo.DONGIA).toLocaleString('vi-VN')} VNĐ</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <button 
                                            onClick={() => handleComboChange(combo.MAHANG, -1)}
                                            className="w-8 h-8 rounded-full !bg-gray-700 text-white hover:bg-gray-600 flex items-center justify-center font-bold"
                                        >-</button>
                                        <span className="text-white font-bold w-6 text-center">{selectedCombos[combo.MAHANG] || 0}</span>
                                        <button 
                                            onClick={() => handleComboChange(combo.MAHANG, 1)}
                                            className="w-8 h-8 rounded-full !bg-[#00E5FF] text-black hover:!bg-[#00cce6] flex items-center justify-center font-bold"
                                        >+</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Tóm tắt & Thanh toán */}
                    <div className="mt-10 border-t border-gray-700 pt-6 flex flex-col sm:flex-row justify-between items-center">
                        <div className="text-left mb-4 sm:mb-0">
                            <p className="text-gray-300 text-sm">Ghế chọn: <span className="font-bold text-white">{selectedSeats.map(s => `${s.HangGhe || s.HANGGHE}${s.SoGhe || s.SOGHE}`).join(', ') || "Chưa chọn"}</span></p>
                            <p className="text-xl font-extrabold text-[#00E5FF] mt-1">
                                Tổng tiền: <span className="text-yellow-400">{calculateTotal().toLocaleString('vi-VN')} VNĐ</span>
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                                Giá vé cơ bản: {(selectedSuat?.GIAVECOBAN || 0).toLocaleString('vi-VN')} VNĐ/ghế
                            </p>
                        </div>
                        <div className="flex gap-4">
                            <button 
                                onClick={handleConfirm}
                                disabled={selectedSeats.length === 0}
                                className={`px-10 py-3 rounded-xl font-bold transition transform text-lg flex-1 ${
                                    selectedSeats.length > 0 
                                    ? 'bg-gradient-to-r from-[#00E5FF] to-[#00D4F7] hover:from-[#00cce6] hover:to-[#00B8D4] !text-black hover:scale-105 shadow-[0_0_25px_rgba(0,229,255,0.6)] border-2 border-[#00E5FF]/30'
                                    : '!bg-gray-700 !text-gray-500 cursor-not-allowed opacity-60'
                                }`}
                            >
                                TIẾP TỤC THANH TOÁN
                            </button>
                            <button 
                                onClick={handleMongoBooking}
                                disabled={selectedSeats.length === 0}
                                className={`px-10 py-3 rounded-xl font-bold transition transform text-lg flex-1 ${
                                    selectedSeats.length > 0 
                                    ? 'bg-gradient-to-r from-[#9C27B0] to-[#7B1FA2] hover:from-[#7B1FA2] hover:to-[#6A1B9A] !text-white hover:scale-105 shadow-[0_0_25px_rgba(156,39,176,0.6)] border-2 border-[#9C27B0]/30'
                                    : '!bg-gray-700 !text-gray-500 cursor-not-allowed opacity-60'
                                }`}
                                title="Demo Optimistic Concurrency Control"
                            >
                                🍃 MONGODB BOOKING
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BookingPage;