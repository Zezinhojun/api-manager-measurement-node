import { NextFunction, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';

import { BadRequestResponse } from '../utils/http-responses/bad-request-response';
import { MeasureType } from '../utils/measure-types';
import Jimp from 'jimp';

const removeBase64Prefix = (base64String: string) => {
    return base64String.replace(/^data:image\/[a-z]+;base64,/, '');
};

const isValidBase64Image = async (base64String: string) => {
    try {
        const imageBuffer = Buffer.from(
            removeBase64Prefix(base64String),
            'base64'
        );
        const image = await Jimp.read(imageBuffer);
        return image != null;
    } catch (error) {
        console.error('Imagem inválida:', error);
        return false;
    }
};

export const validateMeasureCreation = () => {
    return [
        body('customer_code')
            .notEmpty()
            .withMessage('Código do cliente não fornecido.')
            .isString()
            .withMessage('Código do cliente deve ser uma string.'),
        body('measure_datetime')
            .notEmpty()
            .withMessage('Data da medida não fornecida.')
            .isISO8601()
            .withMessage('Data da medida inválida.'),
        body('measure_type')
            .notEmpty()
            .withMessage('Tipo de medida não fornecido.')
            .isIn(Object.values(MeasureType))
            .withMessage('Tipo de medida inválido.'),
        body('image')
            .notEmpty()
            .withMessage('Imagem não fornecida.')
            .custom(async (value) => {
                const isValid = await isValidBase64Image(value);
                if (!isValid) {
                    throw new Error('Imagem Base64 inválida.');
                }
                return true;
            }),

        (req: Request, res: Response, next: NextFunction) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                console.error('Validation errors:', errors.array()); // Adicione este log
                const error = errors.array()[0];
                const httpResponse = new BadRequestResponse(
                    'INVALID_DATA',
                    error.msg
                );
                return res
                    .status(httpResponse.statusCode)
                    .json(httpResponse.body);
            }
            next();
        },
    ];
};
