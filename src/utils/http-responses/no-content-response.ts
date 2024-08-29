import { HttpResponseBase } from '../../models/http-response-model';

export class NoContentResponse extends HttpResponseBase {
    constructor() {
        super(204, null);
    }
}