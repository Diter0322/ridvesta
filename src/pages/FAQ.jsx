import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFaqs } from '../hooks/useFaqs';
import '../styles/faq.css';

const FAQ = () => {
  const navigate = useNavigate();
  const [expandedIndex, setExpandedIndex] = useState(0);

  const { data: faqItems = [], isLoading: loading, isError } = useFaqs();

  return (
    <main className="faq">
      <div className="d-flex align-items-center pt-3">
        <button className="btn-trans" onClick={() => navigate(-1)}>
          <img src="/images/btn-back.png" className="btn-back" alt="" />
        </button>
        <div className="text-center w-100">
          <p className="text-white fw-semibold fs-5 mb-0 me-5">FAQ</p>
        </div>
      </div>

      <div className="mt-4">
        {loading && <p className="text-white text-center">Memuat...</p>}
        {isError && <p className="text-danger text-center">Gagal memuat FAQ</p>}
        {!loading && !isError && (
        <div className="accordion" id="accordionExample">
          {faqItems.filter(item => item.question).map((item, index) => (
            <div className="accordion-item" key={item.id ?? index}>
              <h2 className="accordion-header">
                <button
                  className={`accordion-button ${expandedIndex !== index ? 'collapsed' : ''}`}
                  type="button"
                  onClick={() => setExpandedIndex(expandedIndex === index ? -1 : index)}
                >
                  {item.question}
                </button>
              </h2>
              <div
                className={`accordion-collapse collapse ${expandedIndex === index ? 'show' : ''}`}
                data-bs-parent="#accordionExample"
              >
                <div className="accordion-body">
                  <p>{typeof item.answer === 'string' ? item.answer.replace(/<[^>]+>/g, '') : item.answer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        )}
      </div>

      <div className="relative" style={{ width: '400px', height: '400px' }}>
        <div className="middle-shape"></div>
      </div>
    </main>
  );
};

export default FAQ;
