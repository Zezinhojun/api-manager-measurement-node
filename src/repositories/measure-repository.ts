import Measure from '../database/sequelize/models/measure-model';
import { IMeasure } from '../models/measure-model';

export default class MeasureRepository {
    async createMeasure(measureData: Omit<IMeasure, 'id'>): Promise<Measure> {
        return await Measure.create(measureData);
    }

    async findMeasureById(measureId: string): Promise<Measure | null> {
        return await Measure.findOne({ where: { id: measureId } });
    }

    async findAllMeasures(
        customer_code?: string,
        measure_type?: string
    ): Promise<Measure[]> {
        const query: { where?: { [key: string]: string } } = {};

        if (customer_code) {
            query.where = { ...query.where, customer_code };
        }

        if (measure_type) {
            query.where = {
                ...query.where,
                measure_type: measure_type.toUpperCase(),
            };
        }

        return Measure.findAll(query);
    }

    async findMeasuresByCustomerCode(
        customerCode: string,
        measureType?: string
    ): Promise<Measure[]> {
        const where: { customer_code: string; measure_type?: string } = {
            customer_code: customerCode,
            ...(measureType ? { measure_type: measureType.toUpperCase() } : {}),
        };
        return Measure.findAll({ where });
    }

    async markMeasureAsConfirmed(
        measureId: string,
        updates: Partial<IMeasure>
    ): Promise<Measure> {
        const measure = await Measure.findOne({ where: { id: measureId } });
        if (!measure) {
            throw new Error(`Measure with ID ${measureId} not found`);
        }
        return measure.update(updates);
    }
}
