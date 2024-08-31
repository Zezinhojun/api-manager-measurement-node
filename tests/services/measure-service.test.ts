import MeasureService from '../../src/services/measure-service';
import { BadRequestResponse } from '../../src/utils/http-responses/bad-request-response';
import { ConflictResponse } from '../../src/utils/http-responses/conflict-response';
import { NotFoundResponse } from '../../src/utils/http-responses/not-found-response';
import { OkResponse } from '../../src/utils/http-responses/ok-response';
import { MeasureType } from '../../src/utils/measure-types';
import { MockCustomerRepository } from '../mocks/mockCustomer-repository';
import MockCustomerService from '../mocks/mockCustomer-service';
import { MockMeasureRepository } from '../mocks/mockMeasure-repository';
import { processImage } from '../../src/services/gemini-service';
import { customerCode, measureCreateData } from '../mocks/mockMeasure-data';

jest.mock('../../src/services/gemini-service', () => ({
    run: jest.fn()
}));

const mockRun = processImage as jest.MockedFunction<typeof processImage>;

describe('MeasureService - service', () => {
    let measureService: MeasureService;
    let mockMeasureRepository: MockMeasureRepository;
    let mockCustomerService: MockCustomerService;

    beforeEach(() => {
        mockMeasureRepository = new MockMeasureRepository();
        mockCustomerService = new MockCustomerService(new MockCustomerRepository());
        measureService = new MeasureService(mockMeasureRepository, mockCustomerService);
    });
    it('should handle 200 successful customer creation and measure registration', async () => {
        jest.spyOn(mockCustomerService, 'getCustomerByCode').mockResolvedValue({ statusCode: 404 });
        jest.spyOn(mockCustomerService, 'createCustomer').mockResolvedValue({ statusCode: 200 });
        jest.spyOn(mockMeasureRepository, 'findMeasuresByCustomerCode').mockResolvedValue([]);
        mockRun.mockResolvedValue({ imageUrl: 'http://localhost:3000/files/image_123456789.jpg', text: '10' });
        jest.spyOn(mockMeasureRepository, 'createMeasure').mockResolvedValue({ id: '1', image_url: 'http://localhost:3000/files/image_123456789.jpg' });

        const response = await measureService.registerMeasure(measureCreateData);

        expect(response).toBeInstanceOf(OkResponse);

        const okResponse = response as OkResponse;

        expect(okResponse.body.data.image_url).toBe('http://localhost:3000/files/image_123456789.jpg');
        expect(okResponse.body.data.measure_value).toBe(10);
        expect(okResponse.body.data.measure_uuid).toBe('1');

        expect(mockCustomerService.getCustomerByCode).toHaveBeenCalledWith(measureCreateData.customer_code);
        expect(mockCustomerService.createCustomer).toHaveBeenCalledWith({ customer_code: measureCreateData.customer_code });
        expect(mockMeasureRepository.findMeasuresByCustomerCode).toHaveBeenCalledWith(measureCreateData.customer_code);
        expect(mockRun).toHaveBeenCalledWith(measureCreateData.image);
        expect(mockMeasureRepository.createMeasure).toHaveBeenCalledWith({
            customer_code: measureCreateData.customer_code,
            measure_datetime: new Date(measureCreateData.measure_datetime),
            measure_type: measureCreateData.measure_type,
            image_url: 'http://localhost:3000/files/image_123456789.jpg',
            has_confirmed: false
        });
    });

    it('should return 400 BadRequestResponse if measure data is invalid', async () => {
        const measureData = {
            image: 'base64::image',
            customer_code: '123',
            measure_datetime: 'invalid-date',
            measure_type: MeasureType.GAS
        };

        const response = await measureService.registerMeasure(measureData);

        expect(response).toBeInstanceOf(BadRequestResponse);

        const badRequestResponse = response as BadRequestResponse;

        expect(badRequestResponse.body.error_code).toBe('INVALID_DATA');
        expect(badRequestResponse.body.error_description).toBe('Data da medida inválida.');
    });

    it('should return 409 ConflictResponse if there is a duplicate measure for the same month', async () => {
        mockCustomerService.getCustomerByCode.mockResolvedValue({ statusCode: 200 });
        mockMeasureRepository.findMeasuresByCustomerCode.mockResolvedValue([
            { measure_datetime: new Date('2024-08-30T00:00:00Z'), measure_type: MeasureType.GAS }
        ]);
        mockRun.mockResolvedValue({ imageUrl: 'http://localhost:3000/files/image_123456789.jpg', text: '10' });

        const response = await measureService.registerMeasure(measureCreateData);

        expect(response).toBeInstanceOf(ConflictResponse);

        const conflictResponse = response as ConflictResponse;

        expect(conflictResponse.body.error_code).toBe('DOUBLE_REPORT');
        expect(conflictResponse.body.error_description).toBe('Leitura do mês já realizada');
    });

    it('should return 200 OkResponse when measure is successfully confirmed', async () => {
        const measureUuid = '123';
        const confirmedValue = 10;
        mockMeasureRepository.findMeasureById.mockResolvedValue({
            id: measureUuid,
            has_confirmed: false,
        });
        mockMeasureRepository.markMeasureAsConfirmed.mockResolvedValue(true);
        const response = await measureService.markMeasureAsConfirmed(measureUuid, confirmedValue);

        expect(response).toBeInstanceOf(OkResponse);

        const okResponse = response as OkResponse;

        expect(okResponse.body.data.success).toBe(true);
    });

    it('should return 404 BadRequestResponse if confirmation data is invalid', async () => {
        const invalidMeasureUuid = '';
        const confirmedValue = NaN;

        const response = await measureService.markMeasureAsConfirmed(invalidMeasureUuid, confirmedValue)

        expect(response).toBeInstanceOf(BadRequestResponse);

        const badRequestResponse = response as BadRequestResponse

        expect(badRequestResponse.body.error_code).toBe('INVALID_DATA');
        expect(badRequestResponse.body.error_description).toBe('Dados fornecidos são inválidos.');

    });

    it('should return 409 ConflictResponse if measure is already confirmed', async () => {
        const measureUuid = '123';
        const confirmedValue = 10;

        mockMeasureRepository.findMeasureById.mockResolvedValue({
            id: measureUuid,
            has_confirmed: true,
        });

        const response = await measureService.markMeasureAsConfirmed(measureUuid, confirmedValue);

        expect(response).toBeInstanceOf(ConflictResponse);

        const conflictResponse = response as ConflictResponse;

        expect(conflictResponse.body.error_code).toBe('CONFIRMATION_DUPLICATE');
        expect(conflictResponse.body.error_description).toBe('Leitura do mês já realizada.');
    });

    it('should 200 return all measures if measureType is not provided', async () => {
        const measures = [
            {
                id: '1',
                measure_datetime: new Date('2024-08-30T00:00:00Z'),
                measure_type: MeasureType.GAS,
                has_confirmed: false,
                image_url: 'http://example.com/image1.jpg'
            },
            {
                id: '2',
                measure_datetime: new Date('2024-08-31T00:00:00Z'),
                measure_type: MeasureType.WATER,
                has_confirmed: true,
                image_url: 'http://example.com/image2.jpg'
            }
        ];

        jest.spyOn(mockCustomerService, 'getCustomerByCode').mockResolvedValue({ statusCode: 200 });
        jest.spyOn(mockMeasureRepository, 'findAllMeasures').mockResolvedValue(measures);

        const response = await measureService.fetchMeasuresByCustomer(customerCode);

        expect(response).toBeInstanceOf(OkResponse);

        const okResponse = response as OkResponse;

        expect(okResponse.body.data.customer_code).toBe(customerCode);
        expect(okResponse.body.data.measures.length).toBe(2);
        expect(okResponse.body.data.measures[0].measure_uuid).toBe('1');
        expect(okResponse.body.data.measures[1].measure_uuid).toBe('2');
    });
    it('should return 400 only measures matching the specified measureType', async () => {
        const measureType = MeasureType.GAS;

        const measures = [
            {
                id: '1',
                measure_datetime: new Date('2024-08-30T00:00:00Z'),
                measure_type: MeasureType.GAS,
                has_confirmed: false,
                image_url: 'http://example.com/image1.jpg'
            },
            {
                id: '2',
                measure_datetime: new Date('2024-08-31T00:00:00Z'),
                measure_type: MeasureType.WATER,
                has_confirmed: true,
                image_url: 'http://example.com/image2.jpg'
            }
        ];

        jest.spyOn(mockMeasureRepository, 'findAllMeasures').mockResolvedValue(measures);
        jest.spyOn(mockCustomerService, 'getCustomerByCode').mockResolvedValue({ statusCode: 200 });
        const response = await measureService.fetchMeasuresByCustomer(customerCode, measureType);

        expect(response).toBeInstanceOf(OkResponse);

        const okResponse = response as OkResponse;
        const filteredMeasures = measures
            .filter(measure => measure.measure_type === measureType)
            .map(measure => ({
                measure_uuid: measure.id,
                measure_datetime: measure.measure_datetime,
                measure_type: measure.measure_type,
                has_confirmed: measure.has_confirmed,
                image_url: measure.image_url
            }));

        expect(okResponse.body.data.customer_code).toBe(customerCode);
        expect(okResponse.body.data.measures).toHaveLength(filteredMeasures.length);
        expect(okResponse.body.data.measures).toEqual(filteredMeasures);
    });

    it('should return 400 if measureType is invalid', async () => {
        const measureType = 'INVALID_TYPE' as MeasureType;
        const response = await measureService.fetchMeasuresByCustomer(customerCode, measureType);

        expect(response).toBeInstanceOf(BadRequestResponse);

        const badRequestResponse = response as BadRequestResponse;

        expect(badRequestResponse.body.error_code).toBe('INVALID_TYPE');
        expect(badRequestResponse.body.error_description).toBe('Tipo de medição não permitida');
    });

    it('should return 404 NotFoundResponse if measure is not found', async () => {
        const measureUuid = 'non-existing-uuid';
        const confirmedValue = 10;
        mockMeasureRepository.findMeasureById.mockResolvedValue(null);
        const response = await measureService.markMeasureAsConfirmed(measureUuid, confirmedValue);

        expect(response).toBeInstanceOf(NotFoundResponse);

        const notFoundResponse = response as NotFoundResponse;

        expect(notFoundResponse.body.code).toBe('MEASURE_NOT_FOUND');
        expect(notFoundResponse.body.description).toBe('Leitura do mês já realizada.');
    });

    it('should return 404 if no measures are found', async () => {
        jest.spyOn(mockCustomerService, 'getCustomerByCode').mockResolvedValue({ statusCode: 200 });
        jest.spyOn(mockMeasureRepository, 'findAllMeasures').mockResolvedValue([]);
        const response = await measureService.fetchMeasuresByCustomer(customerCode);

        expect(response).toBeInstanceOf(NotFoundResponse);

        const notFoundResponse = response as NotFoundResponse;

        expect(notFoundResponse.body.code).toBe('MEASURES_NOT_FOUND');
        expect(notFoundResponse.body.description).toBe('Nenhuma leitura encontrada.');
    });

});

