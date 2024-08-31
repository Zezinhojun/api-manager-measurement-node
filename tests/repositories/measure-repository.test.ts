import Measure from '../../src/database/sequelize/models/measure-model';
import { IMeasure } from '../../src/models/measure-model';
import { customerCode, measureData, measureId, measureType, mockMeasure } from '../mocks/mockMeasure-data';
import MeasureRepository from '../../src/repositories/measure-repository';

jest.mock('../../src/database/sequelize/models/measure-model', () => ({
    findOne: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
}));

describe('MeasureRepository, repository', () => {
    let measureRepository: MeasureRepository;

    beforeEach(() => {
        measureRepository = new MeasureRepository();

    });

    it('should create a measure', async () => {
        (Measure.create as jest.Mock).mockResolvedValue(mockMeasure);
        const result = await measureRepository.createMeasure(measureData)

        expect(result).toEqual(mockMeasure);
        expect(Measure.create).toHaveBeenCalledTimes(1);
        expect(Measure.create).toHaveBeenCalledWith(measureData);
    });

    it('should find a measure by ID', async () => {
        (Measure.findOne as jest.Mock).mockResolvedValue(mockMeasure);
        const result = await measureRepository.findMeasureById(measureId);

        expect(result).toEqual(mockMeasure);
        expect(Measure.findOne).toHaveBeenCalledTimes(1);
        expect(Measure.findOne).toHaveBeenCalledWith({ where: { id: measureId } });
    });

    it('should return null if measure not found by ID', async () => {
        (Measure.findOne as jest.Mock).mockResolvedValue(null);
        const result = await measureRepository.findMeasureById(measureId);

        expect(result).toBeNull();
        expect(Measure.findOne).toHaveBeenCalledTimes(1);
        expect(Measure.findOne).toHaveBeenCalledWith({ where: { id: measureId } });
    });

    it('should find all measures with various parameter combinations', async () => {
        (Measure.findAll as jest.Mock).mockResolvedValue([mockMeasure]);

        await measureRepository.findAllMeasures(customerCode, measureType);
        await measureRepository.findAllMeasures(customerCode);
        await measureRepository.findAllMeasures(undefined, measureType);
        await measureRepository.findAllMeasures();

        expect(Measure.findAll).toHaveBeenNthCalledWith(1, { where: { customer_code: customerCode, measure_type: measureType } });
        expect(Measure.findAll).toHaveBeenNthCalledWith(2, { where: { customer_code: customerCode } });
        expect(Measure.findAll).toHaveBeenNthCalledWith(3, { where: { measure_type: measureType } });
        expect(Measure.findAll).toHaveBeenNthCalledWith(4, {});
    });

    it('should update a measure', async () => {
        const updates: Partial<IMeasure> = { has_confirmed: true };
        const mockMeasure = {
            id: 'M123',
            has_confirmed: false,
            update: jest.fn().mockResolvedValue({ id: 'M123', has_confirmed: true }),
        };
        (Measure.findOne as jest.Mock).mockResolvedValue(mockMeasure);
        (Measure.update as jest.Mock).mockResolvedValue(updates);
        const result = await measureRepository.markMeasureAsConfirmed(measureId, updates);

        expect(Measure.findOne).toHaveBeenCalledWith({ where: { id: measureId } });
        expect(mockMeasure.update).toHaveBeenCalledWith(updates);
        expect(result).toEqual({ id: measureId, has_confirmed: true });
    });

});
