import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../config';
import translations from '../utils/translations'; // Adjust the import path as necessary
import '../style/Cart.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';

function Cart({ cart, language, onIncreaseQuantity, onDecreaseQuantity, onRemoveItem, onUpdateQuantity, customer }) {
  const navigate = useNavigate();

  const calculateTotal = () => {
    return cart.reduce((total, item) => {
      const price = item.price || 0;
      const quantity = item.quantity || 0;
      console.log(`Calculating total: ${price} * ${quantity}`);
      return total + price * quantity;
    }, 0).toFixed(2);
  };

  const handleQuantityChange = (event, item) => {
    const newQuantity = parseInt(event.target.value, 10);
    if (!isNaN(newQuantity)) {
      onUpdateQuantity(item, newQuantity);
    }
  };

  const handleCheckout = () => {
    if (customer) {
      navigate('/logged-in-checkout');
    } else {
      navigate('/checkout');
    }
  };

  const t = language === 'EN' ? translations.en.cart : translations.ar.cart;
  const currency = language === 'EN' ? translations.en.currency : translations.ar.currency;

  // Log all items in the cart
  console.log("Cart Items:", cart);

  return (
    <div className="container my-5">
      {cart.length === 0 ? (
        <div className="empty-cart text-center">
          <img src="/icon/shopping-bag.png" alt="Empty Cart" className="empty-cart-icon" />
          <h3>{t.reviewOrder}</h3>
          <p>{t.yourCartIsEmpty}</p>
          <p>{t.startShopping}</p>
          <button className="btn btn-primary">{t.startShoppingButton}</button>
        </div>
      ) : (
        <div className="cart">
          <h3 className="text-center my-3">{t.reviewOrder}</h3>
          <div className="cart-items">
            {cart.map((item, index) => (
              <div key={index} className="cart-item d-flex justify-content-between align-items-center mb-3">
                <div className="item-details d-flex align-items-center">
                  <img 
                    src={`${BASE_URL}${item.productImage}`} 
                    alt={language === 'EN' ? item.product_name_en : item.product_name_ar} 
                    className="cart-item-image" 
                  />
                  <div className="item-info mx-1">
                    <span className="product-name">{language === 'EN' ? item.product_name_en : item.product_name_ar}</span>
                    {item.variantName && (
                      <>
                        <span className="variant-name text-muted">{language === 'EN' ? item.v_name_en : item.v_name_ar}</span>
                        {item.brandName && (
                          <span className="brand-name text-muted">({item.brandName})</span>
                        )}
                      </>
                    )}
                    {!item.variantName && item.brandName && (
                      <span className="brand-name text-muted">({item.brandName})</span>
                    )}
                    <div className="item-quantity d-flex align-items-center mt-2">
                      <button className="btn btn-outline-secondary p-1 px-2 mx-1" onClick={() => onDecreaseQuantity(item)}>-</button>
                      <input 
                        type="number" 
                        className="form-control quantity-input mx-3" 
                        value={item.quantity} 
                        onChange={(e) => handleQuantityChange(e, item)}
                        style={{ width: '100px', maxWidth: '100px', textAlign: 'center' }} // Inline styles
                      />
                      <button className="btn btn-outline-secondary p-1 px-2 mx-1" onClick={() => onIncreaseQuantity(item)}>+</button>
                    </div>
                    {item.customerNote && (
                      <div className="item-note mt-2">
                        <small className="text-muted">{t.note}: {item.customerNote}</small>
                      </div>
                    )}
                  </div>
                </div>
                <div className="item-price d-flex flex-column align-items-end">
                  <span>{currency} {(item.price || 0).toFixed(2)}</span>
                  <button className="btn btn-outline-secondary p-1 mx-1 mt-1" onClick={() => onRemoveItem(item)}>
                    <FontAwesomeIcon icon={faTrashAlt} />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="cart-summary mt-3">
            <div className="d-flex justify-content-between">
              <span>{t.subtotal}</span>
              <span>{currency} {calculateTotal()}</span>
            </div>
            <div className="d-flex justify-content-between">
              <span>{t.deliveryFee}</span>
              <span>{currency} 0.000</span>
            </div>
            <div className="d-flex justify-content-between font-weight-bold">
              <span>{t.total}</span>
              <span>{currency} {calculateTotal()}</span>
            </div>
            <div className="d-flex justify-content-end mt-3">
              <button className="btn btn-primary btn-block" onClick={handleCheckout}>
                {t.proceedToCheckout}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Spacer to prevent footer from covering content */}
      <div style={{ height: '50px' }}></div>
    </div>
  );
}

export default Cart;
