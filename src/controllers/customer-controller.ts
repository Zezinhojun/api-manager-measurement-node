import { Request, Response } from "express";
import { CustomerService } from "../services/customer-service";

export default class CustomerController {
    constructor(readonly customerService: CustomerService) { }

    public static build(customerService: CustomerService): CustomerController {
        return new CustomerController(customerService);
    }
    async getCustomerByCode(req: Request, res: Response) {
        const { customerCode } = req.params
        const httpResponse = await this.customerService.getCustomerByCode(customerCode)
        res.status(httpResponse.statusCode).json(httpResponse.body);
    }

    async getCustomers(req: Request, res: Response) {
        const httpResponse = await this.customerService.getAllCustomers()
        res.status(httpResponse.statusCode).json(httpResponse.body);
    }
}