import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Button } from 'react-bootstrap';
import { BASE_URL } from '../config';
import axios from 'axios';

const EditOrder = () => {
  const [order, setOrder] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedOrder = localStorage.getItem("openOrder");
    if (storedOrder) {
      setOrder(JSON.parse(storedOrder));
    }
  }, []);

  const handleSaveChanges = async () => {
    try {
      // Update the backend
      await axios.post(`${BASE_URL}/api/orders/${order._id}/update`, order);
      // Clear local storage and navigate back to order status
      localStorage.removeItem("openOrder");
      navigate("/order-status");
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };

  const handleIncreaseQuantity = (productId) => {
    setOrder((prevOrder) => ({
      ...prevOrder,
      items: prevOrder.items.map(item =>
        item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item
      ),
    }));
  };

  const handleDecreaseQuantity = (productId) => {
    setOrder((prevOrder) => ({
      ...prevOrder,
      items: prevOrder.items.map(item =>
        item.productId === productId ? { ...item, quantity: item.quantity - 1 } : item
      ).filter(item => item.quantity > 0),
    }));
  };

  const handleRemoveItem = (productId) => {
    setOrder((prevOrder) => ({
      ...prevOrder,
      items: prevOrder.items.filter(item => item.productId !== productId),
    }));
  };

  if (!order) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container my-5">
      <h3 className="text-center">Edit Order</h3>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Product Name</th>
            <th>Variant</th>
            <th>Brand</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Total</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {order.items.map((item, index) => (
            <tr key={index}>
              <td>{item.productName}</td>
              <td>{item.variantName || 'N/A'}</td>
              <td>{item.brandName || 'N/A'}</td>
              <td>{item.quantity}</td>
              <td>{item.price.toFixed(2)}</td>
              <td>{(item.price * item.quantity).toFixed(2)}</td>
              <td>
                <Button variant="success" onClick={() => handleIncreaseQuantity(item.productId)}>+</Button>
                <Button variant="warning" onClick={() => handleDecreaseQuantity(item.productId)}>-</Button>
                <Button variant="danger" onClick={() => handleRemoveItem(item.productId)}>Remove</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Button variant="primary" onClick={handleSaveChanges}>Save Changes</Button>
    </div>
  );
};

export default EditOrder;
