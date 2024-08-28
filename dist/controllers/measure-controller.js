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

// src/controllers/measure-controller.ts
var measure_controller_exports = {};
__export(measure_controller_exports, {
  MeasureController: () => MeasureController
});
module.exports = __toCommonJS(measure_controller_exports);
var MeasureController = class {
  constructor(measureService) {
    this.measureService = measureService;
  }
  async createMeasure(req, res) {
    const measureData = req.body;
    const httpResponse = await this.measureService.createMeasure(measureData);
    res.status(httpResponse.statusCode).json(httpResponse.body);
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  MeasureController
});
