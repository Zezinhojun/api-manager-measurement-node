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
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// src/services/measure-service.ts
var measure_service_exports = {};
__export(measure_service_exports, {
  default: () => MeasureService
});
module.exports = __toCommonJS(measure_service_exports);

// src/models/http-response-model.ts
var HttpResponseBase = class {
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

// src/utils/http-responses/conflict-response.ts
var ConflictResponse = class extends HttpResponseBase {
  constructor(errorCode, errorDescription) {
    super(409, { error_code: errorCode, error_description: errorDescription });
  }
};

// src/utils/http-responses/ok-response.ts
var OkResponse = class extends HttpResponseBase {
  constructor(message, data) {
    super(200, { message, data });
  }
};

// src/utils/measure-utils.ts
var _MeasureUtils = class _MeasureUtils {
  static isBase64(str) {
    try {
      return btoa(atob(str)) === str;
    } catch (err) {
      return false;
    }
  }
  static validateMeasureData(measureData) {
    const { image, customer_code, measure_datetime, measure_type } = measureData;
    const isImageBase64 = _MeasureUtils.isBase64(image);
    if (!image || !isImageBase64) {
      return { isValid: false, error: { code: "INVALID_DATA", description: "Imagem em formato base64 inv\xE1lida." } };
    }
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
_MeasureUtils.validMeasureTypes = [
  "WATER" /* WATER */,
  "GAS" /* GAS */
];
var MeasureUtils = _MeasureUtils;

// src/services/measure-service.ts
var MeasureService = class {
  constructor(measureRepository, customerService) {
    this.measureRepository = measureRepository;
    this.customerService = customerService;
  }
  createMeasure(measureData) {
    return __async(this, null, function* () {
      const validation = MeasureUtils.validateMeasureData(measureData);
      if (!validation.isValid) {
        return new BadRequestResponse(validation.error.code, validation.error.description);
      }
      const measureDate = new Date(measureData.measure_datetime);
      if (isNaN(measureDate.getTime())) {
        return new BadRequestResponse("INVALID_DATA", "Data da medida inv\xE1lida.");
      }
      const customerResponse = yield this.customerService.getCustomerByCode(measureData.customer_code);
      if (customerResponse.statusCode === 404) {
        const createCustomerResponse = yield this.customerService.createCustomer({ customer_code: measureData.customer_code });
        if (createCustomerResponse.statusCode !== 200) {
          return new BadRequestResponse("INVALID_CUSTOMER", "N\xE3o foi poss\xEDvel criar o cliente.");
        }
      }
      const existingMeasures = yield this.measureRepository.findMeasuresByCustomerCode(measureData.customer_code);
      if (MeasureUtils.hasDuplicateMeasurementInCurrentMonth(existingMeasures, measureDate)) {
        return new ConflictResponse("DOUBLE_REPORT", "J\xE1 existe uma leitura para este tipo no m\xEAs atual");
      }
      const newMeasure = yield this.measureRepository.createMeasure({
        customer_code: measureData.customer_code,
        measure_datetime: measureDate,
        measure_type: measureData.measure_type,
        image_url: measureData.image,
        has_confirmed: false
      });
      const responseBody = {
        image_url: newMeasure.image_url,
        measure_uuid: newMeasure.id
      };
      return new OkResponse("Opera\xE7\xE3o realizada com sucesso", responseBody);
    });
  }
  getMeasure(measureId) {
    return __async(this, null, function* () {
      return this.measureRepository.findMeasureById(measureId);
    });
  }
  getMeasureByCustomer(customerCode, measureType) {
    return __async(this, null, function* () {
      return this.measureRepository.findMeasuresByCustomerCode(customerCode, measureType);
    });
  }
  updateMeasure(measureId, updates) {
    return __async(this, null, function* () {
      return this.measureRepository.updateMeasure(measureId, updates);
    });
  }
};
