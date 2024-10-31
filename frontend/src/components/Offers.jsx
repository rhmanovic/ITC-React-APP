import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Card, Container, Row, Col } from "react-bootstrap";
import "../style/App.css";
import translations from "../utils/translations";
import { BASE_URL, YOUR_MERCHANT_ID } from "../config";
import WelcomeModal from "../modals/WelcomeModal.jsx";

function Offers({ language, onAddToCart }) {
  const [offers, setOffers] = useState([]);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const currency = language === 'EN' ? translations.en.currency : translations.ar.currency;

  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/offers/${YOUR_MERCHANT_ID}`)
      .then((response) => {
        console.log("Fetched offers:", response.data);
        setOffers(response.data.offers);
      })
      .catch((error) => console.error("Error fetching offers:", error));
  }, []);

  const handleCardClick = (offer) => {
    setSelectedOffer(offer); // Set selected offer data
    setShowWelcomeModal(true); // Show the modal
  };

  const handleCloseWelcomeModal = () => {
    setShowWelcomeModal(false);
    setSelectedOffer(null); // Clear the selected offer when modal is closed
  };

  return (
    <Container className="main mt-0">
      {offers.length === 0 ? (
        <p>No offers available at the moment.</p>
      ) : (
        <Row className="mt-5">
          {offers.map((offer) => (
            <Col key={offer._id} xs={6} md={4} lg={3} className="mb-2 px-1">
              <Card 
                onClick={() => handleCardClick(offer)} // Open modal on card click
                className="offer-card"
              >
                <Card.Img
                  variant="top"
                  src={offer.offer_image ? `${BASE_URL}${offer.offer_image}` : "https://via.placeholder.com/150"}
                  alt={language === 'EN' ? offer.offer_name_en : offer.offer_name_ar}
                  loading="lazy"
                />
                <Card.Body className="card-body">
                  <Card.Title className="offer-title">
                    {language === 'EN' ? offer.offer_name_en : offer.offer_name_ar}
                  </Card.Title>
                  <div className="price-section d-flex align-items-center mt-3">
                    <span className="new-price-offers  ms-2">
                      {parseFloat(offer.discounted_price).toFixed(3)} {currency}
                    </span>
                    <span className="old-price-offers ms-2 text-muted">
                      <del>{parseFloat(offer.original_price).toFixed(3)} {currency}</del>
                    </span>
                    {/* <span className="discount-badge">%{discountPercentage}-</span> */}
                  </div>
                  
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
      <div style={{ height: '50px' }}></div>

      {/* Welcome Modal with Product and Offer Data */}
      {selectedOffer && (
        <WelcomeModal
          show={showWelcomeModal}
          handleClose={handleCloseWelcomeModal}
          offer={selectedOffer} // Pass selected offer to modal
          language={language}
          onAddToCart={onAddToCart} // Pass onAddToCart to modal
        />
      )}
    </Container>
  );
}

export default Offers;
