import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTransactions } from '../hooks/useTransactions';
import '../styles/transaction-history.css';

const statusClass = (status) => {
  if (!status) return 'success';
  const s = status.toLowerCase();
  if (s === 'success' || s === 'approved') return 'success';
  if (s === 'failed' || s === 'rejected') return 'failed';
  return 'pending';
};

const statusLabel = (status) => {
  if (!status) return 'Success';
  const s = status.toLowerCase();
  if (s === 'approved') return 'Success';
  if (s === 'rejected') return 'Failed';
  if (s === 'pending' || s === 'processing') return 'Processing';
  return status.charAt(0).toUpperCase() + status.slice(1);
};

const formatDateTime = (value, fallbackTime) => {
  if (!value) return fallbackTime ? `Time : ${fallbackTime}` : 'Time : -';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return fallbackTime ? `Time : ${fallbackTime}` : 'Time : -';
  }

  return `Date : ${date.toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })}`;
};

const TransactionHistory = () => {
  const navigate = useNavigate();
  const { data, isLoading, isError } = useTransactions();

  const groupedTransactions = data?.transactions_grouped ?? [];
  const transactions = groupedTransactions.flatMap((group) =>
    (group?.transactions ?? []).map((tx) => ({
      ...tx,
      groupDateLabel: group?.date_label,
    }))
  );

  return (
    <main
      className="transaction-history-page"
      style={{ backgroundImage: 'url(/images/signup-bg.jpeg)' }}
    >
      {/* Header */}
      <div className="d-flex align-items-center pt-3">
        <button className="btn-trans" onClick={() => navigate(-1)}>
          <img src="/images/btn-back.png" className="btn-back" alt="Kembali" />
        </button>
        <div className="text-center w-100">
          <p className="text-white fw-semibold fs-5 mb-0 me-5">Transaction history</p>
        </div>
      </div>

      {isError && (
        <div className="alert alert-danger fade show mt-3" role="alert">
          Gagal memuat riwayat transaksi
        </div>
      )}

      <div className="mt-4">
        {isLoading ? (
          <div className="text-center text-white" style={{ padding: '40px 20px' }}>
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Memuat...</span>
            </div>
            <p style={{ marginTop: '15px' }}>Memuat transaksi...</p>
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center text-white-50 mt-5">
            <p>Belum ada transaksi</p>
          </div>
        ) : (
          transactions.map((tx, i) => (
            <div className="tx-card" key={tx.id ?? i}>
              <div className="tx-left">
                <div className="tx-accent-bar" />
                <div className="tx-info">
                  <p className="tx-title">{tx.description ?? tx.title ?? tx.type ?? 'Transaksi'}</p>
                  <p className="tx-subtitle">{tx.perticulation ?? tx.subtitle ?? tx.note ?? tx.groupDateLabel ?? ''}</p>
                  <p className="tx-date">
                    {formatDateTime(tx.created_at, tx.time)}
                  </p>
                </div>
              </div>
              <div className="tx-right">
                <div className={`tx-status tx-status--${statusClass(tx.status_class ?? tx.status)}`}>
                  <span className="tx-status-dot" />
                  {tx.status_text ?? statusLabel(tx.status)}
                </div>
                <p className="tx-amount">
                  {tx.amount_with_sign ?? `Rp ${Number(tx.amount ?? 0).toLocaleString('id-ID')}`}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
};

export default TransactionHistory;

