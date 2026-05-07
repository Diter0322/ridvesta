import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWithdrawConfig, useCreateWithdrawal } from '../hooks/useWithdrawals';
import '../styles/withdraw.css';

const formatRupiah = (val) =>
  val ? Number(val).toLocaleString('id-ID') : '0';

const Withdraw = () => {
  const navigate = useNavigate();
  const [amount, setAmount] = useState('');
  const [modal, setModal] = useState({ open: false, type: '', message: '' });

  const closeModal = () => setModal({ open: false, type: '', message: '' });
  const showError = (message) => setModal({ open: true, type: 'error', message });

  const { data: withdrawConfig, isLoading: configLoading } = useWithdrawConfig();
  const { mutate: createWithdrawal, isPending } = useCreateWithdrawal();

  const taxRate = (withdrawConfig?.tax?.rate ?? 10) / 100;
  const minWithdraw = withdrawConfig?.withdraw_limits?.min ?? 50000;
  const maxWithdraw = withdrawConfig?.withdraw_limits?.max ?? 10000000;
  const minFormatted = withdrawConfig?.withdraw_limits?.min_formatted ?? 'Rp 50.000';
  const maxFormatted = withdrawConfig?.withdraw_limits?.max_formatted ?? 'Rp 10.000.000';
  const hasWithdrawnToday = withdrawConfig?.daily_limit?.has_withdrawn_today ?? false;

  const numAmount = parseInt(amount, 10) || 0;
  const taxDeduction = Math.floor(numAmount * taxRate);
  const amountReceived = numAmount - taxDeduction;

  const handleAmountChange = (e) => {
    const raw = e.target.value.replace(/\D/g, '');
    setAmount(raw);
  };

  const handleClear = () => setAmount('');

  const handleSubmit = () => {
    if (hasWithdrawnToday) {
      showError('Anda sudah melakukan penarikan hari ini. Coba lagi besok.');
      return;
    }
    if (!numAmount || numAmount < minWithdraw) {
      showError(`Minimum penarikan ${minFormatted}`);
      return;
    }
    if (numAmount > maxWithdraw) {
      showError(`Maximum penarikan ${maxFormatted}`);
      return;
    }
    if (!withdrawConfig?.has_bank_account) {
      showError('Silakan lengkapi data bank terlebih dahulu.');
      return;
    }

    createWithdrawal(
      { amount: numAmount },
      {
        onSuccess: (res) => {
          setAmount('');
          setModal({ open: true, type: 'success', message: res?.message || 'Penarikan berhasil diajukan!' });
        },
        onError: (err) => {
          setModal({ open: true, type: 'error', message: err?.response?.data?.message || 'Gagal mengajukan penarikan. Coba lagi.' });
        },
      }
    );
  };

  const bankInfo = withdrawConfig?.bank ?? {};
  const bankName = bankInfo?.name ?? '—';
  const accountNumber = bankInfo?.masked_account ?? bankInfo?.account_number ?? '—';
  const bankLogo = bankInfo?.logo ?? '/images/qris.png';
  const userBalance = withdrawConfig?.user?.balance_formatted ?? '—';
  const accountHolder = bankInfo?.account_holder ?? '';

  return (
    <main className="withdraw-page" style={{ backgroundImage: 'url(/images/signup-bg.jpeg)' }}>
      {/* Modal */}
      {modal.open && (
        <div className="withdraw-modal-overlay" onClick={closeModal}>
          <div className="withdraw-modal" onClick={(e) => e.stopPropagation()}>
            <div className={`withdraw-modal-icon ${modal.type}`}>
              {modal.type === 'success' ? (
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                  <circle cx="20" cy="20" r="20" fill="#22c55e" opacity="0.15"/>
                  <path d="M12 20l6 6 10-12" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ) : (
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                  <circle cx="20" cy="20" r="20" fill="#ef4444" opacity="0.15"/>
                  <path d="M14 14l12 12M26 14l-12 12" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round"/>
                </svg>
              )}
            </div>
            <p className="withdraw-modal-title">
              {modal.type === 'success' ? 'Berhasil' : 'Gagal'}
            </p>
            <p className="withdraw-modal-msg">{modal.message}</p>
            <button
              className={`withdraw-modal-btn ${modal.type}`}
              onClick={modal.type === 'success' ? () => navigate(-1) : closeModal}
            >
              {modal.type === 'success' ? 'Selesai' : 'Tutup'}
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
          <p className="text-white fw-semibold fs-5 mb-0 me-5">Penarikan Saldo</p>
        </div>
      </div>

      {/* Bank Card */}
      <div className="bank-info-card mt-4">
        {configLoading ? (
          <div className="text-white-50 text-13">Memuat data bank...</div>
        ) : !withdrawConfig?.has_bank_account ? (
          <div className="text-warning text-13">Belum ada rekening bank. <a href="/bank-data" className="text-blue">Tambah sekarang</a></div>
        ) : (
          <>
            <div className="bank-row mb-3">
              <p className="text-blue text-13 mb-1">Nama Bank</p>
              <div className="d-flex align-items-center gap-2">
                <img
                  src={bankLogo}
                  alt={bankName}
                  className="bank-logo"
                  onError={(e) => { e.currentTarget.src = '/images/qris.png'; }}
                />
                <div>
                  <span className="text-white fw-semibold">{bankName}</span>
                  {accountHolder ? <p className="text-white-50 text-12 mb-0">{accountHolder}</p> : null}
                </div>
              </div>
            </div>
            <div className="bank-divider" />
            <div className="bank-row mt-3">
              <p className="text-blue text-13 mb-1">Nomor Rekening</p>
              <p className="text-white fw-semibold mb-0">{accountNumber}</p>
            </div>
            <div className="bank-divider mt-3" />
            <div className="bank-row mt-3">
              <p className="text-blue text-13 mb-1">Saldo Penarikan</p>
              <p className="text-white fw-semibold mb-0">{userBalance}</p>
            </div>
          </>
        )}
      </div>

      {/* Amount Input */}
      <div className="mt-4">
        <p className="text-white fw-semibold mb-2">Masukkan Jumlah Penarikan</p>
        <div className="amount-input-wrap">
          <span className="amount-prefix">Rp</span>
          <input
            type="text"
            className="amount-input"
            value={amount ? formatRupiah(amount) : ''}
            onChange={handleAmountChange}
            placeholder="0"
            inputMode="numeric"
          />
          {amount && (
            <button className="amount-clear" onClick={handleClear} type="button">
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="10" r="9" stroke="#8899aa" strokeWidth="1.5" />
                <path d="M7 7l6 6M13 7l-6 6" stroke="#8899aa" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Min/Max Info */}
      <div className="minmax-card mt-3">
        <div className="minmax-item">
          <span className="text-white-50 text-13">Minimal:</span>
          <span className="text-blue fw-semibold ms-1">{minFormatted}</span>
        </div>
        <div className="minmax-divider" />
        <div className="minmax-item">
          <span className="text-white-50 text-13">Maksimal:</span>
          <span className="text-blue fw-semibold ms-1">{maxFormatted}</span>
        </div>
      </div>


      {/* Amount Received */}
      <div className="amount-received-card mt-4">
        <div className="d-flex justify-content-between align-items-center">
          <span className="text-white fw-semibold text-13" style={{ letterSpacing: '0.5px' }}>
            Jumlah Diterima
          </span>
          <span className="text-green fw-bold">
            RP {formatRupiah(amountReceived)}
          </span>
        </div>
        <p className="text-danger text-13 mb-0 mt-1 text-end">{withdrawConfig?.tax?.rate_percent ?? '10%'} Potongan Pajak.</p>
        <div className="amount-divider mt-3" />
      </div>

      {/* Proceed Button */}
      <div className="deposit-footer">
        <button
          className="btn-primary-full"
          onClick={handleSubmit}
          disabled={isPending}
          type="button"
        >
          {isPending ? 'Memproses...' : 'Proses Penarikan'}
        </button>
      </div>
    </main>
  );
};

export default Withdraw;

