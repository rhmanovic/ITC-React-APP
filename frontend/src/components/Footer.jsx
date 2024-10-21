import React from 'react';
import { useNavigate } from 'react-router-dom';
import translations from '../utils/translations'; // Adjust the import path as necessary
import '../style/Footer.css';

const Footer = ({ language, setShowMoreModal, setShowLoginModal, setShowAccountModal, setShowDummyCartModal, customer }) => {
  const navigate = useNavigate();
  const t = language === 'EN' ? translations.en.footer : translations.ar.footer;

  return (
    <footer className="footer pt-3 bg-light fixed-bottom" dir="ltr">
      <div className="container">
        <div className="row text-center">
          <div className="col footer-col" onClick={() => setShowMoreModal(true)}>
            <img src="/icon/app.png" alt="Icon" className="footer-icon custom-filter" />
            <span className="footer-link-text">{t.more}</span>
          </div>
          <div className="col footer-col" onClick={() => customer ? setShowAccountModal(true) : setShowLoginModal(true)}>
            <img src="/icon/user.png" alt="Icon" className="footer-icon custom-filter" />
            <span className="footer-link-text">{customer ? t.myAccount : t.login}</span>
          </div>
          <div className="col footer-col" onClick={() => navigate('/cart')}>
            <img src="/icon/shopping-bag.png" alt="Icon" className="footer-icon custom-filter" />
            <span className="footer-link-text">{t.cart}</span>
          </div>
          {/* <div className="col footer-col" onClick={() => navigate('/order-status')}>
            <img src="/icon/invoice.png" alt="Icon" className="footer-icon custom-filter" />
            <span className="footer-link-text">{t.orderStatus}</span>
          </div> */}
          {/* <div className="col footer-col" onClick={() => navigate('/order-status-all')}>
            <img src="/icon/invoice.png" alt="Icon" className="footer-icon custom-filter" />
            <span className="footer-link-text">{t.orderStatusAll}</span>
          </div> */}
          <div className="col footer-col" onClick={() => navigate('/')}>
            <img src="/icon/invoice.png" alt="Icon" className="footer-icon custom-filter" />
            <span className="footer-link-text">{t.menu}</span>
          </div>
          {/* <div className="col footer-col" onClick={() => navigate('/seach-order')}>
            <img src="/icon/menu.png" alt="Icon" className="footer-icon custom-filter" />
            <span className="footer-link-text">Search</span>
          </div> */}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
