import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/footer.css';

const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: '/images/icon/home.svg', label: 'Beranda', path: '/home' },
    { icon: '/images/icon/team.svg', label: 'Tim', path: '/team' },
    { icon: '/images/icon/task.svg', label: 'Tugas', path: '/task' },
    { icon: '/images/icon/profile.svg', label: 'Profil', path: '/profile' }
  ];

  return (
    <footer className="footer-nav">
      <div className="footer-nav-container">
        {navItems.map((item, index) => (
          <a
            key={index}
            href={item.path}
            onClick={(e) => {
              e.preventDefault();
              navigate(item.path);
            }}
            className={`footer-nav-item ${location.pathname === item.path ? 'active' : ''}`}
          >
            <img src={item.icon} alt={item.label} className="footer-nav-icon" />
            <span className="footer-nav-label">{item.label}</span>
          </a>
        ))}
      </div>
    </footer>
  );
};

export default Footer;
