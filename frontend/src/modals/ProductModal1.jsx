import React, { useState, useEffect } from "react";
import { Modal, Button, Spinner, Alert, Form } from "react-bootstrap";
import axios from "axios";
import { BASE_URL } from "../config";
import translations from "../utils/translations";

const ProductModal1 = ({ show, handleClose, productId, language, onAddToCart }) => {
  const [product, setProduct] = useState(null);
  const [selectedVariation, setSelectedVariation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [shake, setShake] = useState(false);

  const currency = language === 'EN' ? translations.en.currency : translations.ar.currency;
  const t = language === 'EN' ? translations.en.productPage : translations.ar.productPage;

  useEffect(() => {
    if (show && productId) {
      setLoading(true);
      setError(null);
      axios
        .get(`${BASE_URL}/api/products/id/${productId}`)
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
  }, [show, productId]);

  const handleVariationChange = (event) => {
    const variationId = event.target.value;
    const selected = product.variations.find((variation) => variation._id === variationId);
    setSelectedVariation(selected);
  };

  const handleAddToCartClick = () => {
    if (product.variations.length > 0 && !selectedVariation) {
      setShake(true);
      setTimeout(() => setShake(false), 300);
      return;
    }

    if (product && quantity > 0) {
      const cartItem = {
        productId: product._id,
        productNumber: product.product_number,
        productName: language === 'EN' ? product.product_name_en : product.product_name_ar,
        product_name_en: product.product_name_en,
        product_name_ar: product.product_name_ar,
        brandName: product.brand,
        productImage: product.product_image,
        offerId: product.offer ? product.offer._id : null,
        price: selectedVariation ? parseFloat(selectedVariation.v_sale_price) : parseFloat(product.sale_price),
        cost: selectedVariation ? parseFloat(selectedVariation.v_purchase_price) : parseFloat(product.purchase_price),
        warranty: selectedVariation ? selectedVariation.v_warranty : product.warranty,
        variantId: selectedVariation ? selectedVariation._id : null,
        variantName: selectedVariation ? (language === 'EN' ? selectedVariation.v_name_en : selectedVariation.v_name_ar) : null,
        v_name_en: selectedVariation ? selectedVariation.v_name_en : null,
        v_name_ar: selectedVariation ? selectedVariation.v_name_ar : null,
        v_warranty: selectedVariation ? selectedVariation.v_warranty : null,
        quantity: parseInt(quantity, 10),
      };
      onAddToCart(cartItem);
      handleClose();
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered dir={language === 'EN' ? 'ltr' : 'rtl'}>
      <Modal.Header closeButton>
        <Modal.Title>{product ? (language === 'EN' ? product.product_name_en : product.product_name_ar) : "Product"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading ? (
          <div className="d-flex justify-content-center">
            <Spinner animation="border" />
          </div>
        ) : error ? (
          <Alert variant="danger">{error}</Alert>
        ) : product ? (
          <>
            <img
              src={product.product_image ? `${BASE_URL}${product.product_image}` : "https://via.placeholder.com/150"}
              alt={product.product_name_en}
              className="img-fluid rounded mb-3"
            />
            <h3 className="text-muted">{language === 'EN' ?  product.product_name_en : product.product_name_ar}</h3>

            <h3>{selectedVariation ? selectedVariation.v_sale_price.toFixed(3) : product.sale_price.toFixed(3)} {currency}</h3>
            {product.sale_price && selectedVariation && (
              <p className="text-muted">
                <del>{product.sale_price.toFixed(3)} {currency}</del>
              </p>
            )}

            {/* Variation Selector */}
            {product.variations && product.variations.length > 0 && (
              <Form.Group className="mt-3">
                <Form.Label>{t.ChooseColor}</Form.Label>
                <Form.Control
                  as="select"
                  className={`${shake ? "shake red-border" : ""}`}
                  value={selectedVariation ? selectedVariation._id : ''}
                  onChange={handleVariationChange}
                >
                  <option value="" disabled>{t.ChooseColor}</option>
                  {product.variations.map((variation) => (
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

            <Button className="mt-3 w-100 fw-bold" onClick={handleAddToCartClick}>
              {t.addToCart}
            </Button>
          </>
        ) : (
          <div>No product details available.</div>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default ProductModal1;
