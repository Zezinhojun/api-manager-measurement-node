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

// src/database/sequelize/models/measure-model.ts
var measure_model_exports = {};
__export(measure_model_exports, {
  default: () => measure_model_default
});
module.exports = __toCommonJS(measure_model_exports);
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
