import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Container, Row, Col, Card, Button, Form, Carousel } from "react-bootstrap";
import { BASE_URL } from "../config";
import translations from "../utils/translations";

const ProductPage = ({ language = 'EN', onAddToCart }) => {
  const { productNumber } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariation, setSelectedVariation] = useState(null);
  const [shake, setShake] = useState(false); // State to trigger shake effect

  const t = language === 'EN' ? translations.en.productPage : translations.ar.productPage;
  const currency = language === 'EN' ? translations.en.currency : translations.ar.currency;

  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/products/number/${productNumber}`)
      .then((response) => {
        setProduct(response.data.product);
      })
      .catch((error) => console.error("Error fetching product:", error));
  }, [productNumber]);

  const handleAddToCart = () => {
    // Check if product has variations, and if so, enforce selection
    if (product.variations && product.variations.length > 0 && !selectedVariation) {
      setShake(true); // Trigger shake effect if no variation is selected
      setTimeout(() => setShake(false), 300); // Remove shake effect after animation duration
      return;
    }

    if (product && quantity) {
      const cartItem = {
        productId: product._id,
        productNumber: product.product_number,
        productName: language === 'EN' ? product.product_name_en : product.product_name_ar,
        product_name_en: product.product_name_en,
        product_name_ar: product.product_name_ar,
        brandName: product.brand,
        productImage: product.product_image,
        offerId: product.offer ? product.offer._id : null, // Assuming `offer` exists in `product`

        // Pricing logic: Use variation price if available; otherwise, use product price
        price: selectedVariation ? parseFloat(selectedVariation.v_sale_price) : parseFloat(product.sale_price),

        // Warranty logic: Use variation warranty if available; otherwise, use product warranty
        warranty: selectedVariation ? selectedVariation.v_warranty : product.warranty,

        variantId: selectedVariation ? selectedVariation._id : null,
        variantName: selectedVariation ? (language === 'EN' ? selectedVariation.v_name_en : selectedVariation.v_name_ar) : null,
        v_name_en: selectedVariation ? selectedVariation.v_name_en : null,
        v_name_ar: selectedVariation ? selectedVariation.v_name_ar : null,
        v_warranty: selectedVariation ? selectedVariation.v_warranty : null,

        quantity: parseInt(quantity, 10),
      };
      onAddToCart(cartItem);
    } else {
      alert(t.enterValidQuantity);
    }
  };

  if (!product) {
    return <p>{t.loading}...</p>;
  }

  return (
    <Container className="main mt-5 product-page">
      <p>{product.product_name_en}</p>
      <Row>
        <Col xs={12} md={6}>
          {product.product_images && product.product_images.length > 0 ? (
            <Carousel>
              {product.product_images.map((image, index) => (
                <Carousel.Item key={index}>
                  <Card.Img
                    src={`${BASE_URL}${image}`}
                    alt={`Product image ${index + 1}`}
                    className="rounded"
                    style={{
                      width: '100%',
                      height: 'auto',
                      aspectRatio: '1',
                      objectFit: 'cover'
                    }}
                  />
                </Carousel.Item>
              ))}
            </Carousel>
          ) : (
            <Card.Img
              src={product.product_image ? `${BASE_URL}${product.product_image}` : "https://via.placeholder.com/150x265"}
              alt={language === 'EN' ? product.product_name_en : product.product_name_ar}
              className="rounded"
              style={{
                width: '100%',
                height: 'auto',
                aspectRatio: '1',
                objectFit: 'cover'
              }}
            />
          )}
          <h1 className="mt-3">{language === 'EN' ? product.product_name_en : product.product_name_ar}</h1>
          <h2>{parseFloat(selectedVariation ? selectedVariation.v_sale_price : product.sale_price).toFixed(3)} {currency}</h2>
          <div
            className="my-4 product-description"
            dangerouslySetInnerHTML={{
              __html: language === 'EN' ? product.description_en : product.description_ar,
            }}
          ></div>

          {/* Variation Selector */}
          {product.variations && product.variations.length > 0 && (
            <Form.Group className="mt-3">
              <Form.Label>{t.ChooseColor}</Form.Label>
              <Form.Control
                as="select"
                className={`${shake ? "shake red-border" : ""}`} // Apply shake and red border if triggered
                value={selectedVariation ? selectedVariation._id : ''}
                onChange={(e) => {
                  const selected = product.variations.find(variation => variation._id === e.target.value);
                  setSelectedVariation(selected);
                }}
              >
                {/* Placeholder option */}
                <option value="" disabled>{t.ChooseColor}</option>
                {product.variations
                  .filter(variation => variation.v_show) // Only show variations with v_show set to true
                  .map((variation) => (
                    <option key={variation._id} value={variation._id}>
                      {language === 'EN' ? variation.v_name_en : variation.v_name_ar} - {parseFloat(variation.v_sale_price).toFixed(3)} {currency}
                    </option>
                  ))}
              </Form.Control>
            </Form.Group>
          )}

          {/* Quantity Selector */}
          <Form.Group className="mt-3">
            <Form.Label>{t.quantity}</Form.Label>
            <div className="item-quantity d-flex align-items-center mt-2">
              <button 
                className="btn btn-outline-secondary quantity-btn"
                onClick={() => setQuantity(quantity > 1 ? quantity - 1 : 1)}
              >-</button>
              <input 
                type="number" 
                className="form-control quantity-input" 
                value={quantity} 
                onChange={(e) => setQuantity(Math.max(Number(e.target.value), 1))}
              />
              <button 
                className="btn btn-outline-secondary quantity-btn"
                onClick={() => setQuantity(quantity + 1)}
              >+</button>
            </div>
          </Form.Group>
          <Button 
            className="mt-3 btn-add-to-cart" 
            onClick={handleAddToCart}
          >
            {t.addToCart}
          </Button>
        </Col>
      </Row>
      <div style={{ height: '50px' }}></div>
    </Container>
  );
};

export default ProductPage;