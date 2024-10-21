import React, { useState } from "react";
import { Modal, Button, Spinner, Table } from "react-bootstrap";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { toast } from 'react-toastify';
import amiriRegular from "../fonts/Amiri-Regular-normal.js";
import { BASE_URL } from '../config';

const OrderDetailsModal = ({ show, onHide, order, updateOrderStatus }) => {
  const [loading, setLoading] = useState(false);

  const generatePDF = () => {
    setLoading(true);
    const doc = new jsPDF();
    doc.addFileToVFS("Amiri-Regular.ttf", amiriRegular);
    doc.addFont("Amiri-Regular.ttf", "Amiri", "normal");
    doc.setFont("Amiri");

    // Convert timestamp to yyyy-mm-dd
    const orderDate = new Date(order.time);
    const formattedDate = orderDate.toISOString().split("T")[0];

    // Add Title
    doc.setFontSize(20);
    doc.text("Invoice - فاتورة", 105, 10, null, null, "center");

    // Add Order Details in table format
    doc.text(`رقم الطلب Order Number: ${order.order_number}`, 10, 30);
    doc.text(`تاريخ Date: ${formattedDate}`, 10, 37);
    doc.text(`الحالة Status: ${order.status}`, 10, 44);
    doc.text(`اسم العميل Customer Name: ${order.customerName}`, 10, 51);
    doc.text(`الهاتف Phone: ${order.phone}`, 10, 58);
    doc.text(`العنوان Address: ${order.address}`, 10, 65);

    // Prepare table data
    const tableData = order.items.map((item) => [
      item.product_name_en + " " + item.product_name_ar,
      item.v_name_en ? item.v_name_en + " " + item.v_name_ar : "-",
      item.v_warranty || item.warranty || "-",
      item.brandName || "-",
      item.quantity,
      item.price.toFixed(3),
      (item.price * item.quantity).toFixed(3),
    ]);

    const subtotal = order.items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0,
    );
    const deliveryFee = parseFloat(order.deliveryFee);
    const grandTotal = subtotal + deliveryFee;

    // Add Items Table
    doc.autoTable({
      startY: 80,
      head: [
        [
          "Product Name اسم المنتج",
          "Variant المتغير",
          "Warranty الكفالة",
          "Brand الماركة",
          "Quantity الكمية",
          "Price السعر",
          "Total الاجمالي",
        ],
      ],
      body: [
        ...tableData,
        [
          { content: "Subtotal المجموع الفرعي", colSpan: 5, styles: { halign: "right" } },
          { content: subtotal.toFixed(3) },
        ],
        [
          { content: "Delivery Fee رسوم التوصيل", colSpan: 5, styles: { halign: "right" } },
          { content: deliveryFee.toFixed(3) },
        ],
        [
          { content: "Grand Total المجموع", colSpan: 5, styles: { halign: "right" } },
          { content: grandTotal.toFixed(3) },
        ],
      ],
      styles: { font: "Amiri" },
    });

    doc.save(`invoice_${order.order_number}.pdf`);
    setLoading(false);
  };

  const completeOrder = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/api/orders/${order._id}/status`, { status: 'completed' });
      if (response.data.success) {
        updateOrderStatus(order._id, 'completed');
        toast.success("Order completed successfully!");
        onHide();
      } else {
        toast.error('Failed to update order status.');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Error updating order status.');
    }
  };

  const returnOrder = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/api/orders/${order._id}/status`, { status: 'returned' });
      if (response.data.success) {
        updateOrderStatus(order._id, 'returned');
        toast.success("Order returned successfully!");
        onHide();
      } else {
        toast.error('Failed to update order status.');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Error updating order status.');
    }
  };

  return (
    <>
      <Modal show={show} onHide={onHide} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Order Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {order && (
            <div>
              <Table bordered>
                <tbody>
                  <tr>
                    <td><strong>Order Number:</strong></td>
                    <td>{order.order_number}</td>
                  </tr>
                  <tr>
                    <td><strong>Date:</strong></td>
                    <td>{new Date(order.time).toISOString().split("T")[0]}</td>
                  </tr>
                  <tr>
                    <td><strong>Status:</strong></td>
                    <td>{order.status}</td>
                  </tr>
                  <tr>
                    <td><strong>Customer Name:</strong></td>
                    <td>{order.customerName}</td>
                  </tr>
                  <tr>
                    <td><strong>Phone:</strong></td>
                    <td>{order.phone}</td>
                  </tr>
                  <tr>
                    <td><strong>Address:</strong></td>
                    <td>{order.address}</td>
                  </tr>
                </tbody>
              </Table>
              <h5>Items:</h5>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Product Name</th>
                    <th>Variant</th>
                    <th>Warranty</th>
                    <th>Brand</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item, index) => (
                    <tr key={index}>
                      <td>{item.product_name_en} {item.product_name_ar}</td>
                      <td>{item.v_name_en ? item.v_name_en + " " + item.v_name_ar : "-"}</td>
                      <td>{item.v_warranty || item.warranty || "-"}</td>
                      <td>{item.brandName || "-"}</td>
                      <td>{item.quantity}</td>
                      <td>{item.price.toFixed(3)}</td>
                      <td>{(item.price * item.quantity).toFixed(3)}</td>
                    </tr>
                  ))}
                  <tr>
                    <td colSpan="4"></td>
                    <td colSpan="2"><strong>Subtotal:</strong></td>
                    <td colSpan="1">{order.items.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(3)}</td>
                  </tr>
                  <tr>
                    <td colSpan="4"></td>
                    <td colSpan="2"><strong>Delivery Fee:</strong></td>
                    <td colSpan="1">{parseFloat(order.deliveryFee).toFixed(3)}</td>
                  </tr>
                  <tr>
                    <td colSpan="4"></td>
                    <td colSpan="2"><strong>Grand Total:</strong></td>
                    <td colSpan="1">{(order.items.reduce((acc, item) => acc + item.price * item.quantity, 0) + parseFloat(order.deliveryFee)).toFixed(3)}</td>
                  </tr>
                </tbody>
              </Table>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Close
          </Button>
          <Button variant="primary" onClick={generatePDF}>
            {loading ? <Spinner as="span" animation="border" size="sm" /> : "Create PDF Invoice"}
          </Button>
          <Button 
            variant="success" 
            onClick={completeOrder} 
            className={order.status === 'completed' || order.status === 'returned' ? 'btn-disabled' : ''}
            disabled={order.status === 'completed' || order.status === 'returned'}
          >
            Complete Order
          </Button>
          <Button 
            variant="warning" 
            onClick={returnOrder} 
            className={order.status === 'completed' || order.status === 'returned' ? 'btn-disabled' : ''}
            disabled={order.status === 'completed' || order.status === 'returned'}
          >
            Return Order
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default OrderDetailsModal;