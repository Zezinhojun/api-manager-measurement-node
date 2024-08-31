import MeasureRepository from '../../src/repositories/measure-repository';

class MockMeasureRepository extends MeasureRepository {

    createMeasure = jest.fn()
    findMeasureById = jest.fn()
    findAllMeasures = jest.fn()
    findMeasuresByCustomerCode = jest.fn()
    markMeasureAsConfirmed = jest.fn()
}

export { MockMeasureRepository };
