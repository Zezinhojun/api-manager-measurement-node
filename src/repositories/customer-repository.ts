import Customer from '../database/sequelize/models/customer-model';
import { ICustomer } from '../models/customer-model';

interface ICreateCustomerData {
    customer_code: string;
}

export default class CustomerRepository {
    async findCustomerByCode(customerCode: string): Promise<ICustomer | null> {
        return Customer.findOne({ where: { customer_code: customerCode } });
    }

    async createCustomer(
        customerData: ICreateCustomerData
    ): Promise<ICustomer> {
        return await Customer.create(customerData);
    }
}
