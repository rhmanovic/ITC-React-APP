import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../config';
import translations from '../utils/translations'; // Adjust the import path as necessary

function SignUpModal({ show, onHide, language, onLogin }) {
  const [closing, setClosing] = useState(false);
  const [visible, setVisible] = useState(show);
  const [formData, setFormData] = useState({
    country: '',
    phone: '',
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState(null);

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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${BASE_URL}/api/customers`, formData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (response.data.success) {
        onHide();
        onLogin(response.data.token, response.data.customer);
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError(language === 'EN' ? 'An error occurred. Please try again.' : 'حدث خطأ. حاول مرة أخرى.');
    }
  };

  const t = language === 'EN' ? translations.en.signUpModal : translations.ar.signUpModal;

  return (
    <div className={`custom-modal-wrapper ${visible ? 'show' : ''} ${closing ? 'hide' : ''}`} dir={language === 'EN' ? 'ltr' : 'rtl'}>
      <div className="modal-backdrop" onClick={onHide}></div>
      <div className="custom-modal">
        <div className="modal-header">
          <h5 className="modal-title">{t.createAccount}</h5>
          <button type="button" className="close" onClick={onHide}>
            &times;
          </button>
        </div>
        <hr className="modal-divider" />
        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="country">{t.country}</label>
              <select className="form-control" id="country" onChange={handleChange}>
                <option value="">{t.selectCountry}</option>
                <option value="Kuwait">{t.kuwait}</option>
                {/* Add more options as needed */}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="phone">{t.phone}</label>
              <input
                type="text"
                className="form-control"
                id="phone"
                placeholder={t.enterPhone}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="name">{t.name}</label>
              <input
                type="text"
                className="form-control"
                id="name"
                placeholder={t.enterName}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">{t.email}</label>
              <input
                type="email"
                className="form-control"
                id="email"
                placeholder={t.enterEmail}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">{t.password}</label>
              <input
                type="password"
                className="form-control"
                id="password"
                placeholder={t.enterPassword}
                onChange={handleChange}
              />
            </div>
            {error && <div className="alert alert-danger">{error}</div>}
            <button type="submit" className="btn btn-primary btn-block">{t.confirm}</button>
            <div className="text-center mt-3">
              <small>
                {t.terms}{' '}
                <a className="modal-link" href="/terms">{t.termsConditions}</a>
              </small>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignUpModal;
