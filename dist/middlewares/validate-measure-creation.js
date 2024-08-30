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

// src/middlewares/validate-measure-creation.ts
var validate_measure_creation_exports = {};
__export(validate_measure_creation_exports, {
  validateMeasureCreation: () => validateMeasureCreation
});
module.exports = __toCommonJS(validate_measure_creation_exports);
var import_express_validator = require("express-validator");

// src/models/http-response-model.ts
var HttpResponse = class {
  statusCode;
  body;
  constructor(statusCode, body2) {
    this.statusCode = statusCode;
    this.body = body2;
  }
};

// src/utils/http-responses/bad-request-response.ts
var BadRequestResponse = class extends HttpResponse {
  constructor(errorCode, errorDescription) {
    super(400, { error_code: errorCode, error_description: errorDescription });
  }
};

// src/utils/measure-types.ts
var MeasureType = /* @__PURE__ */ ((MeasureType2) => {
  MeasureType2["WATER"] = "WATER";
  MeasureType2["GAS"] = "GAS";
  return MeasureType2;
})(MeasureType || {});

// src/middlewares/validate-measure-creation.ts
var import_jimp = __toESM(require("jimp"));
var removeBase64Prefix = (base64String) => {
  return base64String.replace(/^data:image\/[a-z]+;base64,/, "");
};
var isValidBase64Image = async (base64String) => {
  try {
    const imageBuffer = Buffer.from(removeBase64Prefix(base64String), "base64");
    const image = await import_jimp.default.read(imageBuffer);
    return image != null;
  } catch (error) {
    console.error("Imagem inv\xE1lida:", error);
    return false;
  }
};
var validateMeasureCreation = () => {
  return [
    (0, import_express_validator.body)("customer_code").notEmpty().withMessage("C\xF3digo do cliente n\xE3o fornecido.").isString().withMessage("C\xF3digo do cliente deve ser uma string."),
    (0, import_express_validator.body)("measure_datetime").notEmpty().withMessage("Data da medida n\xE3o fornecida.").isISO8601().withMessage("Data da medida inv\xE1lida."),
    (0, import_express_validator.body)("measure_type").notEmpty().withMessage("Tipo de medida n\xE3o fornecido.").isIn(Object.values(MeasureType)).withMessage("Tipo de medida inv\xE1lido."),
    (0, import_express_validator.body)("image").notEmpty().withMessage("Imagem n\xE3o fornecida.").custom(async (value) => {
      const isValid = await isValidBase64Image(value);
      if (!isValid) {
        throw new Error("Imagem Base64 inv\xE1lida.");
      }
      return true;
    }),
    (req, res, next) => {
      const errors = (0, import_express_validator.validationResult)(req);
      if (!errors.isEmpty()) {
        console.error("Validation errors:", errors.array());
        const error = errors.array()[0];
        const httpResponse = new BadRequestResponse("INVALID_DATA", error.msg);
        return res.status(httpResponse.statusCode).json(httpResponse.body);
      }
      next();
    }
  ];
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  validateMeasureCreation
});
