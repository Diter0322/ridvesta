import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useProfile, useUploadProfilePhoto } from '../hooks/useProfile';
import '../styles/profile.css';

const Profile = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [photoPratinjau, setPhotoPratinjau] = useState(null);
  const fileInputRef = useRef(null);

  const { data: user, isLoading: profileLoading } = useProfile();
  const uploadPhoto = useUploadProfilePhoto();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPhotoPratinjau(URL.createObjectURL(file));
    setShowPhotoModal(true);
    uploadPhoto.reset();
  };

  const handleUploadConfirm = () => {
    const file = fileInputRef.current?.files[0];
    if (!file) return;
    uploadPhoto.mutate(file, {
      onSuccess: () => {
        setShowPhotoModal(false);
        setPhotoPratinjau(null);
      },
    });
  };

  const handlePhotoModalClose = () => {
    setShowPhotoModal(false);
    setPhotoPratinjau(null);
    uploadPhoto.reset();
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  if (profileLoading || !user) {
    return (
      <main className="profile mb-4" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div className="spinner-border text-light" role="status">
          <span className="visually-hidden">Memuat...</span>
        </div>
      </main>
    );
  }

  return (
    <main className="profile mb-4" style={{ backgroundImage: 'url(/images/signup-bg.jpeg)', backgroundSize: 'cover', backgroundPosition: 'center top' }}>
      <div className="d-flex align-items-center pt-3">
        <button className="btn-trans" onClick={() => navigate(-1)}>
          <img src="/images/btn-back.png" className="btn-back" alt="" />
        </button>
        <div className="text-center w-100">
          <p className="text-white fw-semibold fs-5 me-5 mb-0">Profil Pengguna</p>
        </div>
      </div>

      <div className="text-center pt-2">
        <div className="relative profile-pic">
          <img
              className="user"
              src={user?.photo || '/images/homelogo.png'}
              alt=""
              onError={(e) => { e.target.onerror = null; e.target.src = '/images/homelogo.png'; }}
            />
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
          <button type="button" onClick={() => fileInputRef.current?.click()}>
            <i className="fa-regular fa-camera"></i>
          </button>
        </div>
        <p className="text-white fw-semibold fs-5 mb-1">{user?.fullname ?? 'Memuat...'}</p>
        <p className="text-light3">No. HP: {user?.phone ?? user?.phone_number ?? user?.no_hp ?? user?.noHp ?? '-'}</p>
      </div>

      {/* Account Information */}
      <div className="card-one">
        <p className="text-white fw-semibold text-18">Informasi Akun</p>
        <ul>
          <li>
            <a href="/transaction-history" onClick={(e) => { e.preventDefault(); navigate('/transaction-history'); }}>
              <img src="/images/icon/edit-user.svg" alt="" />
              <div>
                <p className="text-14">Daftar Transaksi</p>
                <p className="text-12">Lihat riwayat transaksi Anda</p>
              </div>
              <i className="fa-solid fa-chevron-right"></i>
            </a>
          </li>
          <li>
            <a href="/deposit-list" onClick={(e) => {
              e.preventDefault();
              navigate('/deposit-list');
            }}>
              <img src="/images/icon/checkmark.svg" alt="" />
              <div>
                <p className="text-14">Daftar Deposit</p>
                <p className="text-12">Pantau catatan deposit Anda</p>
              </div>
              <i className="fa-solid fa-chevron-right"></i>
            </a>
          </li>
          <li>
            <a href="/withdraw-history" onClick={(e) => {
              e.preventDefault();
              navigate('/withdraw-history');
            }}>
              <img src="/images/icon/user.svg" alt="" />
              <div>
                <p className="text-14">Daftar Penarikan</p>
                <p className="text-12">Pantau penarikan Anda</p>
              </div>
              <i className="fa-solid fa-chevron-right"></i>
            </a>
          </li>
          <li>
            <a href="/bank-data" onClick={(e) => {
              e.preventDefault();
              navigate('/bank-data');
            }}>
              <img src="/images/icon/search-box.svg" alt="" />
              <div>
                <p className="text-14">Data Bank</p>
                <p className="text-12">Kelola detail bank Anda</p>
              </div>
              <i className="fa-solid fa-chevron-right"></i>
            </a>
          </li>
        </ul>
      </div>

      {/* Setting  */}
      <div className="card-one setting-card relative mt-4">
        <p className="text-white fw-semibold text-18">Pengaturan</p>
        <ul>
          <li>
            <a href="/change-password" onClick={(e) => {
              e.preventDefault();
              navigate('/change-password');
            }}>
              <img src="/images/icon/lock2.svg" alt="" />
              <div>
                <p className="text-14">Ubah Kata Sandi</p>
                <p className="text-12">Perbarui kata sandi login Anda</p>
              </div>
              <i className="fa-solid fa-chevron-right"></i>
            </a>
          </li>
          <li>
            <a href="#" onClick={(e) => { e.preventDefault(); navigate('/about'); }}>
              <img src="/images/icon/help-circle.svg" alt="" />
              <div>
                <p className="text-14">Tentang Kami</p>
                <p className="text-12">Pelajari lebih lanjut tentang aplikasi kami</p>
              </div>
              <i className="fa-solid fa-chevron-right"></i>
            </a>
          </li>
          <li>
            <a href="/faq" onClick={(e) => {
              e.preventDefault();
              navigate('/faq');
            }}>
              <img src="/images/icon/message.svg" alt="" />
              <div>
                <p className="text-14">FAQ</p>
                <p className="text-12">Temukan jawaban atas pertanyaan umum</p>
              </div>
              <i className="fa-solid fa-chevron-right"></i>
            </a>
          </li>
          <li>
            <a href="#" onClick={(e) => { e.preventDefault(); navigate('/customer-service'); }}>
              <img src="/images/icon/users.svg" alt="" />
              <div>
                <p className="text-14">Layanan Pelanggan</p>
                <p className="text-12">Dapatkan bantuan dari tim support kami</p>
              </div>
              <i className="fa-solid fa-chevron-right"></i>
            </a>
          </li>
          <li>
            <a href="#" onClick={(e) => e.preventDefault()}>
              <img src="/images/icon/download.svg" alt="" />
              <div>
                <p className="text-14">Unduh APK</p>
                <p className="text-12">Unduh versi aplikasi terbaru</p>
              </div>
              <i className="fa-solid fa-chevron-right"></i>
            </a>
          </li>
        </ul>
        <div className="middle-shape"></div>
      </div>

      {/* Log Out */}
      <div className="card-one mt-4 mb-5">
        <ul>
          <li className="pt-0">
            <a
              className="log-out"
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setShowLogoutConfirm(true);
              }}
            >
              <i className="fa-solid fa-arrow-right-from-bracket"></i>
              <span>Keluar</span>
            </a>
          </li>
        </ul>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="logout-modal-overlay" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
        }}>
          <div className="logout-modal" style={{
            backgroundColor: '#1a1a2e',
            borderRadius: '12px',
            padding: '30px',
            minWidth: '300px',
            textAlign: 'center',
            color: 'white',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
          }}>
            <h3 style={{ marginBottom: '15px', marginTop: 0 }}>Konfirmasi Keluar</h3>
            <p style={{ marginBottom: '30px', color: '#ccc' }}>
              Apakah Anda yakin ingin keluar?
            </p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button
                onClick={handleLogout}
                style={{
                  backgroundColor: '#e74c3c',
                  color: 'white',
                  border: 'none',
                  padding: '10px 30px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 'bold',
                }}
              >
                Ya, Keluar
              </button>
              <button
                onClick={() => setShowLogoutConfirm(false)}
                style={{
                  backgroundColor: '#34495e',
                  color: 'white',
                  border: 'none',
                  padding: '10px 30px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 'bold',
                }}
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Photo Upload Modal */}
      {showPhotoModal && (
        <div
          onClick={handlePhotoModalClose}
          style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.75)',
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            zIndex: 1000,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: '#1a1a2e', borderRadius: '16px',
              padding: '28px 24px', width: '300px', textAlign: 'center', color: 'white',
              boxShadow: '0 10px 40px rgba(0,0,0,0.4)',
            }}
          >
            <p style={{ fontWeight: 600, fontSize: '16px', marginBottom: '16px' }}>Ganti Foto Profil</p>
            {photoPratinjau && (
              <img
                src={photoPratinjau}
                alt="Pratinjau"
                style={{ width: 100, height: 100, borderRadius: '50%', objectFit: 'cover', marginBottom: '16px', border: '3px solid #0c77ff' }}
              />
            )}
            {uploadPhoto.isError && (
              <p style={{ color: '#e74c3c', fontSize: '13px', marginBottom: '12px' }}>
                {uploadPhoto.error?.response?.data?.message ?? 'Unggah gagal'}
              </p>
            )}
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button
                onClick={handleUploadConfirm}
                disabled={uploadPhoto.isPending}
                style={{
                  backgroundColor: '#0c77ff', color: 'white', border: 'none',
                  padding: '10px 24px', borderRadius: '8px', cursor: 'pointer',
                  fontSize: '14px', fontWeight: 600, opacity: uploadPhoto.isPending ? 0.7 : 1,
                }}
              >
                {uploadPhoto.isPending ? 'Mengunggah...' : 'Unggah'}
              </button>
              <button
                onClick={handlePhotoModalClose}
                style={{
                  backgroundColor: '#34495e', color: 'white', border: 'none',
                  padding: '10px 24px', borderRadius: '8px', cursor: 'pointer',
                  fontSize: '14px', fontWeight: 600,
                }}
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default Profile;

