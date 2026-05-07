import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDashboard } from '../hooks/useDashboard';
import { useProfile } from '../hooks/useProfile';
import { useUnreadCount, useRecentNotifications, useMarkAsRead, useMarkAllAsRead } from '../hooks/useNotifications';
import WalkingIcon from '../components/WalkingIcon';
import apiClient from '../api/client';
import '../styles/home.css';

const Home = () => {
  const navigate = useNavigate();
  const [planType, setPlanType] = useState('monthly');

  const [participating, setParticipating] = useState(false);
  const [participateMsg, setParticipateMsg] = useState(null);
  const [claiming, setClaiming] = useState(false);
  const [claimMsg, setClaimMsg] = useState(null);
  const [showAccumulationModal, setShowAccumulationModal] = useState(false);
  const [accumulationAmount, setAccumulationAmount] = useState('');
  const [savedAccumulationAmount, setSavedAccumulationAmount] = useState(null);
  const [accumulationSubmitting, setAccumulationSubmitting] = useState(false);
  const [accumulationMsg, setAccumulationMsg] = useState(null);
  const [showTransferResponseModal, setShowTransferResponseModal] = useState(false);
  const [transferResponse, setTransferResponse] = useState({ type: null, text: '' });
  const [notifOpen, setNotifOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const notifRef = useRef(null);

  const { data: unreadData, refetch: refetchUnreadCount } = useUnreadCount();
  const unreadCount = unreadData?.count ?? unreadData ?? 0;
  const { data: notifications, isLoading: notifLoading, refetch: refetchNotifications } = useRecentNotifications(notifOpen);
  const { mutate: markRead } = useMarkAsRead();
  const { mutate: markAllRead, isPending: markingAll } = useMarkAllAsRead();

  const notifList = Array.isArray(notifications) ? notifications : (notifications?.data ?? []);

  const toggleNotif = () => setNotifOpen((v) => !v);

  const parseNumericAmount = (value) => Number(String(value ?? '').replace(/[^0-9]/g, '')) || 0;

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

  // Real-time ticker for hourly countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleClaimReward = async () => {
    if (claiming || investment?.has_claimed_reward) return;
    setClaiming(true);
    setClaimMsg(null);
    try {
      const res = await apiClient.post('/investment/claim-reward');
      setClaimMsg({ type: 'success', text: res.data?.message || 'Reward berhasil diklaim!' });
    } catch (e) {
      const msg = e.response?.data?.message || 'Gagal klaim reward. Coba lagi.';
      setClaimMsg({ type: 'error', text: msg });
    } finally {
      setClaiming(false);
    }
  };

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

  const handleOpenAccumulationModal = () => {
    setAccumulationMsg(null);
    setShowAccumulationModal(true);
  };

  const handleCloseAccumulationModal = () => {
    setAccumulationMsg(null);
    setShowAccumulationModal(false);
  };

  const handleSubmitAccumulation = async (e) => {
    e.preventDefault();
    if (accumulationSubmitting) return;

    const numericValue = parseNumericAmount(accumulationAmount);
    const availableIncome = parseNumericAmount(data?.user_income ?? data?.user_income_formatted);

    if (!numericValue || numericValue <= 0) {
      setAccumulationMsg({ type: 'error', text: 'Jumlah transfer harus lebih besar dari 0' });
      return;
    }

    if (numericValue > availableIncome) {
      setAccumulationMsg({ type: 'error', text: 'Jumlah transfer tidak boleh melebihi saldo rekening.' });
      return;
    }

    setAccumulationSubmitting(true);
    setAccumulationMsg(null);

    try {
      const res = await apiClient.post('/balance/transfer', {
        amount: numericValue,
      });

      setSavedAccumulationAmount(numericValue);
      setTransferResponse({
        type: 'success',
        text: res?.data?.message || 'Transfer saldo berhasil',
      });
      setShowAccumulationModal(false);
      setShowTransferResponseModal(true);
      setAccumulationAmount('');
    } catch (error) {
      const errorText =
        error?.response?.data?.message ||
        error?.response?.data?.errors?.[0] ||
        'Transfer gagal. Silakan coba lagi.';

      setShowAccumulationModal(false);
      setTransferResponse({ type: 'error', text: errorText });
      setShowTransferResponseModal(true);
    } finally {
      setAccumulationSubmitting(false);
    }
  };

  const handleAccumulationChange = (e) => {
    const numericOnly = e.target.value.replace(/[^0-9]/g, '');
    setAccumulationAmount(numericOnly);
  };

  const { data: dashData, isLoading: dashLoading, refetch: refetchDashboard } = useDashboard();
  const { data: user, isLoading: profileLoading, refetch: refetchProfile } = useProfile();

  const loading = dashLoading || profileLoading;
  const data = dashData;

  const investment = data?.investment;
  const baseUserBalance = Number(data?.user_balance ?? 0);
  const accumulationInputValue = Number(accumulationAmount || 0);
  const projectedMainBalance = baseUserBalance + accumulationInputValue;

  const secondsPassedThisHour = (currentTime.getMinutes() * 60) + currentTime.getSeconds();
  const secondsUntilNextHour = 3600 - secondsPassedThisHour;
  const countdownMinutes = Math.floor(secondsUntilNextHour / 60);
  const countdownSeconds = secondsUntilNextHour % 60;
  const countdownLabel = `${countdownMinutes}m ${String(countdownSeconds).padStart(2, '0')}s`;
  const nextProfitPercent = (secondsPassedThisHour / 3600) * 100;

  useEffect(() => {
    if (!showTransferResponseModal) return;

    Promise.allSettled([
      refetchDashboard(),
      refetchProfile(),
      refetchUnreadCount(),
      refetchNotifications(),
    ]);
  }, [
    showTransferResponseModal,
    refetchDashboard,
    refetchProfile,
    refetchUnreadCount,
    refetchNotifications,
  ]);

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
            <p className="text-12 mb-0 opacity-75">Selamat Datang,</p>
            <div className="fw-semibold">{user?.fullname ?? 'User'}</div>
          </div>
        </div>
        <div className="header-actions d-flex gap-2">
    
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
          <div className="mt-0">
            <p className="title mb-2 shiny-silver" style={{ fontSize: 24, fontWeight: 700}}>EMASHARIAN</p>
            <p className="sub-title mb-0">Saldo Investasi</p>
            {/* <div className="d-flex align-items-center mt-1 gap-1"> */}
            <p className="title col text-nowrap fs-2">{data?.user_balance_formatted ?? 'Rp 0'}</p>
            {/* <div className='text-center'> */}
              <button className="btn btn-three col mt-1 text-nowrap text-white fs-medium text-nowrap" onClick={() => navigate('/deposit')}>
              <img src="/images/icon/top-up.svg" alt="" style={{ marginRight: '3px', maxHeight: '20px', filter: 'brightness(0) invert(1)' }} />
              Deposit Saldo
            </button>

            {/* </div> */}
            
            {/* </div> */}
          </div>
          <div>
            <img className="img-fluid" src="/images/homelogo.png" alt="Emasharian.com" />
          </div>
        </div>
        
        <div className="card-one mt-2">
          <div className="d-flex justify-content-between">
            <p className="text-white fw-medium">Pendapatan Profit</p>
            <p>
              <span><i className="fa-regular fa-clock"></i></span>
              <span className="fw-medium fs-6"> {countdownLabel}</span>
              <span className="text-green ms-2">{investment?.hourly_rate ?? '0%'}/hr</span>
            </p>
          </div>
          <div className="bar" style={{ marginTop: '-5px' }}>
            <div className="active" style={{ width: `${nextProfitPercent}%` }}></div>
          </div>
          <div className="d-flex gap-2 justify-content-between mt-4">
            <button className="btn btn-participate w-100" onClick={handleParticipate} disabled={participating || investment?.is_active}>
              {!participating && investment?.is_active ? (
                <WalkingIcon size={20} color="#fff" />
              ) : (
                <img src="/images/icon/run.svg" alt="" />
              )}
              {participating ? 'Memproses...' : investment?.is_active ? 'SUDAH AKTIF' : 'IKUT SERTA'}
            </button>
            <button className="btn btn-clam w-100" onClick={handleClaimReward} disabled={claiming || !!investment?.has_claimed_reward}>
              <img src="/images/icon/reward.svg" alt="" />
              {claiming ? 'Memproses...' : investment?.has_claimed_reward ? 'Sudah Diklaim' : 'Klaim Hadiah'}
            </button>
          </div>
          {participateMsg && (
            <p className={`text-12 mt-2 mb-0 ${participateMsg.type === 'success' ? 'text-green' : 'text-danger'}`}>
              {participateMsg.text}
            </p>
          )}
          {claimMsg && (
            <p className={`text-12 mt-1 mb-0 ${claimMsg.type === 'success' ? 'text-green' : 'text-danger'}`}>
              {claimMsg.text}
            </p>
          )}
          <div className="shape"></div>
        </div>
      </div>

      <div className="text-area mt-4">
        <div className="d-flex gap-2">
          <i className="fa-regular fa-circle-question mt-1"></i>
          <p className="text-sm">
            <span className="text-12 text-yellow" style={{ color: 'gold'}}>Investor perlu klik untuk berpartisipasi dalam investasi pada </span>
            <span className="text-13 text-blue"> pukul 08:00 WIB </span>  <span className="text-12 text-yellow" style={{ color: 'gold'}}> setiap pagi,
            jika tidak, pendapatan investasi tidak akan dihasilkan.</span>
          </p>
        </div>
        <div className="d-flex gap-2" style={{ marginTop: '-20px'}}>
          <i className="fa-solid fa-gift mt-1"></i>
          <p className="text-sm">
            Investor dapat membuka hadiah 1 hari sekali setelah berpartisipasi dalam investasi dan dapatkan
            <span className="text-13 text-green"> Bonus pendapatan 1 jam </span>
          </p>
        </div>
      </div>

      <div className="main-set" style={{ marginTop: '-20px'}}>
        <div className="card-one">
          <div className="d-flex justify-content-between mb-2">
            <div>
              <p className="small mb-1">Saldo Rekening</p>
              <p className="title fs-5">{data?.user_income_formatted ?? 'Rp 0'}</p>
            </div>

            <div className="profit-box">
              <p className="small">Pendapatan Kemarin</p>
              <p className="title text-green">{data?.last_profit_data ? 'Rp ' + Number(data.last_profit_data.amount).toLocaleString('id-ID') : 'Rp 0'}</p>
            </div>
          </div>

          <div className="d-flex gap-3">
            <div className="card-two">
              <p className="text-sm mb-1">Total Profit</p>
              <p className="sub mb-0">{investment?.total_earned_formatted ?? 'Rp 0'}</p>
            </div>
            <div className="card-two">
              <p className="text-sm mb-1">Profit Berlangsung</p>
              <p className="sub mb-0">{investment?.running_profit_formatted ?? 'Rp 0'}</p>
            </div>
          </div>
          <div className="d-flex gap-2 justify-content-between mt-3">
            <button type="button" className="btn btn-one col text-nowrap" onClick={handleOpenAccumulationModal}>Transfer Saldo</button>
            <button type="button" className="btn btn-two col" onClick={() => navigate('/withdraw')}>Penarikan</button>
          </div>
          {savedAccumulationAmount !== null && (
            <p className="text-12 mt-2 mb-0 text-green">
              Nilai akumulasi: Rp {savedAccumulationAmount.toLocaleString('id-ID')}
            </p>
          )}
          <div className="shape"></div>
        </div>
      </div>

      {/* Video Tutorial */}
      <div className="latest-news mt-4 mb-5 pb-4">
        <div className="d-flex justify-content-between text-white align-items-center mb-1">
          <p className="mb-1">Video Penjelasan</p>
        </div>
        <div className="video-card">
          <p className="fw-semibold mb-0 text-white">Cara Menghasilkan Uang!</p>
          <p className="text-12 text-secondary mb-3">
            Panduan mudah untuk memulai investasi dan menghasilkan pendapatan dengan EmasHarian.com
          </p>
          <div className="mt-3 relative">
            <img className="bg" src="/images/video-bd.png" alt="" />
            <button className="btn-trans">
              <img src="/images/btn/btn-play.svg" alt="" />
            </button>
          </div>
        </div>
      </div>

      {showAccumulationModal && (
        <div className="accumulation-modal-backdrop" onClick={handleCloseAccumulationModal}>
          <div className="accumulation-modal" onClick={(e) => e.stopPropagation()}>
            <div className="accumulation-modal-header">
              <h5 className="mb-0">Transfer Saldo</h5>
              <button className="accumulation-modal-close" onClick={handleCloseAccumulationModal} aria-label="Tutup">×</button>
            </div>
            
            <p className="text-12 mb-2">Konversi Saldo Penarikan ke Saldo Investasi</p>
            
            <form onSubmit={handleSubmitAccumulation}>
              <div className="accumulation-two-columns">
                {/* Kolom 1: Saldo Penarikan */}
                <div className="accumulation-column">
                  <label className="accumulation-modal-label">Saldo Penarikan</label>
                  <input
                    id="accumulationAmount"
                    className="accumulation-modal-input"
                    type="text"
                    inputMode="numeric"
                    min="1"
                    placeholder={data?.user_income_formatted ?? 'Rp 0'}
                    value={Number(accumulationAmount) > 0 ? Number(accumulationAmount).toLocaleString('id-ID') : ''}
                    onChange={handleAccumulationChange}
                    required
                  />
                </div>

                {/* Panah dekorasi */}
                <div className="accumulation-arrow"><img src="/images/icon/box-arrow-right.svg" alt="Arrow right" style={{ color: 'white'}}/></div>

                {/* Kolom 2: Saldo Utama (auto-update) */}
                <div className="accumulation-column">
                  <label className="accumulation-modal-label">Saldo Investasi</label>
                  <div className="accumulation-main-balance">
                    {`Rp ${projectedMainBalance.toLocaleString('id-ID')}`}
                  </div>
                </div>
              </div>

              <div className="d-flex justify-content-between accumulation-modal-actions">
                <button type="button" className="btn btn-one col-6" onClick={handleCloseAccumulationModal}>Batal</button>
                <button type="submit" className="btn btn-two col-6" disabled={accumulationSubmitting}>
                  {accumulationSubmitting ? 'Memproses...' : 'Transfer Saldo'}
                </button>
              </div>
              {accumulationMsg && (
                <p className={`text-12 mt-2 mb-0 ${accumulationMsg.type === 'success' ? 'text-green' : 'text-danger'}`}>
                  {accumulationMsg.text}
                </p>
              )}
            </form>
          </div>
        </div>
      )}

      {showTransferResponseModal && (
        <div className="accumulation-modal-backdrop" onClick={() => setShowTransferResponseModal(false)}>
          <div className="accumulation-modal" onClick={(e) => e.stopPropagation()}>
            <div className="accumulation-modal-header">
              <h5 className="mb-0">Status Transfer</h5>
              <button
                className="accumulation-modal-close"
                onClick={() => setShowTransferResponseModal(false)}
                aria-label="Tutup"
              >
                ×
              </button>
            </div>

            <p className={`text-12 mb-3 ${transferResponse.type === 'success' ? 'text-green' : 'text-danger'}`}>
              {transferResponse.text}
            </p>

            <div className="d-flex justify-content-end accumulation-modal-actions">
              <button type="button" className="btn btn-two" onClick={() => setShowTransferResponseModal(false)}>
                OK
              </button>
            </div>
          </div>
        </div>
      )}

    </main>
  );
};

export default Home;

