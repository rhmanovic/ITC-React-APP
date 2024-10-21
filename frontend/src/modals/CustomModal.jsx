import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhoneAlt, faInfoCircle, faShieldAlt, faLanguage } from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp, faSnapchatGhost, faInstagram } from '@fortawesome/free-brands-svg-icons';
import translations from '../utils/translations'; // Adjust the import path as necessary

function CustomModal({ show, onHide, language }) {
  const [closing, setClosing] = useState(false);
  const [visible, setVisible] = useState(show);

  useEffect(() => {
    if (show) {
      setVisible(true);
    } else if (!show && visible) {
      setClosing(true);
      const timer = setTimeout(() => {
        setClosing(false);
        setVisible(false);
      }, 500); // Match the CSS transition duration
      return () => clearTimeout(timer);
    }
  }, [show, visible]);

  const t = language === 'EN' ? translations.en.customModal : translations.ar.customModal;

  return (
    <div className={`custom-modal-wrapper ${visible ? 'show' : ''} ${closing ? 'hide' : ''}`} dir={language === 'EN' ? 'ltr' : 'rtl'}>
      <div className="modal-backdrop" onClick={onHide}></div>
      <div className="custom-modal">
        <div className="modal-header">
          <h5 className="modal-title">{t.moreOptions}</h5>
          <button type="button" className="close" onClick={onHide}>
            &times;
          </button>
        </div>
        <hr className="modal-divider" />
        <div className="modal-body">
          <ul className="list-group p-0">
            <li className="list-group-item">
              <FontAwesomeIcon icon={faPhoneAlt} className="list-icon" />
              <span className="px-1">{t.contactUs}</span>
            </li>
            <li className="list-group-item">
              <FontAwesomeIcon icon={faInfoCircle} className="list-icon" />
              <span className="px-1">{t.aboutUs}</span>
            </li>
            <li className="list-group-item">
              <FontAwesomeIcon icon={faShieldAlt} className="list-icon" />
              <span className="px-1">{t.privacyPolicy}</span>
            </li>
            <li className="list-group-item">
              <FontAwesomeIcon icon={faLanguage} className="list-icon" />
              <span className="px-1">{language === 'EN' ? t.arabic : t.english}</span>
            </li>
          </ul>
          <div className="social-icons mt-3">
            <FontAwesomeIcon icon={faWhatsapp} className="social-icon" />
            <FontAwesomeIcon icon={faSnapchatGhost} className="social-icon" />
            <FontAwesomeIcon icon={faInstagram} className="social-icon" />
          </div>
          <div className="payment-icons mt-3">
            <img src="icon/VISA.png" alt="Visa" className="payment-icon" />
            <img src="icon/mastercard.svg" alt="MasterCard" className="payment-icon" />
            <img src="icon/knet.png" alt="KNET" className="payment-icon" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default CustomModal;
