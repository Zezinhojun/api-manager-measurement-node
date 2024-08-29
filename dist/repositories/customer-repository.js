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

// src/repositories/customer-repository.ts
var customer_repository_exports = {};
__export(customer_repository_exports, {
  default: () => CustomerRepository
});
module.exports = __toCommonJS(customer_repository_exports);

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
