import { run } from '../../src/services/gemini-service';
import MeasureService from '../../src/services/measure-service';
import { BadRequestResponse } from '../../src/utils/http-responses/bad-request-response';
import { ConflictResponse } from '../../src/utils/http-responses/conflict-response';
import { OkResponse } from '../../src/utils/http-responses/ok-response';
import { MeasureType } from '../../src/utils/measure-types';
import { MockCustomerRepository } from '../mocks/mockCustomer-repository';
import MockCustomerService from '../mocks/mockCustomer-service';
import { MockMeasureRepository } from '../mocks/mockMeasure-repository';

jest.mock('../../src/services/gemini-service', () => ({
    run: jest.fn()
}));

const mockRun = run as jest.MockedFunction<typeof run>;

describe('MeasureService, service', () => {
    let measureService: MeasureService
    let mockMeasureRepository: MockMeasureRepository
    let mockCustomerService: MockCustomerService
    let mockCustomerRepository: MockCustomerRepository


    beforeEach(() => {
        mockMeasureRepository = new MockMeasureRepository()
        mockCustomerRepository = new MockCustomerRepository()
        mockCustomerService = new MockCustomerService(mockCustomerRepository)
        measureService = new MeasureService(mockMeasureRepository, mockCustomerService)
    })

    it('should return BadRequestResponse if measure date is invalid', async () => {
        const measureData = {
            image: 'base64::image',
            customer_code: '123',
            measure_datetime: 'invalid-date',
            measure_type: MeasureType.GAS
        };

        const response = await measureService.registerMeasure(measureData);

        expect(response).toBeInstanceOf(BadRequestResponse);
    });

    it('should create a measure successfully', async () => {
        const measureData = {
            image: 'base64::image',
            customer_code: '123',
            measure_datetime: '2024-08-30T00:00:00Z',
            measure_type: MeasureType.GAS
        };

        mockCustomerService.getCustomerByCode.mockResolvedValue({ statusCode: 200 });
        mockMeasureRepository.findMeasuresByCustomerCode.mockResolvedValue([]);
        (run as jest.Mock).mockResolvedValue({ imageUrl: 'http://localhost:3000/files/image_123456789.jpg', text: '10' });
        mockMeasureRepository.createMeasure.mockResolvedValue({ id: 1, image_url: 'http://localhost:3000/files/image_123456789.jpg' });

        const response = await measureService.registerMeasure(measureData);

        expect(response).toBeInstanceOf(OkResponse);
    });

    it('should return ConflictResponse if a duplicate measure is found', async () => {
        const measureData = {
            image: 'base64::image',
            customer_code: '123',
            measure_datetime: '2024-08-30T00:00:00Z',
            measure_type: MeasureType.GAS
        };

        mockCustomerService.getCustomerByCode.mockResolvedValue({ statusCode: 200 });
        mockMeasureRepository.findMeasuresByCustomerCode.mockResolvedValue([
            { measure_datetime: new Date('2024-08-30T00:00:00Z'), measure_type: MeasureType.GAS }
        ]);
        mockRun.mockResolvedValue({ imageUrl: 'http://localhost:3000/files/image_123456789.jpg', text: '10' });

        const response = await measureService.registerMeasure(measureData);

        expect(response).toBeInstanceOf(ConflictResponse);
    });

    it('should return ConflictResponse if there is a conflict', async () => {
        const measureData = {
            image: 'base64::image',
            customer_code: '123',
            measure_datetime: '2024-08-30T00:00:00Z',
            measure_type: MeasureType.GAS
        };
        mockCustomerService.getCustomerByCode.mockResolvedValue({ statusCode: 200 });
        mockMeasureRepository.findMeasuresByCustomerCode.mockResolvedValue([
            {
                id: 1,
                measure_datetime: new Date('2024-08-30T00:00:00Z'),
                measure_type: MeasureType.GAS,
                image_url: 'http://localhost:3000/files/image_123456789.jpg',
                has_confirmed: false
            }
        ]);

        mockRun.mockResolvedValue({ imageUrl: 'http://localhost:3000/files/image_123456789.jpg', text: '10' });
        mockMeasureRepository.createMeasure.mockResolvedValue({
            id: 1,
            image_url: 'http://localhost:3000/files/image_123456789.jpg'
        });

        const response = await measureService.registerMeasure(measureData);

        expect(response).toBeInstanceOf(ConflictResponse);
        const conflictResponse = response as ConflictResponse;
        expect(conflictResponse.body.error_code).toBe('DOUBLE_REPORT');
        expect(conflictResponse.body.error_description).toBe('Já existe uma leitura para este tipo no mês atual');
    });


})