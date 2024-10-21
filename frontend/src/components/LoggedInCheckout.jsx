import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import translations from '../utils/translations'; // Adjust the import path as necessary
import { BASE_URL } from '../config'; // Adjust the import path as necessary
import '../style/Checkout.css'; // Using the existing Checkout.css
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap CSS is imported

function LoggedInCheckout({ language, cart, customer }) {
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [phone, setPhone] = useState(customer ? customer.phone : '');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/customer/addresses`, {
        headers: {
          'Authorization': token
        }
      });
      if (response.data.success) {
        setAddresses(response.data.addresses);
        if (response.data.addresses.length > 0) {
          setSelectedAddress(response.data.addresses[0]._id); // Select the first address by default
        }
      } else {
        console.error('Failed to fetch addresses:', response.data.message);
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
    } finally {
      setLoading(false); // Set loading to false after the fetch is complete
    }
  };

  const handleAddressChange = (event) => {
    setSelectedAddress(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!selectedAddress) {
      console.error('No address selected');
      return;
    }
    // Handle form submission logic here
    console.log('Order submitted', { customer, selectedAddress, phone, cart });
  };

  const t = language === 'EN' ? translations.en : translations.ar;

  return (
    <div className="checkout-container my-5">
      <h3 className="checkout-title">{t.confirmOrder}</h3>
      {loading ? (
        <div className="d-flex justify-content-center my-5">
          <div className="spinner-border" role="status">
            <span className="sr-only">{t.loading}</span>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="checkout-form">
          <div className="form-group">
            <label className="form-label">{t.phone}</label>
            <div className="input-group">
              <input
                type="tel"
                className="form-control"
                placeholder={t.enterPhone}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
              <span className="input-group-text"><FontAwesomeIcon icon={faPhone} /></span>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">{t.address}</label>
            {addresses.length === 0 ? (
              <p>{language === 'EN' ? 'No addresses available' : 'لا توجد عناوين متاحة'}</p>
            ) : (
              <div className="address-list">
                {addresses.map(address => (
                  <div key={address._id} className="form-check">
                    <input
                      type="radio"
                      className="form-check-input"
                      name="address"
                      value={address._id}
                      checked={selectedAddress === address._id}
                      onChange={handleAddressChange}
                    />
                    <label className="form-check-label">
                      {`${address.region}, ${address.block}, ${address.street}`}
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>
          <button type="submit" className="btn btn-primary">{t.submitOrder}</button>
        </form>
      )}
    </div>
  );
}

export default LoggedInCheckout;
