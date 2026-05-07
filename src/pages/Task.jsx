import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTasks, useSubmitTask } from '../hooks/useTasks';
import '../styles/additional.css';

const Task = () => {
  const navigate = useNavigate();
  const [modal, setModal] = useState({ show: false, type: '', title: '', message: '', reward: null });

  const { data: tasks = [], isLoading: loading, isError, error: fetchError } = useTasks();
  const submitTask = useSubmitTask();

  const handleClaimTask = (taskId) => {
    submitTask.mutate(taskId, {
      onSuccess: (result) => {
        setModal({
          show: true,
          type: 'success',
          title: 'Tugas Diklaim!',
          message: result?.message || 'Tugas berhasil diselesaikan.',
          reward: result?.data?.reward || result?.reward || null,
        });
      },
      onError: (err) => {
        setModal({
          show: true,
          type: 'error',
          title: 'Klaim Gagal',
          message: err?.response?.data?.message || 'Gagal mengirim tugas.',
          reward: null,
        });
      },
    });
  };

  return (
    <>
    <main className="task mb-4" style={{ backgroundImage: 'url(/images/signup-bg.jpeg)' }}>
      <div className="d-flex align-items-center pt-3">
        <button className="btn-trans" onClick={() => navigate(-1)}>
          <img src="/images/btn-back.png" className="btn-back" alt="" />
        </button>
        <div className="text-center w-100">
          <p className="text-white fw-semibold fs-5 me-5 mb-0">Tugas</p>
        </div>
      </div>

      {isError && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert" style={{ marginBottom: '15px', marginTop: '15px' }}>
          {fetchError?.response?.data?.message || 'Gagal memuat tugas'}
        </div>
      )}

      {loading ? (
        <div className="text-center text-white" style={{ padding: '40px 20px', marginTop: '40px' }}>
          <div className="spinner-border text-danger" role="status">
            <span className="visually-hidden">Memuat...</span>
          </div>
          <p style={{ marginTop: '15px' }}>Memuat tugas...</p>
        </div>
      ) : !Array.isArray(tasks) || tasks.length === 0 ? (
        <div className="text-center text-white" style={{ padding: '40px 20px', marginTop: '40px' }}>
          <p>Tidak ada tugas tersedia</p>
        </div>
      ) : (
        <>
          {/* Info Card about how missions work */}
          <div className="mt-4">
            <div className="task-card">
              <div className="card-head justify-content-start">
                <i className="fa-regular fa-circle-question text-blue"></i>
                <p className="text-white fw-medium mb-0">
                  Cara Kerja Misi Undangan
                </p>
              </div>
              <div className="p-3 text-white">
                <div className="d-flex gap-2 mb-2">
                  <img src="/images/icon/share.svg" alt="" />
                  <p className="text-12 white80">
                    Aktif di semua media sosial Anda: TikTok, Telegram, Grup WhatsApp, dll. (Penting)
                  </p>
                </div>
                <div className="d-flex gap-2 mb-2">
                  <img src="/images/icon/user.svg" alt="" />
                  <p className="text-12 white80">
                    Aktif di semua media sosial Anda: TikTok, Telegram, Grup WhatsApp, dll. (Penting)
                  </p>
                </div>
                <div className="d-flex gap-2 mb-2">
                  <img src="/images/icon/wallet.svg" alt="" />
                  <p className="text-12 white80">
                    Aktif di semua media sosial Anda: TikTok, Telegram, Grup WhatsApp, dll. (Penting)
                  </p>
                </div>
                <div className="d-flex gap-2 mb-2">
                  <img src="/images/icon/solar_gift.svg" alt="" />
                  <p className="text-12 white80">
                    Aktif di semua media sosial Anda: TikTok, Telegram, Grup WhatsApp, dll. (Penting)
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Task Cards - directly in main, not in a wrapper */}
          {tasks.map((task, index) => {
            // Extract percentage safely
            const percentageValue = parseInt(task.progress?.percentage) || 0;
            
            // Check if task is locked from task.status.locked
            const isTaskLocked = task.status?.locked || task.locked || false;
            const canClaim = task.status?.can_claim ?? true;
            
            // Extract current and required refs for display
            const currentRefs = task.progress?.current_refs ?? 0;
            const requiredRefs = task.progress?.required_refs ?? task.ref_number ?? 0;
            
            // Add mb-5 to last task for spacing
            const isLastTask = index === tasks.length - 1;
            
            return (
              <div key={task.id} className={`task-card mt-3 ${isLastTask ? 'mb-5' : ''}`}>
                <div className="card-head justify-content-between">
                  <div>
                    <p className="fw-semibold text-white mb-0">{task.name || task.title || 'Task'}</p>
                    <p className="mb-0 text-12 white70">
                      Requirments: {requiredRefs} {requiredRefs === 1 ? 'Member' : 'Members'}
                    </p>
                  </div>
                  <div>
                    <div className="circle" style={{ '--value': percentageValue }}>
                      <span> {currentRefs}/{requiredRefs} </span>
                    </div>
                  </div>
                </div>
                <div className="d-flex justify-content-between p-3">
                  <div className="price-box">
                    <span className="text-light3 fw-semibold">Hadiah</span>
                    <span className="text-white text-18 fw-semibold">{task.reward || 'Rp 0.00'}</span>
                  </div>
                  <button
                    className={isTaskLocked ? 'btn-lock' : 'btn-claimed'}
                    disabled={isTaskLocked || !canClaim || submitTask.isPending}
                    onClick={() => handleClaimTask(task.id)}
                  >
                    {submitTask.isPending && submitTask.variables === task.id ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Memproses...
                      </>
                    ) : isTaskLocked ? (
                      <>
                        <img src="/images/icon/lock.svg" alt="" /> Terkunci
                      </>
                    ) : (
                      <>
                        <img src="/images/icon/unlock.svg" alt="" /> Klaim
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </>
      )}
    </main>

      {/* Response Modal */}
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
              maxWidth: '340px',
              width: '100%',
              textAlign: 'center',
              boxShadow: `0 8px 32px ${modal.type === 'success' ? 'rgba(40,167,69,0.3)' : 'rgba(220,53,69,0.3)'}`,
              animation: 'modalPop 0.25s ease',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Icon */}
            <div
              style={{
                width: '64px', height: '64px', borderRadius: '50%',
                background: modal.type === 'success' ? 'rgba(40,167,69,0.15)' : 'rgba(220,53,69,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 16px',
                fontSize: '32px',
              }}
            >
              {modal.type === 'success' ? '✅' : '❌'}
            </div>

            {/* Title */}
            <p style={{ color: '#fff', fontWeight: '700', fontSize: '18px', marginBottom: '8px' }}>
              {modal.title}
            </p>

            {/* Message */}
            <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '14px', marginBottom: modal.reward ? '12px' : '24px' }}>
              {modal.message}
            </p>

            {/* Reward badge */}
            {modal.reward && (
              <div
                style={{
                  background: 'rgba(40,167,69,0.15)',
                  border: '1px solid rgba(40,167,69,0.4)',
                  borderRadius: '8px',
                  padding: '8px 16px',
                  marginBottom: '24px',
                  display: 'inline-block',
                }}
              >
                <span style={{ color: '#28a745', fontWeight: '600', fontSize: '15px' }}>
                  🎁 Reward: {modal.reward}
                </span>
              </div>
            )}

            {/* Close button */}
            <button
              onClick={() => setModal({ ...modal, show: false })}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '10px',
                border: 'none',
                background: modal.type === 'success'
                  ? 'linear-gradient(135deg, #28a745, #20c997)'
                  : 'linear-gradient(135deg, #dc3545, #c82333)',
                color: '#fff',
                fontWeight: '600',
                fontSize: '15px',
                cursor: 'pointer',
              }}
            >
              {modal.type === 'success' ? 'Luar Biasa!' : 'Tutup'}
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes modalPop {
          from { transform: scale(0.85); opacity: 0; }
          to   { transform: scale(1);    opacity: 1; }
        }
      `}</style>
    </>
  );
};

export default Task;

