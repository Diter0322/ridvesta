import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBankData, useSaveBankData } from '../hooks/useBankData';
import '../styles/bank-data.css';

const BankData = () => {
  const navigate = useNavigate();

  const [selectedBank, setSelectedBank] = useState(null);
  const [form, setForm] = useState({ full_name: '', bank_account: '' });
  const [modal, setModal] = useState({ show: false, type: '', message: '' });

  const { data: bankDataResult, isLoading: loading, isError } = useBankData();
  const saveBank = useSaveBankData();

  const bankList = bankDataResult?.bank_list || [];
  const currentBank = bankDataResult?.bank_data || null;

  // Pre-fill form whenever data loads
  useEffect(() => {
    if (bankDataResult?.bank_data) {
      const bd = bankDataResult.bank_data;
      setForm({ full_name: bd.full_name || '', bank_account: bd.bank_account || '' });
      const matched = (bankDataResult.bank_list || []).find((b) => b.id === bd.bank_id);
      if (matched) setSelectedBank(matched);
    }
  }, [bankDataResult]);

  const handleSave = () => {
    if (!selectedBank) {
      setModal({ show: true, type: 'error', message: 'Harap pilih bank terlebih dahulu.' });
      return;
    }
    if (!form.full_name.trim()) {
      setModal({ show: true, type: 'error', message: 'Harap masukkan nama pemilik rekening.' });
      return;
    }
    if (!form.bank_account.trim()) {
      setModal({ show: true, type: 'error', message: 'Harap masukkan nomor rekening.' });
      return;
    }

    saveBank.mutate(
      { bank_id: selectedBank.id, full_name: form.full_name, bank_account: form.bank_account },
      {
        onSuccess: (json) => {
          setModal({ show: true, type: 'success', message: json?.message || 'Rekening bank berhasil disimpan.' });
        },
        onError: (err) => {
          setModal({ show: true, type: 'error', message: err?.response?.data?.message || 'Gagal menyimpan data bank.' });
        },
      }
    );
  };

  return (
    <main className="bank-data" style={{ backgroundImage: 'url(/images/signup-bg.jpeg)' }}>
      <div className="d-flex align-items-center pt-3">
        <button className="btn-trans" onClick={() => navigate(-1)}>
          <img src="/images/btn-back.png" className="btn-back" alt="" />
        </button>
        <div className="text-center w-100">
          <p className="text-white fw-semibold fs-5 mb-0 me-5">Data Bank</p>
        </div>
      </div>

      {isError && (
        <div className="alert alert-danger fade show mt-3" role="alert">
          Gagal memuat data bank
        </div>
      )}

      {loading ? (
        <div className="text-center text-white" style={{ padding: '60px 20px' }}>
          <div className="spinner-border text-danger" role="status">
            <span className="visually-hidden">Memuat...</span>
          </div>
          <p style={{ marginTop: '15px' }}>Memuat data bank...</p>
        </div>
      ) : (
        <>
          <div className="mt-4 mb-4">

            {/* Current bank account */}
            <div className="bank-card">
              <div className="card-head">
                <div>
                  <img src="/images/icon/bank-data1.svg" alt="" />
                </div>
                <p className="text-white fw-medium mb-0">Rekening Bank Saat Ini</p>
              </div>
              {currentBank ? (
                <ul>
                  <li>
                    <span className="text-14">Nama Pemilik Rekening</span>
                    <span className="fw-medium">{currentBank.full_name || '-'}</span>
                  </li>
                  <li>
                    <span className="text-14">Nomor Rekening</span>
                    <span className="fw-medium">{currentBank.masked_account || currentBank.bank_account || '-'}</span>
                  </li>
                  <li>
                    <span className="text-14">Nama Bank</span>
                    <span className="fw-medium">{currentBank.bank_name || '-'}</span>
                  </li>
                </ul>
              ) : (
                <p className="text-white text-14 px-3 py-2 mb-0" style={{ opacity: 0.6 }}>
                  Belum ada rekening bank yang ditautkan.
                </p>
              )}
            </div>

            {/* Bank selector */}
            <div className="bank-card my-4">
              <div className="card-head">
                <div>
                  <img src="/images/icon/bank-data2.svg" alt="" />
                </div>
                <p className="text-white fw-medium mb-0">Pilih &amp; Isi Data Rekening</p>
              </div>
              <div
                className="my-3 bg-grey"
                style={{ borderRadius: '15px', maxHeight: '270px', overflowY: 'auto', overflowX: 'hidden' }}
              >
                <div className="row mt-2">
                {bankList.length === 0 ? (
                  <p className="text-white text-14 mb-0" style={{ opacity: 0.6 }}>No banks available.</p>
                ) : (
                  bankList.map((bank) => (
                    <div key={bank.id} className="col-4 d-flex mb-1" onClick={() => setSelectedBank(bank)} style={{ cursor: 'pointer' }}>
                      <div
                        className="inner-card"
                        style={{
                          border: selectedBank?.id === bank.id ? '2px solid #e63946' : '2px solid transparent',
                          borderRadius: '10px',
                          transition: 'border 0.2s',
                        }}
                      >
                        {bank.logo_url ? (
                          <img
                            src={bank.logo_url}
                            alt={bank.name}
                            style={{ minWidth: '70px', width: '100%', height: 'auto' }}
                            onError={(e) => { e.target.style.display = 'none'; }}
                          />
                        ) : (
                          <div style={{ width: 40, height: 40 }} />
                        )}
                        <p className="mb-0 text-white fw-medium" style={{ fontSize: '9px' }}>{bank.name}</p>
                      </div>
                    </div>
                  ))
                )}
                </div>
              </div>

              {/* Form fields */}
              <div className="px-3 pb-3">
                <div className="mb-3">
                  <label className="text-white text-12 mb-1">Nomor Rekening</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Masukkan nomor rekening"
                    value={form.bank_account}
                    onChange={(e) => setForm({ ...form, bank_account: e.target.value })}
                    style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', borderRadius: '8px' }}
                  />
                </div>
                <div>
                  <label className="text-white text-12 mb-1">Nama Pemilik</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Masukkan nama pemilik rekening"
                    value={form.full_name}
                    onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                    style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', borderRadius: '8px' }}
                  />
                </div>
              </div>
            </div>

            {/* Summary preview */}
            <div className="bank-card">
              <ul className="text-14">
                <li>
                  <span>Nomor Rekening</span>
                  <span>{form.bank_account || '-'}</span>
                </li>
                <li>
                  <span>Nama Pemilik</span>
                  <span>{form.full_name || '-'}</span>
                </li>
                {selectedBank && (
                  <li>
                    <span>Bank</span>
                    <span>{selectedBank.name}</span>
                  </li>
                )}
              </ul>
            </div>
          </div>

          <div>
            <div className="mb-5 bottom">
              <button className="login-btn" onClick={handleSave} disabled={saveBank.isPending}>
                {saveBank.isPending ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Menyimpan...
                  </>
                ) : (
                  'Simpan Perubahan'
                )}
              </button>
            </div>
          </div>
        </>
      )}

      {/* Response modal */}
      {modal.show && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: 'rgba(0,0,0,0.6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '20px',
            backdropFilter: 'blur(4px)',
          }}
          onClick={() => setModal({ ...modal, show: false })}
        >
          <div
            style={{
              background: '#1a1a2e',
              border: `1px solid ${modal.type === 'success' ? '#28a745' : '#dc3545'}`,
              borderRadius: '16px',
              padding: '32px 24px',
              maxWidth: '320px',
              width: '100%',
              textAlign: 'center',
              boxShadow: `0 8px 32px ${modal.type === 'success' ? 'rgba(40,167,69,0.3)' : 'rgba(220,53,69,0.3)'}`,
              animation: 'modalPop 0.25s ease',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{
              width: '60px', height: '60px', borderRadius: '50%',
              background: modal.type === 'success' ? 'rgba(40,167,69,0.15)' : 'rgba(220,53,69,0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 16px', fontSize: '28px',
            }}>
              {modal.type === 'success' ? '✅' : '❌'}
            </div>
            <p style={{ color: '#fff', fontWeight: '700', fontSize: '17px', marginBottom: '8px' }}>
              {modal.type === 'success' ? 'Tersimpan!' : 'Kesalahan'}
            </p>
            <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '14px', marginBottom: '24px' }}>
              {modal.message}
            </p>
            <button
              onClick={() => setModal({ ...modal, show: false })}
              style={{
                width: '100%', padding: '12px', borderRadius: '10px', border: 'none',
                background: modal.type === 'success'
                  ? 'linear-gradient(135deg, #28a745, #20c997)'
                  : 'linear-gradient(135deg, #dc3545, #c82333)',
                color: '#fff', fontWeight: '600', fontSize: '15px', cursor: 'pointer',
              }}
            >
              {modal.type === 'success' ? 'Bagus!' : 'Tutup'}
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes modalPop {
          from { transform: scale(0.85); opacity: 0; }
          to   { transform: scale(1);    opacity: 1; }
        }
        .form-control::placeholder { color: rgba(255,255,255,0.4); }
        .form-control:focus { background: rgba(255,255,255,0.15) !important; box-shadow: none; border-color: rgba(255,255,255,0.4) !important; }
      `}</style>
    </main>
  );
};

export default BankData;

