import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { loginUser } from '../services/authService';
import '../styles/form.css';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validate input
      if (!phone || !password) {
        setError('Harap masukkan nomor telepon dan kata sandi');
        setLoading(false);
        return;
      }

      // Call login API
      const result = await loginUser(phone, password);

      if (result.success) {
        // Save token and user to context and localStorage
        login(result.accessToken, result.user);
        // Redirect to home page
        navigate('/home');
      } else {
        setError(result.error || 'Login gagal. Silakan coba lagi.');
      }
    } catch (err) {
      setError('Terjadi kesalahan. Silakan coba lagi.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="sign-up">
      <div className="text-center py-0">
        <img className="img-fluid d-block mx-auto" src="/images/homelogo.png" alt="logo" style={{ height: 125, width: 'auto', marginBottom: -20 }} />
        <span className="shiny-silver d-block">EMASHARIAN</span>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="box text-white">
          {error && (
            <div className="alert alert-danger alert-dismissible fade show" role="alert">
              {error}
              <button
                type="button"
                className="btn-close btn-close-white"
                onClick={() => setError('')}
              ></button>
            </div>
          )}
          <h5 className="fw-bold text-center mb-3" style={{ marginTop: -15 }}>Login Pengguna</h5>
          <hr></hr>
          <div className="mt-4 relative">
            <img src="/images/icon/email.svg" alt="" className="email mt-3" />
            <label>Masukkan nomor telepon Anda</label>
            <input
              type="text"
              placeholder="Nomor telepon (cth: 8123456)"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={loading}
            />
          </div>
          <div className="mt-2 relative">
            <img src="/images/icon/lock.svg" alt="" className="lock mt-3" />
            <label>Masukkan kata sandi Anda</label>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="*******"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
            <button
              type="button"
              className="show-pass btn-trans"
              onClick={() => setShowPassword(!showPassword)}
              disabled={loading}
            >
              <i className={`mt-4 pt-3 fa-regular fa-eye${showPassword ? '' : '-slash'}`}></i>
            </button>
          </div>
          
          <div className="mt-4">
            <button
              type="submit"
              className="login-btn1 text-center"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Loading...
                </>
              ) : (
                'Masuk'
              )}
            </button>
          </div>
        </div>
      </form>
      <div className="d-flex gap-3 text-white">
        <hr className="hr-one" />
        <span className="fw-lighter text-14 text-lightgrey fst-italic">Emasharian.com berlisensi oleh :</span>
        <hr className="hr-two" />
      </div>
      <div className="text-center">
        <img src="/images/OJK_Logo.png" style={{ maxHeight: 50 }} alt="" />
        {/* <img className="ms-4" src="/images/brand2.png" alt="" /> */}
      </div>

      <p className="text-white text-14 text-center mt-4">
        Belum punya akun? <a className="text-blue fs-6" href="#" onClick={(e) => { e.preventDefault(); navigate('/register'); }}>Buat akun</a>
      </p>
    </main>
  );
};

export default Login;
