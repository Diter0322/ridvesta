import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/form.css';

const OTP = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);

  const handleOtpChange = (index, value) => {
    const newOtp = [...otp];
    newOtp[index] = value.slice(0, 1);
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleVerify = (e) => {
    e.preventDefault();
    const otpCode = otp.join('');
    if (otpCode.length === 6) {
      navigate('/home');
    }
  };

  return (
    <main className="sign-up">
      <div className="text-center mt-5">
        <h2 className="text-white fw-bold">Verifikasi OTP</h2>
        <p className="text-14 text-light mt-3">
          Masukkan kode 6 digit yang dikirim ke ponsel Anda
        </p>
      </div>
      <form onSubmit={handleVerify}>
        <div className="form-box text-white">
          <div className="form-group">
            <label>Kode OTP</label>
            <div className="d-flex gap-2 justify-content-center mt-3 mb-4">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  inputMode="numeric"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  style={{
                    width: '50px',
                    height: '50px',
                    fontSize: '24px',
                    textAlign: 'center',
                    borderRadius: '8px',
                    border: '1px solid #4d5f88',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    color: '#fff'
                  }}
                  required
                />
              ))}
            </div>
          </div>
          <button type="submit" className="login-btn">Verifikasi OTP</button>
          <p className="text-center text-12 mt-3">
            Tidak menerima kode?{' '}
            <a href="#resend" className="text-blue fw-bold">Kirim Ulang</a>
          </p>
        </div>
      </form>
    </main>
  );
};

export default OTP;
