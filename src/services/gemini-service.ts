import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';

const generativeAIClient = new GoogleGenerativeAI(
    process.env.GEMINI_API_KEY ?? ''
);
const imageStorageDirectory = path.join('/app/images');

function createGenerativeAIInput(base64: string, mimeType: string) {
    return {
        inlineData: {
            data: base64,
            mimeType,
        },
    };
}
function stripBase64Prefix(base64Image: string) {
    if (base64Image.startsWith('data:image/')) return base64Image.split(',')[1];

    return base64Image;
}

export async function processImage(base64: string) {
    try {
        const model = generativeAIClient.getGenerativeModel({
            model: 'gemini-1.5-flash',
        });
        const prompt =
            'retornar o valor da conta no seguinte formato: integer ou number,';
        const base64WithoutPrefix = stripBase64Prefix(base64);
        const imageParts = [
            createGenerativeAIInput(base64WithoutPrefix, 'image/jpeg'),
        ];
        const result = await model.generateContent([prompt, ...imageParts]);
        const response = result.response;
        const text = response.text();
        const imageFilename = 'image_' + Date.now() + '.jpg';
        const imageUrl = await saveImage(base64WithoutPrefix, imageFilename);

        return { text, imageUrl };
    } catch (error) {
        throw new Error('Failed to run generative AI model');
    }
}

async function saveImage(
    base64Image: string,
    imageFilename: string
): Promise<string> {
    const imageBuffer = Buffer.from(base64Image, 'base64');
    const imagePath = path.join(imageStorageDirectory, imageFilename);
    await fs.promises.mkdir(path.dirname(imagePath), { recursive: true });
    await fs.promises.writeFile(imagePath, imageBuffer);

    return `http://localhost:3000/files/${imageFilename}`;
}
