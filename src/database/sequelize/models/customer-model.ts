import { DataTypes, Model, Optional } from 'sequelize';

import { ICustomer } from '../../../models/customer-model';
import sequelize from '../sequelize-instance';

interface CustomerCreationAttributes extends Optional<ICustomer, 'id'> { }

class Customer
    extends Model<ICustomer, CustomerCreationAttributes>
    implements ICustomer {
    public get id(): number {
        return this.getDataValue('id');
    }
    public get customer_code(): string {
        return this.getDataValue('customer_code');
    }
}

Customer.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
        },
        customer_code: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            primaryKey: true,
        },
    },
    {
        sequelize,
        modelName: 'Customer',
        tableName: 'customers',
        timestamps: false,
    }
);

export default Customer;
