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

// src/services/customer-service.ts
var customer_service_exports = {};
__export(customer_service_exports, {
  CustomerService: () => CustomerService
});
module.exports = __toCommonJS(customer_service_exports);

// src/models/http-response-model.ts
var HttpResponse = class {
  statusCode;
  body;
  constructor(statusCode, body) {
    this.statusCode = statusCode;
    this.body = body;
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
  constructor(customerRepository) {
    this.customerRepository = customerRepository;
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  CustomerService
});
