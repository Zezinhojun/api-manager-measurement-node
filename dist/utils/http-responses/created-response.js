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

// src/utils/http-responses/created-response.ts
var created_response_exports = {};
__export(created_response_exports, {
  CreatedResponse: () => CreatedResponse
});
module.exports = __toCommonJS(created_response_exports);

// src/models/http-response-model.ts
var HttpResponseBase = class {
  constructor(statusCode, body) {
    this.statusCode = statusCode;
    this.body = body;
  }
};

// src/utils/http-responses/created-response.ts
var CreatedResponse = class extends HttpResponseBase {
  constructor() {
    super(201, { message: "successful" });
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  CreatedResponse
});
