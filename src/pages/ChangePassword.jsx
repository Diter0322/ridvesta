import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useChangePassword } from '../hooks/useChangePassword';
import '../styles/form.css';

const ChangePassword = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [modal, setModal] = useState({ show: false, type: '', message: '' });
  const changePassword = useChangePassword();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      setModal({ show: true, type: 'error', message: 'Kata sandi baru dan konfirmasi kata sandi tidak cocok.' });
      return;
    }

    changePassword.mutate(
      {
        current_password: formData.currentPassword,
        new_password: formData.newPassword,
        confirm_password: formData.confirmPassword,
      },
      {
        onSuccess: (json) => {
          setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
          setModal({ show: true, type: 'success', message: json?.message || 'Kata sandi berhasil diubah.' });
        },
        onError: (err) => {
          const json = err?.response?.data;
          const msg = json?.errors ? json.errors.join(', ') : (json?.message || 'Gagal mengubah kata sandi.');
          setModal({ show: true, type: 'error', message: msg });
        },
      }
    );
  };

  const toggleShowPassword = (field) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  return (
    <main className="sign-up">
      {/* <div className="text-center mt-5">
        
        <h2 className="text-white fw-bold">Change Password</h2>
      </div> */}
      <div className="d-flex align-items-center pt-4 mb-4" style={{ width: '100%', padding: '0 16px' }}>
        <button className="btn-trans" onClick={() => navigate(-1)}>
          <img src="/images/btn-back.png" className="btn-back" alt="" />
        </button>
        <div className="text-center w-100">
          <p className="text-white fw-semibold fs-5 me-5 mb-0">Ubah Kata Sandi  </p>
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="form-box text-white">
          <div className="form-group relative">
            <img src="/images/icon/lock.svg" alt="" className="icon-lock mt-3 pt-1" />
            <label htmlFor="currentPassword">Kata Sandi Saat Ini</label>
            <input
              type={showPasswords.current ? 'text' : 'password'}
              id="currentPassword"
              name="currentPassword"
              placeholder="*******"
              value={formData.currentPassword}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              className="show-pass"
              onClick={() => toggleShowPassword('current')}
            >
              <i className={`mt-3 pt-4 fa-regular fa-eye${showPasswords.current ? '' : '-slash'}`}></i>
            </button>
          </div>
          <div className="form-group relative">
            <img src="/images/icon/lock.svg" alt="" className="icon-lock mt-3 pt-1" />
            <label htmlFor="newPassword">Kata Sandi Baru</label>
            <input
              type={showPasswords.new ? 'text' : 'password'}
              id="newPassword"
              name="newPassword"
              placeholder="*******"
              value={formData.newPassword}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              className="show-pass"
              onClick={() => toggleShowPassword('new')}
            >
              <i className={`mt-3 pt-4 fa-regular fa-eye${showPasswords.new ? '' : '-slash'}`}></i>
            </button>
          </div>
          <div className="form-group relative">
            <img src="/images/icon/lock.svg" alt="" className="icon-lock mt-3 pt-1" />
            <label htmlFor="confirmPassword">Konfirmasi Kata Sandi</label>
            <input
              type={showPasswords.confirm ? 'text' : 'password'}
              id="confirmPassword"
              name="confirmPassword"
              placeholder="*******"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              className="show-pass"
              onClick={() => toggleShowPassword('confirm')}
            >
              <i className={`mt-3 pt-4 fa-regular fa-eye${showPasswords.confirm ? '' : '-slash'}`}></i>
            </button>
          </div>
          <button type="submit" className="login-btn1 mt-3" disabled={changePassword.isPending}>
            {changePassword.isPending ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Updating...
              </>
            ) : (
              'Perbarui Kata Sandi'
            )}
          </button>
        </div>
      </form>

      {/* Response modal */}
      {modal.show && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: 'rgba(0,0,0,0.6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '20px',
            backdropFilter: 'blur(4px)',
          }}
          onClick={() => setModal({ ...modal, show: false })}
        >
          <div
            style={{
              background: '#1a1a2e',
              border: `1px solid ${modal.type === 'success' ? '#28a745' : '#dc3545'}`,
              borderRadius: '16px',
              padding: '32px 24px',
              maxWidth: '320px',
              width: '100%',
              textAlign: 'center',
              boxShadow: `0 8px 32px ${modal.type === 'success' ? 'rgba(40,167,69,0.3)' : 'rgba(220,53,69,0.3)'}`,
              animation: 'modalPop 0.25s ease',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{
              width: '60px', height: '60px', borderRadius: '50%',
              background: modal.type === 'success' ? 'rgba(40,167,69,0.15)' : 'rgba(220,53,69,0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 16px', fontSize: '28px',
            }}>
              {modal.type === 'success' ? '✅' : '❌'}
            </div>
            <p style={{ color: '#fff', fontWeight: '700', fontSize: '17px', marginBottom: '8px' }}>
              {modal.type === 'success' ? 'Kata Sandi Diperbarui!' : 'Kesalahan'}
            </p>
            <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '14px', marginBottom: '24px' }}>
              {modal.message}
            </p>
            <button
              onClick={() => {
                setModal({ ...modal, show: false });
                if (modal.type === 'success') navigate(-1);
              }}
              style={{
                width: '100%', padding: '12px', borderRadius: '10px', border: 'none',
                background: modal.type === 'success'
                  ? 'linear-gradient(135deg, #28a745, #20c997)'
                  : 'linear-gradient(135deg, #dc3545, #c82333)',
                color: '#fff', fontWeight: '600', fontSize: '15px', cursor: 'pointer',
              }}
            >
              {modal.type === 'success' ? 'Selesai' : 'Tutup'}
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes modalPop {
          from { transform: scale(0.85); opacity: 0; }
          to   { transform: scale(1);    opacity: 1; }
        }
      `}</style>
    </main>
  );
};

export default ChangePassword;
