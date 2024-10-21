import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import translations from '../utils/translations';

const DeleteConfirmationModal = ({ show, onHide, language, address, handleDeleteAddress }) => {
  const t = language === 'EN' ? translations.en : translations.ar;

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{t.addressesModal.deleteConfirmation}</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ direction: language === 'EN' ? 'ltr' : 'rtl' }}>
        <p>{t.addressesModal.confirmDelete}</p>
        <p>{`${t.addAddressModal.country}: ${address?.country}`}</p>
        <p>{`${t.addAddressModal.region}: ${address?.region}`}</p>
        <p>{`${t.addAddressModal.block}: ${address?.block}`}</p>
        <p>{`${t.addAddressModal.street}: ${address?.street}`}</p>
        {address?.house && <p>{`${t.addAddressModal.house}: ${address?.house}`}</p>}
        {address?.avenue && <p>{`${t.addAddressModal.avenue}: ${address?.avenue}`}</p>}
        {address?.road && <p>{`${t.addAddressModal.road}: ${address?.road}`}</p>}
        {address?.extraDescription && <p>{`${t.addAddressModal.specialDirections}: ${address?.extraDescription}`}</p>}
      </Modal.Body>
      <Modal.Footer style={{ direction: language === 'EN' ? 'ltr' : 'rtl' }}>
        <Button variant="secondary" onClick={onHide}>
          {t.addressesModal.cancel}
        </Button>
        <Button variant="danger" onClick={handleDeleteAddress}>
          {t.addressesModal.delete}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default DeleteConfirmationModal;
