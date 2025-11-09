import jsPDF from 'jspdf';

export function generateToyotaInvoice(journeyData) {
  const { selectedModel, customization, financing } = journeyData;
  
  const modelName = selectedModel?.name || 'RAV4';
  const colorName = customization?.color?.name || 'Midnight Black';
  const basePrice = selectedModel?.price || 0;
  const packagePrice = customization?.package?.price || 0;
  const totalPrice = customization?.totalPrice || basePrice;
  const monthlyPayment = financing?.monthlyPayment || 0;
  const downPayment = financing?.downPayment || 0;
  const loanTerm = financing?.loanTerm || 60;
  const interestRate = financing?.interestRate || 4.9;
  
  // Create PDF
  const doc = new jsPDF();
  
  // Set font
  doc.setFont('helvetica', 'bold');
  
  // Header
  doc.setFontSize(24);
  doc.setTextColor(220, 38, 38); // Red color
  doc.text('TOYOTA', 105, 20, { align: 'center' });
  
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text('Vehicle Purchase Invoice', 105, 30, { align: 'center' });
  
  // Date
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 40);
  doc.text(`Invoice #: TOY-${Date.now().toString().slice(-6)}`, 20, 45);
  
  // Line
  doc.setDrawColor(220, 38, 38);
  doc.setLineWidth(0.5);
  doc.line(20, 50, 190, 50);
  
  // Vehicle Information
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'bold');
  doc.text('Vehicle Information', 20, 60);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.text(`Model: ${modelName}`, 25, 70);
  doc.text(`Exterior Color: ${colorName}`, 25, 75);
  if (customization?.wheelSize) {
    doc.text(`Wheel Size: ${customization.wheelSize}"`, 25, 80);
  }
  
  // Pricing Breakdown
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('Pricing Breakdown', 20, 95);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  let yPos = 105;
  doc.text(`Base Price:`, 25, yPos);
  doc.text(`$${basePrice.toLocaleString()}`, 170, yPos, { align: 'right' });
  
  if (packagePrice > 0) {
    yPos += 5;
    doc.text(`${customization?.package?.name || 'Package'}:`, 25, yPos);
    doc.text(`+$${packagePrice.toLocaleString()}`, 170, yPos, { align: 'right' });
  }
  
  yPos += 10;
  doc.setDrawColor(200, 200, 200);
  doc.line(25, yPos, 185, yPos);
  
  yPos += 8;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text(`Total Price:`, 25, yPos);
  doc.text(`$${totalPrice.toLocaleString()}`, 170, yPos, { align: 'right' });
  
  // Financing Information
  if (financing && monthlyPayment > 0) {
    yPos += 15;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('Financing Information', 20, yPos);
    
    yPos += 10;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.text(`Down Payment: $${downPayment.toLocaleString()}`, 25, yPos);
    yPos += 5;
    doc.text(`Loan Term: ${loanTerm} months`, 25, yPos);
    yPos += 5;
    doc.text(`APR Rate: ${interestRate}%`, 25, yPos);
    yPos += 5;
    doc.setFont('helvetica', 'bold');
    doc.text(`Monthly Payment: $${monthlyPayment}`, 25, yPos);
  }
  
  // Footer
  yPos = 280;
  doc.setDrawColor(220, 38, 38);
  doc.line(20, yPos, 190, yPos);
  
  yPos += 10;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.text('Thank you for choosing Toyota!', 105, yPos, { align: 'center' });
  yPos += 5;
  doc.text('This is a preliminary invoice. Final pricing may vary.', 105, yPos, { align: 'center' });
  yPos += 5;
  doc.text('Please contact your local Toyota dealer for final pricing and availability.', 105, yPos, { align: 'center' });
  
  // Save PDF
  doc.save(`Toyota-${modelName}-Invoice-${Date.now()}.pdf`);
}

