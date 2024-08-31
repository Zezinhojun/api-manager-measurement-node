import { HttpResponse } from '../../models/http-response-model';

export class BadRequestResponse extends HttpResponse {
    constructor(errorCode: string, errorDescription: string) {
        super(400, {
            error_code: errorCode,
            error_description: errorDescription,
        });
    }
}
