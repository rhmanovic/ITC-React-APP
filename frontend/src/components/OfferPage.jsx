import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Container, Row, Col, Card, Button, Form } from "react-bootstrap";
import { BASE_URL } from "../config";
import translations from "../utils/translations";

const OfferPage = ({ language = 'EN', onAddToCart }) => {
  const { offerNumber } = useParams();
  const [offer, setOffer] = useState(null);
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const t = language === 'EN' ? translations.en.productPage : translations.ar.productPage;
  const currency = language === 'EN' ? translations.en.currency : translations.ar.currency;

  // Fetch offer and product details based on offerNumber
  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/offers/number/${offerNumber}`)
      .then((response) => {
        setOffer(response.data.offer);
        setProduct(response.data.product);
        setQuantity(1); // Start quantity at 1
      })
      .catch((error) => console.error("Error fetching offer or product:", error));
  }, [offerNumber]);

  const handleAddToCart = () => {
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
    } else {
      alert(t.enterValidQuantity);
    }
  };

  if (!offer || !product) {
    return <p>{t.loading}...</p>;
  }

  return (
    <Container className="main mt-5 offer-page product-page">
      <Row>
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
          <h1 className="mt-3">{language === 'EN' ? offer.offer_name_en : offer.offer_name_ar}</h1>

          {/* Price Section */}
          <div className="price-section d-flex align-items-center">
            <span className="new-price">{parseFloat(offer.discounted_price).toFixed(3)}</span>
            <span className="currency"> {currency}</span>
            <span className="old-price ms-3 text-muted">
              <del>{parseFloat(offer.original_price).toFixed(3)} {currency}</del>
            </span>
          </div>

          {/* Quantity Selector */}
          <Form.Group className="mt-3">
            <Form.Label>{`${t.quantity}: ${language === 'EN' ? offer.offer_name_en : offer.offer_name_ar}`}</Form.Label>
            <Form.Label>{`${t.quantity}: ${language === 'EN' ? product.product_name_en : product.product_name_ar}`}</Form.Label>
            <div className="item-quantity d-flex align-items-center mt-2">
              <button 
                className="btn btn-outline-secondary quantity-btn"
                onClick={() => setQuantity(prev => Math.max(prev - 1, 1))} // Decrease by 1, minimum is 1
              >-</button>
              <input 
                type="number" 
                className="form-control quantity-input" 
                value={quantity} 
                readOnly // Lock the input field
              />
              <button 
                className="btn btn-outline-secondary quantity-btn"
                onClick={() => setQuantity(prev => prev + 1)} // Increase by 1
              >+</button>
            </div>
          </Form.Group>

          {/* Add to Cart Button */}
          <Button className="mt-4 btn-add-to-cart" onClick={handleAddToCart}>
            {t.addToCart}
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default OfferPage;
