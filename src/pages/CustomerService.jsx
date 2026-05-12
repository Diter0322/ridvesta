import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/deposit-list.css';

const CustomerService = () => {
  const navigate = useNavigate();
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const currentTimeWIB = useMemo(() => {
    const time = new Intl.DateTimeFormat('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: 'Asia/Jakarta',
    }).format(now);

    return `${time} WIB`;
  }, [now]);

  const isWithinServiceHours = useMemo(() => {
    const parts = new Intl.DateTimeFormat('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: 'Asia/Jakarta',
    }).formatToParts(now);

    const hour = Number(parts.find((part) => part.type === 'hour')?.value ?? '0');
    const minute = Number(parts.find((part) => part.type === 'minute')?.value ?? '0');
    const currentMinutes = hour * 60 + minute;

    const startMinutes = 10 * 60;
    const endMinutes = 17 * 60;

    return currentMinutes >= startMinutes && currentMinutes < endMinutes;
  }, [now]);

  return (
    <main
      className="deposit-list"
      style={{ backgroundImage: 'url(/images/signup-bg.jpeg)' }}
    >
      <div className="d-flex align-items-center pt-3">
        <button className="btn-trans" onClick={() => navigate(-1)}>
          <img src="/images/btn-back.png" className="btn-back" alt="" />
        </button>
        <div className="text-center w-100">
          <p className="text-white fw-semibold fs-5 mb-0 me-5">Layanan Pelanggan</p>
        </div>
      </div>

      <div className="mt-4">
        <div className="depo-card">
          <div className="d-flex gap-2 align-items-center">
            <div>
              <img src="/images/telegram.png" alt="" />
            </div>
            <div>
              <p className="text-white fw-semibold mb-0">Cs Telegram</p>
              <p className="text-light3 mb-0 text-sm">Layanan Bantuan Langsung</p>
            </div>
          </div>
          <div className="text-end">
            <a href="https://t.me/emashariancs/" className="btn-contact">Hubungi</a>
          </div>
        </div>
        <div className="depo-card">
          <div className="d-flex gap-2 align-items-center">
            <div>
              <img src="/images/telegram.png" alt="" />
            </div>
            <div>
              <p className="text-white fw-semibold mb-0">Grup Diskusi</p>
              <p className="text-light3 mb-0 text-sm">Diskusi dan berbagi informasi</p>
            </div>
          </div>
          <div className="text-end">
            <a href="https://t.me/emasharian" className="btn-contact">Bergabung</a>
          </div>
        </div>
      </div>

      <div className="mt-5">
        <p className="text-white fw-semibold fs-5">Jam Layanan</p>
        <div className="row text-center">
          <div className="col-6">
            <div className="depo-card d-block">
              <p className="text-white text-18 fw-semibold mb-0">10:00-17:00</p>
              <p className="text-secondary mb-0 text-14">WIB (GMT+7)</p>
            </div>
          </div>
          <div className="col-6">
            <div className="depo-card d-block">
              <p className="text-white text-18 fw-semibold mb-0">{currentTimeWIB}</p>
              <p className="text-secondary mb-0 text-14">Waktu Sekarang</p>
            </div>
          </div>
          <div className="col-12">
            <div className="depo-card">
              <div className="d-flex gap-1 text-start">
                <i className="fa-regular fa-circle-question warning mt-1"></i>
                <div className="text-sm">
                  <p className={`mb-0 ${isWithinServiceHours ? 'text-success' : 'warning'}`}>
                    {isWithinServiceHours
                      ? 'Dalam jam kerja. Tim kami siap membantu Anda.'
                      : 'Di luar jam kerja. Kami akan merespons saat online.'}
                  </p>
                  <p className="mb-0 text-light3">
                    Sertakan ID Pengguna Anda saat menghubungi kami.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default CustomerService;
