import { HttpResponseBase } from "../../models/http-response-model";

export class OkResponse extends HttpResponseBase {
    constructor(message: string, data: any) {
        super(200, { message, data });
    }
}