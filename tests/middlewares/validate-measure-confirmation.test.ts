import { Request, Response } from 'express';
import request from 'supertest';

import { validateMeasureConfirmation } from '../../src/middlewares/validate-measure-confirmation';
import { createAssertErrorResponse, setupApp } from '../test-utils/middleware-utils';

const app = setupApp(validateMeasureConfirmation, '/test', 'post', (req: Request, res: Response) => {
    res.status(200).send('Success');
});

const assertErrorResponse = createAssertErrorResponse(app, '/test', 'post');

const errorMessages = {
    missingMeasureUuid: {
        error_code: 'INVALID_DATA',
        error_description: 'UUID da medida não fornecido.'
    },
    missingConfirmedValue: {
        error_code: 'INVALID_DATA',
        error_description: 'Valor confirmado não fornecido.'
    },
    invalidConfirmedValue: {
        error_code: 'INVALID_DATA',
        error_description: 'O valor confirmado deve ser um número inteiro positivo.'
    }
};

describe('validateMeasureConfirmation middleware', () => {
    it('should return 400 if measure_uuid is not provided', async () => {
        await assertErrorResponse(
            errorMessages.missingMeasureUuid,
            { confirmed_value: 1 },
        );
    });

    it('should return 400 if confirmed_value is not provided', async () => {
        await assertErrorResponse(
            errorMessages.missingConfirmedValue,
            { measure_uuid: 'some-uuid' },
        );
    });

    it('should return 400 if confirmed_value is not a positive integer', async () => {
        await assertErrorResponse(
            errorMessages.invalidConfirmedValue,
            { measure_uuid: 'some-uuid', confirmed_value: -1 },
        );
    });

    it('should pass validation if all fields are valid', async () => {
        const response = await request(app)
            .post('/test')
            .send({ measure_uuid: 'some-uuid', confirmed_value: 1 });

        expect(response.status).toBe(200);
        expect(response.text).toBe('Success');
    });
})