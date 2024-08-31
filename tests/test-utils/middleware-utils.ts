import request from 'supertest';
import express, { json, Request, Response } from 'express';

export const setupApp = (
    middleware: any,
    route: string,
    method: 'get' | 'post',
    handler: (req: Request, res: Response) => void
) => {
    const app = express();
    app.use(json());
    app[method](route, middleware(), handler);
    return app;
};

export const assertErrorResponse = async (
    app: express.Express,
    url: string,
    expectedError: object,
    method: 'get' | 'post',
    sendData?: object
): Promise<void> => {
    const response = await request(app)[method](url).send(sendData);

    expect(response.status).toBe(400);
    expect(response.body).toEqual(expectedError);
};

export const createAssertErrorResponse = (
    app: express.Express,
    url: string,
    method: 'get' | 'post'
) => {
    return async (expectedError: object, sendData?: object): Promise<void> => {
        let response;

        if (method === 'post') {
            response = await request(app)[method](url).send(sendData);
        } else {
            response = await request(app)[method](url);
        }

        expect(response.status).toBe(400);
        expect(response.body).toEqual(expectedError);
    };
};
