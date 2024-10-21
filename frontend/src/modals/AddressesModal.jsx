import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faPencilAlt, faTrash } from '@fortawesome/free-solid-svg-icons';
import '../style/AddressesModal.css';
import { BASE_URL } from '../config';
import axios from 'axios';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import translations from '../utils/translations';

const AddressesModal = ({ show, onHide, language, setShowAddAddressModal }) => {
  const [closing, setClosing] = useState(false);
  const [visible, setVisible] = useState(show);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState(null);
  const [message, setMessage] = useState('');
  const [showMessage, setShowMessage] = useState(false);

  const t = language === 'EN' ? translations.en : translations.ar;

  useEffect(() => {
    if (show) {
      setVisible(true);
      fetchAddresses();
    } else if (!show && visible) {
      setClosing(true);
      const timer = setTimeout(() => {
        setClosing(false);
        setVisible(false);
      }, 500); // Match the CSS transition duration
      return () => clearTimeout(timer);
    }
  }, [show, visible]);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/customer/addresses`, {
        headers: {
          'Authorization': token
        }
      });
      if (response.data.success) {
        setAddresses(response.data.addresses);
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNewAddress = () => {
    onHide();
    setTimeout(() => {
      setShowAddAddressModal(true);
    }, 500); // Delay to ensure smooth transition
  };

  const handleEditAddress = (address) => {
    // Implement edit functionality here
    console.log('Edit address:', address);
  };

  const handleShowDeleteModal = (address) => {
    setAddressToDelete(address);
    setShowDeleteModal(true);
  };

  const handleDeleteAddress = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${BASE_URL}/api/customer/address/${addressToDelete._id}`, null, {
        headers: {
          'Authorization': token
        }
      });
      setAddresses(addresses.filter(address => address._id !== addressToDelete._id));
      setMessage('Address deleted successfully');
      setShowMessage(true);
      setShowDeleteModal(false);
      setTimeout(() => {
        setShowMessage(false);
        setTimeout(() => {
          setMessage('');
        }, 500); // Match the CSS transition duration
      }, 3000); // Clear message after 3 seconds
    } catch (error) {
      console.error('Error deleting address:', error);
      setMessage('Failed to delete address');
      setShowMessage(true);
      setTimeout(() => {
        setShowMessage(false);
        setTimeout(() => {
          setMessage('');
        }, 500); // Match the CSS transition duration
      }, 3000); // Clear message after 3 seconds
    }
  };

  return (
    <>
      <div className={`addresses-modal custom-modal-wrapper ${visible ? 'show' : ''} ${closing ? 'hide' : ''}`}>
        <div className="modal-backdrop" onClick={onHide}></div>
        <div className="custom-modal">
          <div className="modal-header">
            <h5 className="modal-title">{t.addressesModal.deliveryAddress}</h5>
            <button type="button" className="close" onClick={onHide}>
              &times;
            </button>
          </div>
          <hr className="modal-divider" />
          <div className="modal-body no-margin scrollable-content">
            {message && (
              <div className={`alert ${message === 'Address deleted successfully' ? 'alert-success' : 'alert-danger'} ${showMessage ? 'show' : ''}`}>
                {message}
              </div>
            )}
            {loading ? (
              <div className="d-flex justify-content-center my-5">
                <div className="spinner-border" role="status">
                  <span className="sr-only">{t.cart.loading}</span>
                </div>
              </div>
            ) : addresses.length === 0 ? (
              <div className="text-center">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="address-icon" />
                <p className="address-empty-text">{t.addressesModal.addressEmpty}</p>
              </div>
            ) : (
              <ul className="address-list">
                {addresses.map(address => (
                  <li key={address._id} className="address-item">
                    <div className="address-details">
                      <div className="address-header">
                        <span>{`${t.addAddressModal.country}: ${address.country}, ${t.addAddressModal.region}: ${address.region}, ${t.addAddressModal.block}: ${address.block}, ${t.addAddressModal.street}: ${address.street}`}</span>
                        {address.isDefault && <span className="default-badge">{t.addressesModal.default}</span>}
                      </div>
                      <div className="address-body">
                        {address.house && <div>{`${t.addAddressModal.house}: ${address.house}`}</div>}
                        {address.avenue && <div>{`${t.addAddressModal.avenue}: ${address.avenue}`}</div>}
                        {address.road && <div>{`${t.addAddressModal.road}: ${address.road}`}</div>}
                        {address.extraDescription && <div>{`${t.addAddressModal.specialDirections}: ${address.extraDescription}`}</div>}
                      </div>
                    </div>
                    <div className="address-actions">
                      <FontAwesomeIcon icon={faPencilAlt} className="edit-icon" onClick={() => handleEditAddress(address)} />
                      <FontAwesomeIcon icon={faTrash} className="delete-icon" onClick={() => handleShowDeleteModal(address)} />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="modal-footer">
            <button className="btn btn-primary add-address-btn" onClick={handleAddNewAddress}>
              {t.addressesModal.addAddress}
            </button>
          </div>
        </div>
      </div>

      <DeleteConfirmationModal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        language={language}
        address={addressToDelete}
        handleDeleteAddress={handleDeleteAddress}
      />
    </>
  );
}

export default AddressesModal;
