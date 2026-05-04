import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const generateInvoicePDF = (order) => {
  const doc = new jsPDF();
  const brandColor = '#E2FF31';
  const darkColor = '#1A1A1A';

  // Header
  doc.setFillColor(darkColor);
  doc.rect(0, 0, 210, 40, 'F');
  
  doc.setTextColor(brandColor);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('NOTO BATTERY', 15, 25);
  
  doc.setTextColor('#FFFFFF');
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('INVOICE / PURCHASE RECEIPT', 150, 25);

  // Order Info
  doc.setTextColor(darkColor);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(`Order: #${order._id.slice(-8).toUpperCase()}`, 15, 55);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(`Date: ${new Date(order.createdAt).toLocaleString()}`, 15, 62);
  doc.text(`Status: ${order.orderStatus}`, 15, 69);
  doc.text(`Payment: ${order.paymentMethod}`, 15, 76);

  // Billing Details
  doc.setFont('helvetica', 'bold');
  doc.text('BILL TO:', 120, 55);
  doc.setFont('helvetica', 'normal');
  doc.text(order.address?.name || 'Customer', 120, 62);
  doc.text(order.address?.phone || '', 120, 69);
  const splitAddress = doc.splitTextToSize(`${order.address?.detail}, ${order.address?.city} - ${order.address?.pincode}`, 70);
  doc.text(splitAddress, 120, 76);

  // Table
  const tableData = order.products.map(p => [
    p.title,
    p.quantity,
    `INR ${p.price.toLocaleString()}`,
    `INR ${(p.price * p.quantity).toLocaleString()}`
  ]);

  autoTable(doc, {
    startY: 100,
    head: [['Item Description', 'Qty', 'Unit Price', 'Subtotal']],
    body: tableData,
    headStyles: { fillColor: darkColor, textColor: brandColor, fontStyle: 'bold' },
    columnStyles: {
      3: { textColor: '#000000', fontStyle: 'bold' } // Make total stand out, but black for contrast on white rows or...
    },
    didParseCell: (data) => {
      if (data.section === 'body' && data.column.index === 3) {
        data.cell.styles.textColor = '#22c55e'; // Green for money
        data.cell.styles.fontStyle = 'bold';
      }
    },
    alternateRowStyles: { fillColor: '#F9F9F9' },
    margin: { left: 15, right: 15 },
    theme: 'grid'
  });

  // Totals
  const finalY = doc.lastAutoTable.finalY + 10;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor('#22c55e'); // Green for final total
  doc.text(`GRAND TOTAL: INR ${order.totalAmount.toLocaleString()}`, 130, finalY + 10);

  // Footer
  doc.setFontSize(8);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor('#999999');
  doc.text('Thank you for choosing NOTO BATTERY. For support, contact Info@notobattery.com', 105, 280, { align: 'center' });

  doc.save(`Invoice_${order._id.slice(-6).toUpperCase()}.pdf`);
};

export const generateOrderSummaryPDF = (orders) => {
  const doc = new jsPDF('l', 'mm', 'a4'); // Landscape for more columns
  const brandColor = '#E2FF31';
  const darkColor = '#1A1A1A';

  // Header
  doc.setFillColor(darkColor);
  doc.rect(0, 0, 297, 40, 'F');
  
  doc.setTextColor(brandColor);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('NOTO BATTERY - ORDER MASTER DIRECTORY', 15, 25);
  
  doc.setTextColor('#FFFFFF');
  doc.setFontSize(10);
  doc.text(`Generated on: ${new Date().toLocaleString()}`, 230, 25);

  const tableData = orders.map(o => [
    o.orderId?.toString().slice(-8).toUpperCase() || 'N/A',
    o.customerName,
    o.phone || 'N/A',
    doc.splitTextToSize(o.address || 'N/A', 40),
    doc.splitTextToSize(o.products || 'N/A', 50),
    `INR ${o.totalAmount?.toLocaleString()}`,
    o.status,
    new Date(o.date).toLocaleDateString()
  ]);

  autoTable(doc, {
    startY: 50,
    head: [['Order ID', 'Customer', 'Phone', 'Address', 'Products', 'Total', 'Status', 'Date']],
    body: tableData,
    headStyles: { fillColor: darkColor, textColor: brandColor, fontStyle: 'bold' },
    styles: { fontSize: 8 },
    didParseCell: (data) => {
      if (data.section === 'body' && data.column.index === 5) {
        data.cell.styles.textColor = '#22c55e'; // Green for total amount
        data.cell.styles.fontStyle = 'bold';
      }
    },
    alternateRowStyles: { fillColor: '#F9F9F9' },
    theme: 'grid'
  });

  doc.save(`Order_Master_Directory_${new Date().toLocaleDateString().replace(/\//g, '-')}.pdf`);
};

export const generateStockReportPDF = (stockData, range) => {
  const doc = new jsPDF('p', 'mm', 'a4');
  const brandColor = '#E2FF31';
  const darkColor = '#1A1A1A';

  // Header
  doc.setFillColor(darkColor);
  doc.rect(0, 0, 210, 40, 'F');
  
  doc.setTextColor(brandColor);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('NOTO BATTERY - STOCK LOGISTICS', 15, 25);
  
  doc.setTextColor('#FFFFFF');
  doc.setFontSize(10);
  doc.text(`Range: ${range.toUpperCase()} | Generated: ${new Date().toLocaleDateString()}`, 110, 25);

  const tableData = stockData.map(item => [
    item.title,
    item.unitsAdded,
    item.unitsSold,
    item.currentStock
  ]);

  autoTable(doc, {
    startY: 50,
    head: [['Product Model', 'Units Added', 'Units Sold', 'Available Stock']],
    body: tableData,
    headStyles: { fillColor: darkColor, textColor: brandColor, fontStyle: 'bold' },
    didParseCell: (data) => {
      if (data.section === 'body' && data.column.index === 3) {
        data.cell.styles.textColor = '#22c55e'; // Green for stock level
        data.cell.styles.fontStyle = 'bold';
      }
    },
    alternateRowStyles: { fillColor: '#F9F9F9' },
    theme: 'grid'
  });

  doc.save(`Stock_Report_${range}_${new Date().toLocaleDateString().replace(/\//g, '-')}.pdf`);
};
