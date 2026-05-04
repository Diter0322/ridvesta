import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDashboard } from '../hooks/useDashboard';
import { useProfile } from '../hooks/useProfile';
import { useUnreadCount, useRecentNotifications, useMarkAsRead, useMarkAllAsRead } from '../hooks/useNotifications';
import apiClient from '../api/client';
import '../styles/home.css';

const Home = () => {
  const navigate = useNavigate();
  const [planType, setPlanType] = useState('monthly');

  const [participating, setParticipating] = useState(false);
  const [participateMsg, setParticipateMsg] = useState(null);
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef(null);

  const { data: unreadData } = useUnreadCount();
  const unreadCount = unreadData?.count ?? unreadData ?? 0;
  const { data: notifications, isLoading: notifLoading } = useRecentNotifications(notifOpen);
  const { mutate: markRead } = useMarkAsRead();
  const { mutate: markAllRead, isPending: markingAll } = useMarkAllAsRead();

  const notifList = Array.isArray(notifications) ? notifications : (notifications?.data ?? []);

  const toggleNotif = () => setNotifOpen((v) => !v);

  // Close panel when clicking outside
  useEffect(() => {
    if (!notifOpen) return;
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [notifOpen]);

  const handleParticipate = async () => {
    if (participating || investment?.is_active) return;
    setParticipating(true);
    setParticipateMsg(null);
    try {
      const res = await apiClient.post('/investment/participate');
      setParticipateMsg({ type: 'success', text: res.data?.message || 'Berhasil berpartisipasi!' });
    } catch (e) {
      const msg = e.response?.data?.message || 'Gagal berpartisipasi. Coba lagi.';
      setParticipateMsg({ type: 'error', text: msg });
    } finally {
      setParticipating(false);
    }
  };

  const { data: dashData, isLoading: dashLoading } = useDashboard();
  const { data: user, isLoading: profileLoading } = useProfile();

  const loading = dashLoading || profileLoading;
  const data = dashData;

  const investment = data?.investment;

  if (loading) {
    return (
      <main className="home" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div className="spinner-border text-light" role="status">
          <span className="visually-hidden">Memuat...</span>
        </div>
      </main>
    );
  }

  return (
    <main className="home">
      <div className="header pt-4">
        <div className="d-flex gap-3 align-items-center">
          <div>
            <img className="user-avatar" src={user?.photo || '/images/homelogo.png'} alt="User" onError={(e) => { e.currentTarget.src = '/images/homelogo.png'; }} />
          </div>
          <div className="text-white">
            <p className="text-12 mb-0 opacity-75">Selamat pagi,</p>
            <div className="fw-semibold">{user?.fullname ?? 'User'}</div>
          </div>
        </div>
        <div className="header-actions d-flex gap-2">
          <button className="btn-icon">
            <img src="/images/icon/message.svg" alt="Messages" />
          </button>
          <div className="notif-wrapper" ref={notifRef}>
            <button className="btn-icon notif-btn" onClick={toggleNotif}>
              <img src="/images/icon/notification.svg" alt="Notifications" />
              {unreadCount > 0 && (
                <span className="notif-badge">{unreadCount > 99 ? '99+' : unreadCount}</span>
              )}
            </button>

            {notifOpen && (
              <div className="notif-panel">
                <div className="notif-panel-header">
                  <span className="notif-panel-title">Notifikasi</span>
                  {unreadCount > 0 && (
                    <button
                      className="notif-read-all"
                      onClick={() => markAllRead()}
                      disabled={markingAll}
                    >
                      {markingAll ? 'Memproses...' : 'Tandai semua dibaca'}
                    </button>
                  )}
                </div>

                <div className="notif-list">
                  {notifLoading ? (
                    <div className="notif-empty">Memuat...</div>
                  ) : notifList.length === 0 ? (
                    <div className="notif-empty">
                      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                        <circle cx="20" cy="20" r="20" fill="#1e2d42"/>
                        <path d="M20 10a7 7 0 0 1 7 7v3l2 3H11l2-3v-3a7 7 0 0 1 7-7z" stroke="#4a6080" strokeWidth="1.5" fill="none"/>
                        <path d="M17.5 28a2.5 2.5 0 0 0 5 0" stroke="#4a6080" strokeWidth="1.5" fill="none"/>
                      </svg>
                      <p className="mt-2 mb-0">Tidak ada notifikasi</p>
                    </div>
                  ) : (
                    notifList.map((n) => (
                      <div
                        key={n.id}
                        className={`notif-item ${!n.is_read ? 'unread' : ''}`}
                        onClick={() => { if (!n.is_read) markRead(n.id); }}
                      >
                        <div className="notif-dot-wrap">
                          <span className={`notif-dot ${!n.is_read ? 'active' : ''}`} />
                        </div>
                        <div className="notif-content">
                          <p className="notif-title">{n.title ?? n.subject ?? 'Notifikasi'}</p>
                          <p className="notif-msg">{n.message ?? n.body ?? n.perticulation ?? ''}</p>
                          <p className="notif-time">{n.created_at_human ?? n.time ?? ''}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="main-set mt-3">
        <div className="d-flex justify-content-between">
          <div className="mt-4">
            <p className="title mb-2 gold-shiny">EMASHARIAN.COM</p>
            <p className="sub-title mb-0">Saldo Utama</p>
            <p className="title">{data?.user_balance_formatted ?? 'Rp 0'}</p>
          </div>
          <div>
            <img className="img-fluid" src="/images/homelogo.png" alt="Global" />
          </div>
        </div>
        
        <div className="card-one mt-2">
          <div className="d-flex justify-content-between">
            <p className="text-white text-sm fw-medium">Pendapatan Investasi</p>
            <p>
              <span><i className="fa-regular fa-clock"></i></span>
              <span className="fw-medium fs-6"> {investment?.hours_worked ?? 0} hr</span>
              <span className="text-green ms-2">{investment?.hourly_rate ?? '0%'}/hr</span>
            </p>
          </div>
          <div className="bar">
            <div className="active" style={{ width: '35%' }}></div>
          </div>
          <div className="d-flex gap-2 justify-content-between mt-4">
            <button className="btn btn-participate w-100" onClick={handleParticipate} disabled={participating || investment?.is_active}>
              <img src="/images/icon/run.svg" alt="" />
              {participating ? 'Memproses...' : investment?.is_active ? 'SUDAH AKTIF' : 'IKUT SERTA'}
            </button>
            <button className="btn btn-clam w-100">
              <img src="/images/icon/reward.svg" alt="" />
              Klaim Reward
            </button>
          </div>
          {participateMsg && (
            <p className={`text-12 mt-2 mb-0 ${participateMsg.type === 'success' ? 'text-green' : 'text-danger'}`}>
              {participateMsg.text}
            </p>
          )}
          <div className="shape"></div>
        </div>
      </div>

      <div className="text-area mt-4">
        <div className="d-flex gap-2">
          <i className="fa-regular fa-circle-question mt-1"></i>
          <p className="text-sm">
            Investor perlu klik untuk berpartisipasi dalam investasi pada
            <span className="text-14 text-blue"> pukul 08.00 </span> setiap pagi,
            jika tidak, pendapatan investasi tidak akan dihasilkan.
          </p>
        </div>
        <div className="d-flex gap-2">
          <i className="fa-solid fa-gift mt-1"></i>
          <p className="text-sm">
            Investor dapat membuka kotak hadiah aset digital Grayscale dan mendapatkan
            hadiah hingga <span className="text-14 text-green"> 1 BTC </span> (senilai
            <span className="text-14 text-green"> $100.000 </span>)
          </p>
        </div>
      </div>

      <div className="main-set">
        <div className="card-one">
          <div className="d-flex justify-content-between mb-2">
            <div>
              <p className="small mb-1">Akun Pendapatan</p>
              <p className="title fs-2">{data?.user_income_formatted ?? 'Rp 0'}</p>
            </div>

            <div className="d-flex align-items-center justify-content-center">
              <div className="switch-wrapper mt-4">
                <input
                  type="radio"
                  id="monthly"
                  checked={planType === 'monthly'}
                  name="planType"
                  onChange={() => setPlanType('monthly')}
                />
                <input
                  type="radio"
                  id="yearly"
                  checked={planType === 'yearly'}
                  name="planType"
                  onChange={() => setPlanType('yearly')}
                />
                <label htmlFor="monthly" className="text-center">Bln</label>
                <label htmlFor="yearly" className="text-center">Thn</label>
                <span className="highlighter"></span>
              </div>
            </div>
          </div>

          <div className="d-flex gap-3">
            <div className="card-two">
              <p className="text-sm mb-1">Total Pendapatan</p>
              <p className="sub mb-0">{investment?.total_earned_formatted ?? 'Rp 0'}</p>
            </div>
            <div className="card-two">
              <p className="text-sm mb-1">Keuntungan Berjalan</p>
              <p className="sub mb-0">{investment?.running_profit_formatted ?? 'Rp 0'}</p>
            </div>
          </div>
          <div className="d-flex gap-2 justify-content-between mt-3">
            <button className="btn btn-one w-100" onClick={() => navigate('/deposit')}>Isi Ulang</button>
            <button className="btn btn-two w-100" onClick={() => navigate('/withdraw')}>Penarikan</button>
          </div>
          <div className="shape"></div>
        </div>
      </div>

      {/* Video Tutorial */}
      <div className="latest-news mt-4 mb-5 pb-4">
        <div className="d-flex justify-content-between text-white align-items-center mb-1">
          <p className="mb-1">Tutorial Video</p>
        </div>
        <div className="video-card">
          <p className="fw-semibold mb-0 text-white">IDVESTA APP RELEASE</p>
          <p className="text-12 text-secondary mb-3">
            Peluncuran Resmi Aplikasi Investasi Online IDVESTA..
          </p>
          <div className="mt-3 relative">
            <img className="bg" src="/images/video-bd.png" alt="" />
            <button className="btn-trans">
              <img src="/images/btn/btn-play.svg" alt="" />
            </button>
          </div>
        </div>
      </div>

    </main>
  );
};

export default Home;

