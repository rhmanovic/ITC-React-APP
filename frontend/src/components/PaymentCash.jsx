import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { BASE_URL, YOUR_MERCHANT_ID } from '../config';
import translations from '../utils/translations'; // Adjust the import path as necessary
import '../style/Cart.css'; // Ensure you have this CSS file

function PaymentCash({ language, clearCart }) {
  const navigate = useNavigate();
  const location = useLocation(); // To get the orderId from the URL
  const [paymentData, setPaymentData] = useState(null); // Will store order details
  const [hasClearedCart, setHasClearedCart] = useState(false);
  const [loading, setLoading] = useState(true); // Show loading until the data is fetched

  // Extract orderId from URL params (e.g., /PaymentCash?orderId=...)
  const getOrderIdFromUrl = () => {
    const queryParams = new URLSearchParams(location.search);
    return queryParams.get('orderId');
  };

  useEffect(() => {
    const orderId = getOrderIdFromUrl();

    // Fetch payment/order details from the server
    const fetchPaymentData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/order/${orderId}`); // Correct endpoint here
        setPaymentData(response.data.order); // Assuming response.data.order contains the order details
        setLoading(false); // Set loading to false after fetching data
      } catch (error) {
        console.error('Error fetching payment data:', error);
        setLoading(false); // Stop loading even if there's an error
      }
    };

    fetchPaymentData();

    // Clear the cart once the component mounts and hasn't already been cleared
    if (!hasClearedCart) {
      clearCart();
      setHasClearedCart(true);
    }
  }, [clearCart, hasClearedCart, location]);

  const t = language === 'EN' ? translations.en : translations.ar;

  // Show loading while fetching data
  if (loading) {
    return <p>{t.loadingPaymentData || 'Loading payment data...'}</p>;
  }

  // If no payment data is found, show an error message
  if (!paymentData) {
    return <p>{t.noPaymentData || 'No payment data found.'}</p>;
  }

  return (
    <div className="container my-5">
      <div className="cart">
        <h3 className="text-center my-3">{t.OrderPlaced || 'Payment Status'}</h3>
        <div className="cart-items text-center">
          <div className="item-info mx-1">
            <div className="mb-3">
              <FontAwesomeIcon icon={faCheckCircle} className="text-success" size="3x" />
            </div>
            <p><strong>{t.orderNumber || 'Order Number'}:</strong> {paymentData.order_number}</p>
            <p><strong>{t.amount || 'Amount'}:</strong> {paymentData.total} KD</p>
            <p><strong>{t.created || 'Created'}:</strong> {new Date(paymentData.time).toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentCash;
