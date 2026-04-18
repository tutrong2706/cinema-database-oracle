import { Navigate } from 'react-router-dom';

/**
 * Protected route component - Chỉ cho phép Admin access
 * @param {React.Component} element - Component to render if authorized
 * @returns {React.Component|Navigate}
 */
const ProtectedAdminRoute = ({ element }) => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    // Check if user is authenticated and is Admin
    if (!token || user.vaiTro !== 'Admin') {
        // Redirect to login if not authenticated or not admin
        return <Navigate to="/login" replace />;
    }
    
    // Return the protected component
    return element;
};

export default ProtectedAdminRoute;
