import { HttpResponse } from '../../models/http-response-model';

export class NoContentResponse extends HttpResponse {
    constructor() {
        super(204, null);
    }
}
