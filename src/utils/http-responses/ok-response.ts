import { HttpResponse } from '../../models/http-response-model';

export class OkResponse extends HttpResponse {
    constructor(message: string, data: any) {
        super(200, { message, data });
    }
}
