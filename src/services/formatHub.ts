import { epub } from './formats/epub';

type payload = {
    title: string;
    imgContent: string;
    chapters: Array<string>;
}

export async function convertToEpub({title,imgContent,chapters}: payload) {
    console.log(imgContent)
    try {
        await epub(title,imgContent,chapters);
        console.log("EPUB created successfully");
    } catch (err) {
        console.error("Error generating EPUB: ", err);
    }
}