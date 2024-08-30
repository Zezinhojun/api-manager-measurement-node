import { Express } from 'express';

import { MeasureType } from '../../src/utils/measure-types';
import { MockCustomerRepository } from '../mocks/mockCustomer-repository';
import MockCustomerService from '../mocks/mockCustomer-service';
import { MockMeasureRepository } from '../mocks/mockMeasure-repository';
import { MockMeasureService } from '../mocks/mockMeasure-service';
import { createMockResponse, sendRequest, setupApp } from '../test-utils/controller-utils';

describe('MeasureController', () => {
    let app: Express
    let mockMeasureService: MockMeasureService
    let mockMeasureRepository: MockMeasureRepository
    let mockCustomerService: MockCustomerService
    let mockCustomerRepository: MockCustomerRepository

    beforeEach(() => {

        mockMeasureRepository = new MockMeasureRepository()
        mockCustomerRepository = new MockCustomerRepository()
        mockCustomerService = new MockCustomerService(mockCustomerRepository)
        mockMeasureService = new MockMeasureService(mockMeasureRepository, mockCustomerService)
        app = setupApp(mockMeasureService);
    });

    it('should create a measure with status 201', async () => {
        const measureData = { someField: 'someValue' };
        const mockResponse = createMockResponse(201, { id: '123', ...measureData });

        mockMeasureService.registerMeasure.mockResolvedValue(mockResponse);

        await sendRequest(app, 'post', '/upload', measureData, {}, 201, mockResponse.body);
    });

    it('should update a measure with status 200', async () => {
        const measureId = '123';
        const confirmedValue = 'newValue';
        const mockResponse = createMockResponse(200, { id: measureId, confirmed_value: confirmedValue });

        mockMeasureService.markMeasureAsConfirmed.mockResolvedValue(mockResponse);

        await sendRequest(app, 'patch', '/confirm', { measure_uuid: measureId, confirmed_value: confirmedValue }, {}, 200, mockResponse.body);
    });

    it('should get measures by customer with status 200', async () => {
        const customerCode = 'customer123';
        const measureType: MeasureType = MeasureType.GAS;
        const mockResponse = createMockResponse(200, [{ id: '123', type: measureType }]);

        mockMeasureService.fetchMeasuresByCustomer.mockResolvedValue(mockResponse);

        await sendRequest(app, 'get', `/${customerCode}/list`, {}, { measure_type: measureType }, 200, mockResponse.body);
    });
});
