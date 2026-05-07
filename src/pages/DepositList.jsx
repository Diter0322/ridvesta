import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDeposits } from '../hooks/useDeposits';
import '../styles/deposit-list.css';

const TABS = [
  { key: 'all', label: 'Semua', filter: null },
  { key: 'success', label: 'Berhasil', filter: 'approved' },
  { key: 'process', label: 'Diproses', filter: 'pending' },
];

const DepositList = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');

  const { data, isLoading: loading, isError } = useDeposits();
  const deposits = data?.deposits || [];
  const summary = data?.summary || null;

  const currentFilter = TABS.find((t) => t.key === activeTab)?.filter;
  const filteredDeposits = currentFilter
    ? deposits.filter((d) => d.status === currentFilter || (currentFilter === 'pending' && (d.status === 'pending' || d.status === 'processing')))
    : deposits;

  const getMethodLogo = (code) => {
    if (!code) return '/images/bri.png';
    const lower = code.toLowerCase();
    if (lower === 'qris') return '/images/qris.png';
    return `/images/${lower}.png`;
  };

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

      <div className="my-4">
        <p className="text-white text-14 mb-3">Total Deposit Berhasil</p>
        <p className="text-white">
          <span>Rp</span>
          <span className="fs-3 fw-semibold">
            {summary ? summary.total_approved_formatted : '0'}
          </span>
        </p>

        <ul className="nav nav-tabs" id="myTab" role="tablist">
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

        <div className="tab-content mb-5 pb-3" id="myTabContent">
          {loading ? (
            <div className="text-center text-white" style={{ padding: '40px 20px' }}>
              <div className="spinner-border text-danger" role="status">
                <span className="visually-hidden">Memuat...</span>
              </div>
              <p style={{ marginTop: '15px' }}>Memuat riwayat deposit...</p>
            </div>
          ) : filteredDeposits.length === 0 ? (
            <div className="text-center text-white mt-5" style={{ opacity: 0.6 }}>
              <p>Tidak ada catatan deposit.</p>
            </div>
          ) : (
            filteredDeposits.map((d) => {
              const isSuccess = d.status === 'approved';
              const isProcess = d.status === 'pending' || d.status === 'processing';
              const badgeClass = isSuccess ? 'success' : isProcess ? 'process' : 'process';
              const badgeText = d.status_text || (isSuccess ? 'Success' : 'In Process');

              return (
                <div className="depo-card" key={d.id}>
                  <div className="d-flex gap-2 align-items-center">
                    <img
                      src={d.payment_method?.logo_url || '/images/bri.png'}
                      className="img-fluid silver-emboss"
                      style={{ maxHeight: 45, borderRadius: 25}}
                      alt={d.payment_method?.name || ''}
                      onError={(e) => { e.target.src = '/images/bri.png'; }}
                    />
                    <div>
                      <p className="text-white text-18 fw-semibold mb-1">
                        Rp {d.amount_formatted}
                      </p>
                      <p className="text-light3 mb-0 text-14">{d.order_id}</p>
                    </div>
                  </div>
                  <div className="text-end">
                    <span className={`${badgeClass} badge`}>{badgeText}</span>
                    <p className="text-light3 text-14 mb-0">{d.created_at_formatted}</p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </main>
  );
};

export default DepositList;


