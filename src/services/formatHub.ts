import { arrayOutputType } from 'zod';
import { epub } from './formats/epub';

type payload = {
    title: string;
    imgContent: ArrayBuffer;
    chapters: Array<string>;
}

export async function convertToEpub({title,imgContent,chapters}: payload) {
  console.log("epub");
}