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

  const t = language === 'EN' ? translations.en.productPage : translations.ar.productPage;
  const currency = language === 'EN' ? translations.en.currency : translations.ar.currency;

  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/products/number/${productNumber}`)
      .then((response) => {
        setProduct(response.data.product);
        if (response.data.product.variations && response.data.product.variations.length > 0) {
          setSelectedVariation(response.data.product.variations[0]); // Default to the first variation
        }
      })
      .catch((error) => console.error("Error fetching product:", error));
  }, [productNumber]);

  const handleAddToCart = () => {
    if (product && quantity) {
      const cartItem = {
        productId: product._id,
        productNumber: product.product_number,
        productName: language === 'EN' ? product.product_name_en : product.product_name_ar,
        product_name_en: product.product_name_en,
        product_name_ar: product.product_name_ar,
        warranty: product.warranty,
        variantId: selectedVariation ? selectedVariation._id : null,
        variantName: selectedVariation ? (language === 'EN' ? selectedVariation.v_name_en : selectedVariation.v_name_ar) : null,
        brandName: product.brand,
        productImage: product.product_image,
        price: parseFloat(selectedVariation ? selectedVariation.v_sale_price : product.sale_price),
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

  // Log all items in the cart
  console.log("product Details:", product);

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
              <Form.Label>{t.chooseVariation}</Form.Label>
              <Form.Control
                as="select"
                value={selectedVariation ? selectedVariation._id : ''}
                onChange={(e) => {
                  const selected = product.variations.find(variation => variation._id === e.target.value);
                  setSelectedVariation(selected);
                }}
              >
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
          <Button className="mt-3 btn-add-to-cart" onClick={handleAddToCart}>
            {t.addToCart}
          </Button>
        </Col>
      </Row>
      <div style={{ height: '50px' }}></div>
    </Container>
  );
};

export default ProductPage;
