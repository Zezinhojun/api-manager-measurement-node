import { HttpResponseBase } from '../models/http-response-model';
import CustomerRepository from '../repositories/customer-repository';
import { NotFoundResponse } from '../utils/http-responses/not-found-response';
import { OkResponse } from '../utils/http-responses/ok-response';

export class CustomerService {
    constructor(readonly customerRepository: CustomerRepository) { }

    async getCustomerByCode(customerCode: string): Promise<HttpResponseBase> {
        const customer = await this.customerRepository.findCustomerByCode(customerCode);
        if (customer) {
            return new OkResponse('Cliente encontrado', customer);
        } else {
            return new NotFoundResponse('CUSTOMER_NOT_FOUND', 'Cliente não encontrado');
        }
    }

    async getAllCustomers(): Promise<HttpResponseBase> {
        const customers = await this.customerRepository.findAllCustomers()
        return new OkResponse("Clientes encontrados", customers)
    }

    async createCustomer(customerData: { customer_code: string }): Promise<HttpResponseBase> {
        const existingCustomer = await this.customerRepository.findCustomerByCode(customerData.customer_code)
        if (existingCustomer) {
            return new OkResponse("Customer already there", existingCustomer)
        }
        const customer = await this.customerRepository.createCustomer(customerData);
        return new OkResponse("Customer created", customer)
    }
}