import { DataTypes, Model, Optional } from 'sequelize';

import { IMeasure } from '../../../models/measure-model';
import { MeasureType } from '../../../utils/measure-types';
import sequelize from '../sequelize-instance';
import Customer from './customer-model';

interface MeasureCreationAttributes extends Optional<IMeasure, 'id'> { }

class Measure extends Model<IMeasure, MeasureCreationAttributes> implements IMeasure {
    public get id(): string {
        return this.getDataValue('id');
    }
    public get measure_datetime(): Date {
        return this.getDataValue('measure_datetime');
    }
    public get measure_type(): MeasureType {
        return this.getDataValue('measure_type');
    }
    public get image_url(): string {
        return this.getDataValue('image_url');
    }
    public get customer_code(): string {
        return this.getDataValue('customer_code');
    }
    public get has_confirmed(): boolean {
        return this.getDataValue('has_confirmed');
    }
}

Measure.init({
    id: {
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        validate: {
            isUUID: 4,
        },
    },
    measure_datetime: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    measure_type: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    image_url: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    customer_code: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: 'customers',
            key: 'customer_code',
        },
    },
    has_confirmed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
}, {
    sequelize,
    modelName: 'Measure',
    tableName: 'measures',
    timestamps: false,
    createdAt: false,
    updatedAt: false,
});

Measure.belongsTo(Customer, { foreignKey: 'customer_code' });
Customer.hasMany(Measure, { foreignKey: 'customer_code' });

export default Measure;
