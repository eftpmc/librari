import type { NextApiRequest, NextApiResponse } from 'next';
import { epub } from '@/services/formats/epub'; // Adjust this import path

export default async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const { title, coverImage, chapters } = req.body;
        const epubBuffer = await epub(title, coverImage, chapters);

        // Set headers and send response
        res.setHeader('Content-Type', 'application/epub+zip');
        res.setHeader('Content-Disposition', `attachment; filename=${title}.epub`);
        res.end(epubBuffer);
    } catch (error) {
        res.status(500).json({ error: "Failed to generate EPUB." });
    }
};
