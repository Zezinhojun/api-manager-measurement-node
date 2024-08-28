import { MeasureAttributes } from '../database/sequelize/models/measure-model';
import { MeasureType } from './measure-types';


export class MeasureUtils {
    private static validMeasureTypes: MeasureType[] = [
        MeasureType.WATER,
        MeasureType.GAS
    ];


    public static validateMeasureData(measureData: {
        image: string;
        customer_code: string;
        measure_datetime: string;
        measure_type: MeasureType;
    }): { isValid: boolean; error?: { code: string; description: string } } {
        const { image, customer_code, measure_datetime, measure_type } = measureData;

        ;

        if (!customer_code) {
            return { isValid: false, error: { code: "INVALID_DATA", description: "Código do cliente não fornecido." } };
        }
        if (!measure_datetime || isNaN(Date.parse(measure_datetime))) {
            return { isValid: false, error: { code: "INVALID_DATA", description: "Data da medida inválida." } };
        }
        if (!measure_type || !MeasureUtils.validMeasureTypes.includes(measure_type)) {
            return { isValid: false, error: { code: "INVALID_DATA", description: "Tipo de medida inválido." } };
        }

        return { isValid: true };
    }

    public static hasDuplicateMeasurementInCurrentMonth(measurements: MeasureAttributes[], targetDate: Date): boolean {
        const targetMonth = targetDate.getMonth() + 1;
        const targetYear = targetDate.getFullYear();

        return measurements.some(measurement => {
            const measurementDate = new Date(measurement.measure_datetime);
            const measurementMonth = measurementDate.getMonth() + 1;
            const measurementYear = measurementDate.getFullYear();
            return measurementMonth === targetMonth && measurementYear === targetYear;
        });
    }
}
