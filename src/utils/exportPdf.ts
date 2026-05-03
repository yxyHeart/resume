import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export async function exportResumeToPdf(name: string) {
  const element = document.getElementById('resume-preview');
  if (!element) return;

  const filename = `${name || '简历'}-简历.pdf`;
  const prevMinHeight = element.style.minHeight;

  element.style.minHeight = '0';

  try {
    const canvas = await html2canvas(element, { scale: 2, useCORS: true });
    const imgWidth = 210; // A4 width in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    const pdf = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });
    pdf.addImage(canvas.toDataURL('image/jpeg', 1), 'JPEG', 0, 0, imgWidth, imgHeight);
    pdf.save(filename);
  } finally {
    element.style.minHeight = prevMinHeight;
  }
}
