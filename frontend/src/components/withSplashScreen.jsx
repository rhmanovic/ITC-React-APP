import React, { useState, useEffect } from 'react';
import SplashScreen from './SplashScreen';

const withSplashScreen = (WrappedComponent, fetchData) => {
  return function WithSplashScreen(props) {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const loadAppData = async () => {
        try {
          await fetchData();
        } catch (error) {
          console.error('Error loading data:', error);
        } finally {
          setLoading(false);
        }
      };

      loadAppData();
    }, []);

    if (loading) {
      return <SplashScreen />;
    }

    return <WrappedComponent {...props} />;
  };
};

export default withSplashScreen;
