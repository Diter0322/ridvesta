import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWithdrawals } from '../hooks/useWithdrawals';
import '../styles/withdraw-history.css';

const TABS = [
  { key: 'all', label: 'Semua', filter: null },
  { key: 'success', label: 'Berhasil', filter: 'approved' },
  { key: 'process', label: 'Diproses', filter: 'pending' },
];

const statusBadgeClass = (status) => {
  if (status === 'approved') return 'success';
  if (status === 'rejected' || status === 'cancelled') return 'failed';
  return 'pending';
};

const parseWithdrawalDate = (withdrawal) => {
  const dateValue = withdrawal.created_at || withdrawal.createdAt || withdrawal.date;
  if (!dateValue) return null;
  const parsed = new Date(dateValue);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const formatDateHeader = (dateObj) => (
  new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(dateObj)
);

const formatTimeValue = (dateObj) => (
  new Intl.DateTimeFormat('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(dateObj)
);

const formatDateValue = (dateObj) => (
  new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(dateObj)
);

const WithdrawHistory = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');

  const { data, isLoading: loading, isError } = useWithdrawals();
  const withdrawals = data?.withdrawals || [];
  const approved = withdrawals.filter((w) => w.status === 'approved');
  const totalAmount = approved.reduce((sum, w) => sum + (w.amount || 0), 0).toLocaleString('id-ID');
  const oneWeekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
  const weeklyAmount = approved
    .filter((w) => {
      const dateValue = w.created_at || w.createdAt || w.date;
      if (!dateValue) return false;
      const parsedDate = new Date(dateValue);
      if (Number.isNaN(parsedDate.getTime())) return false;
      return parsedDate.getTime() >= oneWeekAgo;
    })
    .reduce((sum, w) => sum + (w.amount || 0), 0)
    .toLocaleString('id-ID');

  const currentFilter = TABS.find((t) => t.key === activeTab)?.filter;
  const filtered = currentFilter
    ? withdrawals.filter((w) =>
        currentFilter === 'pending'
          ? w.status === 'pending' || w.status === 'processing'
          : w.status === currentFilter
      )
    : withdrawals;

  const sortedWithdrawals = [...filtered].sort((a, b) => {
    const aDate = parseWithdrawalDate(a);
    const bDate = parseWithdrawalDate(b);

    if (!aDate && !bDate) return 0;
    if (!aDate) return 1;
    if (!bDate) return -1;

    return bDate.getTime() - aDate.getTime();
  });

  const groupedByDate = sortedWithdrawals.reduce((groups, withdrawal) => {
    const parsedDate = parseWithdrawalDate(withdrawal);
    const dateKey = parsedDate
      ? new Intl.DateTimeFormat('en-CA', {
          timeZone: 'Asia/Jakarta',
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        }).format(parsedDate)
      : 'no-date';

    const existingGroup = groups.find((group) => group.key === dateKey);
    if (existingGroup) {
      existingGroup.items.push(withdrawal);
      return groups;
    }

    groups.push({
      key: dateKey,
      label: parsedDate ? formatDateHeader(parsedDate) : 'Tanggal tidak tersedia',
      items: [withdrawal],
    });
    return groups;
  }, []);

  return (
    <main className="withdraw-history mb-3" style={{ backgroundImage: 'url(/images/signup-bg.jpeg)' }}>
      <div className="d-flex align-items-center pt-3">
        <button className="btn-trans" onClick={() => navigate(-1)}>
          <img src="/images/btn-back.png" className="btn-back" alt="" />
        </button>
        <div className="text-center w-100">
          <p className="text-white fw-semibold fs-5 mb-0 me-5">Riwayat Penarikan</p>
        </div>
      </div>

      {isError && (
        <div className="alert alert-danger fade show mt-3" role="alert">
          Gagal memuat riwayat penarikan
        </div>
      )}

      <div className="mt-4">
        <div className="withdraw-card">
          <div className="withdraw-summary-grid">
            <div>
              <p className="text-white text-20 mb-1 fw-medium">Total Penarikan Sukses</p>
              <p>
                <span className="text-white fw-semibold">Rp </span>
                <span className="text-blue text-34 fw-semibold">{totalAmount}</span>
              </p>
            </div>
            <div className="withdraw-weekly-box">
              <p className="mb-1">7 Hari Terakhir</p>
              <p className="mb-0">Rp {weeklyAmount}</p>
            </div>
          </div>
        </div>

        <ul className="nav nav-tabs mt-4" id="myTab" role="tablist">
          {TABS.map((tab) => (
            <li className="nav-item" role="presentation" key={tab.key}>
              <button
                className={`nav-link ${activeTab === tab.key ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.key)}
                type="button"
                role="tab"
              >
                {tab.label}
              </button>
            </li>
          ))}
        </ul>

        <div className="tab-content" id="myTabContent">
          {loading ? (
            <div className="text-center text-white" style={{ padding: '40px 20px' }}>
              <div className="spinner-border text-danger" role="status">
                <span className="visually-hidden">Memuat...</span>
              </div>
              <p style={{ marginTop: '15px' }}>Memuat riwayat penarikan...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center text-white mt-5" style={{ opacity: 0.6 }}>
              <p>Tidak ada catatan penarikan.</p>
            </div>
          ) : (
            groupedByDate.map((group) => (
              <div key={group.key} className="withdraw-date-group">
                <p className="withdraw-date-label mb-2">{group.label}</p>
                {group.items.map((w) => {
                  const parsedDate = parseWithdrawalDate(w);
                  return (
                    <div className="with-card" key={w.id}>
                      <div>
                        <p className="text-white text-18 fw-semibold mb-2">
                          Rp {w.amount_formatted}
                        </p>
                        <p className="text-light4 mb-0 text-11">
                          <img
                            className="ovo"
                            src={w.bank?.logo_url || '/images/bank-default.png'}
                            alt=""
                            onError={(e) => { e.target.src = '/images/bank-default.png'; }}
                          />{' '}
                          {w.bank?.name || '-'}
                          <br />
                          <span className="text-light3">{w.bank?.masked_account || ''}</span>
                        </p>
                      </div>
                      <div className="text-end">
                        <span className={`${statusBadgeClass(w.status)} badge`}>
                          {w.status_text || w.status}
                        </span>
                        <p className="text-light3 text-14 mb-0 mt-2">
                          Fee: Rp {w.tax_formatted || '0'}
                        </p>
                        <p className="mb-0 text-white-50 text-11 mt-2">
                          {parsedDate ? `${formatDateValue(parsedDate)} | ${formatTimeValue(parsedDate)} WIB` : '-'}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
};

export default WithdrawHistory;


