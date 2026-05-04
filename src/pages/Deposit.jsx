import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateDeposit } from '../hooks/useDeposits';
import '../styles/deposit.css';

const PAYMENT_METHODS = [
  { code: 'qris', label: 'QRIS', logo: '/images/bank-logo/qris.png' },
  { code: 'bri', label: 'BRI', logo: '/images/bank-logo/bri.png' },
  { code: 'mandiri', label: 'MANDIRI', logo: '/images/bank-logo/mandiri.png' },
  { code: 'bni', label: 'BNI bank', logo: '/images/bank-logo/bni.png' },
];

const QUICK_AMOUNTS = [50000, 100000, 500000, 1000000, 3000000, 5000000];

const METHOD_CODE_MAP = {
  qris: 'QRIS',
  bri: 'BRI',
  mandiri: 'MANDIRI',
  bni: 'BNI',
};

const formatRupiah = (val) =>
  val ? Number(val).toLocaleString('id-ID') : '0';

const Deposit = () => {
  const navigate = useNavigate();
  const [selectedMethod, setSelectedMethod] = useState('qris');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState(null);

  const { mutate: createDeposit, isPending } = useCreateDeposit();

  const handleAmountChange = (e) => {
    const raw = e.target.value.replace(/\D/g, '');
    setAmount(raw);
    setError(null);
  };

  const handleQuickAmount = (val) => {
    setAmount(String(val));
    setError(null);
  };

  const handleClear = () => setAmount('');

  const handleSubmit = () => {
    const numAmount = parseInt(amount, 10);
    if (!numAmount || numAmount < 50000) {
      setError('Minimum deposit Rp 50.000');
      return;
    }
    if (numAmount > 10000000) {
      setError('Maximum deposit Rp 10.000.000');
      return;
    }
    setError(null);

    const mappedMethod = METHOD_CODE_MAP[selectedMethod] ?? selectedMethod.toUpperCase();
    const payload = {
      amount: numAmount,
      method: selectedMethod,
      payment_method: mappedMethod,
      pay_method: mappedMethod,
    };

    createDeposit(
      payload,
      {
        onSuccess: (res) => {
          console.log('Recharge API Response:', res);
          const data = res?.data ?? res;
          console.log('Extracted Data:', data);
          if (selectedMethod === 'qris') {
            navigate('/deposit/qris', { state: { depositData: data } });
          } else {
            navigate('/deposit/bank', { state: { depositData: data } });
          }
        },
        onError: (err) => {
          console.log('Recharge API Error:', err);
          const errors = err?.response?.data?.errors;
          const firstValidationError = errors
            ? Object.values(errors).flat()[0]
            : null;
          setError(
            firstValidationError ||
              err?.response?.data?.message ||
              'Gagal membuat deposit. Coba lagi.'
          );
        },
      }
    );
  };

  return (
    <main className="deposit-page" style={{ backgroundImage: 'url(/images/signup-bg.jpeg)' }}>
      {/* Header */}
      <div className="d-flex align-items-center pt-3">
        <button className="btn-trans" onClick={() => navigate(-1)}>
          <img src="/images/btn-back.png" className="btn-back" alt="Kembali" />
        </button>
        <div className="text-center w-100">
          <p className="text-white fw-semibold fs-5 mb-0 me-5">Deposit Balance</p>
        </div>
      </div>

      {/* Payment Method */}
      <div className="mt-4">
        <p className="text-blue fw-semibold mb-3">Payment Method</p>
        <div className="payment-methods">
          {PAYMENT_METHODS.map((m) => (
            <button
              key={m.code}
              className={`payment-method-btn ${selectedMethod === m.code ? 'active' : ''}`}
              onClick={() => setSelectedMethod(m.code)}
              type="button"
            >
              <img src={m.logo} alt={m.label} className="method-logo" />
              <span className="method-label">{m.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Amount Input */}
      <div className="mt-4">
        <p className="text-white fw-semibold mb-2">Enter Amount</p>
        <div className="amount-input-wrap">
          <span className="amount-prefix">RP</span>
          <input
            type="text"
            className="amount-input"
            value={amount ? formatRupiah(amount) : ''}
            onChange={handleAmountChange}
            placeholder="0"
            inputMode="numeric"
          />
          {amount && (
            <button className="amount-clear" onClick={handleClear} type="button">
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="10" r="9" stroke="#8899aa" strokeWidth="1.5" />
                <path d="M7 7l6 6M13 7l-6 6" stroke="#8899aa" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Quick Amounts */}
      <div className="quick-amounts mt-3">
        {QUICK_AMOUNTS.map((val) => (
          <button
            key={val}
            className={`quick-amount-btn ${amount === String(val) ? 'active' : ''}`}
            onClick={() => handleQuickAmount(val)}
            type="button"
          >
            Rp {formatRupiah(val)}
          </button>
        ))}
      </div>

      {/* Min/Max Info */}
      <div className="minmax-card mt-4">
        <div className="minmax-item">
          <span className="text-white-50 text-13">Minimum:</span>
          <span className="text-blue fw-semibold ms-1">RP 50,000</span>
        </div>
        <div className="minmax-divider" />
        <div className="minmax-item">
          <span className="text-white-50 text-13">Minimum:</span>
          <span className="text-blue fw-semibold ms-1">RP 10,000,000</span>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger mt-3 py-2 text-14" role="alert">
          {error}
        </div>
      )}

      <div className="deposit-hint mt-2">
        <p className="text-white-50 text-13 text-center">Please enter deposit amount</p>
      </div>

      {/* Continue Button */}
      <div className="deposit-footer">
        <button
          className="btn-primary-full"
          onClick={handleSubmit}
          disabled={isPending}
          type="button"
        >
          {isPending ? 'Processing...' : 'Continue to Payment'}
        </button>
      </div>
    </main>
  );
};

export default Deposit;

