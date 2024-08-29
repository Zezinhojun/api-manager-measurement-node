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

// src/utils/http-responses/conflict-response.ts
var conflict_response_exports = {};
__export(conflict_response_exports, {
  ConflictResponse: () => ConflictResponse
});
module.exports = __toCommonJS(conflict_response_exports);

// src/models/http-response-model.ts
var HttpResponseBase = class {
  statusCode;
  body;
  constructor(statusCode, body) {
    this.statusCode = statusCode;
    this.body = body;
  }
};

// src/utils/http-responses/conflict-response.ts
var ConflictResponse = class extends HttpResponseBase {
  constructor(errorCode, errorDescription) {
    super(409, { error_code: errorCode, error_description: errorDescription });
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ConflictResponse
});
