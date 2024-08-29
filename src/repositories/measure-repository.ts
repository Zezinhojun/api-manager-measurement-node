import Measure, { MeasureAttributes } from "../database/sequelize/models/measure-model";

export default class MeasureRepository {
    async createMeasure(measureData: Omit<MeasureAttributes, 'id'>) {
        const measure = await Measure.create(measureData);
        return measure;
    }

    async findMeasureById(measureId: string) {
        return Measure.findOne({ where: { id: measureId } });
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

    async updateMeasure(measureId: string, updates: Partial<MeasureAttributes>) {
        const measure = await Measure.findOne({ where: { id: measureId } })
        if (measure) {
            return measure.update(updates);
        }
        throw new Error('Measure not found');
    }


}

