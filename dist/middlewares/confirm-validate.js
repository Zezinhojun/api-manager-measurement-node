"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/middlewares/confirm-validate.ts
var confirm_validate_exports = {};
__export(confirm_validate_exports, {
  validateConfirmMeasure: () => validateConfirmMeasure
});
module.exports = __toCommonJS(confirm_validate_exports);
var import_express_validator = require("express-validator");

// src/models/http-response-model.ts
var HttpResponseBase = class {
  statusCode;
  body;
  constructor(statusCode, body2) {
    this.statusCode = statusCode;
    this.body = body2;
  }
};

// src/utils/http-responses/bad-request-response.ts
var BadRequestResponse = class extends HttpResponseBase {
  constructor(errorCode, errorDescription) {
    super(400, { error_code: errorCode, error_description: errorDescription });
  }
};

// src/middlewares/confirm-validate.ts
var validateConfirmMeasure = () => {
  return [
    (0, import_express_validator.body)("measure_uuid").notEmpty().withMessage("UUID da medida n\xE3o fornecido."),
    (0, import_express_validator.body)("confirmed_value").notEmpty().withMessage("Valor confirmado n\xE3o fornecido.").bail().custom((value) => {
      if (typeof value !== "number" || !Number.isInteger(value) || value < 0) {
        throw new Error("O valor confirmado deve ser um n\xFAmero inteiro positivo.");
      }
      return true;
    }),
    (req, res, next) => {
      const errors = (0, import_express_validator.validationResult)(req);
      if (!errors.isEmpty()) {
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
  validateConfirmMeasure
});
