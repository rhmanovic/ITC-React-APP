import React, { useState, useEffect } from 'react';

function Contact() {
  const [contactData, setContactData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    fetch('/api/contact')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch contact data');
        }
        return response.json();
      })
      .then(data => {
        setContactData(data);
      })
      .catch(error => {
        setError(error.message);
      });
  };

  return (
    <div>
      <h1>Contact Us</h1>
      {error && <p>Error fetching contact info: {error}</p>}
      {contactData && (
        <div>
          <p>Name: {contactData.name}</p>
          <p>Email: {contactData.email}</p>
        </div>
      )}
    </div>
  );
}

export default Contact;
