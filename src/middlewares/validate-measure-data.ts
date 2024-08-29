import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import { MeasureType } from '../utils/measure-types';

// Middleware para validar dados da medida
export function validateMeasureData() {
    return [
        body('customer_code').notEmpty().withMessage('Código do cliente não fornecido.'),
        body('measure_datetime').notEmpty().withMessage('Data da medida não fornecida.')
            .isISO8601().withMessage('Data da medida inválida.'),
        body('measure_type').notEmpty().withMessage('Tipo de medida não fornecido.')
            .isIn(Object.values(MeasureType)).withMessage('Tipo de medida inválido.'),
        body('image').notEmpty().withMessage('Imagem não fornecida.'),

        (req: Request, res: Response, next: NextFunction) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                const error = errors.array()[0];
                return res.status(400).json({
                    error_code: "INVALID_DATA",
                    error_description: error.msg
                });
            }
            next();
        }
    ];
}
