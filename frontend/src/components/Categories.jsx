import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Card, Container, Row, Col } from "react-bootstrap";
import "../style/App.css";
import { BASE_URL, YOUR_MERCHANT_ID } from "../config";

function Categories({ language }) {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/merchant/${YOUR_MERCHANT_ID}`)
      .then((response) => {
        const { categories } = response.data;
        setCategories(categories);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const handleCategoryClick = (categoryNumber) => {
    navigate(`/category/${categoryNumber}`);
  };

  return (
    <Container className="main mt-5">
      {categories.length === 0 ? (
        <p className="no-categories">No categories available.</p>
      ) : (
        <Row>
          {categories.map((category) => (
            <Col key={category._id} xs={6} md={4} lg={3} className="mb-4">
              <Card 
                onClick={() => handleCategoryClick(category.category_number)} 
                className="category-card"
              >
                <Card.Img
                  variant="top"
                  src={category.imgsrc ? `${BASE_URL}${category.imgsrc}` : "https://via.placeholder.com/150x265"}
                  alt="Category image"
                  className="rounded"
                />
                <Card.Body className="card-body">
                  <Card.Title>
                    {language === 'EN' ? category.EnglishName : category.ArabicName}
                  </Card.Title>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
      <div style={{ height: '50px' }}></div>
    </Container>
  );
}

export default Categories;
