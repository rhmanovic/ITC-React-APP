import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { BASE_URL } from '../config'; // Import BASE_URL
import { toast } from 'react-toastify'; // Import toast for notifications
import amiriRegular from "../fonts/Amiri-Regular-normal.js"; // Adjust the path if necessary

const OrderDetailsModal = ({ show, onHide, order, updateOrderStatus }) => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const generatePDF = () => {
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
    const imgData = "img/banner.jpg";
    const InstagramQRLink = "img/Instagram-QR-Link.jpeg";
    const WhatsappQRLink = "img/Whatsapp-QR-Link.jpeg";
    const imgWidth = 30;
    const imgHeight = 30;
    const startX = 10;
    const startY = 30;

    doc.setFontSize(12);
    doc.addImage(imgData, "JPEG", startX + 150, startY, imgWidth, imgHeight); // Image aligned to the right
    doc.text(
      "اي تي ستور للتجارة العامة",
      startX + 150 + imgWidth / 2,
      startY + imgHeight + 5,
      null,
      null,
      "center",
    ); // Company name centered below image
    doc.text(
      "ITC for electricity",
      startX + 150 + imgWidth / 2,
      startY + imgHeight + 10,
      null,
      null,
      "center",
    ); // Company name centered below image

    doc.text(`رقم الطلب Order Number: ${order.order_number}`, startX, startY);
    doc.text(`تاريخ Date: ${formattedDate}`, startX, startY + 7);
    doc.text(`الحالة Status: ${order.status}`, startX, startY + 14);
    doc.text(
      `اسم العميل Customer Name: ${order.customerName}`,
      startX,
      startY + 21,
    );
    doc.text(`الهاتف Phone: ${order.phone}`, startX, startY + 28);
    doc.text(`العنوان Address: ${order.address}`, startX, startY + 35);

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
          "warranty الكفالة",
          "Brand الماركة",
          "Quantity الكمية",
          "Price السعر",
          "Total الاجمالي",
        ],
      ],
      body: [
        ...tableData,
        [
          {
            content: "Subtotal المجموع الفرعي",
            colSpan: 5,
            styles: { halign: "right" },
          },
          { content: subtotal.toFixed(3) },
        ],
        [
          {
            content: "Delivery Fee رسوم التوصيل",
            colSpan: 5,
            styles: { halign: "right" },
          },
          { content: deliveryFee.toFixed(3) },
        ],
        [
          {
            content: "Grand Total المجموع",
            colSpan: 5,
            styles: { halign: "right" },
          },
          { content: grandTotal.toFixed(3) },
        ],
      ],
      styles: { font: "Amiri", textColor: [0, 0, 0], lineColor: [0, 0, 0], fillColor: [255, 255, 255] },
      headStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], lineColor: [0, 0, 0], fontStyle: 'bold' },
      bodyStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], lineColor: [0, 0, 0] },
      footStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], lineColor: [0, 0, 0] },
    });

    // Get the Y-coordinate where the table ends
    const finalY = doc.autoTable.previous.finalY;

    // Add text below the table
    const rtlText = [
      "البضاعة ترد وتستبدل خلال 14 يوم",
      "الكفالة لا تشمل الكسر او سوء الاستخدام",
      "الاسلاك والانارة الشريطية المباعة بالامتار المقصوصة لا ترد ولا تستبدل",
      "أسواق القرين - شارع سوق السراح - كهرباء مول محل 2",
      "هاتف: 90903115",
      "شكراً لتعاملكم معنا!"
    ];

    rtlText.forEach((line, index) => {
      doc.text(line, 200, finalY + 10 + (index * 5), { align: 'right' });
    });

    // Add Instagram and WhatsApp QR codes with text below
    const qrStartY = finalY + 50;
    doc.addImage(InstagramQRLink, "JPEG", startX + 100, qrStartY, imgWidth, imgHeight);
    doc.text("@itcstorekw تابعنا انستجرام", startX+ 100 + imgWidth / 2, qrStartY + imgHeight + 5, null, null, "center");

    doc.addImage(WhatsappQRLink, "JPEG", startX + 50, qrStartY, imgWidth, imgHeight);
    doc.text("كلمنا واتساب", startX + 50 + imgWidth / 2, qrStartY + imgHeight + 5, null, null, "center");

    doc.save(`invoice_${order.order_number}.pdf`);
  };

  const handleConfirmAndPrint = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/api/orders/${order._id}/status`, { status: 'completed' });

      if (response.data.success) {
        updateOrderStatus(order._id, 'completed');
        onHide();
        toast.success("Order status updated and invoice generated!");
        generatePDF();
      } else {
        toast.error('Failed to update order status.');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Error updating order status.');
    }
  };

  const handlePrintClick = () => {
    if (order.status !== 'completed') {
      setShowConfirmModal(true);
    } else {
      generatePDF();
    }
  };

  return (
    <>
      <Modal show={show} onHide={onHide} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Order Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <h1>Welcome</h1>
            <h1 style={{ textAlign: "right" }}>مرحبا</h1>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Close
          </Button>
          <Button variant="primary" onClick={handlePrintClick}>
            Create PDF Invoice
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)} size="sm">
        <Modal.Header closeButton>
          <Modal.Title>Confirm Payment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Confirm payment received to print the invoice and mark the order as completed.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleConfirmAndPrint}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default OrderDetailsModal;
