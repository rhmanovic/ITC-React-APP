import React from 'react';

const Invoice = ({ order }) => {
  const subtotal = order.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const deliveryFee = parseFloat(order.deliveryFee);
  const grandTotal = subtotal + deliveryFee;

  return (
    <div className="invoice" id="invoice">
     
    </div>
  );
};

export default Invoice;
