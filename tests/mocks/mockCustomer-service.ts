import { CustomerService } from '../../src/services/customer-service';

export default class MockCustomerService extends CustomerService {
    getCustomerByCode = jest.fn()
    createCustomer = jest.fn()

}