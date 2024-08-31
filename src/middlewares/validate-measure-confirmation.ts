import { NextFunction, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';

import { BadRequestResponse } from '../utils/http-responses/bad-request-response';

export const validateMeasureConfirmation = () => {
    return [
        body('measure_uuid').notEmpty().withMessage('UUID da medida não fornecido.'),
        body('confirmed_value').notEmpty().withMessage('Valor confirmado não fornecido.')
            .bail().custom(value => {
                if (typeof value !== 'number' || !Number.isInteger(value) || value < 0) {
                    throw new Error('O valor confirmado deve ser um número inteiro positivo.');
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
    ];
}
