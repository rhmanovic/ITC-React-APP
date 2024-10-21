import { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../config';

const useFetchData = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [merchantName, setMerchantName] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/merchant/662625076d3391f5ad60c243`);
        const { merchant, categories, products } = response.data;
        setMerchantName(merchant.projectName);
        setCategories(categories);
        setProducts(products);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return { categories, products, merchantName };
};

export default useFetchData;
