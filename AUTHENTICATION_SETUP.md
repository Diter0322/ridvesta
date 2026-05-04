# Authentication Flow Setup Guide - idvesta/ridvesta

## Overview
This guide explains the authentication flow implementation for your React application.

## Files Created/Modified

### 1. **API Configuration** (`src/config/api.js`)
- Global API base URL: `http://127.0.0.1:8000/api`
- Centralized endpoint management
- Easy to switch environments

```javascript
import { API_BASE_URL } from './config/api';
// Usage: const url = `${API_BASE_URL}/login`;
```

### 2. **Authentication Context** (`src/context/AuthContext.jsx`)
- Manages global authentication state
- Stores `accessToken` and `user` data
- Provides `login()` and `logout()` methods
- Persists authentication data in localStorage

```javascript
import { useAuth } from './context/AuthContext';

// In any component:
const { user, accessToken, loading, login, logout, isAuthenticated } = useAuth();
```

### 3. **Login Service** (`src/services/authService.js`)
- Handles API communication with backend
- Makes POST request to `/api/login?phone=PHONE&password=PASSWORD`
- Returns success/error response with access_token

### 4. **Protected Route Component** (`src/components/ProtectedRoute.jsx`)
- Wraps protected pages/routes
- Redirects unauthenticated users to `/login`
- Shows loading spinner while checking authentication

### 5. **Updated App.jsx**
- Wrapped entire app with `AuthProvider`
- All pages except `/login`, `/signup`, `/otp`, `/change-password` are protected
- Protected routes automatically redirect if not authenticated

### 6. **Updated Login.jsx**
- Integrated with authentication service
- Phone number and password inputs
- Error handling and validation
- Loading state during login
- Stores access_token on successful login
- Redirects to `/home` after successful login

## How It Works

### Login Flow
```
User enters phone & password
              ↓
Click Submit → loginUser() API call
              ↓
API returns access_token
              ↓
login() saves token + user to context & localStorage
              ↓
Redirect to /home
```

### Protected Routes Flow
```
User visits /home (protected route)
              ↓
ProtectedRoute checks isAuthenticated()
              ↓
If authenticated → Show page
If not authenticated → Redirect to /login
```

## Usage Examples

### In Login Page (Already Implemented)
```javascript
import { useAuth } from '../context/AuthContext';
import { loginUser } from '../services/authService';

const { login } = useAuth();
const result = await loginUser(phone, password);
if (result.success) {
  login(result.accessToken, result.user);
  navigate('/home');
}
```

### Getting User Info in Any Component
```javascript
import { useAuth } from '../context/AuthContext';

const MyComponent = () => {
  const { user, accessToken } = useAuth();
  
  return <div>{user?.phone}</div>;
};
```

### Logout in Any Component
```javascript
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const MyComponent = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  return <button onClick={handleLogout}>Logout</button>;
};
```

### Making Authenticated API Calls
```javascript
import { API_BASE_URL } from '../config/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('access_token');
  return {
    'Authorization': `Bearer ${token}`,
  };
};

const response = await fetch(
  `${API_BASE_URL}/some-endpoint`,
  {
    method: 'GET',
    headers: getAuthHeaders(),
  }
);
```

## Protected & Public Routes

### Public Routes (No Login Required)
- `/login` - Login page
- `/signup` - Sign up page
- `/otp` - OTP verification
- `/change-password` - Password reset

### Protected Routes (Login Required)
- `/home` - Dashboard
- `/profile` - User profile
- `/faq` - FAQ
- `/bank-data` - Bank information
- `/deposit-list` - Deposits
- `/team` - Team
- `/task` - Tasks
- `/withdraw-history` - Withdrawal history

## Storage

### localStorage Keys
- `access_token` - JWT/Bearer token from API
- `user` - User data (phone, name, etc.)

### Clearing Authentication
```javascript
localStorage.removeItem('access_token');
localStorage.removeItem('user');
```

## Testing

### Test Credentials
Use the phone and password to test:
- Phone: `8123456`
- Password: `123456`

The request will be made to: `http://127.0.0.1:8000/api/login?phone=8123456&password=123456`

## Next Steps

1. **Test the login flow** with your backend API
2. **Update API response handling** in `authService.js` if needed (based on your API structure)
3. **Add logout button** in Footer or Header using the logout example above
4. **Add token refresh** logic if token expires
5. **Add role-based access control** if needed

## Troubleshooting

### Pages Not Protected
- Check that route is wrapped with `<ProtectedRoute>`
- Verify `AuthProvider` is wrapping the entire app in App.jsx

### Login Not Working
- Check browser console for errors
- Verify backend is running at `http://127.0.0.1:8000`
- Check API endpoint and response format
- Open Developer Tools → Application → localStorage to see saved tokens

### Token Not Persisting
- Verify localStorage is not disabled
- Check browser's Application tab for stored tokens
- Clear localStorage and try again

---

**Created:** 2024
**Framework:** React 18.2.0 + React Router 6.14.0
