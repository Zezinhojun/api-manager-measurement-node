// const { GoogleGenerativeAI } = require("@google/generative-ai");


// // Access your API key as an environment variable (see "Set up your API key" above)
// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// async function run() {
//     const prompt = "Write a story about an AI and magic"

//     const result = await model.generateContent(prompt);
//     const response = await result.response;
//     const text = response.text();
//     console.log(text);
// }

// run();

import { createApp } from "./app";
import sequelize from "./database/sequelize/sequelize-instance";

const PORT = process.env.PORT ?? 3000;
const app = createApp();

async function initialize() {
    console.log('Attempting to connect to the database...');

    try {

        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
        await sequelize.sync({ force: true });
        console.log('Database synced successfully.');
        app.listen(PORT, () => {
            console.log(`Server running on ${PORT}`);
        });
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        process.exit(1);
    }
}

initialize();
