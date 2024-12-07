import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./style/Modal.css";
// import "./style/SplashScreen.css";

import { BASE_URL, YOUR_MERCHANT_ID } from "./config";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Menu from "./components/Menu";
import Categories from "./components/Categories";
import CategoryProducts from "./components/CategoryProducts";
import Offers from "./components/Offers";
import SearchOrder from "./components/SearchOrder";
import Cart from "./components/Cart";
import AboutUs from "./components/AboutUs";
import Payment from "./components/Payment";
import PaymentCash from "./components/PaymentCash";
import Checkout from "./components/Checkout";
import LoggedInCheckout from "./components/LoggedInCheckout";
import EditOrderPage from "./components/EditOrderPage";
import ProductPage from "./components/ProductPage";
import OfferPage from "./components/OfferPage";

import CustomModal from "./modals/CustomModal";
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfService from './components/TermsOfService';



import LoginModal from "./modals/LoginModal";
import SignUpModal from "./modals/SignUpModal";
import AccountModal from "./modals/AccountModal";
import UpdateProfileModal from "./modals/UpdateProfileModal";
import AddressesModal from "./modals/AddressesModal";
import ChangePasswordModal from "./modals/ChangePasswordModal";
import AddAddressModal from "./modals/AddAddressModal";
// import SplashScreen from "./components/SplashScreen";
import ProductModal from "./modals/ProductModal"; 
import VariantModal from "./modals/VariantModal"; 
import DummyCartModal from "./modals/DummyCartModal"; 

function App() {
  const location = useLocation(); // Get the current route location

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [merchantName, setMerchantName] = useState("");
  const [language, setLanguage] = useState("AR");
  const [customer, setCustomer] = useState(null);
  const [cart, setCart] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);

  const [showMoreModal, setShowMoreModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [showUpdateProfileModal, setShowUpdateProfileModal] = useState(false);
  const [showAddressesModal, setShowAddressesModal] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [showAddAddressModal, setShowAddAddressModal] = useState(false);
  // const [showSplash, setShowSplash] = useState(true);
  // const [splashClass, setSplashClass] = useState("");

  const [showProductModal, setShowProductModal] = useState(false);
  const [showVariantModal, setShowVariantModal] = useState(false);
  const [showDummyCartModal, setShowDummyCartModal] = useState(false);

  useEffect(() => {
    const storedLanguage = localStorage.getItem("language");
    const storedCustomer = localStorage.getItem("customer");
    const storedToken = localStorage.getItem("token");
    const storedCart = localStorage.getItem("cart");

    if (storedLanguage) {
      setLanguage(storedLanguage);
    } else {
      setLanguage("AR");
    }

    if (storedCustomer && storedToken) {
      const customer = JSON.parse(storedCustomer);
      setCustomer(customer);
    }

    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }

    axios
      .get(`${BASE_URL}/api/merchant/${YOUR_MERCHANT_ID}`)
      .then((response) => {
        const { merchant, categories, products } = response.data;
        setMerchantName(merchant.projectName);
        setCategories(categories);
        setProducts(products);
      })
      .catch((error) => console.error("Error fetching data:", error))
      .finally(() => {
        // setSplashClass("slide-out");
        // setTimeout(() => setShowSplash(false), 1000); // Duration of the slide-out animation
      });
  }, []);

  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
    localStorage.setItem("language", newLanguage);
  };

  const handleLogin = (token, customer) => {
    localStorage.setItem("token", token);
    localStorage.setItem("customer", JSON.stringify(customer));
    setCustomer(customer);
    setShowLoginModal(false);
  };

  const handleSignUp = () => {
    setShowSignUpModal(true);
    setShowLoginModal(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("customer");
    setCustomer(null);
    setShowAccountModal(false);
  };

  const updateCustomer = (updatedCustomer) => {
    const customer = { ...updatedCustomer, id: updatedCustomer._id };
    setCustomer(customer);
    localStorage.setItem("customer", JSON.stringify(customer));
  };

  const handleAddToCart = (cartItem) => {
    const updatedCart = cart.map((item) =>
      item.productId === cartItem.productId && item.variantId === cartItem.variantId
        ? { ...item, quantity: cartItem.quantity }
        : item
    );

    // If the item wasn't found in the cart, add it
    if (!updatedCart.find((item) => item.productId === cartItem.productId && item.variantId === cartItem.variantId)) {
      updatedCart.push(cartItem);
    }

    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    const successMessage = language === "EN" ? "Added to cart!" : "تم الاضافة للعربة";
    toast.success(successMessage);
  };

  const handleIncreaseQuantity = (product) => {
    const updatedCart = cart.map((item) =>
      item.productId === product.productId && item.variantId === product.variantId
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const handleDecreaseQuantity = (product) => {
    const updatedCart = cart
      .map((item) =>
        item.productId === product.productId && item.variantId === product.variantId
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
      .filter((item) => item.quantity > 0);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const handleRemoveItem = (product) => {
    const updatedCart = cart.filter(
      (item) => !(item.productId === product.productId && item.variantId === product.variantId)
    );
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const handleQuantityChange = (product, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveItem(product);
    } else {
      const updatedCart = cart.map((item) =>
        item.productId === product.productId && item.variantId === product.variantId
          ? { ...item, quantity: newQuantity }
          : item
      );
      setCart(updatedCart);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
    }
  };

  const handleAddressAdded = (addresses) => {
    setCustomer((prevCustomer) => ({
      ...prevCustomer,
      addresses,
    }));
  };

  const handleCloseAddAddressModal = () => setShowAddAddressModal(false);

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setShowProductModal(true);
  };

  const handleVariantClick = (variant) => {
    setSelectedVariant(variant);
    setShowVariantModal(true);
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("cart");
    toast.success("Order Created");
  };

  // Check if current route is the OfferPage
  const isOfferPage = location.pathname.startsWith("/offer/");

  return (
    <div className="pt-5" dir={language === "EN" ? "ltr" : "rtl"}>
      {/* {showSplash && (
        <div className={`splash-screen ${splashClass}`}>
          <SplashScreen />
        </div>
      )} */}
      <Navbar
        projectName={merchantName}
        language={language}
        setLanguage={handleLanguageChange}
        customer={customer}
        onLogout={handleLogout}
      />
      <div className="flex-grow-1 pt-1">
        <Routes>
          <Route path="/" element={<Categories language={language} />} />
          <Route
            path="/menu"
            element={
              <Menu
                categories={categories}
                products={products}
                language={language}
                onAddToCart={handleAddToCart}
                onProductClick={handleProductClick} 
              />
            }
          />
          <Route path="/privacy-policy" element={<PrivacyPolicy language={language} />} />
          <Route path="/terms-of-service" element={<TermsOfService language={language} />} />
          
          <Route
            path="/category/:categoryNumber"
            element={
              <CategoryProducts
                language={language}
                onAddToCart={handleAddToCart}
                cart={cart}
                onVariantClick={handleVariantClick}
              />
            }
          />
          <Route
            path="/offers"
            element={
              <Offers
                language={language}
                onAddToCart={handleAddToCart}
                cart={cart}
                onVariantClick={handleVariantClick}
              />
            }
          />
          
          <Route path="/about" element={<AboutUs language={language} />} />
          <Route path="/payment" element={<Payment language={language} cart={cart} customer={customer} clearCart={clearCart} />} />
          <Route path="/PaymentCash" element={<PaymentCash language={language} cart={cart} customer={customer} clearCart={clearCart} />} />
          <Route
            path="/cart"
            element={
              <Cart
                language={language}
                cart={cart}
                onIncreaseQuantity={handleIncreaseQuantity}
                onDecreaseQuantity={handleDecreaseQuantity}
                onRemoveItem={handleRemoveItem}
                onUpdateQuantity={handleQuantityChange}
                customer={customer}
              />
            }
          />
          <Route
            path="/checkout"
            element={
              <Checkout language={language} cart={cart} customer={customer} clearCart={clearCart} />
            }
          />
          <Route
            path="/logged-in-checkout"
            element={
              <LoggedInCheckout
                language={language}
                cart={cart}
                customer={customer}
              />
            }
          />
          <Route path="/product/:productNumber" element={<ProductPage language={language} onAddToCart={handleAddToCart} />} />
          <Route path="/offer/:offerNumber" element={<OfferPage language={language} onAddToCart={handleAddToCart} />} />
          <Route path="/seach-order" element={<SearchOrder language={language} />} />
          <Route path="/edit-order/:id" element={<EditOrderPage cart={cart} />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>

      {/* Conditionally render the footer except on the OfferPage */}
      {!isOfferPage && (
        <Footer
          language={language}
          setShowMoreModal={setShowMoreModal}
          setShowLoginModal={setShowLoginModal}
          setShowAccountModal={setShowAccountModal}
          setShowAddAddressModal={setShowAddAddressModal}
          setShowDummyCartModal={setShowDummyCartModal}
          customer={customer}
        />
      )}

      <CustomModal
        show={showMoreModal}
        onHide={() => setShowMoreModal(false)}
        language={language}
      />
      <LoginModal
        show={showLoginModal}
        onHide={() => setShowLoginModal(false)}
        language={language}
        onLogin={handleLogin}
        onSignUpClick={handleSignUp}
      />
      <SignUpModal
        show={showSignUpModal}
        onHide={() => setShowSignUpModal(false)}
        language={language}
        onLogin={handleLogin}
      />
      <AccountModal
        show={showAccountModal}
        onHide={() => setShowAccountModal(false)}
        language={language}
        customer={customer}
        onLogout={handleLogout}
        setShowUpdateProfileModal={setShowUpdateProfileModal}
        setShowAddressesModal={setShowAddressesModal}
        setShowChangePasswordModal={setShowChangePasswordModal}
      />
      <UpdateProfileModal
        show={showUpdateProfileModal}
        onHide={() => setShowUpdateProfileModal(false)}
        language={language}
        customer={customer}
        updateCustomer={updateCustomer}
      />
      <AddressesModal
        show={showAddressesModal}
        onHide={() => setShowAddressesModal(false)}
        language={language}
        setShowAddAddressModal={setShowAddAddressModal}
      />
      <AddAddressModal
        show={showAddAddressModal}
        handleClose={handleCloseAddAddressModal}
        language={language}
        onAddressAdded={handleAddressAdded}
      />
      <ChangePasswordModal
        show={showChangePasswordModal}
        onHide={() => setShowChangePasswordModal(false)}
        language={language}
      />
      <ProductModal
        show={showProductModal}
        cart={cart}
        handleClose={() => setShowProductModal(false)}
        product={selectedProduct}
        language={language}
        onAddToCart={handleAddToCart}
      />
      <VariantModal
        show={showVariantModal}
        handleClose={() => setShowVariantModal(false)}
        variant={selectedVariant}
        product={selectedProduct}
        language={language}
        onAddToCart={handleAddToCart}
        cart={cart} 
      />
      <DummyCartModal
        show={showDummyCartModal}
        handleClose={() => setShowDummyCartModal(false)}
        cart={cart}
      />
      <ToastContainer />
    </div>
  );
}

export default App;
