import html2pdf from 'html2pdf.js';

export function setupPdfDownload() {
  const button = document.getElementById('downloadPdfBtn');
  const element = document.getElementById('portfolioLayoutGrid');

  if (!button || !element) {
    console.error('Кнопка или элемент для PDF не найдены');
    return;
  }

  button.addEventListener('click', () => {
    const opt = {
      margin: 0,
      filename: 'portfolio.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 3, useCORS: true },
      jsPDF: { unit: 'em', format: [100, 160], orientation: 'portrait' },
    };

    html2pdf().set(opt).from(element).save();
  });
}
