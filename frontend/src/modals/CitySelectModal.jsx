import React from "react";
import { Modal, Button, ListGroup } from "react-bootstrap";
import translations from "../utils/translations"; // Adjust the import path as necessary
import "../style/CitySelectModal.css"; // Ensure this path is correct

const CitySelectModal = ({ show, handleClose, handleCitySelect, language }) => {
  const t = language === 'EN' ? translations.en.citySelectModal : translations.ar.citySelectModal;

  const dummyCities = [
    "New York", "Los Angeles", "Chicago", "Houston", "Phoenix",
    "Philadelphia", "San Antonio", "San Diego", "Dallas", "San Jose",
    "Austin", "Jacksonville", "Fort Worth", "Columbus", "Charlotte",
    "San Francisco", "Indianapolis", "Seattle", "Denver", "Washington"
  ];

  return (
    <Modal show={show} onHide={handleClose} centered className="city-select-modal">
      <Modal.Header closeButton>
        <Modal.Title>{t.selectCity}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="city-select-modal-body">
        <ListGroup>
          {dummyCities.map((city, index) => (
            <ListGroup.Item
              key={index}
              action
              onClick={() => handleCitySelect(city)}
            >
              {city}
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Modal.Body>
      
    </Modal>
  );
};

export default CitySelectModal;
