import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSubmitBonusCode } from '../hooks/useBonus';
import '../styles/redeem-code.css';

const SAMPLE_CODES = ['WELCOME50', 'BONUS100', 'CRYPTO2026', 'INVEST500'];

const GiftIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M4 10.25h16v8.25a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8.25Z" stroke="currentColor" strokeWidth="1.8" />
    <path d="M12 6.25v14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M3.5 10.25h17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M8.4 8.25c-1.46 0-2.65-.95-2.65-2.13 0-1.06.77-1.87 1.87-1.87 1.76 0 3.12 2.11 4.38 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M15.6 8.25c1.46 0 2.65-.95 2.65-2.13 0-1.06-.77-1.87-1.87-1.87-1.76 0-3.12 2.11-4.38 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

const RedeemCode = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [modal, setModal] = useState(null); // { type: 'success'|'error', message: string }
  const { mutate: submitCode, isPending } = useSubmitBonusCode();

  const closeModal = () => {
    const type = modal?.type;
    setModal(null);
    if (type === 'success') navigate('/home');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const normalizedCode = code.trim().toUpperCase();
    if (!normalizedCode) {
      setModal({ type: 'error', message: 'Masukkan kode redeem terlebih dahulu.' });
      return;
    }

    submitCode(
      { bonus_code: normalizedCode },
      {
        onSuccess: (res) => {
          setCode('');
          setModal({
            type: 'success',
            message: res?.message || 'Berhasil menukarkan kode bonus!',
          });
        },
        onError: (err) => {
          setModal({
            type: 'error',
            message: err?.response?.data?.message || 'Gagal menukarkan kode. Coba lagi.',
          });
        },
      }
    );
  };

  return (
    <main className="redeem-code-page" style={{ backgroundImage: 'url(/images/signup-bg.jpeg)' }}>
      {modal && (
        <div className="redeem-modal-overlay" onClick={closeModal}>
          <div className="redeem-modal" onClick={(e) => e.stopPropagation()}>
            <div className={`redeem-modal__icon-wrap redeem-modal__icon-wrap--${modal.type}`}>
              {modal.type === 'success' ? (
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="11" stroke="#22c55e" strokeWidth="1.8" />
                  <path d="M7 12.5l3.5 3.5 6.5-7" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="11" stroke="#ef4444" strokeWidth="1.8" />
                  <path d="M8 8l8 8M16 8l-8 8" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
                </svg>
              )}
            </div>
            <h2 className="redeem-modal__title">
              {modal.type === 'success' ? 'Berhasil!' : 'Gagal'}
            </h2>
            <p className="redeem-modal__message">{modal.message}</p>
            <button className={`redeem-modal__btn redeem-modal__btn--${modal.type}`} onClick={closeModal}>
              {modal.type === 'success' ? 'Kembali ke Beranda' : 'Tutup'}
            </button>
          </div>
        </div>
      )}
      <div className="redeem-code-shell">
        <div className="d-flex align-items-center pt-3">
          <button className="btn-trans redeem-back-btn" onClick={() => navigate(-1)} type="button">
            <img src="/images/btn-back.png" className="btn-back" alt="Kembali" />
          </button>
          <div className="text-center w-100">
            <p className="text-white fw-semibold fs-5 mb-0 me-5">Redeem Code</p>
          </div>
        </div>

        <section className="redeem-card redeem-card--intro">
          <div className="redeem-card__headline">
            <div className="redeem-card__icon">
              <GiftIcon />
            </div>
            <h1 className="redeem-card__title">Redeem Your Code</h1>
          </div>
          <p className="redeem-card__copy">
            Enter a valid redeem code to receive rewards, bonuses, or special prizes.
          </p>
        </section>

        <section className="redeem-card redeem-card--form">
          <form onSubmit={handleSubmit}>
            <label className="redeem-label" htmlFor="redeem-code-input">Redeem Code</label>
            <input
              id="redeem-code-input"
              className="redeem-input"
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="Masukkan kode Anda"
              autoComplete="off"
            />

            <button className="redeem-submit-btn" type="submit" disabled={isPending}>
              {isPending ? 'Sedang menukar...' : 'Tukarkan Sekarang'}
            </button>

            <p className="redeem-hint">
              Try: {SAMPLE_CODES.join(', ')}
            </p>


          </form>
        </section>
      </div>
    </main>
  );
};

export default RedeemCode;
