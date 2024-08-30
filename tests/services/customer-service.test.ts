import { CustomerService } from "../../src/services/customer-service";
import { NotFoundResponse } from "../../src/utils/http-responses/not-found-response";
import { OkResponse } from "../../src/utils/http-responses/ok-response";
import { MockCustomerRepository } from "../mocks/mockCustomer-repository";

describe('CustomerService, service', () => {
    let mockCustomerRepository: MockCustomerRepository
    let customerService: CustomerService;
    const customerCode = 'C123'
    const mockCustomerCode = { customer_code: customerCode }

    beforeEach(() => {
        mockCustomerRepository = new MockCustomerRepository();
        customerService = new CustomerService(mockCustomerRepository)
    })

    it('should return an OkResponse when trying to create a customer that already exists', async () => {
        jest.spyOn(mockCustomerRepository, 'findCustomerByCode').mockResolvedValue(mockCustomerCode);
        const result = await customerService.createCustomer(mockCustomerCode);

        expect(result).toEqual(new OkResponse("Customer already there", mockCustomerCode));
        expect(mockCustomerRepository.findCustomerByCode).toHaveBeenCalledWith(customerCode);
        expect(mockCustomerRepository.createCustomer).not.toHaveBeenCalled();
    });

    it('should return an OkResponse when a customer is created successfully', async () => {
        jest.spyOn(mockCustomerRepository, 'findCustomerByCode').mockResolvedValue(null);
        jest.spyOn(mockCustomerRepository, 'createCustomer').mockResolvedValue(mockCustomerCode);
        const result = await customerService.createCustomer(mockCustomerCode);

        expect(result).toEqual(new OkResponse("Customer created", mockCustomerCode));
        expect(mockCustomerRepository.findCustomerByCode).toHaveBeenCalledWith(customerCode);
        expect(mockCustomerRepository.createCustomer).toHaveBeenCalledWith(mockCustomerCode);
    });

    it('should return a NotFoundResponse when a customer is not found by code', async () => {
        jest.spyOn(mockCustomerRepository, 'findCustomerByCode').mockResolvedValue(null);
        const result = await customerService.getCustomerByCode('non-existing-code');

        expect(result).toEqual(new NotFoundResponse('CUSTOMER_NOT_FOUND', 'Cliente não encontrado'));
        expect(mockCustomerRepository.findCustomerByCode).toHaveBeenCalledWith('non-existing-code');
    });

    it('should handle errors from repository when finding a customer by code', async () => {
        jest.spyOn(mockCustomerRepository, 'findCustomerByCode').mockRejectedValue(new Error('Database error'));
        await expect(customerService.getCustomerByCode(customerCode)).rejects.toThrow('Database error');
    });

    it('should handle errors from repository when creating a customer', async () => {
        jest.spyOn(mockCustomerRepository, 'findCustomerByCode').mockResolvedValue(null);
        jest.spyOn(mockCustomerRepository, 'createCustomer').mockRejectedValue(new Error('Database error'));
        await expect(customerService.createCustomer(mockCustomerCode)).rejects.toThrow('Database error');
    });
})