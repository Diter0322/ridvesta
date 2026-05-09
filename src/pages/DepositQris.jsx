import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDepositStatus } from '../hooks/useDeposits';
import '../styles/deposit-qris.css';

const isHttpUrl = (value) => /^https?:\/\//i.test(String(value || ''));
const isDataImage = (value) => /^data:image\//i.test(String(value || ''));

const toQrImageSrc = (value) => {
  const qrValue = String(value || '').trim();
  if (!qrValue) return null;
  if (isHttpUrl(qrValue) || isDataImage(qrValue)) return qrValue;
  return `https://api.qrserver.com/v1/create-qr-code/?size=280x280&data=${encodeURIComponent(qrValue)}`;
};

const DepositQris = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const hasShownSuccessModal = useRef(false);
  const sourceData = state?.depositData ?? {};
  const rawData = sourceData?.data ?? sourceData;
  
  console.log('DepositQris received state:', state);
  console.log('Raw depositData:', rawData);
  
  // Map recharge API response fields to expected format
  const depositData = {
    amount:
      rawData?.amount ??
      rawData?.nominal ??
      rawData?.payMoney ??
      0,
    order_id:
      rawData?.order_id ??
      rawData?.reference_id ??
      rawData?.trx_id ??
      rawData?.orderNum ??
      rawData?.id ??
      '—',
    qr_code_url:
      rawData?.qr_code_url ??
      null,
    qr_raw:
      rawData?.qr_code_url ??
      rawData?.qr_code ??
      rawData?.qr_url ??
      rawData?.payData ??
      rawData?.qrString ??
      null,
  };

  const currentOrderId = String(depositData?.order_id ?? '').trim();
  const { data: statusData } = useDepositStatus(currentOrderId, {
    refetchInterval: 8000,
    refetchIntervalInBackground: true,
  });


  const liveStatus = String(statusData?.status ?? '').toLowerCase();
  const isSuccess = liveStatus === 'success' || liveStatus === 'approved';
  const isFailed = liveStatus === 'failed';
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

  const qrCodeUrl = toQrImageSrc(depositData?.qr_code_url ?? depositData?.qr_raw);

  const instructions = [
    { icon: '📱', text: '01. Buka aplikasi pembayaran QRIS pilihan Anda.' },
    { icon: '📋', text: '02. Pindai kode QR yang ditampilkan di atas.' },
    { icon: '💳', text: '03. Verifikasi jumlah dan konfirmasi pembayaran .' },
  ];

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    navigate('/deposit-list');
  };

  return (
    <main className="deposit-qris-page" style={{ backgroundImage: 'url(/images/signup-bg.jpeg)' }}>
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
              Setoran Anda telah dikonfirmasi dan saldo Anda telah diperbarui..
            </p>
            <button className="deposit-result-modal__button" onClick={handleCloseSuccessModal} type="button">
              Lihat Riwayat Deposit
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
        </div>
      </div>

      <p className="text-white-50 text-13 mt-3">Scan kode QRIS untuk menyelesaikan transaksi Anda</p>
      <div className={`payment-status-chip ${isSuccess ? 'success' : isFailed ? 'failed' : 'pending'}`}>
        <span className="dot" />
        <span>{statusLabel}</span>
      </div>

      {/* QR Code */}
      <div className="qr-wrapper mt-3">
        {qrCodeUrl ? (
          <img src={qrCodeUrl} alt="QR Code" className="qr-image" />
        ) : (
          <div className="qr-placeholder">
            <svg width="160" height="160" viewBox="0 0 160 160" fill="none">
              <rect x="4" y="4" width="68" height="68" rx="4" stroke="white" strokeWidth="3" />
              <rect x="18" y="18" width="40" height="40" rx="2" fill="white" />
              <rect x="88" y="4" width="68" height="68" rx="4" stroke="white" strokeWidth="3" />
              <rect x="102" y="18" width="40" height="40" rx="2" fill="white" />
              <rect x="4" y="88" width="68" height="68" rx="4" stroke="white" strokeWidth="3" />
              <rect x="18" y="102" width="40" height="40" rx="2" fill="white" />
              <rect x="88" y="88" width="10" height="10" fill="white" />
              <rect x="104" y="88" width="10" height="10" fill="white" />
              <rect x="120" y="88" width="10" height="10" fill="white" />
              <rect x="136" y="88" width="16" height="10" fill="white" />
              <rect x="88" y="104" width="10" height="10" fill="white" />
              <rect x="104" y="104" width="24" height="10" fill="white" />
              <rect x="134" y="104" width="18" height="10" fill="white" />
              <rect x="88" y="120" width="16" height="32" fill="white" />
              <rect x="110" y="120" width="10" height="10" fill="white" />
              <rect x="126" y="120" width="26" height="10" fill="white" />
              <rect x="110" y="136" width="42" height="16" fill="white" />
            </svg>
          </div>
        )}
      </div>

      {/* Transaction Details */}
      <div className="qris-detail-card mt-4">
        <p className="text-white fw-semibold text-13 mb-3" style={{ letterSpacing: '0.5px' }}>
          DETAIL TRANSAKSI
        </p>
        <div className="d-flex justify-content-between mb-2">
          <span className="text-white-50 text-13">Order Id:</span>
          <span className="text-white fw-semibold text-13">
            {depositData?.order_id ?? depositData?.id ?? '—'}
          </span>
        </div>
        <div className="d-flex justify-content-between">
          <span className="text-white-50 text-13">Jumlah Deposit:</span>
          <span className="text-blue fw-semibold text-13">
            Rp {Number(depositData?.amount ?? 0).toLocaleString('id-ID')}
          </span>
        </div>
      </div>

      {/* How to Pay */}
      <div className="instructions-card mt-3">
        <p className="text-white fw-semibold text-13 mb-3" style={{ letterSpacing: '0.5px' }}>
          Petunjuk Pembayaran QRIS
        </p>
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
          {isSuccess ? 'Lihat Riwayat Deposit' : 'Saya Sudah Membayar'}
        </button>
      </div>
    </main>
  );
};

export default DepositQris;

