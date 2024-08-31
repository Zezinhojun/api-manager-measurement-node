import { MeasureType } from '../utils/measure-types';

export interface IMeasure {
    id: string;
    measure_datetime: Date;
    measure_type: MeasureType;
    image_url: string;
    customer_code: string;
    has_confirmed: boolean;
}
