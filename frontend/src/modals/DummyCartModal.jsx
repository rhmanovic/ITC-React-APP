import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const DummyCartModal = ({ show, handleClose, cart }) => {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Cart Items</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {cart.length > 0 ? (
          <ul>
            {cart.map((item, index) => (
              <li key={index}>
                {item.productName} ({item.variantName}) - Quantity: {item.quantity}
              </li>
            ))}
          </ul>
        ) : (
          <p>No items in the cart.</p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DummyCartModal;
