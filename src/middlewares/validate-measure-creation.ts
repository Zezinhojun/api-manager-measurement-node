import { NextFunction, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';

import { BadRequestResponse } from '../utils/http-responses/bad-request-response';
import { MeasureType } from '../utils/measure-types';

export const validateMeasureCreation = () => {
    return [
        body('customer_code').notEmpty().withMessage('Código do cliente não fornecido.')
            .isString().withMessage('Código do cliente deve ser uma string.'),
        body('measure_datetime').notEmpty().withMessage('Data da medida não fornecida.')
            .isISO8601().withMessage('Data da medida inválida.'),
        body('measure_type').notEmpty().withMessage('Tipo de medida não fornecido.')
            .isIn(Object.values(MeasureType)).withMessage('Tipo de medida inválido.'),
        body('image').notEmpty().withMessage('Imagem não fornecida.'),

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
