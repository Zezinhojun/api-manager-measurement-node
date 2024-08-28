import Customer, { CustomerAttributes } from "../database/sequelize/models/customer-model";

export default class CustomerRepository {
    async findCustomerByCode(customerCode: string): Promise<CustomerAttributes | null> {
        return Customer.findOne({ where: { customer_code: customerCode } })
    }

    async findAllCustomers(): Promise<CustomerAttributes[]> {
        return Customer.findAll()
    }

    async createCustomer(customerData: { customer_code: string }): Promise<CustomerAttributes> {
        return await Customer.create(customerData)
    }
}