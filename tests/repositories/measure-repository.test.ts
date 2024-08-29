import Measure from '../../src/database/sequelize/models/measure-model';
import { IMeasure } from '../../src/models/measure-model';
import MeasureRepository from '../../src/repositories/measure-repository';
import { MeasureType } from '../../src/utils/measure-types';
import { customerCode, measureData, measureId, measureType, mockMeasure } from '../mocks/mockMeasureRepository';

jest.mock('../../src/database/sequelize/models/measure-model');

describe('MeasureRepository, repository', () => {
    let measureRepository: MeasureRepository;

    beforeEach(() => {
        measureRepository = new MeasureRepository();
    });

    it('should create a measure', async () => {
        (Measure.create as jest.Mock).mockResolvedValue(mockMeasure);
        const result = await measureRepository.createMeasure(measureData);

        expect(result).toEqual(mockMeasure);
        expect(Measure.create).toHaveBeenCalledWith(measureData);
    });

    it('should find a measure by ID', async () => {
        (Measure.findOne as jest.Mock).mockResolvedValue(mockMeasure);
        const result = await measureRepository.findMeasureById(measureId);

        expect(result).toEqual(mockMeasure);
        expect(Measure.findOne).toHaveBeenCalledWith({ where: { id: measureId } });
    });

    it('should return null if measure not found by ID', async () => {
        (Measure.findOne as jest.Mock).mockResolvedValue(null);
        const result = await measureRepository.findMeasureById(measureId);

        expect(result).toBeNull();
        expect(Measure.findOne).toHaveBeenCalledWith({ where: { id: measureId } });
    });

    it('should find all measures with various parameter combinations', async () => {
        (Measure.findAll as jest.Mock).mockResolvedValue([mockMeasure]);

        await measureRepository.findAllMeasures(customerCode, measureType);
        await measureRepository.findAllMeasures(customerCode);
        await measureRepository.findAllMeasures(undefined, measureType);
        await measureRepository.findAllMeasures();

        expect(Measure.findAll).toHaveBeenNthCalledWith(1, {
            where: {
                customer_code: customerCode,
                measure_type: measureType
            }
        });

        expect(Measure.findAll).toHaveBeenNthCalledWith(2, {
            where: { customer_code: customerCode }
        });

        expect(Measure.findAll).toHaveBeenNthCalledWith(3, {
            where: { measure_type: measureType }
        });

        expect(Measure.findAll).toHaveBeenNthCalledWith(4, {});
    });
    it('should update a measure', async () => {
        const updates: Partial<IMeasure> = { measure_type: MeasureType.WATER };
        (Measure.findOne as jest.Mock).mockResolvedValue({
            ...mockMeasure,
            update: jest.fn().mockResolvedValue({ ...mockMeasure, ...updates })
        });
        const result = await measureRepository.updateMeasure(measureId, updates);

        expect(result).toEqual({ ...mockMeasure, ...updates });
        expect(Measure.findOne).toHaveBeenCalledWith({ where: { id: measureId } });
    });

    it('should throw an error if measure not found for update', async () => {
        (Measure.findOne as jest.Mock).mockResolvedValue(null);
        await expect(measureRepository.updateMeasure(measureId, {})).rejects.toThrow(`Measure with ID ${measureId} not found`);
    });

});
