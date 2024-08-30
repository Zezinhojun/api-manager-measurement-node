import Customer from '../../src/database/sequelize/models/customer-model';
import { ICustomer } from '../../src/models/customer-model';
import CustomerRepository from '../../src/repositories/customer-repository';

jest.mock('../../src/database/sequelize/models/customer-model', () => ({
    findOne: jest.fn(),
    create: jest.fn()
}));

class MockCustomerRepository extends CustomerRepository {
    async findCustomerByCode(customerCode: string): Promise<ICustomer | null> {
        return Customer.findOne({ where: { customer_code: customerCode } });
    }

    async createCustomer(customerData: { customer_code: string }): Promise<ICustomer> {
        return Customer.create(customerData);
    }
}

export { MockCustomerRepository };
