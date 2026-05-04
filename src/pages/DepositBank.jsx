import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDeposits } from '../hooks/useDeposits';
import '../styles/deposit-bank.css';

const INITIAL_SECONDS = 20 * 60; // 20 minutes

const pad = (n) => String(n).padStart(2, '0');

const DepositBank = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const hasShownSuccessModal = useRef(false);
  const sourceData = state?.depositData ?? {};
  const rawData = sourceData?.data ?? sourceData;
  
  console.log('DepositBank received state:', state);
  console.log('Raw depositData:', rawData);
  
  // Map recharge API response fields to expected format
  const depositData = {
    amount: rawData?.amount ?? rawData?.nominal ?? 0,
    order_id: rawData?.order_id ?? rawData?.reference_id ?? rawData?.trx_id ?? rawData?.id ?? 'â€”',
    created_at: rawData?.created_at ?? rawData?.request_time ?? new Date().toISOString(),
    virtual_account: rawData?.virtual_account ?? rawData?.va ?? rawData?.va_number ?? '',
  };

  const currentOrderId = String(depositData?.order_id ?? '').trim();
  const { data: depositsData } = useDeposits({
    enabled: !!currentOrderId && currentOrderId !== 'â€”',
    refetchInterval: 8000,
    refetchIntervalInBackground: true,
  });

  const matchedDeposit = (depositsData?.deposits ?? []).find(
    (item) => String(item?.order_id ?? '').trim() === currentOrderId
  );

  const liveStatus = String(matchedDeposit?.status ?? '').toLowerCase();
  const isSuccess = liveStatus === 'approved' || liveStatus === 'success';
  const isFailed = liveStatus === 'failed' || liveStatus === 'rejected' || liveStatus === 'cancelled';
  const statusLabel = isSuccess
    ? 'Pembayaran Berhasil'
    : isFailed
      ? 'Pembayaran Gagal'
      : 'Waiting Payment';

  useEffect(() => {
    if (isSuccess && !hasShownSuccessModal.current) {
      hasShownSuccessModal.current = true;
      setShowSuccessModal(true);
    }
  }, [isSuccess]);
  
  console.log('Mapped depositData:', depositData);

  const [secondsLeft, setSecondsLeft] = useState(INITIAL_SECONDS);
  const intervalRef = useRef(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(intervalRef.current);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, []);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const progress = secondsLeft / INITIAL_SECONDS;
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - progress);

  const handleCopy = () => {
    const va = depositData?.virtual_account ?? depositData?.va_number ?? '';
    if (va) navigator.clipboard.writeText(va);
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    navigate('/deposit-list');
  };

  const instructions = [
    { icon: 'ðŸ“±', text: '01.Open your Bank application' },
    { icon: 'ðŸ“‹', text: '02.Copy the VA code above.' },
    { icon: 'ðŸ”—', text: '03.Paste the VA number in the app.' },
    { icon: 'ðŸ’³', text: '04.Verify the amount and confirm payment.' },
    { icon: 'ðŸ’°', text: '05.Balance is automatically credited (1-2 mins).' },
  ];

  return (
    <main className="deposit-bank-page" style={{ backgroundImage: 'url(/images/signup-bg.jpeg)' }}>
      {showSuccessModal && (
        <div className="deposit-result-modal-overlay" onClick={handleCloseSuccessModal}>
          <div className="deposit-result-modal" onClick={(e) => e.stopPropagation()}>
            <div className="deposit-result-modal__icon success">
              <svg width="42" height="42" viewBox="0 0 42 42" fill="none" aria-hidden="true">
                <circle cx="21" cy="21" r="21" fill="#1fddaa" fillOpacity="0.16" />
                <path d="M12.5 21.5 18 27l11.5-13" stroke="#1fddaa" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <p className="deposit-result-modal__title">Deposit Received</p>
            <p className="deposit-result-modal__message">
              Your deposit has been confirmed and your balance has been updated.
            </p>
            <button className="deposit-result-modal__button" onClick={handleCloseSuccessModal} type="button">
              View Deposit History
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="d-flex align-items-center pt-3">
        <button className="btn-trans" onClick={() => navigate(-1)}>
          <img src="/images/btn-back.png" className="btn-back" alt="Kembali" />
        </button>
        <div className="text-center w-100">
          <p className="text-white fw-semibold fs-5 mb-0 me-5">Deposit Bank</p>
        </div>
      </div>

      <p className="text-white-50 text-13 mt-3">Please complete before the timer runs out.</p>
      <div className={`fw-bolder text-secondary text-outline-white payment-status-chip ${isSuccess ? 'success' : isFailed ? 'failed' : 'pending'}`}>
        <span className="dot" />
        <span>{statusLabel}</span>
      </div>

      {/* Bill Card */}
      <div className="bank-bill-card mt-2">
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <p className="text-white-50 text-13 mb-1">Total Bill:</p>
            <p className="text-white fw-bold fs-4 mb-0">
              Rp {Number(depositData?.amount ?? 0).toLocaleString('id-ID')}
            </p>
          </div>
          {/* Countdown Ring */}
          <div className="countdown-wrap">
            <svg width="70" height="70" viewBox="0 0 70 70" className="countdown-svg">
              <circle cx="35" cy="35" r={radius} fill="none" stroke="#1a3050" strokeWidth="5" />
              <circle
                cx="35"
                cy="35"
                r={radius}
                fill="none"
                stroke="#2f91ff"
                strokeWidth="5"
                strokeDasharray={circumference}
                strokeDashoffset={dashOffset}
                strokeLinecap="round"
                transform="rotate(-90 35 35)"
                style={{ transition: 'stroke-dashoffset 1s linear' }}
              />
            </svg>
            <div className="countdown-label">
              <span className="text-white-50 text-11">Expiered</span>
              <span className="text-white fw-bold text-14">{pad(minutes)}:{pad(seconds)}</span>
            </div>
          </div>
        </div>

        <div className="d-flex gap-4 mt-3">
          <div>
            <p className="text-white-50 text-12 mb-1">Order Id</p>
            <p className="text-white fw-semibold text-14 mb-0">
              {depositData?.order_id ?? depositData?.id ?? 'â€”'}
            </p>
          </div>
          <div>
            <p className="text-white-50 text-12 mb-1">Date & Time</p>
            <p className="text-white fw-semibold text-14 mb-0">
              {depositData?.created_at
                ? new Date(depositData.created_at).toLocaleString('en-GB', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : 'â€”'}
            </p>
          </div>
        </div>
      </div>

      {/* Virtual Account */}
      <div className="mt-4">
        <p className="text-white fw-semibold mb-2">Virtual Account Number</p>
        <div className="va-input-wrap">
          <span className="va-number">
            {depositData?.virtual_account ?? depositData?.va_number ?? '500*****000'}
          </span>
          <button className="va-copy-btn" onClick={handleCopy} type="button" title="Copy">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <rect x="9" y="9" width="13" height="13" rx="2" stroke="#2f91ff" strokeWidth="1.8" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" stroke="#2f91ff" strokeWidth="1.8" />
            </svg>
          </button>
        </div>
      </div>

      {/* Payment Instructions */}
      <div className="instructions-card mt-4">
        <p className="text-white fw-semibold mb-3">Payment Instructions</p>
        {instructions.map((item, i) => (
          <div className="instruction-row" key={i}>
            <span className="instruction-icon">{item.icon}</span>
            <span className="text-white text-13">{item.text}</span>
          </div>
        ))}
      </div>

      {/* I Have Paid */}
      <div className="deposit-footer">
        <button
          className="btn-primary-full"
          onClick={() => navigate('/deposit-list')}
          type="button"
        >
          {isSuccess ? 'View Deposit History' : 'I Have Paid'}
        </button>
      </div>
    </main>
  );
};

export default DepositBank;

