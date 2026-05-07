import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useReferralLevel } from '../hooks/useReferral';
import '../styles/referral-details.css';

const ReferralDetails = () => {
  const navigate = useNavigate();
  const { level = '1' } = useParams();

  const { data, isLoading: loading, isError } = useReferralLevel(level);

  const summary = data?.summary || null;
  const commissions = data?.commissions || null;
  const members = data?.members || [];
  const levelInfo = data?.level || null;

  const commissionKey = level == 1 ? 'level_1_formatted' : level == 2 ? 'level_2_formatted' : 'level_3_formatted';
  const commissionAmt = commissions ? `Rp. ${commissions[commissionKey] || '0'}` : '-';
  const totalActiveRef = summary?.total_active_members ?? 0;
  const levelIcons = { '1': '1st.png', '2': '2nd.png', '3': '3rd.png' };
  const levelIcon = levelIcons[level] || '1st.png';

  return (
    <main
      className="referral-details"
      style={{ backgroundImage: 'url(/images/signup-bg.jpeg)' }}
    >
      <div className="d-flex align-items-center pt-4 mb-4">
        <button className="btn-trans" onClick={() => navigate(-1)}>
          <img src="/images/btn-back.png" className="btn-back" alt="" />
        </button>
        <div className="text-center w-100">
          <p className="text-white fw-semibold fs-5 me-5 mb-0">Anggota Tim</p>
        </div>
      </div>

      {isError && (
        <div className="alert alert-danger fade show mb-3" role="alert">
          Gagal memuat data referral
        </div>
      )}

      {loading ? (
        <div className="text-center text-white" style={{ padding: '60px 20px' }}>
          <div className="spinner-border text-danger" role="status">
            <span className="visually-hidden">Memuat...</span>
          </div>
          <p style={{ marginTop: '15px' }}>Memuat data referral...</p>
        </div>
      ) : (
        <>
          {/* Summary card */}
          <div className="red-card relative">
            <img className="referral-bg" src="/images/refer-bg.png" alt="" />
            <div className="d-flex justify-content-between">
              <p className="text-18 text-white">
                <img src={`/images/${levelIcon}`} alt="" /> Level {level}
              </p>
              <p className="text-14 text-light3 mb-0 mt-1 fw-semibold">
                {levelInfo?.total_referrals ?? 0} Anggota
              </p>
            </div>

            <div className="card-one">
              <div className="row">
                <div className="col-6">
                  <div className="card-two">
                    <img className="bg" src="/images/referral-bg2.png" alt="" />
                    <p className="text-18 text-white mb-1 mt-1 fw-semibold">
                      {totalActiveRef}
                    </p>
                    <p className="text-light3 mb-0 text-14">Total Referral Aktif</p>
                  </div>
                </div>
                <div className="col-6">
                  <div className="card-two">
                    <img className="bg" src="/images/referral-bg2.png" alt="" />
                    <p className="text-18 text-white fw-semibold mb-1 mt-1">
                      {commissionAmt}
                    </p>
                    <p className="text-light3 mb-0 text-14">Total Komisi</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Member cards */}
          {members.length === 0 ? (
            <div className="text-center text-white my-5" style={{ opacity: 0.6 }}>
              <p>Tidak ada anggota di Level {level}.</p>
            </div>
          ) : (
            members.map((member, index) => {
              const rank = String(index + 1).padStart(2, '');
              const isActive = member.member_status === 'active';
              const displayName = member.fullname || member.name || 'Tidak Diketahui';
              const maskedPhone = member.phone
                ? member.phone.slice(0, 4) + '****' + member.phone.slice(-4)
                : '-';
              const depositAmt = member.total_deposit_formatted
                ? `Rp. ${member.total_deposit_formatted}`
                : 'Rp. 0';
              const avatar = member.photo || '/images/avatar-default.png';

              return (
                <div className="red-card mt-4" key={member.id}>
                  <div className="d-flex justify-content-between text-white">
                    <div className="d-flex gap-2 align-items-center">
                      <div>
                        <img
                          className="user"
                          src={avatar}
                          alt=""
                          onError={(e) => { e.target.src = '/images/avatar-default.png'; }}
                        />
                      </div>
                      <div>
                        <p className="mb-0 fw-medium">{displayName}</p>
                        <p className="mb-0 text-12">{maskedPhone}</p>
                        <p className="mb-0 text-12">Total Investasi</p>
                      </div>
                    </div>
                    <div className="text-end">
                      {isActive ? (
                        <p className="mb-0 active text-sm mt-2">
                          <span className="dot"></span> Aktif
                        </p>
                      ) : (
                        <p className="mb-0 text-sm mt-2" style={{ color: '#aaa' }}>
                          Tidak Aktif
                        </p>
                      )}
                      <p className="mb-0 text-white fw-semibold">{depositAmt}</p>
                    </div>
                  </div>
                  {index < 3 && (
                    <div className="top">
                      <img src={`/images/icon/${rank}.png`} alt="" />
                      Top {rank}
                    </div>
                  )}
                  <div className="left-bar"></div>
                </div>
              );
            })
          )}
        </>
      )}
    </main>
  );
};

export default ReferralDetails;

