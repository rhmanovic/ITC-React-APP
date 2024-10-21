import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../config';

function LoginModal({ show, onHide, language, onLogin, onSignUpClick }) {
  const [closing, setClosing] = useState(false);
  const [visible, setVisible] = useState(show);
  const [formData, setFormData] = useState({ email: '', password: '' });
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
      const response = await axios.post(`${BASE_URL}/api/Customerlogin`, formData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (response.data.success) {
        // Handle successful response
        onHide();
        // Pass the token and customer data to the onLogin function
        onLogin(response.data.token, response.data.customer);
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  const handleSignUpClick = () => {
    onHide();
    setTimeout(onSignUpClick, 500); // Delay to ensure smooth transition
  };

  return (
    <div className={`custom-modal-wrapper ${visible ? 'show' : ''} ${closing ? 'hide' : ''}`}>
      <div className="modal-backdrop" onClick={onHide}></div>
      <div className="custom-modal">
        <div className="modal-header">
          <h5 className="modal-title">{language === 'EN' ? 'Login' : 'تسجيل الدخول'}</h5>
          <button type="button" className="close" onClick={onHide}>
            &times;
          </button>
        </div>
        <hr className="modal-divider" />
        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="emailorphone">{language === 'EN' ? 'Email' : 'البريد الإلكتروني'}</label>
              <input
                type="emailorphone"
                className="form-control"
                id="emailorphone"
                placeholder={language === 'EN' ? 'Enter your email' : 'أدخل بريدك الإلكتروني'}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">{language === 'EN' ? 'Password' : 'كلمة المرور'}</label>
              <input
                type="password"
                className="form-control"
                id="password"
                placeholder={language === 'EN' ? 'Enter your password' : 'أدخل كلمة المرور'}
                onChange={handleChange}
              />
            </div>
            {error && <div className="alert alert-danger">{error}</div>}
            <button type="submit" className="btn btn-primary btn-block">
              {language === 'EN' ? 'Login' : 'تسجيل الدخول'}
            </button>
            <div className="text-center mt-3">
              <a href="/forgot-password" className="forgot-password-link">{language === 'EN' ? 'Forgot Password?' : 'نسيت كلمة المرور؟'}</a>
              <br />
              <a href="#" onClick={handleSignUpClick} className="register-link">
                {language === 'EN' ? "Don't have an account?" : 'لا تملك حساب؟'}{' '}
                <span className="modal-link">{language === 'EN' ? 'Sign up' : 'تسجيل'}</span>
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginModal;
