import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Profile from './pages/Profile';
import FAQ from './pages/FAQ';
import BankData from './pages/BankData';
import DepositList from './pages/DepositList';
import Team from './pages/Team';
import Task from './pages/Task';
import WithdrawHistory from './pages/WithdrawHistory';
import OTP from './pages/OTP';
import ChangePassword from './pages/ChangePassword';
import ReferralDetails from './pages/ReferralDetails';
import CustomerService from './pages/CustomerService';
import About from './pages/About';
import Deposit from './pages/Deposit';
import DepositBank from './pages/DepositBank';
import DepositQris from './pages/DepositQris';
import Withdraw from './pages/Withdraw';
import TransactionHistory from './pages/TransactionHistory';
import RedeemCode from './pages/RedeemCode';
import './styles/index.css';

// Wrapper for pages with footer navigation
const PageWithFooter = ({ children }) => (
  <>{children}<Footer /></>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes - No authentication required */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/register/:referralCode" element={<Register />} />
          <Route path="/otp" element={<OTP />} />
          <Route path="/change-password" element={<ChangePassword />} />

          {/* Protected Routes - Authentication required */}
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <PageWithFooter><Home /></PageWithFooter>
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <PageWithFooter><Profile /></PageWithFooter>
              </ProtectedRoute>
            }
          />
          <Route
            path="/faq"
            element={
              <ProtectedRoute>
                <PageWithFooter><FAQ /></PageWithFooter>
              </ProtectedRoute>
            }
          />
          <Route
            path="/bank-data"
            element={
              <ProtectedRoute>
                <PageWithFooter><BankData /></PageWithFooter>
              </ProtectedRoute>
            }
          />
          <Route
            path="/deposit-list"
            element={
              <ProtectedRoute>
                <PageWithFooter><DepositList /></PageWithFooter>
              </ProtectedRoute>
            }
          />
          <Route
            path="/team"
            element={
              <ProtectedRoute>
                <PageWithFooter><Team /></PageWithFooter>
              </ProtectedRoute>
            }
          />
          <Route
            path="/task"
            element={
              <ProtectedRoute>
                <PageWithFooter><Task /></PageWithFooter>
              </ProtectedRoute>
            }
          />
          <Route
            path="/withdraw-history"
            element={
              <ProtectedRoute>
                <PageWithFooter><WithdrawHistory /></PageWithFooter>
              </ProtectedRoute>
            }
          />

          <Route
            path="/about"
            element={
              <ProtectedRoute>
                <About />
              </ProtectedRoute>
            }
          />

          <Route
            path="/customer-service"
            element={
              <ProtectedRoute>
                <CustomerService />
              </ProtectedRoute>
            }
          />

          <Route
            path="/referral-details/:level"
            element={
              <ProtectedRoute>
                <ReferralDetails />
              </ProtectedRoute>
            }
          />

          <Route
            path="/deposit"
            element={
              <ProtectedRoute>
                <Deposit />
              </ProtectedRoute>
            }
          />
          <Route
            path="/deposit/bank"
            element={
              <ProtectedRoute>
                <DepositBank />
              </ProtectedRoute>
            }
          />
          <Route
            path="/deposit/qris"
            element={
              <ProtectedRoute>
                <DepositQris />
              </ProtectedRoute>
            }
          />
          <Route
            path="/withdraw"
            element={
              <ProtectedRoute>
                <Withdraw />
              </ProtectedRoute>
            }
          />
          <Route
            path="/transaction-history"
            element={
              <ProtectedRoute>
                <TransactionHistory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/redeem-code"
            element={
              <ProtectedRoute>
                <RedeemCode />
              </ProtectedRoute>
            }
          />

          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
