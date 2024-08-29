import { IMeasure } from '../models/measure-model';
import { MeasureType } from './measure-types';

export class MeasureUtils {
    public static hasDuplicateMeasurementInCurrentMonth(
        measurements: IMeasure[],
        targetDate: Date,
        targetType: MeasureType
    ): boolean {
        const targetMonth = targetDate.getMonth() + 1;
        const targetYear = targetDate.getFullYear();

        return measurements.some(measurement => {
            const measurementDate = new Date(measurement.measure_datetime);
            const measurementMonth = measurementDate.getMonth() + 1;
            const measurementYear = measurementDate.getFullYear();
            return measurementMonth === targetMonth &&
                measurementYear === targetYear &&
                measurement.measure_type === targetType;
        });
    }
}
