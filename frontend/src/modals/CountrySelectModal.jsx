// CountrySelectModal.jsx
import React from "react";
import { Modal, Button } from "react-bootstrap";
import translations from "../utils/translations"; // Adjust the import path as necessary
import "../style/CountrySelectModal.css"; // Ensure this path is correct

const CountrySelectModal = ({ show, handleClose, handleCountrySelect, language }) => {
  const t = language === 'EN' ? translations.en.countrySelectModal : translations.ar.countrySelectModal;

  const countries = ["Kuwait", "Saudi Arabia", "Qatar", "United Arab Emirates", "Oman", "Bahrain"]; // Add more countries as needed

  return (
    <Modal show={show} onHide={handleClose} centered className="country-select-modal">
      <Modal.Header closeButton>
        <Modal.Title>{t.selectCountry}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ul className="list-group">
          {countries.map((country) => (
            <li key={country} className="list-group-item" onClick={() => handleCountrySelect(country)}>
              {country}
            </li>
          ))}
        </ul>
      </Modal.Body>
      
    </Modal>
  );
};

export default CountrySelectModal;
