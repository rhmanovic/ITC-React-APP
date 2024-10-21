import React, { useState } from 'react';
import axios from 'axios';
import { Table, Button, Form } from 'react-bootstrap';
import { BASE_URL } from '../config';
import OrderDetailsModal from '../modals/OrderDetailsModal';
import '../style/Cart.css';

function SearchOrder() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [search, setSearch] = useState("");

  const fetchOrders = async (mobileNumber) => {
    setLoading(true);
    try {
      const response = await axios.post(`${BASE_URL}/api/orders/search`, { phone: mobileNumber });
      if (response.data.success) {
        setOrders(response.data.orders);
        setError(null);
      } else {
        setError('Failed to fetch orders');
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Error fetching orders');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchOrders(search);
  };

  const handleShowModal = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedOrder(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'new':
        return 'bg-info';
      case 'processing':
        return 'bg-warning';
      case 'completed':
        return 'bg-success';
      case 'canceled':
        return 'bg-danger';
      case 'returned':
        return 'bg-danger';
      default:
        return '';
    }
  };

  const Spacer = ({ height }) => {
    return (
      <div style={{ height: height }} />
    );
  };

  return (
    <div className="container my-5">
      <h3 className="text-center">Search Orders</h3>
      <Form onSubmit={handleSearch} className="mb-4">
        <Form.Group controlId="search">
          <Form.Label>Mobile Number</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter mobile number"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Form.Group>
        <Button variant="primary" type="submit" disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </Button>
      </Form>
      {loading ? (
        <div className="container text-center my-5">
          <div className="empty-cart">
            <img src="icon/shopping-bag.png" alt="Loading" className="empty-cart-icon" />
            <h3>Loading orders...</h3>
          </div>
        </div>
      ) : error ? (
        <div className="container text-center my-5">
          <div className="empty-cart">
            <img src="icon/shopping-bag.png" alt="Error" className="empty-cart-icon" />
            <h3>{error}</h3>
          </div>
        </div>
      ) : orders.length === 0 ? (
        <div className="container text-center my-5">
          <div className="empty-cart">
            <img src="icon/shopping-bag.png" alt="Empty Cart" className="empty-cart-icon" />
            <h3>No orders found</h3>
          </div>
        </div>
      ) : (
        <div className="table-container">
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Order Number</th>
                <th>Status</th>
                <th>Total</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <tr key={index}>
                  <td>{order.order_number}</td>
                  <td className={getStatusColor(order.status)} style={{ cursor: 'pointer' }}>
                    {order.status}
                  </td>
                  <td>{order.total}</td>
                  <td>
                    <Button variant="primary" onClick={() => handleShowModal(order)}>
                      View Details
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
      <Spacer height="50px" />
      {selectedOrder && (
        <OrderDetailsModal
          show={showModal}
          onHide={handleCloseModal}
          order={selectedOrder}
          updateOrderStatus={(orderId, newStatus) => {
            setOrders((prevOrders) =>
              prevOrders.map((order) =>
                order._id === orderId ? { ...order, status: newStatus } : order
              )
            );
          }}
        />
      )}
    </div>
  );
}

export default SearchOrder;
