import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../config';

function UpdateProfileModal({ show, onHide, language, customer, updateCustomer }) {
  const [closing, setClosing] = useState(false);
  const [visible, setVisible] = useState(show);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    email: '',
    country: '',
    phone: ''
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    if (show && customer) {
      console.log('UpdateProfileModal useEffect - setting formData with customer:', customer);
      setVisible(true);
      setFormData({
        id: customer.id || customer._id || '',
        name: customer.name || '',
        email: customer.email || '',
        country: customer.country || '',
        phone: customer.phone || ''
      });
    } else if (!show && visible) {
      setClosing(true);
      const timer = setTimeout(() => {
        setClosing(false);
        setVisible(false);
      }, 500); // Match the CSS transition duration
      return () => clearTimeout(timer);
    }
  }, [show, visible, customer]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitting formData:', formData);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Unauthorized: No token provided');
        return;
      }

      const response = await axios.post(`${BASE_URL}/api/customer/update`, formData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        }
      });

      if (response.data.success) {
        console.log('Update successful, response data:', response.data.customer);
        updateCustomer(response.data.customer);
        onHide();
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className={`custom-modal-wrapper ${visible ? 'show' : ''} ${closing ? 'hide' : ''}`}>
      <div className="modal-backdrop" onClick={onHide}></div>
      <div className="custom-modal">
        <div className="modal-header">
          <h5 className="modal-title">{language === 'EN' ? 'Update Profile' : 'تحديث الملف الشخصي'}</h5>
          <button type="button" className="close" onClick={onHide}>
            &times;
          </button>
        </div>
        <hr className="modal-divider" />
        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>{language === 'EN' ? 'Name' : 'الاسم'}</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} className="form-control" />
            </div>
            <div className="form-group">
              <label>{language === 'EN' ? 'Email' : 'البريد الإلكتروني'}</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} className="form-control" />
            </div>
            <div className="form-group">
              <label>{language === 'EN' ? 'Country' : 'البلد'}</label>
              <input type="text" name="country" value={formData.country} onChange={handleChange} className="form-control" />
            </div>
            <div className="form-group">
              <label>{language === 'EN' ? 'Phone Number' : 'رقم الهاتف'}</label>
              <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="form-control" />
            </div>
            {error && <div className="alert alert-danger">{error}</div>}
            <button type="submit" className="btn btn-primary">
              {language === 'EN' ? 'Update' : 'تحديث'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UpdateProfileModal;
