
export abstract class HttpResponseBase {
    statusCode: number;
    body: any;

    constructor(statusCode: number, body: any) {
        this.statusCode = statusCode;
        this.body = body
    }
}