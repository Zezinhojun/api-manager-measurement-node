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

// src/services/measure-service.ts
var measure_service_exports = {};
__export(measure_service_exports, {
  default: () => MeasureService
});
module.exports = __toCommonJS(measure_service_exports);

// src/models/http-response-model.ts
var HttpResponse = class {
  statusCode;
  body;
  constructor(statusCode, body) {
    this.statusCode = statusCode;
    this.body = body;
  }
};

// src/utils/http-responses/bad-request-response.ts
var BadRequestResponse = class extends HttpResponse {
  constructor(errorCode, errorDescription) {
    super(400, { error_code: errorCode, error_description: errorDescription });
  }
};

// src/utils/http-responses/conflict-response.ts
var ConflictResponse = class extends HttpResponse {
  constructor(errorCode, errorDescription) {
    super(409, { error_code: errorCode, error_description: errorDescription });
  }
};

// src/utils/http-responses/not-found-response.ts
var NotFoundResponse = class extends HttpResponse {
  constructor(errorCode, errorDescription) {
    super(404, { code: errorCode, description: errorDescription });
  }
};

// src/utils/http-responses/ok-response.ts
var OkResponse = class extends HttpResponse {
  constructor(message, data) {
    super(200, { message, data });
  }
};

// src/utils/measure-utils.ts
var MeasureUtils = class {
  static hasDuplicateForDate(measurements, targetDate, targetType) {
    const monthOfTargetDate = targetDate.getMonth() + 1;
    const yearOfTargetDate = targetDate.getFullYear();
    return measurements.some((measurement) => {
      const dateOfMeasurement = new Date(measurement.measure_datetime);
      const monthOfMeasurementDate = dateOfMeasurement.getMonth() + 1;
      const yearOfMeasurementDate = dateOfMeasurement.getFullYear();
      return monthOfMeasurementDate === monthOfTargetDate && yearOfMeasurementDate === yearOfTargetDate && measurement.measure_type === targetType;
    });
  }
};

// src/services/gemini-service.ts
var import_generative_ai = require("@google/generative-ai");
var import_fs = __toESM(require("fs"));
var import_path = __toESM(require("path"));
var genAi = new import_generative_ai.GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? "");
var imageStoragePath = import_path.default.join("/app/images");
function fileToGenerativePart(base64, mimeType) {
  return {
    inlineData: {
      data: base64,
      mimeType
    }
  };
}
function removeDataPrefix(base64Image) {
  if (base64Image.startsWith("data:image/")) {
    return base64Image.split(",")[1];
  }
  return base64Image;
}
async function run(base64) {
  try {
    const model = genAi.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = "retornar o valor da conta no seguinte formato: integer ou number,";
    const base64WithoutPrefix = removeDataPrefix(base64);
    const imageParts = [fileToGenerativePart(base64WithoutPrefix, "image/jpeg")];
    const result = await model.generateContent([prompt, ...imageParts]);
    const response = result.response;
    const text = await response.text();
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
  const imagePath = import_path.default.join(imageStoragePath, imageFilename);
  import_fs.default.mkdir(import_path.default.dirname(imagePath), { recursive: true }, (err) => {
    if (err)
      return console.error("Error creating directory:", err);
    import_fs.default.writeFile(imagePath, imageBuffer, (err2) => {
      if (err2)
        return console.error("Error saving image:", err2);
    });
  });
  return `http://localhost:3000/files/${imageFilename}`;
}

// src/services/measure-service.ts
var MeasureService = class {
  constructor(measureRepository, customerService) {
    this.measureRepository = measureRepository;
    this.customerService = customerService;
  }
  async createMeasure(measureData) {
    const measureDate = new Date(measureData.measure_datetime);
    if (isNaN(measureDate.getTime())) {
      return new BadRequestResponse("INVALID_DATA", "Data da medida inv\xE1lida ali.");
    }
    const customerResponse = await this.customerService.getCustomerByCode(measureData.customer_code);
    if (customerResponse.statusCode === 404) {
      const createCustomerResponse = await this.customerService.createCustomer({ customer_code: measureData.customer_code });
      if (createCustomerResponse.statusCode !== 200) {
        return new BadRequestResponse("INVALID_CUSTOMER", "N\xE3o foi poss\xEDvel criar o cliente.");
      }
    }
    const existingMeasures = await this.measureRepository.findMeasuresByCustomerCode(measureData.customer_code);
    if (MeasureUtils.hasDuplicateForDate(existingMeasures, measureDate, measureData.measure_type)) {
      return new ConflictResponse("DOUBLE_REPORT", "J\xE1 existe uma leitura para este tipo no m\xEAs atual");
    }
    const result = await run(measureData.image);
    const newMeasure = await this.measureRepository.createMeasure({
      customer_code: measureData.customer_code,
      measure_datetime: measureDate,
      measure_type: measureData.measure_type,
      image_url: result.imageUrl,
      has_confirmed: false
    });
    const responseBody = {
      image_url: newMeasure.image_url,
      measure_value: parseInt(result.text),
      measure_uuid: newMeasure.id.toString()
    };
    return new OkResponse("Opera\xE7\xE3o realizada com sucesso", responseBody);
  }
  async getMeasure(measureId) {
    return this.measureRepository.findMeasureById(measureId);
  }
  async getMeasuresByCustomer(customerCode, measureType) {
    const customer = await this.customerService.getCustomerByCode(customerCode);
    if (!customer) {
      return new NotFoundResponse("MEASURE_NOT_FOUND", "Nenhuma leitura encontrada.");
    }
    const measures = await this.measureRepository.findAllMeasures(customerCode, measureType);
    if (!measures.length) {
      return new NotFoundResponse("MEASURES_NOT_FOUND", "Nenhuma leitura encontrada.");
    }
    const responseBody = {
      customer_code: customerCode,
      measures: measures.map((measure) => ({
        measure_uuid: measure.id,
        measure_datetime: measure.measure_datetime,
        measure_type: measure.measure_type,
        has_confirmed: measure.has_confirmed,
        image_url: measure.image_url
      }))
    };
    return new OkResponse("Opera\xE7\xE3o realizada com sucesso", responseBody);
  }
  async updateMeasure(measureUuid, confirmedValue) {
    const measure = await this.measureRepository.findMeasureById(measureUuid);
    if (!measure) {
      return new NotFoundResponse("MEASURE_NOT_FOUND", "Leitura n\xE3o encontrada.");
    }
    if (measure.has_confirmed) {
      return new ConflictResponse("CONFIRMATION_DUPLICATE", "Leitura do m\xEAs j\xE1 realizada.");
    }
    await this.measureRepository.updateMeasure(measure.id, { has_confirmed: true });
    return new OkResponse("Opera\xE7\xE3o realizada com sucesso.", { success: true });
  }
};
