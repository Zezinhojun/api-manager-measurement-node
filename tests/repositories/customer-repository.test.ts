import Customer from '../../src/database/sequelize/models/customer-model';
import { ICustomer } from '../../src/models/customer-model';
import CustomerRepository from '../../src/repositories/customer-repository';

jest.mock('../../src/database/sequelize/models/customer-model', () => ({
    findOne: jest.fn(),
    create: jest.fn()
}));

describe('CustomerRepository, repository', () => {
    let customerRepository: CustomerRepository;
    const customerCode = 'C123';
    const mockCustomer: ICustomer = { customer_code: customerCode } as ICustomer;
    const customerData = { customer_code: customerCode };

    beforeEach(() => {
        customerRepository = new CustomerRepository();
    });

    it('should find a customer by code', async () => {
        (Customer.findOne as jest.Mock).mockResolvedValue(mockCustomer);

        const result = await customerRepository.findCustomerByCode(customerCode);

        expect(result).toEqual(mockCustomer);
        expect(Customer.findOne).toHaveBeenCalledTimes(1);
        expect(Customer.findOne).toHaveBeenCalledWith({ where: { customer_code: customerCode } });
    });


    it('should create a customer', async () => {
        (Customer.create as jest.Mock).mockResolvedValue(mockCustomer)

        const result = await customerRepository.createCustomer(customerData);

        expect(result).toEqual(mockCustomer);
        expect(Customer.create).toHaveBeenCalledTimes(1);
        expect(Customer.create).toHaveBeenCalledWith(mockCustomer);
    });

    it('should return null if customer not found', async () => {
        (Customer.findOne as jest.Mock).mockResolvedValue(null)

        const result = await customerRepository.findCustomerByCode('non-existing-code');

        expect(result).toBeNull();
        expect(Customer.findOne).toHaveBeenCalledTimes(1);
        expect(Customer.findOne).toHaveBeenCalledWith({ where: { customer_code: "non-existing-code" } });
    });
});
