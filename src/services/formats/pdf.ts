// pdfService.ts
import { PDFDocument, rgb } from 'pdf-lib';

export async function createPdfBuffer(title: string, chapters: string[]): Promise<Buffer> {
  const pdfDoc = await PDFDocument.create();

  // Add a title page
  const titlePage = pdfDoc.addPage([600, 400]);
  const { width, height } = titlePage.getSize();
  titlePage.drawText(title, {
    x: 50,
    y: height - 200,
    size: 30,
    color: rgb(0, 0, 0),
  });

  // Add chapters to the PDF
  for (const chapter of chapters) {
    const page = pdfDoc.addPage();
    page.drawText(chapter, {
      x: 50,
      y: height - 100, // Adjust as needed
      size: 15,
      color: rgb(0, 0, 0),
    });
  }

  // Serialize the PDF to a Uint8Array
  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}
