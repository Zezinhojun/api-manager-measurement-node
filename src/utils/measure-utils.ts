import { IMeasure } from '../models/measure-model';
import { MeasureType } from './measure-types';

export class MeasureUtils {
    public static hasDuplicateForDate(
        measurements: IMeasure[],
        targetDate: Date,
        targetType: MeasureType
    ): boolean {
        const monthOfTargetDate = targetDate.getMonth() + 1;
        const yearOfTargetDate = targetDate.getFullYear();

        return measurements.some(measurement => {
            const dateOfMeasurement = new Date(measurement.measure_datetime);
            const monthOfMeasurementDate = dateOfMeasurement.getMonth() + 1;
            const yearOfMeasurementDate = dateOfMeasurement.getFullYear();
            return monthOfMeasurementDate === monthOfTargetDate &&
                yearOfMeasurementDate === yearOfTargetDate &&
                measurement.measure_type === targetType;
        });
    }
}
