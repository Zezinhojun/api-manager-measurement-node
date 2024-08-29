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

// src/middlewares/validate-get-measures-by-customer.ts
var validate_get_measures_by_customer_exports = {};
__export(validate_get_measures_by_customer_exports, {
  validateGetMeasuresByCustomer: () => validateGetMeasuresByCustomer
});
module.exports = __toCommonJS(validate_get_measures_by_customer_exports);
var import_express_validator = require("express-validator");

// src/utils/measure-types.ts
var MeasureType = /* @__PURE__ */ ((MeasureType2) => {
  MeasureType2["WATER"] = "WATER";
  MeasureType2["GAS"] = "GAS";
  return MeasureType2;
})(MeasureType || {});

// src/models/http-response-model.ts
var HttpResponseBase = class {
  statusCode;
  body;
  constructor(statusCode, body) {
    this.statusCode = statusCode;
    this.body = body;
  }
};

// src/utils/http-responses/bad-request-response.ts
var BadRequestResponse = class extends HttpResponseBase {
  constructor(errorCode, errorDescription) {
    super(400, { error_code: errorCode, error_description: errorDescription });
  }
};

// src/middlewares/validate-get-measures-by-customer.ts
var validateGetMeasuresByCustomer = () => {
  return [
    // Valida o código do cliente
    (0, import_express_validator.param)("customer_code").notEmpty().withMessage("C\xF3digo do cliente n\xE3o fornecido.").isString().withMessage("C\xF3digo do cliente deve ser uma string."),
    // Valida o parâmetro query measure_type
    (0, import_express_validator.query)("measure_type").optional().custom((value) => {
      if (value) {
        if (typeof value !== "string") {
          throw new Error("Tipo de medi\xE7\xE3o deve ser uma string.");
        }
        const measureType = value.toUpperCase();
        if (!Object.values(MeasureType).includes(measureType)) {
          throw new Error("Tipo de medi\xE7\xE3o n\xE3o permitido.");
        }
      }
      return true;
    }),
    // Middleware para processar os erros de validação
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
  validateGetMeasuresByCustomer
});
