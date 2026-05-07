import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDeposits } from '../hooks/useDeposits';
import '../styles/deposit-list.css';

const TABS = [
  { key: 'all', label: 'Semua', filter: null },
  { key: 'success', label: 'Berhasil', filter: 'approved' },
  { key: 'process', label: 'Diproses', filter: 'pending' },
];

const parseDepositDate = (deposit) => {
  const dateValue = deposit.created_at || deposit.createdAt || deposit.date;
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

const formatDepositDate = (dateObj) => (
  new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(dateObj)
);

const formatDepositTime = (dateObj) => (
  new Intl.DateTimeFormat('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(dateObj)
);

const DepositList = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');

  const { data, isLoading: loading, isError } = useDeposits();
  const deposits = data?.deposits || [];
  const summary = data?.summary || null;
  const oneWeekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);

  const weeklyApprovedTotal = deposits
    .filter((d) => {
      if (d.status !== 'approved') return false;
      const dateValue = d.created_at || d.createdAt || d.date;
      if (!dateValue) return false;
      const parsedDate = new Date(dateValue);
      if (Number.isNaN(parsedDate.getTime())) return false;
      return parsedDate.getTime() >= oneWeekAgo;
    })
    .reduce((sum, d) => sum + (d.amount || 0), 0)
    .toLocaleString('id-ID');

  const currentFilter = TABS.find((t) => t.key === activeTab)?.filter;
  const filteredDeposits = currentFilter
    ? deposits.filter((d) => d.status === currentFilter || (currentFilter === 'pending' && (d.status === 'pending' || d.status === 'processing')))
    : deposits;

  const sortedDeposits = [...filteredDeposits].sort((a, b) => {
    const aDate = parseDepositDate(a);
    const bDate = parseDepositDate(b);

    if (!aDate && !bDate) return 0;
    if (!aDate) return 1;
    if (!bDate) return -1;

    return bDate.getTime() - aDate.getTime();
  });

  const groupedByDate = sortedDeposits.reduce((groups, deposit) => {
    const parsedDate = parseDepositDate(deposit);
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
      existingGroup.items.push(deposit);
      return groups;
    }

    groups.push({
      key: dateKey,
      label: parsedDate ? formatDateHeader(parsedDate) : 'Tanggal tidak tersedia',
      items: [deposit],
    });

    return groups;
  }, []);

  return (
    <main className="deposit-list" style={{ backgroundImage: 'url(/images/signup-bg.jpeg)' }}>
      <div className="d-flex align-items-center pt-3">
        <button className="btn-trans" onClick={() => navigate(-1)}>
          <img src="/images/btn-back.png" className="btn-back" alt="" />
        </button>
        <div className="text-center w-100">
          <p className="text-white fw-semibold fs-5 mb-0 me-5">Riwayat Deposit</p>
        </div>
      </div>

      {isError && (
        <div className="alert alert-danger fade show mt-3" role="alert">
          Gagal memuat riwayat deposit
        </div>
      )}

      <div className="mt-4">
        <div className="deposit-summary-card mb-3">
          <div className="deposit-summary-grid">
            <div>
              <p className="text-white text-20 mb-1 fw-medium">Total Deposit Sukses</p>
              <p className="text-white">
                <span>Rp </span>
                <span className="text-blue text-34 fw-semibold">
                  {summary ? summary.total_approved_formatted : '0'}
                </span>
              </p>
            </div>
            <div className="deposit-weekly-box">
              <p className="mb-1">7 Hari Terakhir</p>
              <p className="mb-0">Rp {weeklyApprovedTotal}</p>
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
              <p style={{ marginTop: '15px' }}>Memuat riwayat deposit...</p>
            </div>
          ) : groupedByDate.length === 0 ? (
            <div className="text-center text-white mt-5" style={{ opacity: 0.6 }}>
              <p>Tidak ada catatan deposit.</p>
            </div>
          ) : (
            groupedByDate.map((group) => (
              <div key={group.key} className="deposit-date-group">
                <p className="deposit-date-label mb-2">{group.label}</p>
                {group.items.map((d) => {
                  const isSuccess = d.status === 'approved';
                  const isProcess = d.status === 'pending' || d.status === 'processing';
                  const badgeClass = isSuccess ? 'success' : isProcess ? 'process' : 'process';
                  const badgeText = d.status_text || (isSuccess ? 'Success' : 'In Process');
                  const parsedDate = parseDepositDate(d);

                  return (
                    <div className="depo-card" key={d.id}>
                      <div className="d-flex gap-2 align-items-center">
                        <img
                          src={d.payment_method?.logo_url || '/images/bri.png'}
                          className="method-logo"
                          alt={d.payment_method?.name || ''}
                          onError={(e) => { e.target.src = '/images/bri.png'; }}
                        />
                        <div>
                          <p className="text-white text-18 fw-semibold mb-1">
                            Rp {d.amount_formatted}
                          </p>
                          <p className="text-light3 mb-0 text-14 deposit-meta">{d.order_id}</p>
                        </div>
                      </div>
                      <div className="text-end">
                        <span className={`${badgeClass} badge`}>{badgeText}</span>
                        <p className="mb-0 text-white-50 text-11 mt-4 pt-1">
                          {parsedDate ? `${formatDepositDate(parsedDate)} | ${formatDepositTime(parsedDate)} WIB` : '-'}
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

export default DepositList;


