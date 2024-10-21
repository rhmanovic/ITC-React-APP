import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import translations from '../utils/translations';
import '../style/Cart.css';

function Payment({ language, cart, customer, clearCart }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [paymentData, setPaymentData] = useState(null);
  const [hasClearedCart, setHasClearedCart] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const paymentDataFromParams = {
      id: queryParams.get('id'),
      status: queryParams.get('status'),
      order_number: queryParams.get('order_number'),
      amount: queryParams.get('amount'),
      currency: queryParams.get('currency'),
      created: queryParams.get('created'),
      payment: queryParams.get('payment'),
    };
    setPaymentData(paymentDataFromParams);
  }, [location]);

  useEffect(() => {
    if (paymentData && paymentData.status === "CAPTURED" && !hasClearedCart) {
      clearCart();
      setHasClearedCart(true);
    }
  }, [paymentData, clearCart, hasClearedCart]);

  const handleRedirectToCheckout = () => {
    navigate('/checkout'); // Redirect to the checkout page
  };

  const t = language === 'EN' ? translations.en : translations.ar;

  return (
    <div className="container my-5">
      <div className="cart">
        <h3 className="text-center my-3">{t.paymentStatus || 'Payment Status'}</h3>
        {paymentData ? (
          <div className="cart-items text-center">
            <div className="item-info mx-1">
              <div className="mb-3">
                {paymentData.status === "CAPTURED" ? (
                  <FontAwesomeIcon icon={faCheckCircle} className="text-success" size="3x" />
                ) : (
                  <>
                    <FontAwesomeIcon icon={faTimesCircle} className="text-danger" size="3x" />
                    <button onClick={handleRedirectToCheckout} className="btn btn-primary mt-3">
                      {t.retryPayment || 'Retry Payment'}
                    </button>
                  </>
                )}
              </div>
              <p><strong>{t.status || 'Status'}:</strong> {paymentData.status}</p>
              <p><strong>{t.orderNumber || 'Order Number'}:</strong> {paymentData.order_number}</p>
              <p><strong>{t.amount || 'Amount'}:</strong> {paymentData.amount} {paymentData.currency}</p>

              <p>
                <strong>{t.created || 'Created'}: </strong>
                {(() => {
                  const decodedDate = decodeURIComponent(paymentData.created);
                  const date = new Date(decodedDate);

                  const day = String(date.getDate()).padStart(2, '0');
                  const month = String(date.getMonth() + 1).padStart(2, '0');
                  const year = date.getFullYear();
                  const hours = String(date.getHours()).padStart(2, '0');
                  const minutes = String(date.getMinutes()).padStart(2, '0');
                  const seconds = String(date.getSeconds()).padStart(2, '0');

                  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
                })()}
              </p>

              <p><strong>{t.id || 'ID'}:</strong> {paymentData.id}</p>
              <p><strong>{t.paymentMethod || 'Payment Method'}:</strong> {paymentData.payment}</p>
            </div>
          </div>
        ) : (
          <p>{t.loadingPaymentData || 'Loading payment data...'}</p>
        )}
      </div>
    </div>
  );
}

export default Payment;
