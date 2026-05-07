import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import MovieDetail from './pages/MovieDetail';
import BookingPage from './pages/BookingPage';
import PaymentPage from './pages/PaymentPage';
import LoginPage from './pages/LoginPage';
import Navbar from './components/Navbar';
import AdminPage from './pages/AdminPage';
import SearchPage from './pages/SearchPage';
import ProfilePage from './pages/ProfilePage';
import RevenueReportPage from './pages/RevenueReportPage';
import ProtectedAdminRoute from './components/ProtectedAdminRoute';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-900 text-white">
        <Navbar />
        <div className="container mx-auto p-4">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/movie/:id" element={<MovieDetail />} />
            <Route path="/booking/:id" element={<BookingPage />} />
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/admin" element={<ProtectedAdminRoute element={<AdminPage />} />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/revenue-report" element={<ProtectedAdminRoute element={<RevenueReportPage />} />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;