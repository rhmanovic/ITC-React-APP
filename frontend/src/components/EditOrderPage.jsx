import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { BASE_URL } from "../config";
import { Form, Button, Table, Row, Col, Modal } from "react-bootstrap";
import translations from "../utils/translations"; // Adjust the import path as necessary
import "../style/EditOrderPage.css"; // Custom CSS for styling

const EditOrderPage = ({ cart, language, customer }) => {
  const { id } = useParams(); // Extract order id from URL params
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/order/${id}`);
        if (response.data.success) {
          setOrder(response.data.order);
        } else {
          setError("Failed to fetch order details");
        }
      } catch (err) {
        console.error("Error fetching order details:", err);
        setError("Error fetching order details");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchOrder();
    }
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOrder((prevOrder) => ({
      ...prevOrder,
      [name]: value,
    }));
  };

  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    const updatedItems = order.items
      .map((item, i) => (i === index ? { ...item, [name]: value } : item))
      .filter((item) => item.quantity > 0);
    setOrder((prevOrder) => {
      const updatedOrder = {
        ...prevOrder,
        items: updatedItems,
      };
      updatedOrder.total = calculateTotal(updatedOrder.items, updatedOrder.deliveryFee);
      return updatedOrder;
    });
  };

  const handleDeliveryFeeChange = (e) => {
    const { value } = e.target;
    setOrder((prevOrder) => {
      const updatedOrder = {
        ...prevOrder,
        deliveryFee: parseFloat(value),
      };
      updatedOrder.total = calculateTotal(updatedOrder.items, updatedOrder.deliveryFee);
      return updatedOrder;
    });
  };

  const calculateTotal = (items, deliveryFee) => {
    const itemsTotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    return itemsTotal + parseFloat(deliveryFee);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${BASE_URL}/api/orders/update/${id}`, order);
      if (response.data.success) {
        alert("Order updated successfully");
      } else {
        alert("Failed to update order");
      }
    } catch (error) {
      console.error("Error updating order:", error);
      alert("Error updating order");
    }
  };

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleAddToOrder = () => {
    const updatedItems = [...order.items, ...cart];
    setOrder((prevOrder) => {
      const updatedOrder = {
        ...prevOrder,
        items: updatedItems,
      };
      updatedOrder.total = calculateTotal(updatedOrder.items, updatedOrder.deliveryFee);
      return updatedOrder;
    });
    setShowModal(false);
  };

  const t = language === "EN" ? translations.en.cart : translations.ar.cart;
  const currency = language === "EN" ? translations.en.currency : translations.ar.currency;

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="container my-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Edit Order</h3>
        <Button variant="primary" size="sm" onClick={handleShowModal} className="ml-3" style={{ width: '200px' }}>
          Show Cart Items
        </Button>
      </div>
      {order && (
        <Form onSubmit={handleSubmit}>
          <Form.Group as={Row} controlId="formOrderNumber">
            <Form.Label column sm="2">
              Order Number
            </Form.Label>
            <Col sm="10">
              <Form.Control plaintext readOnly defaultValue={order.order_number} />
            </Col>
          </Form.Group>

          <Form.Group as={Row} controlId="formStatus">
            <Form.Label column sm="2">
              Status
            </Form.Label>
            <Col sm="10">
              <Form.Control plaintext readOnly defaultValue={order.status} />
            </Col>
          </Form.Group>

          <Form.Group as={Row} controlId="formCustomerName">
            <Form.Label column sm="2">
              Customer Name
            </Form.Label>
            <Col sm="10">
              <Form.Control
                type="text"
                name="customerName"
                value={order.customerName}
                onChange={handleInputChange}
              />
            </Col>
          </Form.Group>

          <Form.Group as={Row} controlId="formAddress">
            <Form.Label column sm="2">
              Address
            </Form.Label>
            <Col sm="10">
              <Form.Control
                type="text"
                name="address"
                value={order.address}
                onChange={handleInputChange}
              />
            </Col>
          </Form.Group>

          <Form.Group as={Row} controlId="formPhone">
            <Form.Label column sm="2">
              Phone
            </Form.Label>
            <Col sm="10">
              <Form.Control
                type="text"
                name="phone"
                value={order.phone}
                onChange={handleInputChange}
              />
            </Col>
          </Form.Group>

          <h6>Items:</h6>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Variant</th>
                <th>Warranty</th>
                <th>Brand</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item, index) => (
                <tr key={index}>
                  <td>
                    <Form.Control plaintext readOnly defaultValue={`${item.product_name_en}, ${item.product_name_ar}`} />
                  </td>
                  <td>
                    <Form.Control plaintext readOnly defaultValue={`${item.v_name_en || 'N/A'}, ${item.v_name_ar || 'N/A'}`} />
                  </td>
                  <td>
                    <Form.Control plaintext readOnly defaultValue={item.v_warranty || item.warranty || "N/A"} />
                  </td>
                  <td>
                    <Form.Control plaintext readOnly defaultValue={item.brandName || "N/A"} />
                  </td>
                  <td>
                    <Form.Control
                      type="number"
                      name="quantity"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, e)}
                    />
                  </td>
                  <td>
                    <Form.Control
                      type="number"
                      name="price"
                      value={item.price}
                      onChange={(e) => handleItemChange(index, e)}
                    />
                  </td>
                  <td>{(item.price * item.quantity).toFixed(3)}</td>
                </tr>
              ))}
              <tr>
                <td colSpan="5"></td>
                <td colSpan="1" className="text-right"><strong>Subtotal:</strong></td>
                <td>{order.items.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(3)}</td>
              </tr>
              <tr>
                <td colSpan="5"></td>
                <td colSpan="1" className="text-right"><strong>Delivery Fee:</strong></td>
                <td>
                  <Form.Control
                    type="number"
                    name="deliveryFee"
                    value={order.deliveryFee}
                    onChange={handleDeliveryFeeChange}
                  />
                </td>
              </tr>
              <tr>
                <td colSpan="5"></td>
                <td colSpan="1" className="text-right"><strong>Grand Total:</strong></td>
                <td>{order.total.toFixed(3)}</td>
              </tr>
            </tbody>
          </Table>

          <Button variant="primary" type="submit">
            Save Changes
          </Button>
        </Form>
      )}

      <Modal show={showModal} onHide={handleCloseModal} size="lg" dialogClassName="custom-modal-width">
        <Modal.Header closeButton>
          <Modal.Title>Cart Items</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {cart.length === 0 ? (
            <div className="empty-cart text-center">
              <img src="icon/shopping-bag.png" alt="Empty Cart" className="empty-cart-icon" />
              <h3>{t.yourCartIsEmpty}</h3>
              <p>{t.startShopping}</p>
              <button className="btn btn-primary">{t.startShoppingButton}</button>
            </div>
          ) : (
            <div className="cart">
              <div className="cart-items">
                {cart.map((item, index) => (
                  <div key={index} className="cart-item d-flex justify-content-between align-items-center mb-3">
                    <div className="item-details d-flex align-items-center">
                      <img
                        src={`${BASE_URL}${item.productImage}`}
                        alt={language === "EN" ? item.product_name_en : item.product_name_ar}
                        className="cart-item-image"
                      />
                      <div className="item-info mx-1">
                        <span className="product-name">{language === "EN" ? item.product_name_en : item.product_name_ar}</span>
                        {item.variantName && (
                          <>
                            <span className="variant-name text-muted">{language === "EN" ? item.v_name_en : item.v_name_ar}</span>
                            {item.brandName && (
                              <span className="brand-name text-muted">({item.brandName})</span>
                            )}
                          </>
                        )}
                        {!item.variantName && item.brandName && (
                          <span className="brand-name text-muted">({item.brandName})</span>
                        )}
                        <div className="item-quantity mt-2">
                          <span className="quantity-description mx-1">Quantity:</span> {item.quantity}
                        </div>
                      </div>
                    </div>
                    <div className="item-price d-flex flex-column align-items-end">
                      <span>{currency} {(item.price || 0).toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleAddToOrder}>
            Add to Order
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Spacer to prevent footer from covering content */}
      <div style={{ height: '100px' }}></div>
    </div>
  );
};

export default EditOrderPage;
