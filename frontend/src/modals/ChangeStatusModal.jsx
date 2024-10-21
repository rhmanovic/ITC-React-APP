// ChangeStatusModal.jsx
import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const ChangeStatusModal = ({ show, onHide, order, onUpdateStatus }) => {
  const [newStatus, setNewStatus] = useState(order ? order.status : '');

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdateStatus(order._id, newStatus);
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Change Order Status</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="statusSelect">
            <Form.Label>Status</Form.Label>
            <Form.Control 
              as="select" 
              value={newStatus} 
              onChange={(e) => setNewStatus(e.target.value)}
            >
              <option value="new">New</option>
              <option value="processing">Processing</option>
              <option value="completed">Completed</option>
              <option value="canceled">Canceled</option>
            </Form.Control>
          </Form.Group>
          <Button variant="primary" type="submit">
            Update Status
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ChangeStatusModal;
