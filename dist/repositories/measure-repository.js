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

// src/repositories/measure-repository.ts
var measure_repository_exports = {};
__export(measure_repository_exports, {
  default: () => MeasureRepository
});
module.exports = __toCommonJS(measure_repository_exports);

// src/database/sequelize/models/measure-model.ts
var import_sequelize3 = require("sequelize");

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
var import_sequelize2 = require("sequelize");
var Customer = class extends import_sequelize2.Model {
  id;
  customer_code;
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

// src/database/sequelize/models/measure-model.ts
var Measure = class extends import_sequelize3.Model {
  id;
  measure_datetime;
  measure_type;
  image_url;
  customer_code;
  has_confirmed;
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
  async createMeasure(measureData) {
    return measure_model_default.create(measureData);
  }
  async findMeasureById(measureId) {
    return measure_model_default.findOne({ where: { id: measureId } });
  }
  async findMeasuresByCustomerCode(customerCode, measureType) {
    return measure_model_default.findAll({
      where: {
        customer_code: customerCode,
        ...measureType ? { measure_type: measureType.toUpperCase() } : {}
      }
    });
  }
  async findMeasuresByType(measureType) {
    return measure_model_default.findAll({
      where: {
        measure_type: measureType
      }
    });
  }
  async updateMeasure(measureId, updates) {
    const measure = await measure_model_default.findOne({ where: { id: measureId } });
    if (measure) {
      return measure.update(updates);
    }
    throw new Error("Measure not found");
  }
};
