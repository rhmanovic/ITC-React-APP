import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Card, Container, Row, Col } from "react-bootstrap";
import "../style/App.css";
import { BASE_URL, YOUR_MERCHANT_ID } from "../config";

function Categories({ language }) {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/merchant/${YOUR_MERCHANT_ID}`)
      .then((response) => {
        const { categories } = response.data;
        setCategories(categories);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      });
  }, []);

  const handleCategoryClick = (categoryNumber) => {
    navigate(`/category/${categoryNumber}`);
  };

  return (
    <Container className="main mt-5">
      {isLoading ? (
        <Row>
          {[...Array(8)].map((_, index) => (
            <Col key={index} xs={6} md={4} lg={3} className="mb-4">
              <Card className="category-card">
                <div className="aspect-ratio-container"></div>
                <Card.Body>
                  <div className="skeleton-title"></div>
                  <div className="skeleton-text"></div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      ) : categories.length === 0 ? (
        <div className="text-center no-categories">
          <img
            src="https://via.placeholder.com/200"
            alt="No categories"
            style={{ maxWidth: "200px", margin: "20px auto" }}
          />
          <p>No categories available. Please check back later.</p>
        </div>
      ) : (
        <Row>
          {categories
            .filter((category) => category.status)
            .map((category) => (
              <Col key={category._id} xs={6} md={4} lg={3} className="mb-4">
                <Card
                  onClick={() => handleCategoryClick(category.category_number)}
                  className="category-card"
                >
                  <div
                    className={`aspect-ratio-container ${category.imgsrc ? '' : 'loading'}`}
                    style={{
                      paddingTop: `${(category.imageHeight / category.imageWidth) * 100}%`,
                    }}
                  >
                    <img
                      src={category.imgsrc ? `${BASE_URL}${category.imgsrc}` : "https://via.placeholder.com/150x265"}
                      alt={language === "EN" ? category.EnglishName : category.ArabicName}
                      loading="lazy"
                      onLoad={(e) => e.target.parentElement.classList.remove('loading')}
                    />
                  </div>
                  <Card.Body>
                    <Card.Title>
                      {language === "EN" ? category.EnglishName : category.ArabicName}
                    </Card.Title>
                  </Card.Body>
                </Card>
              </Col>
            ))}
        </Row>
      )}
      <div style={{ height: "50px" }}></div>
    </Container>
  );
}

export default Categories;
