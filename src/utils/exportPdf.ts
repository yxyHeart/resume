import html2pdf from 'html2pdf.js';

export function exportResumeToPdf(name: string) {
  const element = document.getElementById('resume-preview');
  if (!element) return;

  const filename = `${name || '简历'}-简历.pdf`;
  const prevMinHeight = element.style.minHeight;
  element.style.minHeight = 'auto';

  html2pdf()
    .set({
      margin: 0,
      filename,
      image: { type: 'jpeg', quality: 1 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    })
    .from(element)
    .save()
    .finally(() => {
      element.style.minHeight = prevMinHeight;
    });
}
