import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signupUser } from '../services/authService';
import '../styles/form.css';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullname: '',
    phone: '',
    password: '',
    password_confirmation: '',
    securityCode: '',
    agreeTerms: false,
    ref_id: 0
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState({ show: false, message: '' });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.fullname || !formData.phone || !formData.password) {
      setError('Harap isi semua kolom yang wajib diisi');
      return;
    }

    // Validate fullname format (letters and spaces only, max 35 chars)
    const fullnameRegex = /^[a-zA-Z\s]+$/;
    if (!fullnameRegex.test(formData.fullname)) {
      setError('Nama lengkap hanya boleh berisi huruf dan spasi');
      return;
    }

    if (formData.fullname.length > 35) {
      setError('Nama lengkap tidak boleh lebih dari 35 karakter');
      return;
    }

    // Validate phone format (starts with 8, digits only, 8-15 chars)
    const phoneRegex = /^8\d+$/;
    if (!phoneRegex.test(formData.phone)) {
      setError('Nomor ponsel harus diawali dengan 8 dan hanya berisi angka');
      return;
    }

    if (formData.phone.length < 8 || formData.phone.length > 15) {
      setError('Nomor ponsel harus 8-15 digit');
      return;
    }

    // Validate passwords match
    if (formData.password !== formData.password_confirmation) {
      setError('Kata sandi tidak cocok');
      return;
    }

    // Validate password length
    if (formData.password.length < 6) {
      setError('Kata sandi minimal 6 karakter');
      return;
    }

    if (formData.password.length > 35) {
      setError('Kata sandi tidak boleh lebih dari 35 karakter');
      return;
    }

    // Validate ref_id is numeric
    if (isNaN(formData.ref_id)) {
      setError('Kode undangan harus berupa angka');
      return;
    }

    // Validate terms agreement
    if (!formData.agreeTerms) {
      setError('Anda harus menyetujui Syarat & Ketentuan');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Call signup API
      const refId = formData.ref_id === '' || formData.ref_id === '0' || formData.ref_id == 0 ? null : formData.ref_id;

      const result = await signupUser(
        formData.fullname,
        formData.phone,
        formData.password,
        formData.password_confirmation,
        refId
      );

      if (result.success) {
        setModal({ show: true, message: result.message || 'Akun berhasil dibuat! Silakan masuk.' });
      } else {
        setError(result.error || 'Pendaftaran gagal. Silakan coba lagi.');
      }
    } catch (err) {
      setError('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="sign-up">
      {/* Success Modal */}
      {modal.show && (
        <div
          onClick={() => setModal({ show: false, message: '' })}
          style={{
            position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#0d1b2e', border: '2px solid #2b8fff', borderRadius: '16px',
              padding: '32px 24px', maxWidth: '320px', width: '90%', textAlign: 'center',
              animation: 'modalPop 0.25s ease',
            }}
          >
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>âœ…</div>
            <p style={{ color: '#fff', fontWeight: 600, fontSize: '18px', marginBottom: '8px' }}>Berhasil</p>
            <p style={{ color: '#ffffffcc', fontSize: '14px', marginBottom: '24px' }}>{modal.message}</p>
            <button
              type="button"
              onClick={() => navigate('/login')}
              style={{
                background: 'linear-gradient(92.99deg, #2b8fff 14.34%, #56a6ff 22.07%, #3695ff 29.79%)',
                border: 'none', borderRadius: '10px', color: '#fff',
                padding: '12px 32px', fontSize: '15px', fontWeight: 600, cursor: 'pointer', width: '100%',
              }}
            >
              Masuk Sekarang
            </button>
          </div>
        </div>
      )}
      <style>{`@keyframes modalPop { from { transform: scale(0.85); opacity: 0; } to { transform: scale(1); opacity: 1; } }`}</style>
      <div className="text-center py-0">
        <img className="img-fluid d-block mx-auto" src="/images/homelogo.png" alt="logo" style={{ height: 125, width: 'auto', marginBottom: -20 }} />
        <span className="shiny-silver d-block">EMASHARIAN</span>
      </div>
      <form onSubmit={handleSignUp}>
        <div className="box text-white">
          <p className="fw-semibold mb-1 fs-3">Daftar</p>
          <p className="text-14 fw-medium">
            Hanya butuh satu menit untuk membuat akun Anda
          </p>
          
          {error && (
            <div className="alert alert-danger alert-dismissible fade show" role="alert" style={{ marginBottom: '15px' }}>
              {error}
              <button
                type="button"
                className="btn-close btn-close-white"
                onClick={() => setError('')}
              ></button>
            </div>
          )}

          <div className="mt-2">
            <label htmlFor="fullname">Masukkan nama lengkap Anda</label>
            <input
              type="text"
              id="fullname"
              name="fullname"
              placeholder="Nama Lengkap"
              value={formData.fullname}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>
          <div className="form-group relative">
            <label htmlFor="phone">Nomor telepon</label>
            <span className="fixed-number mt-4 pt-3">ID +62 |</span>
            <input
              className="number"
              type="text"
              id="phone"
              name="phone"
              placeholder="**************"
              value={formData.phone}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group relative">
            <img src="/images/icon/lock.svg" alt="" className="icon-lock mt-3" />
            <label htmlFor="password">Kata Sandi</label>
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              placeholder="*******"
              value={formData.password}
              onChange={handleChange}
              required
              minLength="6"
              maxLength="35"
              disabled={loading}
            />
            <button
              type="button"
              className="show-pass mt-3"
              onClick={() => setShowPassword(!showPassword)}
              disabled={loading}
            >
              <i className={`fa-regular fa-eye${showPassword ? '' : '-slash'}`}></i>
            </button>
          </div>

          <div className="form-group relative mt-2">
            <img src="/images/icon/lock.svg" alt="" className="icon-lock mt-3" />
            <label htmlFor="password_confirmation">Konfirmasi Kata Sandi</label>
            <input
              type={showPasswordConfirm ? 'text' : 'password'}
              id="password_confirmation"
              name="password_confirmation"
              placeholder="*******"
              value={formData.password_confirmation}
              onChange={handleChange}
              required
              minLength="6"
              maxLength="35"
              disabled={loading}
            />
            <button
              type="button"
              className="show-pass mt-3"
              onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
              disabled={loading}
            >
              <i className={`fa-regular fa-eye${showPasswordConfirm ? '' : '-slash'}`}></i>
            </button>
          </div>

          <div className="mt-2">
            <label htmlFor="ref_id">Kode Undangan</label>
            <input
              type="number"
              id="ref_id"
              name="ref_id"
              placeholder="Kode Undangan (opsional)"
              value={formData.ref_id}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div className="form-group my-2">
            <label>Pemeriksaan Keamanan</label>
            <div className="row g-2">
              <div className="col-5">
                <div className="security-box d-flex justify-content-between align-items-center">
                  <span className="text-blue">A 8</span>
                  <button type="button" className="btn-trans">
                    <img src="/images/btn/btn-refresh.svg" alt="Refresh" />
                  </button>
                </div>
              </div>
              <div className="col-5">
                  <input
                  type="text"
                  name="securityCode"
                  className="security-box"
                  placeholder="Jawaban"
                  disabled={loading}
                />
              </div>
            </div>
          </div>
          <div className="checkbox-group mt-2">
            <input
              type="checkbox"
              id="agree"
              name="agreeTerms"
              checked={formData.agreeTerms}
              onChange={handleChange}
              required
              disabled={loading}
            />
            <label htmlFor="agree" className="mb-0 ps-1 text-12">Saya menyetujui Syarat &amp; Ketentuan</label>
          </div>
          <div className="mt-4">
            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Mendaftar...
                </>
              ) : (
                'Daftar'
              )}
            </button>
          </div>
        </div>
      </form>

      {/* OR Divider */}
      <div className="d-flex gap-3 text-white my-4">
        <hr className="hr-one" />
        <span className="fw-medium text-14">Atau Lanjutkan Dengan</span>
        <hr className="hr-two" />
      </div>

      {/* Bottom badges */}
      <div className="text-center mb-4">
        <img src="/images/ojk.png" alt="OJK" className="me-2" />
        <img src="/images/brand2.png" alt="Brand" />
      </div>

      <p className="text-white text-14 text-center mt-4">
        Sudah punya akun? <a className="text-blue fw-bold" href="#login" onClick={() => navigate('/login')}>Masuk</a>
      </p>
    </main>
  );
};

export default Register;

