import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../config';
import OrderDetailsModal from '../modals/OrderDetailsModal';
import '../style/Cart.css';
import { YOUR_MERCHANT_ID } from "../config";

function OrderStatusAll() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      // const response = await axios.get(`${BASE_URL}/api/orders`);
      const response = await axios.get(`${BASE_URL}/api/orders/${YOUR_MERCHANT_ID}`);
      if (response.data.success) {
        setOrders(response.data.orders);
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

  const handleReload = () => {
    setLoading(true);
    fetchOrders();
  };

  const handleShowModal = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedOrder(null);
  };

  const handleStatusChange = async (status) => {
    try {
      const response = await axios.post(`${BASE_URL}/api/orders/${selectedOrder._id}/status`, { status });
      if (response.data.success) {
        updateOrderStatus(selectedOrder._id, status);
      } else {
        alert('Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Error updating status');
    }
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

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order._id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  if (loading) {
    return (
      <div className="container text-center my-5">
        <div className="empty-cart">
          <img src="icon/shopping-bag.png" alt="Loading" className="empty-cart-icon" />
          <h3>Loading orders...</h3>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container text-center my-5">
        <div className="empty-cart">
          <img src="icon/shopping-bag.png" alt="Error" className="empty-cart-icon" />
          <h3>{error}</h3>
          <button className="btn btn-primary" onClick={handleReload}>Reload</button>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="container text-center my-5">
        <div className="empty-cart">
          <img src="icon/shopping-bag.png" alt="Empty Cart" className="empty-cart-icon" />
          <h3>قائمة طلباتي فارغة</h3>
          <button className="btn btn-primary" onClick={handleReload}>إعادة تحميل</button>
        </div>
      </div>
    );
  }

  const Spacer = ({ height }) => {
    return (
      <div style={{ height: height }} />
    );
  };

  return (
    <div className="container my-5">
      <h3 className="text-center">Today Orders</h3>
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
                <td className={getStatusColor(order.status)} style={{ cursor: order.status !== 'completed' ? 'pointer' : 'default' }}>
                  {order.status}
                </td>
                <td>{order.total}</td>
                <td>
                  <div className="d-flex gap-2">
                    <Button variant="primary" onClick={() => handleShowModal(order)}>
                      View Details
                    </Button>
                    <Button 
                      variant="primary" 
                      onClick={() => navigate(`/edit-order/${order._id}`)}
                      className={order.status === 'completed' || order.status === 'returned' ? 'btn-disabled' : ''}
                      disabled={order.status === 'completed' || order.status === 'returned'}
                    >
                      Edit Order
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      <Spacer height="50px" />

      {selectedOrder && (
        <OrderDetailsModal
          show={showModal}
          onHide={handleCloseModal}
          order={selectedOrder}
          updateOrderStatus={updateOrderStatus}
        />
      )}
    </div>
  );
}

export default OrderStatusAll;

