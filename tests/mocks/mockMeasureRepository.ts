import { IMeasure } from "../../src/models/measure-model";
import { MeasureType } from "../../src/utils/measure-types";


export const measureId = 'M123';
export const customerCode = 'C123';
export const measureType: MeasureType = MeasureType.GAS;

export const mockMeasure: IMeasure = {
    id: measureId,
    customer_code: customerCode,
    measure_type: measureType,
    measure_datetime: new Date(),
    image_url: 'http://example.com/image.jpg',
    has_confirmed: false
} as IMeasure;

export const measureData: Omit<IMeasure, 'id'> = {
    customer_code: customerCode,
    measure_type: measureType,
    measure_datetime: new Date(),
    image_url: 'http://example.com/image.jpg',
    has_confirmed: false
};
