import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { Container, Spinner, Alert, Row, Col, Card } from "react-bootstrap";
import { BASE_URL } from "../config";
import translations from "../utils/translations";

const OrderDetails = ({ language = "EN" }) => {
  const location = useLocation();
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Select translations based on the language
  const t = language === "EN" ? translations.en : translations.ar;
  const currency = t.currency;

  useEffect(() => {
    const fetchOrder = async () => {
      const query = location.pathname.split("/")[2]; // Extract the query part
      const mobileMatch = query.match(/m=(\d+)/);
      const invoiceMatch = query.match(/i=(\d+)/);

      const mobile = mobileMatch ? mobileMatch[1] : null;
      const invoice = invoiceMatch ? invoiceMatch[1] : null;

      if (!mobile || !invoice) {
        setError(t.invalidParameters || "Invalid parameters in URL");
        setIsLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `${BASE_URL}/api/orders?mobile=${mobile}&invoice=${invoice}`
        );
        setOrder(response.data);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.error || t.failedToFetchOrder || "Failed to fetch order");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [location, t]);

  if (isLoading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">{t.loading}</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      <h3>{t.invoiceTitle || "Invoice - Order Details"}</h3>
      {order ? (
        <Card>
          <Card.Body>
            <Row>
              <Col sm={6}>
                <p><strong>{t.orderNumber}:</strong> {order.order_number}</p>
                {/* <p><strong>{t.name}:</strong> {order.customerName || t.notAvailable || "N/A"}</p> */}
                <p><strong>{t.phone}:</strong> {order.phone}</p>
                {/* <p><strong>{t.paymentMethod}:</strong> {order.PaymentMethod}</p> */}
                {/* <p><strong>{t.status}:</strong> {order.status}</p> */}
              </Col>
              <Col sm={6}>
                <p><strong>{t.invoiceDate}:</strong> {new Date(order.time).toLocaleDateString()}</p>
                {/* <p><strong>{t.website}:</strong> <a href={order.myWebsite} target="_blank" rel="noopener noreferrer">{order.myWebsite}</a></p> */}
              </Col>
            </Row>

            <h5>{t.items}</h5>
            <Row>
              {order.items.map((item) => (
                <Col sm={12} key={item._id}>
                  <Card className="mb-3">
                    <Card.Body>
                      <Row>
                        <Col sm={4}>
                          <img
                            src={`${BASE_URL}${item.productImage}`}
                            alt={item.productName}
                            className="img-fluid"
                            style={{ maxWidth: "150px" }}
                          />
                        </Col>
                        <Col sm={8}>
                          <p><strong>{t.productName}:</strong> {language === "EN" ? item.product_name_en : item.product_name_ar}</p>
                          <p><strong>{t.variant}:</strong> {language === "EN" ? item.v_name_en : item.v_name_ar}</p>
                          <p><strong>{t.price}:</strong> {item.price.toFixed(3)} {currency}</p>
                          <p><strong>{t.quantity}:</strong> {item.quantity}</p>
                          <p><strong>{t.total}:</strong> {(item.price * item.quantity).toFixed(3)} {currency}</p>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>

            <hr />
            <Row>
              <Col sm={6}>
                <p><strong>{t.deliveryFee}:</strong> {order.deliveryFee} {currency}</p>
                <p><strong>{t.discount}:</strong> {order.discount} {currency}</p>
              </Col>
              <Col sm={6}>
                <h5>{t.total}: {(order.total).toFixed(2)} {currency}</h5>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      ) : (
        <p>{t.noOrderFound || "No order found."}</p>
      )}
      <div style={{ height: "70px" }}></div>
    </Container>
  );
};

export default OrderDetails;
