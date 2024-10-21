import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserEdit, faAddressBook, faKey, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import translations from '../utils/translations'; // Adjust the import path as necessary

function AccountModal({ show, onHide, language, customer, onLogout, setShowUpdateProfileModal, setShowAddressesModal, setShowChangePasswordModal }) {
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

  const t = language === 'EN' ? translations.en.accountModal : translations.ar.accountModal;

  return (
    <div className={`custom-modal-wrapper ${visible ? 'show' : ''} ${closing ? 'hide' : ''}`}>
      <div className="modal-backdrop" onClick={onHide}></div>
      <div className="custom-modal">
        <div className="modal-header">
          <h5 className="modal-title">{t.myAccount}</h5>
          <button type="button" className="close" onClick={onHide}>
            &times;
          </button>
        </div>
        <hr className="modal-divider" />
        <div className="modal-body">
          <ul className="list-group p-0">
            <li className="list-group-item" onClick={() => {
              onHide();
              setShowUpdateProfileModal(true);
            }}>
              <FontAwesomeIcon icon={faUserEdit} className="list-icon" />
              <span className="px-1">{t.updateProfile}</span>
            </li>
            <li className="list-group-item" onClick={() => {
              onHide();
              setShowAddressesModal(true);
            }}>
              <FontAwesomeIcon icon={faAddressBook} className="list-icon" />
              <span className="px-1">{t.addresses}</span>
            </li>
            <li className="list-group-item" onClick={() => {
              onHide();
              setShowChangePasswordModal(true);
            }}>
              <FontAwesomeIcon icon={faKey} className="list-icon" />
              <span className="px-1">{t.changePassword}</span>
            </li>
            <li className="list-group-item" onClick={onLogout}>
              <FontAwesomeIcon icon={faSignOutAlt} className="list-icon" />
              <span className="px-1">{t.logout}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default AccountModal;
