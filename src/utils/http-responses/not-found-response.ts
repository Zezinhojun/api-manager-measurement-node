import { HttpResponse } from '../../models/http-response-model';

export class NotFoundResponse extends HttpResponse {
    constructor(errorCode: string, errorDescription: string) {
        super(404, { code: errorCode, description: errorDescription });
    }
}
