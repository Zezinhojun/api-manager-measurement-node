import express from 'express';
import request from 'supertest';

import { MeasureController } from '../../src/controllers/measure-controller';
import MeasureService from '../../src/services/measure-service';

export function setupApp(
    measureService: jest.Mocked<MeasureService>
): express.Express {
    const app = express();
    app.use(express.json());
    const measureController = new MeasureController(measureService);
    app.post('/upload', (req, res) =>
        measureController.createMeasure(req, res)
    );
    app.patch('/confirm', (req, res) =>
        measureController.updateMeasure(req, res)
    );
    app.get('/:customer_code/list', (req, res) =>
        measureController.getMeasuresByCustomer(req, res)
    );
    return app;
}

export function createMockResponse(statusCode: number, body: any) {
    return { statusCode, body };
}

export async function sendRequest(
    app: express.Express,
    method: 'post' | 'patch' | 'get',
    url: string,
    body: any = {},
    query: any = {},
    expectedStatusCode: number,
    expectedBody: any
) {
    const response = await request(app)
        [method](url)
        .send(body)
        .query(query)
        .expect(expectedStatusCode);
    expect(response.body).toEqual(expectedBody);
}
