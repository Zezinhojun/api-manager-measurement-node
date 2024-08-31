import { Request, Response } from 'express';

import MeasureService from '../services/measure-service';
import { MeasureType } from '../utils/measure-types';

export class MeasureController {
    constructor(readonly measureService: MeasureService) {}

    async createMeasure(req: Request, res: Response) {
        const measureData = req.body;
        const httpResponse =
            await this.measureService.registerMeasure(measureData);
        res.status(httpResponse.statusCode).json(httpResponse.body);
    }

    async updateMeasure(req: Request, res: Response) {
        const { measure_uuid, confirmed_value } = req.body;
        const httpResponse = await this.measureService.markMeasureAsConfirmed(
            measure_uuid,
            confirmed_value
        );
        res.status(httpResponse.statusCode).json(httpResponse.body);
    }

    async getMeasuresByCustomer(req: Request, res: Response) {
        const { customer_code } = req.params;
        const measure_type = req.query.measure_type as MeasureType | undefined;
        const httpResponse = await this.measureService.fetchMeasuresByCustomer(
            customer_code,
            measure_type
        );
        res.status(httpResponse.statusCode).json(httpResponse.body);
    }
}
