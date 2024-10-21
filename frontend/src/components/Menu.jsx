// Menu.jsx

import React, { useState, useEffect, useRef, useCallback } from 'react';
import '../style/CategoryNavbar.css';
// import '../style/App.css'; // Ensure this CSS file includes the banner-image styles
import CategorySections from './CategorySections'; // Import the new component

function Menu({ language, categories, products, onAddToCart }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const offset = 200; // Adjust this offset value to fit your needs
  const clickOffset = 150; // Additional offset for click event
  const scrollContainerRef = useRef(null);
  const debounceTimeout = useRef(null);

  const handleNavClick = useCallback((index, id) => {
    setActiveIndex(index);
    const section = document.getElementById(id);
    const yOffset = -clickOffset; // Use the additional offset for click
    const y = section.getBoundingClientRect().top + window.pageYOffset + yOffset;
    window.scrollTo({ top: y, behavior: 'smooth' });
  }, []);

  const checkAndScrollToActive = useCallback(() => {
    const scrollContainer = scrollContainerRef.current;
    const activeEl = document.querySelector('.nav-link.active');
    if (activeEl && scrollContainer) {
      const activeElRect = activeEl.getBoundingClientRect();
      const containerRect = scrollContainer.getBoundingClientRect();
      if (activeElRect.left < containerRect.left || activeElRect.right > containerRect.right) {
        scrollContainer.scrollLeft += activeElRect.left - containerRect.left - (containerRect.width - activeElRect.width) / 2;
      }
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollOffset = window.pageYOffset;
      const viewPortHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      const positions = categories.map(category => {
        const element = document.getElementById(category._id);
        const elementTop = window.pageYOffset + element.getBoundingClientRect().top - offset;
        const elementBottom = elementTop + element.offsetHeight;
        return { top: elementTop, bottom: elementBottom };
      });

      if (scrollOffset + viewPortHeight >= documentHeight) {
        setActiveIndex(categories.length - 1);
      } else {
        const currentIndex = positions.findIndex(pos => pos.bottom >= scrollOffset && pos.top <= scrollOffset + viewPortHeight);
        if (scrollOffset === 0) {
          setActiveIndex(0);
        } else if (currentIndex !== -1) {
          setActiveIndex(currentIndex);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [categories, offset]);

  useEffect(() => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    debounceTimeout.current = setTimeout(() => {
      checkAndScrollToActive();
    }, 350); // Delay the action by 500 milliseconds
  }, [checkAndScrollToActive, activeIndex]);

  return (
    <div className="main mt-0">
      <div className="banner-image">
        <img className="bd-highlight" src="/img/banner.jpg" alt="banner"/>
      </div>
      <div className="category-navbar sticky-top py-2" ref={scrollContainerRef}>
        <ul className="nav nav-pills d-flex flex-row flex-nowrap p-0">
          {categories.map((category, index) => (
            <li key={category._id} className="nav-item mx-1">
              <a
                className={`nav-link nav-list ${index === activeIndex ? 'active' : ''}`}
                onClick={() => handleNavClick(index, category._id)}
              >
                {language === 'EN' ? category.EnglishName : category.ArabicName}
              </a>
            </li>
          ))}
        </ul>
      </div>
      <CategorySections 
        categories={categories} 
        products={products} 
        language={language} 
        buttonBorderColor="#FD995A" 
        buttonTextColor="black" 
        onAddToCart={onAddToCart}  // Pass the onAddToCart function
      />        
      
    </div>
  );
}

export default Menu;
