import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Card, Container, Row, Col } from "react-bootstrap";
import "../style/App.css";
import translations from "../utils/translations";
import { BASE_URL, YOUR_MERCHANT_ID } from "../config";
import ProductModal1 from "../modals/ProductModal1"; // Import the Product modal
import WelcomeModal from "../modals/WelcomeModal.jsx"; // Import offer modal component

function CategoryProducts({ language, onAddToCart, cart }) {
  const { categoryNumber } = useParams();
  const [products, setProducts] = useState([]);
  const [offers, setOffers] = useState([]);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedOffer, setSelectedOffer] = useState(null);


  const t = language === 'EN' ? translations.en.productPage : translations.ar.productPage;
  const currency = language === 'EN' ? translations.en.currency : translations.ar.currency;

  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/categories/${categoryNumber}/products/${YOUR_MERCHANT_ID}`)
      .then((response) => {
        const { products, offers } = response.data;
        setProducts(products);
        setOffers(offers);
      })
      .catch((error) => console.error("Error fetching products and offers:", error));
  }, [categoryNumber]);

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setShowProductModal(true);
  };

  const handleCloseProductModal = () => {
    setShowProductModal(false);
    setSelectedProduct(null);
  };

  const handleCardClick = (offer) => {
    setSelectedOffer(offer);
    setShowWelcomeModal(true);
  };

  const handleCloseWelcomeModal = () => {
    setShowWelcomeModal(false);
    setSelectedOffer(null);
  };

  const getBadgeColor = (warranty) => {
    const warrantyValue = parseInt(warranty, 10);
    if (warrantyValue === 1) return "green-badge";
    if (warrantyValue === 2) return "blue-badge";
    if (warrantyValue >= 3) return "gold-badge";
    return "";
  };

  return (
    <Container className="main mt-0">
      {offers.length === 0 && products.length === 0 ? (
        <p>No products or offers available for this category.</p>
      ) : (
        <Row className="mt-4">
          {offers.length > 0 && offers.map((offer, index) => (
            <Col key={offer._id} xs={6} md={4} lg={3} className="mb-2 px-1">
              <Card
                onClick={() => handleCardClick(offer)}
                className="offer-card"
              >
                {/* Discount Badge */}
                <div className="discount-badge">
                  {`${Math.round(((offer.original_price - offer.discounted_price) / offer.original_price) * 100)}% ${t.off}`} 
                </div>

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
                  <div className="price-section text-center">
                    {/* Prices on the same line */}
                    <span className="new-price-offers ms-2 text-danger fw-bold">
                      {parseFloat(offer.discounted_price).toFixed(3)} {currency}
                    </span>
                    <span className="old-price-offers ms-2 text-muted text-decoration-line-through">
                      {parseFloat(offer.original_price).toFixed(3)} {currency}
                    </span>
                    <br />
                    {/* Savings on a new line */}
                    <div className="save-amount text-success fw-bold">
                      Save {parseFloat(offer.original_price - offer.discounted_price).toFixed(3)} {currency}
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}

          {products.length > 0 && products
            .filter(product => product.status) // Filter out products where status is false
            .map((product) => (
              <Col key={product._id} xs={6} md={4} lg={3} className="mb-4">
                <Card 
                  onClick={() => handleProductClick(product)} 
                  className="product-card"
                >
                  <Card.Img
                    variant="top"
                    src={product.product_image ? `${BASE_URL}${product.product_image}` : "https://via.placeholder.com/150x265"}
                    alt={language === 'EN' ? product.product_name_en : product.product_name_ar}
                    loading="lazy"
                  />

                  {/* Warranty Badge */}
                  {product.warranty && (
                    <div className={`warranty-badge ${getBadgeColor(product.warranty)}`}>
                      <span>{product.warranty} {product.warranty > 1 ? 'Years' : 'Year'} Warranty</span>
                    </div>
                  )}

                  <Card.Body className="card-body">
                    <Card.Title className="product-title">
                      {language === 'EN' ? product.product_name_en : product.product_name_ar}
                    </Card.Title>
                    <span className="price">
                      {parseFloat(product.sale_price).toFixed(3)} {currency}
                    </span>
                  </Card.Body>
                </Card>
              </Col>
            ))}
        </Row>
      )}
      <div style={{ height: '50px' }}></div>

      {/* Modal for Selected Product */}
      {selectedProduct && (
        <ProductModal1
          show={showProductModal}
          handleClose={handleCloseProductModal}
          productId={selectedProduct._id}
          language={language}
          onAddToCart={onAddToCart}
        />
      )}

      {/* Modal for Selected Offer */}
      {selectedOffer && (
        <WelcomeModal
          show={showWelcomeModal}
          handleClose={handleCloseWelcomeModal}
          offer={selectedOffer}
          language={language}
          onAddToCart={onAddToCart}
        />
      )}
    </Container>
  );
}

export default CategoryProducts;
