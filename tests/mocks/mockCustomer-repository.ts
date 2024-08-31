import CustomerRepository from '../../src/repositories/customer-repository';

class MockCustomerRepository extends CustomerRepository {
    findCustomerByCode = jest.fn();
    createCustomer = jest.fn();
}

export { MockCustomerRepository };
