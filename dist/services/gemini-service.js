"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/services/gemini-service.ts
var gemini_service_exports = {};
__export(gemini_service_exports, {
  processImage: () => processImage
});
module.exports = __toCommonJS(gemini_service_exports);
var import_generative_ai = require("@google/generative-ai");
var import_fs = __toESM(require("fs"));
var import_path = __toESM(require("path"));
var generativeAIClient = new import_generative_ai.GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? "");
var imageStorageDirectory = import_path.default.join("/app/images");
function createGenerativeAIInput(base64, mimeType) {
  return {
    inlineData: {
      data: base64,
      mimeType
    }
  };
}
function stripBase64Prefix(base64Image) {
  if (base64Image.startsWith("data:image/")) {
    return base64Image.split(",")[1];
  }
  return base64Image;
}
async function processImage(base64) {
  try {
    const model = generativeAIClient.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = "retornar o valor da conta no seguinte formato: integer ou number,";
    const base64WithoutPrefix = stripBase64Prefix(base64);
    const imageParts = [createGenerativeAIInput(base64WithoutPrefix, "image/jpeg")];
    const result = await model.generateContent([prompt, ...imageParts]);
    const response = result.response;
    const text = response.text();
    const imageFilename = "image_" + Date.now() + ".jpg";
    const imageUrl = await saveImage(base64WithoutPrefix, imageFilename);
    return { text, imageUrl };
  } catch (error) {
    console.error("Error running generative AI model:", error);
    throw new Error("Failed to run generative AI model");
  }
}
async function saveImage(base64Image, imageFilename) {
  const imageBuffer = Buffer.from(base64Image, "base64");
  const imagePath = import_path.default.join(imageStorageDirectory, imageFilename);
  await import_fs.default.promises.mkdir(import_path.default.dirname(imagePath), { recursive: true });
  await import_fs.default.promises.writeFile(imagePath, imageBuffer);
  return `http://localhost:3000/files/${imageFilename}`;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  processImage
});
