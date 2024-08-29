import { Request, Response } from 'express';
import request from 'supertest';

import { validateMeasureCreation } from '../../src/middlewares/validate-measure-creation';
import { createAssertErrorResponse, setupApp } from '../test-utils/middleware-utils';

const app = setupApp(validateMeasureCreation, '/test', 'post', (req: Request, res: Response) => {
    res.status(200).send('Success');
});

const assertErrorResponse = createAssertErrorResponse(app, '/test', 'post');

const errorMessages = {
    missingCustomerCode: {
        error_code: 'INVALID_DATA',
        error_description: 'Código do cliente não fornecido.'
    },
    invalidCustomerCode: {
        error_code: 'INVALID_DATA',
        error_description: 'Código do cliente deve ser uma string.'
    },
    missingMeasureDatetime: {
        error_code: 'INVALID_DATA',
        error_description: 'Data da medida não fornecida.'
    },
    invalidMeasureDatetime: {
        error_code: 'INVALID_DATA',
        error_description: 'Data da medida inválida.'
    },
    missingMeasureType: {
        error_code: 'INVALID_DATA',
        error_description: 'Tipo de medida não fornecido.'
    },
    invalidMeasureType: {
        error_code: 'INVALID_DATA',
        error_description: 'Tipo de medida inválido.'
    },
    missingImage: {
        error_code: 'INVALID_DATA',
        error_description: 'Imagem não fornecida.'
    }
};

describe('validateMeasureCreation middleware', () => {
    it('should return 400 for invalid customer_code', async () => {
        await assertErrorResponse(
            errorMessages.missingCustomerCode,
            { measure_datetime: '2024-11-23T14:20:00.000Z', measure_type: 'GAS', image: 'image-url' },
        );

        await assertErrorResponse(
            errorMessages.invalidCustomerCode,
            { customer_code: 123, measure_datetime: '2024-11-23T14:20:00.000Z', measure_type: 'GAS', image: 'image-url' },
        );
    });

    it('should return 400 for invalid measure_datetime', async () => {
        await assertErrorResponse(
            errorMessages.missingMeasureDatetime,
            { customer_code: 'some-code', measure_type: 'GAS', image: 'image-url' },
        );

        await assertErrorResponse(
            errorMessages.invalidMeasureDatetime,
            { customer_code: 'some-code', measure_datetime: 'invalid-date', measure_type: 'GAS', image: 'image-url' },
        );
    });

    it('should return 400 for invalid measure_datetime', async () => {
        await assertErrorResponse(
            errorMessages.missingMeasureDatetime,
            { customer_code: 'some-code', measure_type: 'GAS', image: 'image-url' }
        );

        await assertErrorResponse(
            errorMessages.invalidMeasureDatetime,
            { customer_code: 'some-code', measure_datetime: 'invalid-date', measure_type: 'GAS', image: 'image-url' }
        );
    });

    it('should return 400 for invalid measure_type', async () => {
        await assertErrorResponse(
            errorMessages.missingMeasureType,
            { customer_code: 'some-code', measure_datetime: '2024-11-23T14:20:00.000Z', image: 'image-url' },
        );

        await assertErrorResponse(
            errorMessages.invalidMeasureType,
            { customer_code: 'some-code', measure_datetime: '2024-11-23T14:20:00.000Z', measure_type: 'INVALID_TYPE', image: 'image-url' },

        );
    });

    it('should return 400 for missing image', async () => {
        await assertErrorResponse(
            errorMessages.missingImage,
            { customer_code: 'some-code', measure_datetime: '2024-11-23T14:20:00.000Z', measure_type: 'GAS' },
        );
    });

    it('should pass validation if all fields are valid', async () => {
        const response = await request(app)
            .post('/test')
            .send({ customer_code: 'some-code', measure_datetime: '2024-11-23T14:20:00.000Z', measure_type: 'GAS', image: 'image-url' });

        expect(response.status).toBe(200);
        expect(response.text).toBe('Success');
    });
})