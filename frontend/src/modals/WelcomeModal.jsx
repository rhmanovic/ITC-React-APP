import React, { useState, useEffect } from "react";
import { Modal, Button, Spinner, Alert, Form, Row, Col } from "react-bootstrap";
import axios from "axios";
import Countdown from "react-countdown";
import { BASE_URL } from "../config";
import translations from "../utils/translations";

const WelcomeModal = ({ show, handleClose, offer, language, onAddToCart }) => {
  const [product, setProduct] = useState(null);
  const [selectedVariation, setSelectedVariation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [shake, setShake] = useState(false); // State to trigger shake effect if no variation is selected

  const currency = language === 'EN' ? translations.en.currency : translations.ar.currency;
  const t = language === 'EN' ? translations.en.productPage : translations.ar.productPage;

  useEffect(() => {
    if (show && offer && offer.product) {
      setLoading(true);
      setError(null);
      axios
        .get(`${BASE_URL}/api/products/id/${offer.product}`)
        .then((response) => {
          const productData = response.data.product;
          const availableVariations = productData.variations.filter(variation => variation.v_show);
          setProduct({ ...productData, variations: availableVariations });
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching product data:", error);
          setError("Failed to load product data. Please try again.");
          setLoading(false);
        });
    }
  }, [show, offer]);

  const getNextMidnight = () => {
    const now = new Date();
    const nextMidnight = new Date(now);
    nextMidnight.setHours(24, 0, 0, 0);
    return nextMidnight;
  };

  const discountPercentage = offer && offer.original_price
    ? Math.round(((offer.original_price - offer.discounted_price) / offer.original_price) * 100)
    : 0;

  const handleVariationChange = (event) => {
    const variationId = event.target.value;
    const selected = product.variations.find((variation) => variation._id === variationId);
    setSelectedVariation(selected);
    setShake(false); // Reset shake effect when a variation is selected
  };

  const handleAddToCartClick = () => {
    if (!selectedVariation && product.variations.length > 0) {
      setShake(true); // Trigger shake effect if no variation is selected
      setTimeout(() => setShake(false), 300); // Remove shake effect after animation duration
      return; // Prevent adding to cart without selecting a variation
    }

    const cartItem = {
      offerId: offer._id,
      offerName: language === 'EN' ? offer.offer_name_en : offer.offer_name_ar,
      productId: product ? product._id : "dummy_id",
      productName: product ? (language === 'EN' ? product.product_name_en : product.product_name_ar) : "Dummy Product",
      product_name_en: offer.offer_name_en,
      product_name_ar: offer.offer_name_ar,
      productImage: offer ? offer.offer_image : "/dummy-image.jpg",
      price: parseFloat(offer.discounted_price),
      quantity,
      offer_quantity: parseFloat(offer.offer_quantity),
      warranty: selectedVariation ? selectedVariation.v_warranty : product?.warranty,
      variantId: selectedVariation ? selectedVariation._id : "dummy_variation_id",
      variantName: selectedVariation ? (language === 'EN' ? selectedVariation.v_name_en : selectedVariation.v_name_ar) : null,
      v_name_en: selectedVariation ? selectedVariation.v_name_en : null,
      v_name_ar: selectedVariation ? selectedVariation.v_name_ar : null,
      v_warranty: selectedVariation ? selectedVariation.v_warranty : null
    };
    onAddToCart(cartItem);
    handleClose();
  };

  const countdownRenderer = ({ hours, minutes, seconds }) => (
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

  return (
    <Modal show={show} onHide={handleClose} centered dir={language === 'EN' ? 'ltr' : 'rtl'} className="">
      <div className="modal-header">
        <h5 className="modal-title">{language === 'EN' ? offer?.offer_name_en : offer?.offer_name_ar || "Welcome"}</h5>
        <button type="button" className="close" onClick={handleClose}>
          &times;
        </button>
      </div>
      <Modal.Body>
        {loading ? (
          <div className="d-flex justify-content-center">
            <Spinner animation="border" />
          </div>
        ) : error ? (
          <Alert variant="danger">{error}</Alert>
        ) : (
          <>
            <Row className="mb-3">
              <Col>
                <div>{language === 'EN' ? "Details" : "تفاصيل"}</div>
                <h2>{language === 'EN' ? offer?.offer_name_en : offer?.offer_name_ar || "Welcome"}</h2>
                <Form.Group className="mt-3">
                  <Form.Label>{language === 'EN' ? "Select Variation" : "اختر التنوع"}</Form.Label>
                  <Form.Control
                    as="select"
                    className={`${shake ? "shake red-border" : ""}`} // Apply shake effect if triggered
                    value={selectedVariation ? selectedVariation._id : ""}
                    onChange={handleVariationChange}
                  >
                    <option value="" disabled>{t.ChooseColor}</option>
                    {product?.variations?.map((variation) => (
                      <option key={variation._id} value={variation._id}>
                        {language === 'EN' ? variation.v_name_en : variation.v_name_ar}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>

                <Form.Group className="mt-3">
                  <div className="item-quantity d-flex align-items-center mt-2">
                    <button className="btn btn-outline-secondary quantity-btn" onClick={() => setQuantity(prev => Math.max(prev - 1, 1))}>-</button>
                    <input type="number" className="form-control quantity-input" value={quantity} readOnly />
                    <button className="btn btn-outline-secondary quantity-btn" onClick={() => setQuantity(prev => prev + 1)}>+</button>
                  </div>
                </Form.Group>
              </Col>
              <Col>
                <div>{language === 'EN' ? "More Info" : "مزيد من المعلومات"}</div>
                <img
                  src={`${BASE_URL}${offer?.offer_image || "/dummy-image.jpg"}`}
                  alt={offer?.offer_name_en || "Dummy Offer"}
                  style={{ width: "100%", height: "auto", marginBottom: "15px" }}
                />
              </Col>
            </Row>

            <div className="price-section d-flex align-items-center mt-3">
              <span className="new-price ms-2">
                {parseFloat(offer.discounted_price).toFixed(3)} {currency}
              </span>
              <span className="old-price ms-2 text-muted">
                <del>{parseFloat(offer.original_price).toFixed(3)} {currency}</del>
              </span>
              <span className="discount-badge">%{discountPercentage}-</span>
            </div>

            <div className="countdown-container mt-3">
              <h5 className="countdown-title">{t.limitedTimeOffer || "Limited Time Offer"}</h5>
              <Countdown 
                date={getNextMidnight()} 
                renderer={countdownRenderer}
              />
            </div>
          </>
        )}
      </Modal.Body>
      <Modal.Footer className="p-0">
        <Button
          variant="primary"
          onClick={handleAddToCartClick}
          className="w-100 fw-bold m-0"
        >
          {t.buyNow}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default WelcomeModal;
