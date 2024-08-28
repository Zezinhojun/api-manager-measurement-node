import Measure, { MeasureAttributes } from "../database/sequelize/models/measure-model";

export default class MeasureRepository {
    async createMeasure(measureData: Omit<MeasureAttributes, 'id'>) {
        return Measure.create(measureData)
    }

    async findMeasureById(measureId: number) {
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

    async updateMeasure(measureId: number, updates: Partial<MeasureAttributes>) {
        const measure = await Measure.findOne({ where: { id: measureId } })
        if (measure) {
            return measure.update(updates);
        }
        throw new Error('Measure not found');
    }


}

