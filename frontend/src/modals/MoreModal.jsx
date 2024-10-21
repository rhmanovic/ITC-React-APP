import React from 'react';
import { Modal } from 'react-bootstrap';
import translations from '../utils/translations'; // Adjust the import path as necessary

function MoreModal({ show, onHide, language }) {
  const t = language === 'EN' ? translations.en.moreModal : translations.ar.moreModal;

  return (
    <Modal
      show={show}
      onHide={onHide}
      animation={false} // Disable the default Bootstrap fade animation
      className={`more-modal ${show ? 'show' : ''}`} // Add 'show' class based on the modal state
    >
      <Modal.Header closeButton>
        <Modal.Title>{t.moreOptions}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ul className="list-group">
          <li className="list-group-item">{t.contactUs}</li>
          <li className="list-group-item">{t.aboutUs}</li>
          <li className="list-group-item">{t.privacyPolicy}</li>
          <li className="list-group-item" onClick={onHide}>{t.close}</li>
        </ul>
      </Modal.Body>
    </Modal>
  );
}

export default MoreModal;
