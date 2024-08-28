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

export async function run(base64: string) {
    const model = genAi.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = "retornar o valor da conta no seguinte formato: “measure_value”:integer,"
    const imageParts = [fileToGenerativePart(base64, "image/jpeg")]

    const result = await model.generateContent([prompt, ...imageParts]);
    const response = result.response
    const text = response.text()

    const imageFilename = 'image_' + Date.now() + '.jpg';
    const imageUrl = await saveImage(base64, imageFilename);
    console.log(imageUrl)
    return { text, imageUrl };
}

async function saveImage(base64Image: string, imageFilename: string): Promise<string> {
    const imageBuffer = Buffer.from(base64Image, 'base64');
    const imagePath = path.join(imageStoragePath, imageFilename);

    fs.mkdir(path.dirname(imagePath), { recursive: true }, (err) => {
        if (err) {
            console.error('Error creating directory:', err);
            return;
        }

        fs.writeFile(imagePath, imageBuffer, (err) => {
            if (err) {
                console.error('Error saving image:', err);

            }

        });
    });
    return `http://localhost:3000/files/${imageFilename}`;
}