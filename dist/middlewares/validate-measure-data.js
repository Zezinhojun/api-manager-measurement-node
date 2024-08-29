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

// src/middlewares/validate-measure-data.ts
var validate_measure_data_exports = {};
__export(validate_measure_data_exports, {
  validateMeasureData: () => validateMeasureData
});
module.exports = __toCommonJS(validate_measure_data_exports);
var import_express_validator = require("express-validator");

// src/utils/measure-types.ts
var MeasureType = /* @__PURE__ */ ((MeasureType2) => {
  MeasureType2["WATER"] = "WATER";
  MeasureType2["GAS"] = "GAS";
  MeasureType2["ELECTRICITY"] = "ELECTRICITY";
  MeasureType2["PHONE"] = "PHONE";
  return MeasureType2;
})(MeasureType || {});

// src/middlewares/validate-measure-data.ts
function validateMeasureData() {
  return [
    (0, import_express_validator.body)("customer_code").notEmpty().withMessage("C\xF3digo do cliente n\xE3o fornecido."),
    (0, import_express_validator.body)("measure_datetime").notEmpty().withMessage("Data da medida n\xE3o fornecida.").isISO8601().withMessage("Data da medida inv\xE1lida."),
    (0, import_express_validator.body)("measure_type").notEmpty().withMessage("Tipo de medida n\xE3o fornecido.").isIn(Object.values(MeasureType)).withMessage("Tipo de medida inv\xE1lido."),
    (0, import_express_validator.body)("image").notEmpty().withMessage("Imagem n\xE3o fornecida."),
    (req, res, next) => {
      const errors = (0, import_express_validator.validationResult)(req);
      if (!errors.isEmpty()) {
        const error = errors.array()[0];
        return res.status(400).json({
          error_code: "INVALID_DATA",
          error_description: error.msg
        });
      }
      next();
    }
  ];
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  validateMeasureData
});
