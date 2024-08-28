import { HttpResponseBase } from "../../models/http-response-model";

export class CreatedResponse extends HttpResponseBase {
    constructor() {
        super(201, { message: "successful" });
    }
}