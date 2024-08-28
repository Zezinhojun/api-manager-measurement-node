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
