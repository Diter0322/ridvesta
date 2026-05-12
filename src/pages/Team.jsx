import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTeam, useTeamSummary } from '../hooks/useTeam';
import '../styles/team.css';

const GENERATION_LABELS = ['1', '2', '3'];
const GENERATION_IMAGES = ['/images/1st.png', '/images/2nd.png', '/images/3rd.png'];

const Team = () => {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const { data: teamData, isLoading: teamLoading, isError: teamError } = useTeam();
  const { data: summaryData, isLoading: summaryLoading } = useTeamSummary();

  const loading = teamLoading || summaryLoading;
  const levels = summaryData?.levels || [];

  const rawShareLink = teamData?.user?.share_link || '';
  const shareLink = rawShareLink ? `${window.location.origin}${rawShareLink}` : '';
  const qrUrl = shareLink
    ? `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(shareLink)}`
    : '/images/qr.png';
  const totalReferrals = teamData?.statistics?.total_referrals?.total ?? teamData?.statistics?.total_referrals ?? 0;
  const totalCommission = teamData?.statistics?.total_commission ?? 0;
  const commissions = teamData?.commissions || [];

  const handleCopy = () => {
    if (!shareLink) return;
    navigator.clipboard.writeText(shareLink).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const fmt = (n) =>
    typeof n === 'number' ? `Rp ${n.toLocaleString('id-ID')}` : `Rp 0`;

  return (
    <main className="team">
      <div className="d-flex align-items-center pt-3">
        <button className="btn-trans" onClick={() => navigate('/home')}>
          <img src="/images/btn-back.png" className="btn-back" alt=""/>
        </button>
        <div className="text-center w-100">
          <p className="text-white fw-semibold fs-5 mb-0 me-5">Referral Tim</p>
        </div>
      </div>

      {teamError && (
        <div className="alert alert-danger alert-dismissible fade show mt-3" role="alert">
          Gagal memuat data tim
        </div>
      )}

      {loading ? (
        <div className="text-center text-white" style={{ padding: '60px 20px' }}>
          <div className="spinner-border text-danger" role="status">
            <span className="visually-hidden">Memuat...</span>
          </div>
          <p style={{ marginTop: '15px' }}>Memuat data tim...</p>
        </div>
      ) : (
        <>
          {/* Top stat cards */}
          <div className="mt-4 row">
            <div className="col-6">
              <div className="team-card">
                <div className="d-flex justify-content-between mb-3">
                  <p className="mb-0 text-20" style={{ fontSize: '14px' }}>
                    {Number(totalReferrals) || 0}
                  </p>
                  <div>
                    <img src="/images/team-icon1.png" alt="" />
                  </div>
                </div>
                <p className="text-14 fw-medium mb-0 fw-semibold">Total referral</p>
                <img className="bg" src="/images/team-card-bg.png" alt="" />
              </div>
            </div>
            <div className="col-6">
              <div className="team-card">
                <div className="d-flex justify-content-between mb-3">
                  <p className="mb-0 text-20" style={{ fontSize: '14px' }}>
                    {fmt(totalCommission)}
                  </p>
                  <div>
                    <img src="/images/team-icon2.png" alt="" />
                  </div>
                </div>
                <p className="text-14 fw-medium mb-0 fw-semibold">Total komisi</p>
                <img className="bg" src="/images/team-card-bg.png" alt="" />
              </div>
            </div>
          </div>

          {/* QR & referral link */}
          <div className="text-center my-3">
            
            <p className="text-sm text-white text-10 mt-2 mb-0">
              Bagikan link referral Anda kepada teman untuk bergabung
            </p>
            <div className="link-area mt-2">
              <input type="text" value={shareLink} readOnly />
              <button onClick={handleCopy}>
                {copied ? 'Tersalin!' : 'Salin Link'} <i className="fa-regular fa-copy"></i>
              </button>
            </div>
          </div>

          {/* Generation cards (level 1, 2, 3) */}
          {[0, 1, 2].map((i) => {
            const lvl = levels[i] || {};
            const comm = commissions[i] || {};
            return (
              <div className="mt-4" key={i}>
                <div className="team-card2">
                  <div className="d-flex justify-content-between text-white">
                    <div className="d-flex">
                      <div>
                        <img src={GENERATION_IMAGES[i]} alt="" />
                      </div>
                      <div>
                        <p className="mb-0 fw-medium text-12">Referral Level {GENERATION_LABELS[i]}</p>
                        <p className="mb-0 text-green2 text-12 fw-semibold">Bonus Komisi: {i === 0 ? '30%' : i === 1 ? '3%' : '1%'}</p>
                        <p className="mb-0 text-12">{lvl.total_referrals ?? 0} Anggota</p>
                      </div>
                    </div>
                    <div className="commission">
                      <p className="text-10 text-green2">Total Komisi</p>
                      <p className="text-12 mb-0">{comm.formatted_amount ? `Rp ${comm.formatted_amount}` : 'Rp 0'}</p>
                    </div>
                  </div>
                  <div className="row mt-2">
                    <div className="col-6">
                      <div className="team-card3">
                        <p className="text-14 fw-semibold text-white pt-1" style={{ marginBottom: 5 }}>{lvl.total_active_members ?? 0}</p>
                        <p className="text-light3 text-14">Anggota Aktif</p>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="team-card3">
                        <p className="text-14 fw-semibold text-white pt-1" style={{ marginBottom: 5 }}>
                          {lvl.total_deposit_formatted ? `Rp ${lvl.total_deposit_formatted}` : 'Rp 0'}
                        </p>
                        <p className="text-light3 text-14">Total Deposit</p>
                      </div>
                    </div>
                    <div className="col-12" style={{ position: 'relative', zIndex: 2 }}>
                      <button type="button" className="login-btn justify-content-center" onClick={() => navigate(`/referral-details/${i + 1}`)}>
                        <span>Lihat daftar anggota</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Rebate commission card */}
          

          <div className="middle-shape"></div>

          
        </>
      )}
    </main>
  );
};

export default Team;

