import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../config';
import translations from '../utils/translations'; // Adjust the import path as necessary
import '../style/ChangePasswordModal.css';

function ChangePasswordModal({ show, onHide, language }) {
  const [closing, setClosing] = useState(false);
  const [visible, setVisible] = useState(show);
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

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
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmNewPassword) {
      setError(language === 'EN' ? 'New password and confirmation do not match' : 'كلمة المرور الجديدة وتأكيدها لا يتطابقان');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError(language === 'EN' ? 'Unauthorized: No token provided' : 'غير مصرح: لا يوجد رمز مميز');
        return;
      }

      const response = await axios.post(`${BASE_URL}/api/customer/change-password`, formData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        }
      });

      if (response.data.success) {
        setSuccess(response.data.message);
        setError(null);
      } else {
        setError(response.data.message);
        setSuccess(null);
      }
    } catch (err) {
      console.error('Error changing password:', err);
      setError(language === 'EN' ? 'An error occurred. Please try again.' : 'حدث خطأ. حاول مرة أخرى.');
      setSuccess(null);
    }
  };

  const t = language === 'EN' ? translations.en.changePasswordModal : translations.ar.changePasswordModal;

  return (
    <div className={`custom-modal-wrapper ${visible ? 'show' : ''} ${closing ? 'hide' : ''}`}>
      <div className="modal-backdrop" onClick={onHide}></div>
      <div className="custom-modal">
        <div className="modal-header">
          <h5 className="modal-title">{t.changePassword}</h5>
          <button type="button" className="close" onClick={onHide}>
            &times;
          </button>
        </div>
        <hr className="modal-divider" />
        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>{t.oldPassword}</label>
              <input
                type="password"
                name="oldPassword"
                value={formData.oldPassword}
                onChange={handleChange}
                className="form-control"
                placeholder={t.enterOldPassword}
              />
            </div>
            <div className="form-group">
              <label>{t.newPassword}</label>
              <input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                className="form-control"
                placeholder={t.enterNewPassword}
              />
            </div>
            <div className="form-group">
              <label>{t.confirmNewPassword}</label>
              <input
                type="password"
                name="confirmNewPassword"
                value={formData.confirmNewPassword}
                onChange={handleChange}
                className="form-control"
                placeholder={t.confirmNewPasswordPlaceholder}
              />
            </div>
            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}
            <button type="submit" className="btn btn-primary">{t.confirm}</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ChangePasswordModal;
