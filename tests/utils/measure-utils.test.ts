import { IMeasure } from "../../src/models/measure-model";
import { MeasureType } from "../../src/utils/measure-types";
import { MeasureUtils } from "../../src/utils/measure-utils";


const createMeasurement = (date: string, type: MeasureType): IMeasure => ({
    id: '1',
    measure_datetime: new Date(date),
    measure_type: type,
    customer_code: 'code1',
    image_url: 'url1',
    has_confirmed: false
});

const targetDate = new Date('2024-08-10');
const targetType = MeasureType.GAS;
describe('MeasureUtils, utils', () => {
    it('should return true if there is a duplicate measurement in the current month and year for the same type', () => {
        const measurements: IMeasure[] = [
            createMeasurement('2024-08-15', MeasureType.GAS),
            createMeasurement('2024-08-20', MeasureType.GAS)
        ];

        const result = MeasureUtils.hasDuplicateForDate(measurements, targetDate, targetType);
        expect(result).toBe(true);
    });

    it('should return false if there are no measurements in the current month and year for the same type', () => {
        const measurements: IMeasure[] = [
            createMeasurement('2024-09-15', MeasureType.GAS),
            createMeasurement('2024-08-20', MeasureType.WATER)
        ];

        const result = MeasureUtils.hasDuplicateForDate(measurements, targetDate, targetType);
        expect(result).toBe(false);
    });

    it('should return false if no measurements are provided', () => {
        const measurements: IMeasure[] = [];

        const result = MeasureUtils.hasDuplicateForDate(measurements, targetDate, targetType);
        expect(result).toBe(false);
    });
});
