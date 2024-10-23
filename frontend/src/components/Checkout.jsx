import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { BASE_URL, YOUR_MERCHANT_ID } from '../config';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faPhone, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import translations from '../utils/translations'; // Adjust the import path as necessary
import '../style/Checkout.css'; // Ensure you have this CSS file
import { Spinner } from 'react-bootstrap';

function Checkout({ language, cart, customer, clearCart }) {

  const [knetEnabled, setKnetEnabled] = useState(false);
  const [cashEnabled, setCashEnabled] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(''); // Initialize without a default payment method

  const navigate = useNavigate();

  // Fetch the payment method settings when the component mounts
  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/merchant/${YOUR_MERCHANT_ID}`)
      .then((response) => {
        const { knetEnabled, cashEnabled } = response.data.merchant; // Assuming these fields exist in tapSettings
        setKnetEnabled(knetEnabled);
        setCashEnabled(cashEnabled);

        // Set default payment method
        if (knetEnabled && !cashEnabled) {
          setPaymentMethod('knet');
        } else if (!knetEnabled && cashEnabled) {
          setPaymentMethod('cash');
        } else if (knetEnabled && cashEnabled) {
          setPaymentMethod('knet'); // Default to knet if both are enabled
        }

        console.log("Knet Enabled:", knetEnabled);
        console.log("Cash Enabled:", cashEnabled);
      })
      .catch((error) => console.error("Error fetching payment settings:", error));
  }, []);

  // Load data from localStorage if available, or fall back to the customer data
  const [name, setName] = useState(localStorage.getItem('checkoutName') || (customer ? customer.name : ''));
  const [address, setAddress] = useState(localStorage.getItem('checkoutAddress') || '');
  const [phone, setPhone] = useState(localStorage.getItem('checkoutPhone') || '');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Save data to localStorage whenever the fields are updated
    localStorage.setItem('checkoutName', name);
    localStorage.setItem('checkoutAddress', address);
    localStorage.setItem('checkoutPhone', phone);
  }, [name, address, phone]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true); // Set loading to true when the form is submitted

    const orderData = {
      customerName: name || '', // Make name optional
      merchant: YOUR_MERCHANT_ID, // Use the merchant ID from config
      items: cart,
      address: address,
      phone: phone,
      paymentMethod: paymentMethod, // Include payment method
      deliveryFee: 0,
      total: parseFloat(cart.reduce((total, item) => total + (item.price * item.quantity), 0)).toFixed(2),
    };

    console.log('Order submitted:', orderData);

    try {
      const response = await axios.post(`${BASE_URL}/api/submit-order`, orderData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      // If there's a redirect URL (for cash payment), handle the redirection in the frontend
      if (response.data.redirectUrl) {
        window.location.href = response.data.redirectUrl;
      } else {
        // Handle other cases (e.g., successful payment via knet)
        alert('Order submitted successfully!');
        // Optionally clear the cart or redirect to a success page
        clearCart();
      }
    } catch (error) {
      console.error('Error submitting order:', error);
      alert('Error submitting order. Please try again.');
    } finally {
      setLoading(false); // Stop the loading spinner
    }
  };


  const handlePhoneChange = (e) => {
    const { value } = e.target;
    const validPhone = value.replace(/\D/g, ''); // Remove non-numeric characters
    setPhone(validPhone);
  };

  const t = language === 'EN' ? translations.en : translations.ar;

  return (
    <div className="checkout-container" dir={language === 'EN' ? 'ltr' : 'rtl'}>
      <h3 className="checkout-title">{t.confirmOrder}</h3>
      <form onSubmit={handleSubmit} className="checkout-form">
        <div className="form-group">
          <label className="form-label">{t.name}</label>
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder={t.enterName}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <span className="input-group-text"><FontAwesomeIcon icon={faUser} /></span>
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">{t.phone}</label>
          <div className="input-group">
            <input
              type="tel"
              className="form-control"
              placeholder={t.enterPhone}
              value={phone}
              onChange={handlePhoneChange}
              required
            />
            <span className="input-group-text"><FontAwesomeIcon icon={faPhone} /></span>
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">{t.address}</label>
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder={t.enterAddress}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
            <span className="input-group-text"><FontAwesomeIcon icon={faMapMarkerAlt} /></span>
          </div>
        </div>

        {/* Conditionally render payment methods based on server response */}
        {knetEnabled && (
          <div className="form-group">
            <label>
              <input
                type="radio"
                name="paymentMethod"
                value="knet"
                checked={paymentMethod === 'knet'}
                onChange={() => setPaymentMethod('knet')}
              />
              {" "}{t.PaybyKnet} {/* Use translation for "Pay by Knet" */}
            </label>
          </div>
        )}

        {cashEnabled && (
          <div className="form-group">
            <label>
              <input
                type="radio"
                name="paymentMethod"
                value="cash"
                checked={paymentMethod === 'cash'}
                onChange={() => setPaymentMethod('cash')}
              />
              {" "}{t.PaybyCash} {/* Use translation for "Pay by Cash" */}
            </label>
          </div>
        )}

        <button type="submit" className="btn btn-primary">
          {t.submitOrder} - {parseFloat(cart.reduce((total, item) => total + (item.price * item.quantity), 0)).toFixed(2)}
        </button>
      </form>

      {loading && (
        <div className="loading-overlay">
          <Spinner animation="border" variant="light" />
        </div>
      )}
    </div>
  );
}

export default Checkout;
