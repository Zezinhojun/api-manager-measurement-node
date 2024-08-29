import { HttpResponse } from '../models/http-response-model';
import CustomerRepository from '../repositories/customer-repository';
import { NotFoundResponse } from '../utils/http-responses/not-found-response';
import { OkResponse } from '../utils/http-responses/ok-response';


export class CustomerService {
    constructor(readonly customerRepository: CustomerRepository) { }

    async getCustomerByCode(customerCode: string): Promise<HttpResponse> {
        const customer = await this.customerRepository.findCustomerByCode(customerCode);
        if (customer) {
            return new OkResponse('Cliente encontrado', customer);
        } else {
            return new NotFoundResponse('CUSTOMER_NOT_FOUND', 'Cliente não encontrado');
        }
    }

    async createCustomer(customerData: { customer_code: string }): Promise<HttpResponse> {
        const existingCustomer = await this.customerRepository.findCustomerByCode(customerData.customer_code)
        if (existingCustomer) {
            return new OkResponse("Customer already there", existingCustomer)
        }
        const customer = await this.customerRepository.createCustomer(customerData);
        return new OkResponse("Customer created", customer)
    }
}