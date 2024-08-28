import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../sequelize-instance';
import Customer from './customer-model';
import { MeasureType } from '../../../utils/measure-types';

export interface MeasureAttributes {
    id: number;
    measure_datetime: Date;
    measure_type: MeasureType;
    image_url: string;
    customer_code: string;
    has_confirmed: boolean;
}

interface MeasureCreationAttributes extends Optional<MeasureAttributes, 'id'> { }

class Measure extends Model<MeasureAttributes, MeasureCreationAttributes> implements MeasureAttributes {
    public id!: number;
    public measure_datetime!: Date;
    public measure_type!: MeasureType;
    public image_url!: string;
    public customer_code!: string;
    public has_confirmed!: boolean;
}

Measure.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
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
});

Measure.belongsTo(Customer, { foreignKey: 'customer_code' });
Customer.hasMany(Measure, { foreignKey: 'customer_code' });



export default Measure;
