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

// src/utils/measure-utils.ts
var measure_utils_exports = {};
__export(measure_utils_exports, {
  MeasureUtils: () => MeasureUtils
});
module.exports = __toCommonJS(measure_utils_exports);
var MeasureUtils = class _MeasureUtils {
  static validMeasureTypes = [
    "WATER" /* WATER */,
    "GAS" /* GAS */
  ];
  static validateMeasureData(measureData) {
    const { image, customer_code, measure_datetime, measure_type } = measureData;
    ;
    if (!customer_code) {
      return { isValid: false, error: { code: "INVALID_DATA", description: "C\xF3digo do cliente n\xE3o fornecido." } };
    }
    if (!measure_datetime || isNaN(Date.parse(measure_datetime))) {
      return { isValid: false, error: { code: "INVALID_DATA", description: "Data da medida inv\xE1lida." } };
    }
    if (!measure_type || !_MeasureUtils.validMeasureTypes.includes(measure_type)) {
      return { isValid: false, error: { code: "INVALID_DATA", description: "Tipo de medida inv\xE1lido." } };
    }
    return { isValid: true };
  }
  static hasDuplicateMeasurementInCurrentMonth(measurements, targetDate) {
    const targetMonth = targetDate.getMonth() + 1;
    const targetYear = targetDate.getFullYear();
    return measurements.some((measurement) => {
      const measurementDate = new Date(measurement.measure_datetime);
      const measurementMonth = measurementDate.getMonth() + 1;
      const measurementYear = measurementDate.getFullYear();
      return measurementMonth === targetMonth && measurementYear === targetYear;
    });
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  MeasureUtils
});
