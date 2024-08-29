import Measure from '../database/sequelize/models/measure-model';
import { IMeasure } from '../models/measure-model';

export default class MeasureRepository {
    async createMeasure(measureData: Omit<IMeasure, 'id'>) {
        const measure = await Measure.create(measureData);
        return measure;
    }

    async findMeasureById(measureId: string) {
        return Measure.findOne({ where: { id: measureId } });
    }

    async findAllMeasures(customer_code?: string, measure_type?: string) {
        const query: any = {};

        if (customer_code) {
            query.where = { ...query.where, customer_code };
        }

        if (measure_type) {
            query.where = { ...query.where, measure_type: measure_type.toUpperCase() };
        }

        return Measure.findAll(query);
    }

    async findMeasuresByCustomerCode(customerCode: string, measureType?: string) {
        return Measure.findAll({
            where: {
                customer_code: customerCode,
                ...(measureType ? { measure_type: measureType.toUpperCase() } : {}),
            }
        })
    }

    async findMeasuresByType(measureType: string): Promise<Measure[]> {
        return Measure.findAll({
            where: {
                measure_type: measureType
            }
        });
    }

    async updateMeasure(measureId: string, updates: Partial<IMeasure>) {
        const measure = await Measure.findOne({ where: { id: measureId } })
        if (measure) {
            return measure.update(updates);
        }
        throw new Error('Measure not found');
    }


}

