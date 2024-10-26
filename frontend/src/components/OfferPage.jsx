import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, Row, Col, Card, Button, Form } from "react-bootstrap";
import { BASE_URL } from "../config";
import Countdown from "react-countdown";
import translations from "../utils/translations";
import "../style/OfferPage.css"; // Add this line to import your CSS

const OfferPage = ({ language = 'EN', onAddToCart }) => {
  const { offerNumber } = useParams();
  const navigate = useNavigate();
  const [offer, setOffer] = useState(null);
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const t = language === 'EN' ? translations.en.productPage : translations.ar.productPage;
  const currency = language === 'EN' ? translations.en.currency : translations.ar.currency;

  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/offers/number/${offerNumber}`)
      .then((response) => {
        setOffer(response.data.offer);
        setProduct(response.data.product);
        setQuantity(1);
      })
      .catch((error) => console.error("Error fetching offer or product:", error));
  }, [offerNumber]);

  const getNextMidnight = () => {
    const now = new Date();
    const nextMidnight = new Date(now);
    nextMidnight.setHours(24, 0, 0, 0);
    return nextMidnight;
  };

  const discountPercentage = offer
    ? Math.round(((offer.original_price - offer.discounted_price) / offer.original_price) * 100)
    : 0;

  const handleBuyNow = () => {
    if (offer && product && quantity) {
      const cartItem = {
        offerId: offer._id,
        offerName: language === 'EN' ? offer.offer_name_en : offer.offer_name_ar,
        productId: product._id,
        productName: language === 'EN' ? offer.offer_name_en : offer.offer_name_ar,
        product_name_en: offer.offer_name_en,
        product_name_ar: offer.offer_name_ar,
        productImage: offer.offer_image,
        price: parseFloat(offer.discounted_price),
        quantity: parseInt(quantity, 10),
        offer_quantity: parseFloat(offer.offer_quantity),
        warranty: product.warranty,
        variantId: null,
        variantName: null,
      };

      onAddToCart(cartItem);
      navigate("/cart");
    } else {
      alert(t.enterValidQuantity);
    }
  };

  if (!offer || !product) {
    return <p>{t.loading}</p>;
  }

  const countdownRenderer = ({ hours, minutes, seconds }) => {
    return (
      <div className="countdown-timer">
        <div className="time-segment">
          <span className="time">{hours}</span>
          <span className="label">Hours</span>
        </div>
        <div className="time-segment">
          <span className="time">{minutes}</span>
          <span className="label">Minutes</span>
        </div>
        <div className="time-segment">
          <span className="time">{seconds}</span>
          <span className="label">Seconds</span>
        </div>
      </div>
    );
  };

  return (
    <div className="main">
      <div>
        <Col xs={12} md={6}>
          <Card.Img
            src={offer.offer_image ? `${BASE_URL}${offer.offer_image}` : "https://via.placeholder.com/150x265"}
            alt={language === 'EN' ? offer.offer_name_en : offer.offer_name_ar}
            className="rounded"
            style={{
              width: '100%',
              height: 'auto',
              aspectRatio: '1',
              objectFit: 'cover'
            }}
          />
          <Container className="main mt-5">
            <h1 className="mt-3">{language === 'EN' ? offer.offer_name_en : offer.offer_name_ar}</h1>

            <div className="countdown-container mt-3">
              <h5 className="countdown-title">{t.limitedTimeOffer}</h5>
              <Countdown 
                date={getNextMidnight()} 
                renderer={countdownRenderer}
              />
            </div>

            <div className="price-section d-flex align-items-center mt-3">
              <span className="new-price ms-2">
                {parseFloat(offer.discounted_price).toFixed(3)} {currency}
              </span>
              <span className="old-price ms-2 text-muted">
                <del>{parseFloat(offer.original_price).toFixed(3)} {currency}</del>
              </span>
              <span className="discount-badge">%{discountPercentage}-</span>
            </div>

            <Form.Group className="mt-3">
              <div className="item-quantity d-flex align-items-center mt-2">
                <button className="btn btn-outline-secondary quantity-btn" onClick={() => setQuantity(prev => Math.max(prev - 1, 1))}>-</button>
                <input type="number" className="form-control quantity-input" value={quantity} readOnly />
                <button className="btn btn-outline-secondary quantity-btn" onClick={() => setQuantity(prev => prev + 1)}>+</button>
              </div>
            </Form.Group>
            <p className="mt-4">{language === 'EN' ? offer.description_en : offer.description_ar}</p>

          </Container>
        </Col>
      </div>

      {/* Sticky Buy Now button at the bottom */}
      <Button className="btn-buy-now" onClick={handleBuyNow}>
        {t.buyNow}
      </Button>
    </div>
  );
};

export default OfferPage;
