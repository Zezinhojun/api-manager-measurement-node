import MeasureService from '../../src/services/measure-service';


export class MockMeasureService extends MeasureService {

    registerMeasure = jest.fn()
    fetchMeasureById = jest.fn()
    fetchMeasuresByCustomer = jest.fn()
    markMeasureAsConfirmed = jest.fn()
}