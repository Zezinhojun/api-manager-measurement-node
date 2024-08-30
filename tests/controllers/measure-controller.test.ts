import express from 'express'
import MeasureService from '../../src/services/measure-service';
import { MeasureType } from '../../src/utils/measure-types';
import { createMockResponse, sendRequest, setupApp } from '../test-utils/controller-utils';

describe('MeasureController', () => {
    let app: express.Express;
    let measureService: jest.Mocked<MeasureService>;

    beforeEach(() => {
        measureService = {
            createMeasure: jest.fn(),
            updateMeasure: jest.fn(),
            getMeasuresByCustomer: jest.fn(),
        } as unknown as jest.Mocked<MeasureService>;

        app = setupApp(measureService);
    });

    it('should create a measure with status 201', async () => {
        const measureData = { someField: 'someValue' };
        const mockResponse = createMockResponse(201, { id: '123', ...measureData });

        measureService.createMeasure.mockResolvedValue(mockResponse);

        await sendRequest(app, 'post', '/upload', measureData, {}, 201, mockResponse.body);
    });

    it('should update a measure with status 200', async () => {
        const measureId = '123';
        const confirmedValue = 'newValue';
        const mockResponse = createMockResponse(200, { id: measureId, confirmed_value: confirmedValue });

        measureService.updateMeasure.mockResolvedValue(mockResponse);

        await sendRequest(app, 'patch', '/confirm', { measure_uuid: measureId, confirmed_value: confirmedValue }, {}, 200, mockResponse.body);
    });

    it('should get measures by customer with status 200', async () => {
        const customerCode = 'customer123';
        const measureType: MeasureType = MeasureType.GAS;
        const mockResponse = createMockResponse(200, [{ id: '123', type: measureType }]);

        measureService.getMeasuresByCustomer.mockResolvedValue(mockResponse);

        await sendRequest(app, 'get', `/${customerCode}/list`, {}, { measure_type: measureType }, 200, mockResponse.body);
    });
});
