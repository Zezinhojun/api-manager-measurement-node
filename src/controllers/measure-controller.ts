import { Request, Response } from 'express';

import MeasureService from '../services/measure-service';

export class MeasureController {
    constructor(readonly measureService: MeasureService) { }

    async createMeasure(req: Request, res: Response) {
        const measureData = req.body;
        const httpResponse = await this.measureService.createMeasure(measureData)
        res.status(httpResponse.statusCode).json(httpResponse.body);
    }

    async updateMeasure(req: Request, res: Response) {
        const { measure_uuid, confirmed_value } = req.body
        const httpResponse = await this.measureService.updateMeasure(measure_uuid, confirmed_value)
        res.status(httpResponse.statusCode).json(httpResponse.body);
    }
}