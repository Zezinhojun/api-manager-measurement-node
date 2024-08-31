import { HttpResponse } from '../../models/http-response-model';

export class CreatedResponse extends HttpResponse {
    constructor() {
        super(201, { message: 'successful' });
    }
}
