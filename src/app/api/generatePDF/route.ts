// Assuming you have a similar structure and naming convention
import { createPdfBuffer } from '@/services/formats/pdf';

export async function POST(request: Request) {
  try {
    const { title, chapters } = await request.json();

    const pdfBuffer = await createPdfBuffer(title, chapters);

    const pdfBase64 = pdfBuffer.toString('base64');
    return new Response(JSON.stringify({ pdfBase64 }), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error('Error in POSTPDF handler:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
