import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Container, Row, Col } from "react-bootstrap";
import "../style/App.css";
import translations from "../utils/translations";
import { BASE_URL } from "../config";

function CategoryProducts({ language, onAddToCart, cart }) {
  const { categoryNumber } = useParams();
  const navigate = useNavigate(); 
  const [products, setProducts] = useState([]);

  const currency = language === 'EN' ? translations.en.currency : translations.ar.currency;

  useEffect(() => {
    console.log(`Fetching products for category number: ${categoryNumber}`);
    axios
      .get(`${BASE_URL}/api/categories/${categoryNumber}/products`)
      .then((response) => {
        console.log("Fetched products:", response.data);
        const { products } = response.data;
        setProducts(products);
      })
      .catch((error) => console.error("Error fetching products:", error));
  }, [categoryNumber]);

  const handleProductClick = (productNumber) => {
    navigate(`/product/${productNumber}`);
  };

  return (
    <Container className="main mt-0">
      {products.length === 0 ? (
        <p>No products available for this category.</p>
      ) : (
        <Row className="mt-5">
          {products.map((product) => (
            <Col key={product._id} xs={6} md={4} lg={3} className="mb-4">
              <Card 
                onClick={() => handleProductClick(product.product_number)} 
                className="product-card"
              >
                <Card.Img
                  variant="top"
                  src={product.product_image ? `${BASE_URL}${product.product_image}` : "https://via.placeholder.com/150x265"}
                  alt={language === 'EN' ? product.product_name_en : product.product_name_ar}
                />
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
      {/* Spacer to prevent footer from covering content */}
      <div style={{ height: '50px' }}></div>
    </Container>
  );
}

export default CategoryProducts;
