import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../sequelize-instance';

export interface CustomerAttributes {
    id: number;
    customer_code: string;
}

interface CustomerCreationAttributes extends Optional<CustomerAttributes, 'id'> { }

class Customer extends Model<CustomerAttributes, CustomerCreationAttributes> implements CustomerAttributes {
    public id!: number;
    public customer_code!: string;
}

Customer.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    customer_code: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
}, {
    sequelize,
    modelName: 'Customer',
    tableName: 'customers',
    timestamps: false,
});

export default Customer;
