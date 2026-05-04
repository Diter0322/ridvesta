import { useAuth } from '../context/AuthContext';

/**
 * Custom hook to handle user logout
 * Can be used in any component that needs logout functionality
 */
export const useLogout = () => {
  const { logout } = useAuth();
  const navigate = require('react-router-dom').useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return handleLogout;
};

/**
 * Helper to get authorization headers with access token
 * Use this when making API calls that require authentication
 */
export const getAuthHeaders = () => {
  const token = localStorage.getItem('access_token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
};
