import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../sequelize-instance';

export interface CustomerAttributes {
    id: number;
    customer_code: string;
}

interface CustomerCreationAttributes extends Optional<CustomerAttributes, 'id'> { }

class Customer extends Model<CustomerAttributes, CustomerCreationAttributes> implements CustomerAttributes {
    public get id(): number {
        return this.getDataValue('id');
    }
    public get customer_code(): string {
        return this.getDataValue('customer_code');
    }
}

Customer.init({
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
}, {
    sequelize,
    modelName: 'Customer',
    tableName: 'customers',
    timestamps: false,
});

export default Customer;
