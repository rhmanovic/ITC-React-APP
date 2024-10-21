import React from 'react';
import { Modal, Button, Table } from 'react-bootstrap';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import amiriRegular from './fonts/Amiri-Regular-normal.js'; // Adjust the path if necessary

const OrderDetailsModal = ({ show, onHide, order }) => {
  if (!order) {
    return null;
  }

  const createPdf = () => {
    const doc = new jsPDF();

    // Add Title
    doc.setFontSize(20);
    doc.text('Invoice', 105, 10, null, null, 'center');

    // Add Order Details in table format
    const imgData = 'img/banner.jpg';
    const imgWidth = 30;
    const imgHeight = 30;
    const startX = 10;
    const startY = 30;

    doc.setFontSize(12);
    doc.addImage(imgData, 'JPEG', startX + 150, startY, imgWidth, imgHeight); // Image aligned to the right
    doc.text('ITC for electricity', startX + 150 + imgWidth / 2, startY + imgHeight + 10, null, null, 'center'); // Company name centered below image

    doc.text(`Order Number: ${order.order_number}`, startX, startY);
    doc.text(`Status: ${order.status}`, startX, startY + 10);
    doc.text(`Customer Name: ${order.customerName}`, startX, startY + 20);
    doc.text(`Address: ${order.address}`, startX, startY + 30);
    doc.text(`Phone: ${order.phone}`, startX, startY + 40);


    // Prepare table data
    const tableData = order.items.map(item => [
      item.productName,
      item.variantName || 'N/A',
      item.brandName || 'N/A',
      item.quantity,
      item.price.toFixed(3),
      (item.price * item.quantity).toFixed(3),
    ]);

    const subtotal = order.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const deliveryFee = parseFloat(order.deliveryFee);
    const grandTotal = subtotal + deliveryFee;

    // Add Items Table
    doc.autoTable({
      startY: 80,
      head: [['Product Name', 'Variant', 'Brand', 'Quantity', 'Price', 'Total']],
      body: [
        ...tableData,
        [
          { content: 'Subtotal', colSpan: 5, styles: { halign: 'right' } },
          { content: subtotal.toFixed(3) }
        ],
        [
          { content: 'Delivery Fee', colSpan: 5, styles: { halign: 'right' } },
          { content: deliveryFee.toFixed(3) }
        ],
        [
          { content: 'Grand Total', colSpan: 5, styles: { halign: 'right' } },
          { content: grandTotal.toFixed(3) }
        ],
      ],
    });

    doc.save(`invoice_${order.order_number}.pdf`);
  };

  const subtotal = order.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const deliveryFee = parseFloat(order.deliveryFee);
  const grandTotal = subtotal + deliveryFee;

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Order Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <>
          <Table>
            <tbody>
              <tr>
                <td style={{ textAlign: 'left' }}>
                  <p><strong>Order Number:</strong> {order.order_number}</p>
                  <p><strong>Status:</strong> {order.status}</p>
                  <p><strong>Customer Name:</strong> {order.customerName}</p>
                  <p><strong>Address:</strong> {order.address}</p>
                  <p><strong>Phone:</strong> {order.phone}</p>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <img src="/img/banner.jpg" alt="Loading..." style={{ maxWidth: '100px', maxHeight: '100px' }} />
                  <p>ITC for electricity</p>
                </td>
              </tr>
            </tbody>
          </Table>
          <h6>Items:</h6>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Variant</th>
                <th>Brand</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item, itemIndex) => (
                <tr key={itemIndex}>
                  <td>{item.productName}</td>
                  <td>{item.variantName || 'N/A'}</td>
                  <td>{item.brandName || 'N/A'}</td>
                  <td>{item.quantity}</td>
                  <td>{item.price.toFixed(3)}</td>
                  <td>{(item.price * item.quantity).toFixed(3)}</td>
                </tr>
              ))}
              <tr>
                <td colSpan="5"><strong>Subtotal</strong></td>
                <td>{subtotal.toFixed(3)}</td>
              </tr>
              <tr>
                <td colSpan="5"><strong>Delivery Fee</strong></td>
                <td>{deliveryFee.toFixed(3)}</td>
              </tr>
              <tr>
                <td colSpan="5"><strong>Grand Total</strong></td>
                <td>{grandTotal.toFixed(3)}</td>
              </tr>
            </tbody>
          </Table>
        </>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Close</Button>
        <Button variant="primary" onClick={createPdf}>Create PDF Invoice</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default OrderDetailsModal;
