import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";
import CitySelectModal from "./CitySelectModal"; // Adjust the import path as necessary
import CountrySelectModal from "./CountrySelectModal"; // Adjust the import path as necessary
import translations from "../utils/translations"; // Adjust the import path as necessary
import "../style/AddAddressModal.css";
import { BASE_URL } from "../config"; // Ensure the correct path

const AddAddressModal = ({ show, handleClose, language, customerId, onAddressAdded }) => {
  const t = language === 'EN' ? translations.en.addAddressModal : translations.ar.addAddressModal;
  const [addressType, setAddressType] = useState("home");
  const [formData, setFormData] = useState({
    country: t.selectCountry,
    region: t.selectRegion, 
    street: "",
    block: "",
    house: "",
    district: "",
    road: "",
    avenue: "",  // Ensure avenue is initialized as an empty string
    extraDescription: "",
    isDefault: false
  });

  const [showCitySelectModal, setShowCitySelectModal] = useState(false);
  const [showCountrySelectModal, setShowCountrySelectModal] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // This useEffect will ensure the component re-renders when language changes
  }, [language]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleCitySelect = (city) => {
    setFormData((prevData) => ({
      ...prevData,
      region: city
    }));
    setShowCitySelectModal(false);
  };

  const handleCountrySelect = (country) => {
    setFormData((prevData) => ({
      ...prevData,
      country: country
    }));
    setShowCountrySelectModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Reset error state
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${BASE_URL}/api/customer/address`, // Ensure this is the correct endpoint
        { ...formData, addressType },
        { 
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token
          }
        } // Ensure the token is correctly included
      );
      onAddressAdded(response.data.addresses);
      handleClose();
    } catch (error) {
      console.error('Error adding address:', error);
      if (error.response) {
        console.error('Server response:', error.response.data);
        setError(`Server responded with status ${error.response.status}: ${error.response.data.message || error.response.data}`);
      } else {
        setError('An error occurred. Please try again.');
      }
    }
  };

  return (
    <>
      <Modal show={show} onHide={handleClose} centered className="add-address-modal">
        <Modal.Header closeButton>
          <Modal.Title>{t.addNewAddress}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group>
              <Form.Label>{t.country}</Form.Label>
              <div
                className="form-select"
                onClick={() => setShowCountrySelectModal(true)}
                style={{ cursor: "pointer", border: "1px solid #ced4da", padding: "0.375rem 0.75rem" }}
              >
                {formData.country || t.selectCountry}
              </div>
            </Form.Group>
            <Form.Group>
              <Form.Label>{t.region}</Form.Label>
              <div
                className="form-select"
                onClick={() => setShowCitySelectModal(true)}
                style={{ cursor: "pointer", border: "1px solid #ced4da", padding: "0.375rem 0.75rem" }}
              >
                {formData.region || t.selectRegion}
              </div>
            </Form.Group>
            <div className="address-type-buttons my-3">
              <Button
                className={`btn ${addressType === "home" ? "btn-primary active" : ""}`}
                onClick={() => setAddressType("home")}
              >
                {t.home}
              </Button>
              <Button
                className={`btn ${addressType === "apartment" ? "btn-primary active" : ""}`}
                onClick={() => setAddressType("apartment")}
              >
                {t.apartment}
              </Button>
              <Button
                className={`btn ${addressType === "office" ? "btn-primary active" : ""}`}
                onClick={() => setAddressType("office")}
              >
                {t.office}
              </Button>
            </div>
            <div className="inline-form-group">
              <Form.Group className="form-item">
                <Form.Label>{t.block}</Form.Label>
                <Form.Control
                  type="text"
                  name="block"
                  value={formData.block}
                  onChange={handleChange}
                  placeholder={t.enterBlock}
                  required
                />
              </Form.Group>
              <Form.Group className="form-item">
                <Form.Label>{t.street}</Form.Label>
                <Form.Control
                  type="text"
                  name="street"
                  value={formData.street}
                  onChange={handleChange}
                  placeholder={t.enterStreet}
                  required
                />
              </Form.Group>
            </div>
            <div className="inline-form-group">
              <Form.Group className="form-item">
                <Form.Label>{t.house}</Form.Label>
                <Form.Control
                  type="text"
                  name="house"
                  value={formData.house}
                  onChange={handleChange}
                  placeholder={t.enterHouse}
                  required
                />
              </Form.Group>
              <Form.Group className="form-item">
                <Form.Label>{t.avenue} ({t.optional})</Form.Label>
                <Form.Control
                  type="text"
                  name="avenue"
                  value={formData.avenue}
                  onChange={handleChange}
                  placeholder={t.enterAvenue}
                />
              </Form.Group>
            </div>
            <Form.Group>
              <Form.Label>{t.specialDirections} ({t.optional})</Form.Label>
              <Form.Control
                type="text"
                name="extraDescription"
                value={formData.extraDescription}
                onChange={handleChange}
                placeholder={t.enterDirections}
              />
            </Form.Group>
            <Form.Group controlId="formBasicCheckbox" className="my-2">
              <Form.Check
                type="checkbox"
                name="isDefault"
                checked={formData.isDefault}
                onChange={handleChange}
                label={t.makeDefault}
              />
            </Form.Group>
            {error && <div className="alert alert-danger">{error}</div>}
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                {t.close}
              </Button>
              <Button className="btn-primary" type="submit">
                {t.add}
              </Button>
            </Modal.Footer>
          </Form>
        </Modal.Body>
      </Modal>

      {showCitySelectModal && <div className="city-select-modal-backdrop"></div>}
      <CitySelectModal
        show={showCitySelectModal}
        handleClose={() => setShowCitySelectModal(false)}
        handleCitySelect={handleCitySelect}
        language={language}
      />

      {showCountrySelectModal && <div className="country-select-modal-backdrop"></div>}
      <CountrySelectModal
        show={showCountrySelectModal}
        handleClose={() => setShowCountrySelectModal(false)}
        handleCountrySelect={handleCountrySelect}
        language={language}
      />
    </>
  );
};

export default AddAddressModal;
