import React from 'react';
import { BASE_URL } from '../config'; // Import BASE_URL
import translations from '../utils/translations'; // Adjust the import path as necessary

const CategorySections = ({ categories, products, language, buttonBorderColor, buttonTextColor, onAddToCart }) => {
  const t = language === 'EN' ? translations.en.categorySections : translations.ar.categorySections;
  const currency = language === 'EN' ? translations.en.currency : translations.ar.currency;

  return (
    <>
      {categories.map(category => (
        <div key={category._id} id={category._id} style={{ minHeight: '200px' }} className="mx-1">
          <h3><strong>{language === 'EN' ? category.EnglishName : category.ArabicName}</strong></h3>
          <div className="mx-1">
            {products.filter(product => product.category_number === category.category_number).map(product => (
              <React.Fragment key={product._id}>
                <div className="col-md-12 mb-4">
                  <div className="product-card d-flex">
                    <div className="product-details flex-grow-1 d-flex flex-column justify-content-between">
                      <div>
                        <h5 className="product-name">{language === 'EN' ? product.product_name_en : product.product_name_ar}</h5>
                        <p className="product-description" dangerouslySetInnerHTML={{ __html: language === 'EN' ? product.description_en : product.description_ar }}></p>
                      </div>
                      <div className="mt-auto">
                        <span className="product-price d-block">{currency} {product.sale_price.toFixed(3)}</span>
                        <button
                          className="btn mt-2"
                          style={{ borderColor: buttonBorderColor, color: buttonTextColor }}
                          onClick={() => onAddToCart(product)}
                        >
                          {t.addToCart}
                        </button>
                      </div>
                    </div>
                    <div className="product-image">
                      <img 
                        className="product-image" 
                        src={`${BASE_URL}${product.product_image}`} 
                        alt={product.product_name_en} 
                      />
                    </div>
                  </div>
                </div>
                <hr className="custom-divider" />
              </React.Fragment>
            ))}
          </div>
        </div>
      ))}
    </>
  );
};

export default CategorySections;
