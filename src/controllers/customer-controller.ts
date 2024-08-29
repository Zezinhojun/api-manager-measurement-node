import { Request, Response } from 'express';

import { CustomerService } from '../services/customer-service';

export default class CustomerController {
    constructor(readonly customerService: CustomerService) { }

    async getCustomerByCode(req: Request, res: Response) {
        const { customerCode } = req.params
        const httpResponse = await this.customerService.getCustomerByCode(customerCode)
        res.status(httpResponse.statusCode).json(httpResponse.body);
    }

}