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

// src/controllers/customer-controller.ts
var customer_controller_exports = {};
__export(customer_controller_exports, {
  default: () => CustomerController
});
module.exports = __toCommonJS(customer_controller_exports);
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
