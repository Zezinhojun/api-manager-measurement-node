"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
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

// src/app.ts
var app_exports = {};
__export(app_exports, {
  createApp: () => createApp
});
module.exports = __toCommonJS(app_exports);
var import_express2 = __toESM(require("express"));

// src/routes.ts
var import_express = require("express");

// src/models/http-response-model.ts
var HttpResponseBase = class {
  constructor(statusCode, body) {
    this.statusCode = statusCode;
    this.body = body;
  }
};

// src/utils/http-responses/not-found-response.ts
var NotFoundResponse = class extends HttpResponseBase {
  constructor(errorCode, errorDescription) {
    super(404, { code: errorCode, description: errorDescription });
  }
};

// src/utils/http-responses/ok-response.ts
var OkResponse = class extends HttpResponseBase {
  constructor(message, data) {
    super(200, { message, data });
  }
};

// src/services/customer-service.ts
var CustomerService = class {
  constructor(customerRepository2) {
    this.customerRepository = customerRepository2;
  }
  getCustomerByCode(customerCode) {
    return __async(this, null, function* () {
      const customer = yield this.customerRepository.findCustomerByCode(customerCode);
      if (customer) {
        return new OkResponse("Cliente encontrado", customer);
      } else {
        return new NotFoundResponse("CUSTOMER_NOT_FOUND", "Cliente n\xE3o encontrado");
      }
    });
  }
  getAllCustomers() {
    return __async(this, null, function* () {
      const customers = yield this.customerRepository.findAllCustomers();
      return new OkResponse("Clientes encontrados", customers);
    });
  }
  createCustomer(customerData) {
    return __async(this, null, function* () {
      const existingCustomer = yield this.customerRepository.findCustomerByCode(customerData.customer_code);
      if (existingCustomer) {
        return new OkResponse("Customer already there", existingCustomer);
      }
      const customer = yield this.customerRepository.createCustomer(customerData);
      return new OkResponse("Customer created", customer);
    });
  }
};

// src/database/sequelize/models/customer-model.ts
var import_sequelize2 = require("sequelize");

// src/database/sequelize/sequelize-instance.ts
var import_sequelize = require("sequelize");
var sequelize = new import_sequelize.Sequelize({
  dialect: "postgres",
  host: "postgres",
  port: 5432,
  database: "mydatabase",
  username: "myuser",
  password: "mypassword",
  logging: false
});
var sequelize_instance_default = sequelize;

// src/database/sequelize/models/customer-model.ts
var Customer = class extends import_sequelize2.Model {
};
Customer.init({
  id: {
    type: import_sequelize2.DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  customer_code: {
    type: import_sequelize2.DataTypes.STRING,
    allowNull: false,
    unique: true
  }
}, {
  sequelize: sequelize_instance_default,
  modelName: "Customer",
  tableName: "customers",
  timestamps: false
});
var customer_model_default = Customer;

// src/repositories/customer-repository.ts
var CustomerRepository = class {
  findCustomerByCode(customerCode) {
    return __async(this, null, function* () {
      return customer_model_default.findOne({ where: { customer_code: customerCode } });
    });
  }
  findAllCustomers() {
    return __async(this, null, function* () {
      return customer_model_default.findAll();
    });
  }
  createCustomer(customerData) {
    return __async(this, null, function* () {
      return yield customer_model_default.create(customerData);
    });
  }
};

// src/controllers/customer-controller.ts
var CustomerController = class _CustomerController {
  constructor(customerService) {
    this.customerService = customerService;
  }
  static build(customerService) {
    return new _CustomerController(customerService);
  }
  getCustomerByCode(req, res) {
    return __async(this, null, function* () {
      const { customerCode } = req.params;
      const httpResponse = yield this.customerService.getCustomerByCode(customerCode);
      res.status(httpResponse.statusCode).json(httpResponse.body);
    });
  }
  getCustomers(req, res) {
    return __async(this, null, function* () {
      const httpResponse = yield this.customerService.getAllCustomers();
      res.status(httpResponse.statusCode).json(httpResponse.body);
    });
  }
};

// src/database/sequelize/models/measure-model.ts
var import_sequelize3 = require("sequelize");
var Measure = class extends import_sequelize3.Model {
};
Measure.init({
  id: {
    type: import_sequelize3.DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  measure_datetime: {
    type: import_sequelize3.DataTypes.DATE,
    allowNull: false
  },
  measure_type: {
    type: import_sequelize3.DataTypes.STRING,
    allowNull: false
  },
  image_url: {
    type: import_sequelize3.DataTypes.STRING,
    allowNull: false
  },
  customer_code: {
    type: import_sequelize3.DataTypes.STRING,
    allowNull: false,
    references: {
      model: "customers",
      key: "customer_code"
    }
  },
  has_confirmed: {
    type: import_sequelize3.DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  sequelize: sequelize_instance_default,
  modelName: "Measure",
  tableName: "measures",
  timestamps: false
});
Measure.belongsTo(customer_model_default, { foreignKey: "customer_code" });
customer_model_default.hasMany(Measure, { foreignKey: "customer_code" });
var measure_model_default = Measure;

// src/repositories/measure-repository.ts
var MeasureRepository = class {
  createMeasure(measureData) {
    return __async(this, null, function* () {
      return measure_model_default.create(measureData);
    });
  }
  findMeasureById(measureId) {
    return __async(this, null, function* () {
      return measure_model_default.findOne({ where: { id: measureId } });
    });
  }
  findMeasuresByCustomerCode(customerCode, measureType) {
    return __async(this, null, function* () {
      return measure_model_default.findAll({
        where: __spreadValues({
          customer_code: customerCode
        }, measureType ? { measure_type: measureType.toUpperCase() } : {})
      });
    });
  }
  findMeasuresByType(measureType) {
    return __async(this, null, function* () {
      return measure_model_default.findAll({
        where: {
          measure_type: measureType
        }
      });
    });
  }
  updateMeasure(measureId, updates) {
    return __async(this, null, function* () {
      const measure = yield measure_model_default.findOne({ where: { id: measureId } });
      if (measure) {
        return measure.update(updates);
      }
      throw new Error("Measure not found");
    });
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
  constructor(measureRepository2, customerService) {
    this.measureRepository = measureRepository2;
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

// src/controllers/measure-controller.ts
var MeasureController = class {
  constructor(measureService2) {
    this.measureService = measureService2;
  }
  createMeasure(req, res) {
    return __async(this, null, function* () {
      const measureData = req.body;
      const httpResponse = yield this.measureService.createMeasure(measureData);
      res.status(httpResponse.statusCode).json(httpResponse.body);
    });
  }
};

// src/routes.ts
var customerRepository = new CustomerRepository();
var customService = new CustomerService(customerRepository);
var customerController = new CustomerController(customService);
var measureRepository = new MeasureRepository();
var measureService = new MeasureService(measureRepository, customService);
var measureController = new MeasureController(measureService);
var router = (0, import_express.Router)();
router.post("/upload", (req, res) => measureController.createMeasure(req, res));
router.get("/:customerCode/list", (req, res) => customerController.getCustomerByCode(req, res));

// src/app.ts
var createApp = () => {
  const app = (0, import_express2.default)();
  app.use((0, import_express2.json)());
  app.use("/", router);
  return app;
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createApp
});
