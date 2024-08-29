import Customer from '../database/sequelize/models/customer-model';
import { ICustomer } from '../models/customer-model';

export default class CustomerRepository {
    async findCustomerByCode(customerCode: string): Promise<ICustomer | null> {
        return Customer.findOne({ where: { customer_code: customerCode } })
    }

    async createCustomer(customerData: { customer_code: string }): Promise<ICustomer> {
        return await Customer.create(customerData)
    }
}