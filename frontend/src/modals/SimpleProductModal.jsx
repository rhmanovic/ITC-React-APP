import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import NumericKeypad from "./NumericKeypad"; // Import the NumericKeypad component

function SimpleProductModal({ show, handleClose, product, language, onAddToCart, cart = [] }) {
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState(""); // Initialize price with product price
  const [activeInput, setActiveInput] = useState("quantity"); // Directly activate quantity input
  const [isFirstPriceInput, setIsFirstPriceInput] = useState(true); // Track first input for price

  useEffect(() => {
    if (product) {
      setPrice(product.sale_price.toFixed(3)); // Set initial price when product is set
      // Check if the product without variants is already in the cart
      const existingCartItem = cart.find((item) => item.productId === product._id && !item.variantId);
      if (existingCartItem) {
        setQuantity(existingCartItem.quantity.toString());
      } else {
        setQuantity("");
      }
      setActiveInput("quantity"); // Set the active input to quantity when the product changes
    }
  }, [product, cart]);

  const handleNumericKeypadClick = (num) => {
    try {
      if (activeInput === "price") {
        if (isFirstPriceInput) {
          setPrice(num);
          setIsFirstPriceInput(false);
        } else {
          setPrice((prev) => prev + num);
        }
      } else if (activeInput === "quantity") {
        setQuantity((prev) => prev + num);
      }
    } catch (error) {
      console.error("Error handling numeric keypad click:", error);
    }
  };

  const handleClear = () => {
    try {
      if (activeInput === "price") {
        setPrice("");
        setIsFirstPriceInput(true); // Reset first input flag
      } else if (activeInput === "quantity") {
        setQuantity("");
      }
    } catch (error) {
      console.error("Error clearing input:", error);
    }
  };

  const handleBackspace = () => {
    try {
      if (activeInput === "price") {
        setPrice((prev) => prev.slice(0, -1));
        if (price.length <= 1) {
          setIsFirstPriceInput(true); // Reset first input flag if price is cleared
        }
      } else if (activeInput === "quantity") {
        setQuantity((prev) => prev.slice(0, -1));
      }
    } catch (error) {
      console.error("Error handling backspace:", error);
    }
  };

  const handleConfirm = () => {
    // Handle confirm action if needed
  };

  const handleAddToCart = () => {
    if (quantity && price && product) {
      const cartItem = {
        productId: product._id,
        productName: language === 'EN' ? product.product_name_en : product.product_name_ar,
        product_name_en: product.product_name_en,
        product_name_ar: product.product_name_ar,
          warranty: product.warranty,
        variantId: null,
        variantName: null,
        brandName: product.brand, // Add the brand name of the product
        productImage: product.product_image,
        price: parseFloat(price),
        quantity: parseInt(quantity, 10),
      };

      // Always replace the quantity
      onAddToCart(cartItem);
      handleClose();
    } else {
      alert("Please select a valid quantity and price.");
    }
  };

  if (!product) {
    return null;
  }

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>
          {language === 'EN' ? product.product_name_en : product.product_name_ar} 
          {product.brand && ` (${product.brand})`}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row>
          <Col>
            <Form.Group controlId="formPrice">
              <Form.Label>Price</Form.Label>
              <Form.Control 
                type="text" 
                value={price}
                onFocus={() => setActiveInput("price")}
                readOnly // Read only to force using the numeric keypad
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="formQuantity">
              <Form.Label>Quantity</Form.Label>
              <Form.Control 
                type="text" 
                value={quantity}
                onFocus={() => setActiveInput("quantity")}
                readOnly // Read only to force using the numeric keypad
              />
            </Form.Group>
          </Col>
        </Row>
        <NumericKeypad 
          handleButtonClick={handleNumericKeypadClick} 
          handleClear={handleClear} 
          handleBackspace={handleBackspace} 
          handleConfirm={handleConfirm} 
          allowDecimal={activeInput === "price"} // Allow decimal only for price
        />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={handleAddToCart}>
          Add to Cart
        </Button>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default SimpleProductModal;
