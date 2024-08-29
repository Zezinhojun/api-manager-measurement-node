import { NextFunction, Request, Response } from 'express';
import { param, query, validationResult } from 'express-validator';

import { BadRequestResponse } from '../utils/http-responses/bad-request-response';
import { MeasureType } from '../utils/measure-types';

export const validateCustomerMeasuresQuery = () => {
    return [
        param('customer_code')
            .notEmpty().withMessage('Código do cliente não fornecido.'),
        query('measure_type')
            .optional()
            .custom(value => {
                if (value) {
                    const measureType = value.toUpperCase() as MeasureType;
                    if (!Object.values(MeasureType).includes(measureType)) {
                        throw new Error('Tipo de medição não permitida.');
                    }
                }
                return true;
            }),

        (req: Request, res: Response, next: NextFunction) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                const error = errors.array()[0];
                const httpResponse = new BadRequestResponse("INVALID_DATA", error.msg)
                return res.status(httpResponse.statusCode).json(httpResponse.body);
            }
            next();
        }
    ]

}


