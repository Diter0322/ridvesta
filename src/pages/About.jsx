import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/about.css';

const About = () => {
  const navigate = useNavigate();

  return (
    <main style={{ backgroundImage: 'url(/images/signup-bg.jpeg)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="d-flex align-items-center pt-3">
        <button className="btn-trans" onClick={() => navigate(-1)}>
          <img src="/images/btn-back.png" className="btn-back" alt="" />
        </button>
        <div className="text-center w-100">
          <p className="text-white fw-semibold fs-5 me-5 mb-0">Tentang</p>
        </div>
      </div>

      <div className="mt-4">
        {/* Company Profile */}
        <div className="task-card">
          <div className="card-head justify-content-start">
            <i className="fa-regular fa-circle-question text-blue"></i>
            <p className="text-white fw-medium mb-0">Profil Perusahaan</p>
          </div>
          <div className="p-3">
            <p className="text-14 white80">
              IDVESTA didirikan pada 2026 sebagai perusahaan investasi berlisensi
              yang berfokus pada manajemen aset digital dan konvensional. Kami saat ini
              mengelola dana lebih dari IDR 100 miliar dari ribuan investor di Indonesia.
            </p>
            <p className="text-14 white80">
              Dengan tim analis berpengalaman dan sistem pemantauan 24/7,
              kami menjamin pertumbuhan aset yang stabil dan aman.
            </p>
          </div>
        </div>

        {/* Our Statistics */}
        <div className="task-card mt-3 p-3">
          <p className="text-white fw-medium mb-3">Statistik Kami</p>
          <div className="row">
            <div className="col-6">
              <div className="task-card p-3">
                <p className="neutral text-12 mb-1">Dana Dikelola</p>
                <p className="text-20 fw-medium text-white mb-0">IDR 100M+</p>
              </div>
            </div>
            <div className="col-6">
              <div className="task-card p-3">
                <p className="neutral text-12 mb-1">Investor Aktif</p>
                <p className="text-20 fw-medium text-white mb-0">5.000+</p>
              </div>
            </div>
            <div className="col-6">
              <div className="task-card p-3">
                <p className="neutral text-12 mb-1">Rata-rata Profit Tahunan</p>
                <p className="text-20 fw-medium text-white mb-0">12%</p>
              </div>
            </div>
            <div className="col-6">
              <div className="task-card p-3">
                <p className="neutral text-12 mb-1">Uptime Sistem</p>
                <p className="text-20 fw-medium text-white mb-0">99.9%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Our Commitment */}
        <div className="task-card mt-3 p-3">
          <p className="text-white fw-medium mb-3">Komitmen Kami</p>
          <ul className="text-12 white80 ps-3">
            <li className="mb-2">
              Transparansi penuh laporan keuangan bulanan - Sistem keamanan tingkat bank
            </li>
            <li className="mb-2">Penarikan saldo cepat 1x24 jam</li>
            <li className="mb-2">Bantuan pengguna yang responsif</li>
            <li>Inovasi berkelanjutan untuk keuntungan maksimal.</li>
          </ul>
        </div>
      </div>

      {/* Start Investing */}
      <div className="investing mt-5">
        <p className="text-18 fw-bold text-white mb-0">Mulai Berinvestasi Sekarang</p>
        <p className="white80 text-12">
          Bergabunglah dengan ribuan investor sukses bersama IDVESTA
        </p>
        <button className="btn btn-two">Isi Saldo</button>
      </div>
    </main>
  );
};

export default About;
