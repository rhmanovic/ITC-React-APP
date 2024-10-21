import { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "./config";

export const useAppState = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [merchantName, setMerchantName] = useState("");
  const [language, setLanguage] = useState("AR");
  const [customer, setCustomer] = useState(null);
  const [cart, setCart] = useState([]);

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
      .get(`${BASE_URL}/api/merchant/662625076d3391f5ad60c243`)
      .then((response) => {
        const { merchant, categories, products } = response.data;
        setMerchantName(merchant.projectName);
        setCategories(categories);
        setProducts(products);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  return {
    categories,
    products,
    merchantName,
    language,
    setLanguage,
    customer,
    setCustomer,
    cart,
    setCart,
  };
};
