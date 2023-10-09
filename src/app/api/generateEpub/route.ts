import { createEpubBuffer } from '@/services/formats/epub';

export async function POST(request: Request) {
  try {
    const res = await request.json()
    const { title, coverImage, chapters } = res;

    const epubBuffer = await createEpubBuffer(title, coverImage, chapters);

    const epubBase64 = epubBuffer.toString('base64');
    return new Response(JSON.stringify({ epubBase64 }), {
        headers: {
            "Content-Type": "application/json"
        }
    });
  } catch (error) {
    console.error('Error in POST handler:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
