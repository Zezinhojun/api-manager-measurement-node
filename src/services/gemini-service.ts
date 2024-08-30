import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';

const genAi = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? '')
const imageStoragePath = path.join('/app/images');

function fileToGenerativePart(base64: string, mimeType: string) {
    return {
        inlineData: {
            data: base64,
            mimeType,
        },
    };
}
function removeDataPrefix(base64Image: string) {
    if (base64Image.startsWith('data:image/')) {
        return base64Image.split(',')[1];
    }
    return base64Image;
}

export async function run(base64: string) {
    try {
        const model = genAi.getGenerativeModel({ model: "gemini-1.5-flash" });
        const prompt = "retornar o valor da conta no seguinte formato: integer ou number,";
        const base64WithoutPrefix = removeDataPrefix(base64);
        const imageParts = [fileToGenerativePart(base64WithoutPrefix, "image/jpeg")];

        const result = await model.generateContent([prompt, ...imageParts]);
        const response = result.response;
        const text = await response.text();

        const imageFilename = 'image_' + Date.now() + '.jpg';
        const imageUrl = await saveImage(base64WithoutPrefix, imageFilename);

        return { text, imageUrl };
    } catch (error) {
        console.error('Error running generative AI model:', error);
        throw new Error('Failed to run generative AI model');
    }
}

async function saveImage(base64Image: string, imageFilename: string): Promise<string> {
    const imageBuffer = Buffer.from(base64Image, 'base64');
    const imagePath = path.join(imageStoragePath, imageFilename);

    fs.mkdir(path.dirname(imagePath), { recursive: true }, (err) => {
        if (err) return console.error('Error creating directory:', err);
        fs.writeFile(imagePath, imageBuffer, (err) => {
            if (err) return console.error('Error saving image:', err);
        });
    });
    return `http://localhost:3000/files/${imageFilename}`;
}