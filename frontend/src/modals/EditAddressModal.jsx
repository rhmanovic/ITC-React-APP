// EditAddressModal.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../config';
import '../style/AddAddressModal.css';

const EditAddressModal = ({ show, onHide, language, address, onAddressUpdated }) => {
  const [formData, setFormData] = useState({
    city: '',
    block: '',
    street: '',
    house: '',
    region: '',
    isDefault: false
  });

  useEffect(() => {
    if (show && address) {
      setFormData({
        city: address.city,
        block: address.block,
        street: address.street,
        house: address.house,
        region: address.region,
        isDefault: address.isDefault
      });
    }
  }, [show, address]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${BASE_URL}/api/customer/update-address`, { ...formData, _id: address._id }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        }
      });

      if (response.data.success) {
        onAddressUpdated(response.data.address);
        onHide();
      } else {
        console.error(response.data.message);
      }
    } catch (error) {
      console.error('Error updating address:', error);
    }
  };

  return (
    <div className={`custom-modal-wrapper ${show ? 'show' : ''}`}>
      <div className="modal-backdrop" onClick={onHide}></div>
      <div className="custom-modal add-address-modal">
        <div className="modal-header">
          <h5 className="modal-title">{language === 'EN' ? 'Edit Address' : 'تعديل العنوان'}</h5>
          <button type="button" className="close" onClick={onHide}>&times;</button>
        </div>
        <hr className="modal-divider" />
        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>{language === 'EN' ? 'City' : 'مدينة'}</label>
              <input type="text" name="city" value={formData.city} onChange={handleChange} className="form-control" />
            </div>
            <div className="form-group">
              <label>{language === 'EN' ? 'Block' : 'كتلة'}</label>
              <input type="text" name="block" value={formData.block} onChange={handleChange} className="form-control" />
            </div>
            <div className="form-group">
              <label>{language === 'EN' ? 'Street' : 'شارع'}</label>
              <input type="text" name="street" value={formData.street} onChange={handleChange} className="form-control" />
            </div>
            <div className="form-group">
              <label>{language === 'EN' ? 'House' : 'منزل'}</label>
              <input type="text" name="house" value={formData.house} onChange={handleChange} className="form-control" />
            </div>
            <div className="form-group">
              <label>{language === 'EN' ? 'Region' : 'منطقة'}</label>
              <input type="text" name="region" value={formData.region} onChange={handleChange} className="form-control" />
            </div>
            <div className="form-check">
              <input type="checkbox" name="isDefault" checked={formData.isDefault} onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })} className="form-check-input" id="defaultAddress" />
              <label className="form-check-label" htmlFor="defaultAddress">{language === 'EN' ? 'Set as default' : 'تعيين كافتراضي'}</label>
            </div>
            <button type="submit" className="btn btn-primary btn-block">{language === 'EN' ? 'Update' : 'تحديث'}</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditAddressModal;
