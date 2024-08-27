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
const PORT = process.env.PORT ?? 3000
const app = createApp()
app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
})