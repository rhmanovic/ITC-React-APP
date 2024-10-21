import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { BASE_URL } from "../config";
import VariantModal from "../modals/VariantModal"; // Import the VariantModal component

function ProductModal({ show, handleClose, product, language, onAddToCart, cart }) {
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [showVariantModal, setShowVariantModal] = useState(false);

  if (!product) {
    return null;
  }

  const handleVariantClick = (variant) => {
    setSelectedVariant(variant);
    setShowVariantModal(true);
  };

  const handleCloseVariantModal = () => {
    setShowVariantModal(false);
    setSelectedVariant(null);
  };

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{language === 'EN' ? product.product_name_en : product.product_name_ar}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <img 
            src={product.product_image ? `${BASE_URL}${product.product_image}` : "https://via.placeholder.com/150"} 
            alt={language === 'EN' ? product.product_name_en : product.product_name_ar} 
            style={{maxWidth: '250px', maxHeight: '250px' }} 
          />
          {/* <p>{language === 'EN' ? product.description_en : product.description_ar}</p> */}
          <h5>Variants:</h5>
          {product.variations && product.variations.length > 0 ? (
            <div className="d-flex flex-wrap">
              {product.variations.map((variant) => (
                <div 
                  key={variant._id} 
                  className="p-2 border m-1" 
                  style={{ cursor: 'pointer' }} 
                  onClick={() => handleVariantClick(variant)}
                >
                  <strong>{language === 'EN' ? variant.v_name_en : variant.v_name_ar}</strong>: {variant.v_sale_price.toFixed(3)}
                  <br />
                  {variant.v_brand}
                  <br />
                  Quantity: {variant.v_available_quantity}
                  Warehouse: {variant.v_warehouse_stock}
                </div>
              ))}
            </div>
          ) : (
            <p>No variants available.</p>
          )}
        </Modal.Body>
        
      </Modal>

      <VariantModal 
        show={showVariantModal} 
        handleClose={handleCloseVariantModal} 
        variant={selectedVariant} 
        language={language}
        product={product} // Pass the product prop
        onAddToCart={onAddToCart} // Pass the onAddToCart handler
        cart={cart} // Pass the cart prop here
        
      />
    </>
  );
}

export default ProductModal;
