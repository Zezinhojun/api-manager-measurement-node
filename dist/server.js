"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
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

// src/app.ts
var import_express2 = __toESM(require("express"));

// src/routes.ts
var import_express = require("express");

// src/controllers/measure-controller.ts
var MeasureController = class {
  constructor(measureService2) {
    this.measureService = measureService2;
  }
  async createMeasure(req, res) {
    const measureData = req.body;
    const httpResponse = await this.measureService.createMeasure(measureData);
    res.status(httpResponse.statusCode).json(httpResponse.body);
  }
  async updateMeasure(req, res) {
    const { measure_uuid, confirmed_value } = req.body;
    const httpResponse = await this.measureService.updateMeasure(measure_uuid, confirmed_value);
    res.status(httpResponse.statusCode).json(httpResponse.body);
  }
  async getMeasuresByCustomer(req, res) {
    const { customer_code } = req.params;
    const measure_type = req.query.measure_type;
    const httpResponse = await this.measureService.getMeasuresByCustomer(customer_code, measure_type);
    res.status(httpResponse.statusCode).json(httpResponse.body);
  }
};

// src/middlewares/validate-customer-measures-query.ts
var import_express_validator = require("express-validator");

// src/models/http-response-model.ts
var HttpResponse = class {
  statusCode;
  body;
  constructor(statusCode, body3) {
    this.statusCode = statusCode;
    this.body = body3;
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

// src/middlewares/validate-customer-measures-query.ts
var validateCustomerMeasuresQuery = () => {
  return [
    (0, import_express_validator.param)("customer_code").notEmpty().withMessage("C\xF3digo do cliente n\xE3o fornecido."),
    (0, import_express_validator.query)("measure_type").optional().custom((value) => {
      if (value) {
        const measureType = value.toUpperCase();
        if (!Object.values(MeasureType).includes(measureType)) {
          throw new Error("Tipo de medi\xE7\xE3o n\xE3o permitida.");
        }
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

// src/middlewares/validate-measure-confirmation.ts
var import_express_validator2 = require("express-validator");
var validateMeasureConfirmation = () => {
  return [
    (0, import_express_validator2.body)("measure_uuid").notEmpty().withMessage("UUID da medida n\xE3o fornecido."),
    (0, import_express_validator2.body)("confirmed_value").notEmpty().withMessage("Valor confirmado n\xE3o fornecido.").bail().custom((value) => {
      if (typeof value !== "number" || !Number.isInteger(value) || value < 0) {
        throw new Error("O valor confirmado deve ser um n\xFAmero inteiro positivo.");
      }
      return true;
    }),
    (req, res, next) => {
      const errors = (0, import_express_validator2.validationResult)(req);
      if (!errors.isEmpty()) {
        const error = errors.array()[0];
        const httpResponse = new BadRequestResponse("INVALID_DATA", error.msg);
        return res.status(httpResponse.statusCode).json(httpResponse.body);
      }
      next();
    }
  ];
};

// src/middlewares/validate-measure-creation.ts
var import_express_validator3 = require("express-validator");
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
    (0, import_express_validator3.body)("customer_code").notEmpty().withMessage("C\xF3digo do cliente n\xE3o fornecido.").isString().withMessage("C\xF3digo do cliente deve ser uma string."),
    (0, import_express_validator3.body)("measure_datetime").notEmpty().withMessage("Data da medida n\xE3o fornecida.").isISO8601().withMessage("Data da medida inv\xE1lida."),
    (0, import_express_validator3.body)("measure_type").notEmpty().withMessage("Tipo de medida n\xE3o fornecido.").isIn(Object.values(MeasureType)).withMessage("Tipo de medida inv\xE1lido."),
    (0, import_express_validator3.body)("image").notEmpty().withMessage("Imagem n\xE3o fornecida.").custom(async (value) => {
      const isValid = await isValidBase64Image(value);
      if (!isValid) {
        throw new Error("Imagem Base64 inv\xE1lida.");
      }
      return true;
    }),
    (req, res, next) => {
      const errors = (0, import_express_validator3.validationResult)(req);
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

// src/database/sequelize/models/customer-model.ts
var import_sequelize2 = require("sequelize");

// src/database/sequelize/sequelize-instance.ts
var import_sequelize = require("sequelize");
var sequelize = new import_sequelize.Sequelize({
  dialect: "postgres",
  host: "postgres",
  // localhost if out container, postgres in container
  port: 5432,
  database: "mydatabase",
  username: "myuser",
  password: "mypassword",
  logging: false
});
var sequelize_instance_default = sequelize;

// src/database/sequelize/models/customer-model.ts
var Customer = class extends import_sequelize2.Model {
  get id() {
    return this.getDataValue("id");
  }
  get customer_code() {
    return this.getDataValue("customer_code");
  }
};
Customer.init({
  id: {
    type: import_sequelize2.DataTypes.INTEGER,
    autoIncrement: true
  },
  customer_code: {
    type: import_sequelize2.DataTypes.STRING,
    allowNull: false,
    unique: true,
    primaryKey: true
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
  async findCustomerByCode(customerCode) {
    return customer_model_default.findOne({ where: { customer_code: customerCode } });
  }
  async createCustomer(customerData) {
    return await customer_model_default.create(customerData);
  }
};

// src/database/sequelize/models/measure-model.ts
var import_sequelize3 = require("sequelize");
var Measure = class extends import_sequelize3.Model {
  get id() {
    return this.getDataValue("id");
  }
  get measure_datetime() {
    return this.getDataValue("measure_datetime");
  }
  get measure_type() {
    return this.getDataValue("measure_type");
  }
  get image_url() {
    return this.getDataValue("image_url");
  }
  get customer_code() {
    return this.getDataValue("customer_code");
  }
  get has_confirmed() {
    return this.getDataValue("has_confirmed");
  }
};
Measure.init({
  id: {
    type: import_sequelize3.DataTypes.STRING,
    defaultValue: import_sequelize3.DataTypes.UUIDV4,
    primaryKey: true,
    validate: {
      isUUID: 4
    }
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
  timestamps: false,
  createdAt: false,
  updatedAt: false
});
Measure.belongsTo(customer_model_default, { foreignKey: "customer_code" });
customer_model_default.hasMany(Measure, { foreignKey: "customer_code" });
var measure_model_default = Measure;

// src/repositories/measure-repository.ts
var MeasureRepository = class {
  async createMeasure(measureData) {
    return await measure_model_default.create(measureData);
  }
  async findMeasureById(measureId) {
    return await measure_model_default.findOne({ where: { id: measureId } });
  }
  async findAllMeasures(customer_code, measure_type) {
    const query2 = {};
    if (customer_code) {
      query2.where = { ...query2.where, customer_code };
    }
    if (measure_type) {
      query2.where = { ...query2.where, measure_type: measure_type.toUpperCase() };
    }
    return measure_model_default.findAll(query2);
  }
  async findMeasuresByCustomerCode(customerCode, measureType) {
    const where = {
      customer_code: customerCode,
      ...measureType ? { measure_type: measureType.toUpperCase() } : {}
    };
    return measure_model_default.findAll({ where });
  }
  async updateMeasure(measureId, updates) {
    const measure = await measure_model_default.findOne({ where: { id: measureId } });
    if (!measure) {
      console.log("Throwing error for measureId:", measureId);
      throw new Error(`Measure with ID ${measureId} not found`);
    }
    return measure.update(updates);
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

// src/services/customer-service.ts
var CustomerService = class {
  constructor(customerRepository2) {
    this.customerRepository = customerRepository2;
  }
  async getCustomerByCode(customerCode) {
    const customer = await this.customerRepository.findCustomerByCode(customerCode);
    if (customer) {
      return new OkResponse("Cliente encontrado", customer);
    } else {
      return new NotFoundResponse("CUSTOMER_NOT_FOUND", "Cliente n\xE3o encontrado");
    }
  }
  async createCustomer(customerData) {
    const existingCustomer = await this.customerRepository.findCustomerByCode(customerData.customer_code);
    if (existingCustomer) {
      return new OkResponse("Customer already there", existingCustomer);
    }
    const customer = await this.customerRepository.createCustomer(customerData);
    return new OkResponse("Customer created", customer);
  }
};

// src/utils/http-responses/conflict-response.ts
var ConflictResponse = class extends HttpResponse {
  constructor(errorCode, errorDescription) {
    super(409, { error_code: errorCode, error_description: errorDescription });
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
  constructor(measureRepository2, customerService) {
    this.measureRepository = measureRepository2;
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

// src/routes.ts
var customerRepository = new CustomerRepository();
var customService = new CustomerService(customerRepository);
var measureRepository = new MeasureRepository();
var measureService = new MeasureService(measureRepository, customService);
var measureController = new MeasureController(measureService);
var router = (0, import_express.Router)();
router.post("/upload", validateMeasureCreation(), (req, res) => measureController.createMeasure(req, res));
router.patch("/confirm", validateMeasureConfirmation(), (req, res) => measureController.updateMeasure(req, res));
router.get("/:customer_code/list", validateCustomerMeasuresQuery(), (req, res) => measureController.getMeasuresByCustomer(req, res));

// src/app.ts
var createApp = () => {
  const app2 = (0, import_express2.default)();
  app2.use((0, import_express2.json)());
  app2.use("/files", import_express2.default.static("images"));
  app2.use("/", router);
  return app2;
};

// src/server.ts
var PORT = process.env.PORT ?? 3e3;
var app = createApp();
async function initialize() {
  console.log("Attempting to connect to the database...");
  try {
    await sequelize_instance_default.authenticate();
    console.log("Connection has been established successfully.");
    await sequelize_instance_default.sync({ force: true });
    console.log("Database synced successfully.");
    app.listen(PORT, () => {
      console.log(`Server running on ${PORT}`);
    });
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    process.exit(1);
  }
}
initialize();
