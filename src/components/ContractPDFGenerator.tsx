import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface ContractData {
  responsibleName: string;
  cpfCnpj: string;
  address: string;
  email: string;
  phone: string;
  basePackagePrice: number;
  paymentOption: 'full' | 'split';
  totalPrice: number;
  firstPayment: number;
  secondPayment: number;
}

export const generateContractPDF = async (contractData: ContractData, logoUrl: string) => {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 15;
  const contentWidth = pageWidth - margin * 2;
  let yPosition = margin;

  // Colors from Pontal branding
  const primaryColor = [26, 43, 42]; // Deep Sea Charcoal
  const secondaryColor = [188, 108, 37]; // Burnt Sunset
  const accentColor = [168, 130, 115]; // Muted Sand
  const lightBg = [242, 238, 228]; // Fine Sand

  // Helper function to add text
  const addText = (text: string, x: number, y: number, options: any = {}) => {
    pdf.setTextColor(...(options.color || primaryColor));
    pdf.setFontSize(options.size || 11);
    pdf.setFont('helvetica', options.weight || 'normal');
    pdf.text(text, x, y, options);
    return y + (options.lineHeight || 5);
  };

  // Header with logo and branding
  try {
    const img = new Image();
    img.src = logoUrl;
    await new Promise((resolve) => {
      img.onload = () => {
        pdf.addImage(img, 'PNG', margin, yPosition, 30, 30);
        resolve(null);
      };
    });
  } catch (e) {
    console.log('Logo not available');
  }

  // Company name and info
  yPosition = margin + 35;
  pdf.setTextColor(...secondaryColor);
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.text('PONTAL CARAPITANGUI', pageWidth - margin, yPosition, { align: 'right' });

  yPosition += 8;
  pdf.setTextColor(...accentColor);
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Praia Bar & Açaiteria', pageWidth - margin, yPosition, { align: 'right' });

  // Divider line
  yPosition += 8;
  pdf.setDrawColor(...accentColor);
  pdf.line(margin, yPosition, pageWidth - margin, yPosition);

  // Title
  yPosition += 10;
  pdf.setTextColor(...primaryColor);
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('CONTRATO DE PRESTAÇÃO DE SERVIÇOS', margin, yPosition);

  yPosition += 8;
  pdf.setFontSize(12);
  pdf.text('Desenvolvimento de Software e Marketing Digital', margin, yPosition);

  // Contract details
  yPosition += 15;
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(...primaryColor);
  pdf.text('CONTRATADA:', margin, yPosition);

  yPosition += 6;
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(9);
  pdf.text('HUDSON LUIZ DOS SANTOS ARGOLLO (CLUBE MKT)', margin + 5, yPosition);
  yPosition += 4;
  pdf.text('CPF: 025.878.755-44', margin + 5, yPosition);
  yPosition += 4;
  pdf.text('Avenida Rio Branco, 225, Centro, Jequié/BA, CEP 45203-011', margin + 5, yPosition);

  // Contratante
  yPosition += 10;
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(10);
  pdf.setTextColor(...primaryColor);
  pdf.text('CONTRATANTE:', margin, yPosition);

  yPosition += 6;
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(9);
  pdf.text(contractData.responsibleName || '[Nome do Responsável]', margin + 5, yPosition);
  yPosition += 4;
  pdf.text(`CPF/CNPJ: ${contractData.cpfCnpj || '[CPF/CNPJ]'}`, margin + 5, yPosition);
  yPosition += 4;
  pdf.text(`Endereço: ${contractData.address || '[Endereço]'}`, margin + 5, yPosition);
  yPosition += 4;
  pdf.text(`Email: ${contractData.email || '[Email]'}`, margin + 5, yPosition);
  yPosition += 4;
  pdf.text(`Telefone: ${contractData.phone || '[Telefone]'}`, margin + 5, yPosition);

  // Cláusula 1
  yPosition += 12;
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(10);
  pdf.setTextColor(...primaryColor);
  pdf.text('CLÁUSULA 1ª - DO OBJETO', margin, yPosition);

  yPosition += 6;
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(9);
  const clause1Text = pdf.splitTextToSize(
    'O presente contrato tem como objeto o desenvolvimento, licenciamento de uso e configuração de soluções digitais para a CONTRATANTE, contemplando o seguinte escopo principal (Pacote Base):',
    contentWidth
  );
  yPosition = pdf.text(clause1Text, margin, yPosition).lastAutoTable.finalY || yPosition + 10;

  yPosition += 3;
  const services = [
    '• Website Corporativo: Desenvolvimento do site institucional',
    '• Cardápio Digital: Menu digital interativo com acesso facilitado',
    '• Estratégia de Google Ads: Planejamento de campanhas de anúncios',
  ];

  services.forEach((service) => {
    pdf.setFontSize(8);
    yPosition = pdf.text(service, margin + 5, yPosition).lastAutoTable.finalY || yPosition + 4;
  });

  // Cláusula 3 - Valores
  yPosition += 12;
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(10);
  pdf.setTextColor(...primaryColor);
  pdf.text('CLÁUSULA 2ª - DOS VALORES E FORMAS DE PAGAMENTO', margin, yPosition);

  yPosition += 8;
  pdf.setFillColor(...lightBg);
  pdf.rect(margin, yPosition - 4, contentWidth, 35, 'F');
  pdf.setDrawColor(...accentColor);
  pdf.rect(margin, yPosition - 4, contentWidth, 35);

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(9);
  pdf.setTextColor(...primaryColor);
  pdf.text('Resumo de Valores:', margin + 5, yPosition);

  yPosition += 5;
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(8);
  pdf.text(`Pacote Base: R$ ${contractData.basePackagePrice.toFixed(2)}`, margin + 5, yPosition);

  yPosition += 5;
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(...secondaryColor);
  pdf.text(`VALOR TOTAL: R$ ${contractData.totalPrice.toFixed(2)}`, margin + 5, yPosition);

  yPosition += 8;
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(9);
  pdf.setTextColor(...primaryColor);
  if (contractData.paymentOption === 'full') {
    pdf.text('Pagamento à Vista com 15% de Desconto', margin + 5, yPosition);
    yPosition += 4;
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8);
    pdf.text(`Valor: R$ ${contractData.totalPrice.toFixed(2)}`, margin + 5, yPosition);
  } else {
    pdf.text('Pagamento Parcelado 50/50', margin + 5, yPosition);
    yPosition += 4;
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8);
    pdf.text(`1ª Parcela (Assinatura): R$ ${contractData.firstPayment.toFixed(2)}`, margin + 5, yPosition);
    yPosition += 4;
    pdf.text(`2ª Parcela (Entrega): R$ ${contractData.secondPayment.toFixed(2)}`, margin + 5, yPosition);
  }

  yPosition += 6;
  pdf.setFontSize(8);
  pdf.setTextColor(...accentColor);
  pdf.text('PIX (E-mail): hudsonargollo@gmail.com', margin + 5, yPosition);

  // Cláusula 4
  yPosition += 10;
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(10);
  pdf.setTextColor(...primaryColor);
  pdf.text('CLÁUSULA 3ª - DA ENTREGA, REVISÃO E APROVAÇÃO', margin, yPosition);

  yPosition += 6;
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(9);
  const clause4 = pdf.splitTextToSize(
    'A CONTRATADA compromete-se a entregar a versão inicial dos projetos no prazo de 2 (dois) a 5 (cinco) dias úteis, contados a partir da assinatura deste contrato e da confirmação do pagamento.',
    contentWidth
  );
  yPosition = pdf.text(clause4, margin, yPosition).lastAutoTable.finalY || yPosition + 10;

  // Cláusula 5
  yPosition += 8;
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(10);
  pdf.setTextColor(...primaryColor);
  pdf.text('CLÁUSULA 4ª - DO SUPORTE TÉCNICO', margin, yPosition);

  yPosition += 6;
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(9);
  const clause5 = pdf.splitTextToSize(
    'A CONTRATADA garante o suporte técnico gratuito para a correção de eventuais falhas (bugs) ou mau funcionamento dos sistemas durante a vigência deste contrato.',
    contentWidth
  );
  yPosition = pdf.text(clause5, margin, yPosition).lastAutoTable.finalY || yPosition + 10;

  // Cláusula 6
  yPosition += 8;
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(10);
  pdf.setTextColor(...primaryColor);
  pdf.text('CLÁUSULA 5ª - DA VIGÊNCIA', margin, yPosition);

  yPosition += 6;
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(9);
  pdf.text('O presente contrato tem prazo de vigência de 1 (um) ano, contado a partir da data de sua assinatura.', margin, yPosition);

  // Cláusula 7
  yPosition += 10;
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(10);
  pdf.setTextColor(...primaryColor);
  pdf.text('CLÁUSULA 6ª - DO FORO', margin, yPosition);

  yPosition += 6;
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(9);
  const clause7 = pdf.splitTextToSize(
    'Para dirimir quaisquer controvérsias oriundas deste contrato, as partes elegem o foro da comarca de Maraú, Estado da Bahia.',
    contentWidth
  );
  pdf.text(clause7, margin, yPosition);

  // Footer
  const footerY = pageHeight - 20;
  pdf.setDrawColor(...accentColor);
  pdf.line(margin, footerY, pageWidth - margin, footerY);

  pdf.setFontSize(8);
  pdf.setTextColor(...accentColor);
  pdf.text(`Data: ${new Date().toLocaleDateString('pt-BR')}`, margin, footerY + 5);
  pdf.text('Maraú - BA', pageWidth - margin, footerY + 5, { align: 'right' });

  pdf.setFontSize(7);
  pdf.setTextColor(...accentColor);
  pdf.text('PONTAL CARAPITANGUI - Praia Bar & Açaiteria', pageWidth / 2, pageHeight - 5, { align: 'center' });

  return pdf;
};
