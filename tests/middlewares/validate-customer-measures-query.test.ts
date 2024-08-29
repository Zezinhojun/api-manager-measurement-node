import { Request, Response } from 'express';
import request from 'supertest';

import { validateCustomerMeasuresQuery } from '../../src/middlewares/validate-customer-measures-query';
import { assertErrorResponse, setupApp } from '../test-utils/middleware-utils';

const app = setupApp(validateCustomerMeasuresQuery, '/test/:customer_code?', 'get', (req: Request, res: Response) => {
    res.status(200).send('Success');
});

const errorMessages = {
    missingCustomerCode: {
        error_code: 'INVALID_DATA',
        error_description: 'Código do cliente não fornecido.'
    },
    invalidCustomerCode: {
        error_code: 'INVALID_DATA',
        error_description: 'Código do cliente deve ser uma string.'
    },
    invalidMeasureType: {
        error_code: 'INVALID_DATA',
        error_description: 'Tipo de medição deve ser uma string.'
    },
    invalidMeasureTypeValue: {
        error_code: 'INVALID_DATA',
        error_description: 'Tipo de medição não permitida.'
    }
};

describe('validateCustomerMeasuresQuery, middleware', () => {
    it('should return 400 if customer_code is not provided', async () => {
        await assertErrorResponse(
            app, // app is the Express instance
            '/test', // URL for the request
            errorMessages.missingCustomerCode, // Expected error
            'get' // HTTP method
        );
    });

    it('should return 400 if measure_type is provided but is not a valid MeasureType', async () => {
        await assertErrorResponse(
            app,
            '/test/sdigs?measure_type=INVALID_TYPE',
            errorMessages.invalidMeasureTypeValue,
            'get'
        );
    });

    it('should pass validation if all fields are valid', async () => {
        const response = await request(app)
            .get('/test/customer-code?measure_type=GAS');

        expect(response.status).toBe(200);
        expect(response.text).toBe('Success');
    });

})