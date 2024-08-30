import { CustomerService } from '../../src/services/customer-service';
import { MockCustomerRepository } from './mockCustomer-repository';

export default class MockCustomerService extends CustomerService {
    constructor(customerRepository: MockCustomerRepository) {
        super(customerRepository);
    }
    getCustomerByCode = jest.fn()
    createCustomer = jest.fn()

}