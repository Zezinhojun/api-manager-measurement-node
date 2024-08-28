import { HttpResponseBase } from "../../models/http-response-model";

export class NotFoundResponse extends HttpResponseBase {
    constructor(errorCode: string, errorDescription: string) {
        super(404, { code: errorCode, description: errorDescription });
    }
}