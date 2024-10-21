import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faSearch, faHeart, faUser } from '@fortawesome/free-solid-svg-icons'; // Add the needed icons
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../style/Navbar.css';

import { BASE_URL, YOUR_MERCHANT_ID } from '../config';

function Navbar({ language, setLanguage, customer, onLogout, projectName }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [activeButton, setActiveButton] = useState('التصنيفات');
  const [activeSection, setActiveSection] = useState('section1');
  const [categories, setCategories] = useState([]);

  const toggleLanguage = () => {
    setLanguage(language === 'EN' ? 'AR' : 'EN');
  };

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const handleButtonClick = (buttonName, section) => {
    setActiveButton(buttonName);
    setActiveSection(section);
  };

  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/merchant/${YOUR_MERCHANT_ID}`)
      .then((response) => {
        const { categories } = response.data;
        setCategories(categories);
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  return (
    <>
      <nav className="navbar navbar-expand-lg fixed-top bg-white border-bottom" dir="ltr">
        <div className="d-flex justify-content-between w-100 align-items-center justify-content-center px-1">
          <FontAwesomeIcon icon={faBars} className="address-icon mx-2" onClick={toggleSidebar} />
          <img className="bd-highlight" src="/img/banner.jpg" alt={projectName} style={{ maxWidth: '150px' }} />
          <div className="bd-highlight d-flex align-items-center">
            <span className="mx-2" onClick={toggleLanguage} style={{ cursor: 'pointer' }}>
              {language === 'EN' ? 'AR' : 'EN'}
            </span>
          </div>
        </div>
      </nav>
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: 0.2 }}
            className="sidebar"
          >
            <div className="sidebar-content p-0">
              <div className="sidebar-header p-0 py-3 d-flex">
                <input type="text" placeholder="البحث عن المنتجات" className="form-control border-0" />
                <button type="button" className="search-button">
                  <FontAwesomeIcon icon={faSearch} />
                </button>
              </div>
              <div className="btn-group w-100" role="group">
                <button
                  type="button"
                  className={`py-3 btn btn-squared ${activeButton === 'التصنيفات' ? 'active' : ''}`}
                  onClick={() => handleButtonClick('التصنيفات', 'section1')}
                >
                  التصنيفات
                </button>
                <button
                  type="button"
                  className={`py-3 btn btn-squared ${activeButton === 'القائمة' ? 'active' : ''}`}
                  onClick={() => handleButtonClick('القائمة', 'section2')}
                >
                  القائمة
                </button>
              </div>
              <ul className="list-group list-group-flush">
                <AnimatePresence mode="wait">
                  {activeSection === 'section1' ? (
                    <motion.div
                      key="section1"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {categories.length === 0 ? (
                        <li className="list-group-item"><p>No categories available.</p></li>
                      ) : (
                        categories.map((category) => (
                          <li key={category._id} className="list-group-item">
                            <a href="#" className="text-decoration-none text-dark">
                              {language === 'EN' ? category.EnglishName : category.ArabicName}
                            </a>
                          </li>
                        ))
                      )}
                    </motion.div>
                  ) : (
                    <motion.div
                      key="section2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <li className="list-group-item"><a href="#" className="text-decoration-none text-dark">الصفحة الرئيسية</a></li>
                      <li className="list-group-item"><a href="#" className="text-decoration-none text-dark">المتجر</a></li>
                      <li className="list-group-item"><a href="#" className="text-decoration-none text-dark">تواصل معنا</a></li>
                      <li className="list-group-item"><a href="#" className="text-decoration-none text-dark">الشروط والأحكام</a></li>
                      <li className="list-group-item"><a href="#" className="text-decoration-none text-dark">مواقع التواصل</a></li>
                      <li className="list-group-item"><a href="#" className="text-decoration-none text-dark">ENGLISH</a></li>
                      <li className="list-group-item"><a href="#" className="text-decoration-none text-dark"><FontAwesomeIcon icon={faHeart} /> المفضلة</a></li>
                      <li className="list-group-item"><a href="#" className="text-decoration-none text-dark"><FontAwesomeIcon icon={faUser} /> دخول / تسجيل</a></li>
                    </motion.div>
                  )}
                </AnimatePresence>
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overlay"
            onClick={toggleSidebar}
          />
        )}
      </AnimatePresence>
    </>
  );
}

export default Navbar;
