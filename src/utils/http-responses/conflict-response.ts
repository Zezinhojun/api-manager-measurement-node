import { HttpResponse } from '../../models/http-response-model';

export class ConflictResponse extends HttpResponse {
    constructor(errorCode: string, errorDescription: string) {
        super(409, {
            error_code: errorCode,
            error_description: errorDescription,
        });
    }
}
