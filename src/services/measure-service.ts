import { MeasureAttributes } from '../database/sequelize/models/measure-model';
import { HttpResponseBase } from '../models/http-response-model';
import MeasureRepository from '../repositories/measure-repository';
import { BadRequestResponse } from '../utils/http-responses/bad-request-response';
import { ConflictResponse } from '../utils/http-responses/conflict-response';
import { OkResponse } from '../utils/http-responses/ok-response';
import { imagebase64 } from '../utils/image-base-64';
import { MeasureType } from '../utils/measure-types';
import { MeasureUtils } from '../utils/measure-utils';
import { CustomerService } from './customer-service';
import { run } from './gemini-service';

type MeasureData = {
    image: string;
    customer_code: string;
    measure_datetime: string;
    measure_type: MeasureType
}

export default class MeasureService {
    constructor(
        readonly measureRepository: MeasureRepository,
        readonly customerService: CustomerService) { }

    async createMeasure(measureData: MeasureData): Promise<HttpResponseBase> {

        const measureDate = new Date(measureData.measure_datetime);

        if (isNaN(measureDate.getTime())) {
            return new BadRequestResponse("INVALID_DATA", "Data da medida inválida ali.");
        }

        const customerResponse = await this.customerService.getCustomerByCode(measureData.customer_code);

        if (customerResponse.statusCode === 404) {
            const createCustomerResponse = await this.customerService.createCustomer({ customer_code: measureData.customer_code });
            if (createCustomerResponse.statusCode !== 200) {
                return new BadRequestResponse("INVALID_CUSTOMER", "Não foi possível criar o cliente.");
            }
        }

        const existingMeasures = await this.measureRepository.findMeasuresByCustomerCode(measureData.customer_code);

        if (MeasureUtils.hasDuplicateMeasurementInCurrentMonth(existingMeasures, measureDate, measureData.measure_type)) {
            return new ConflictResponse("DOUBLE_REPORT", "Já existe uma leitura para este tipo no mês atual");
        }
        const result = await run(imagebase64)

        const newMeasure = await this.measureRepository.createMeasure({
            customer_code: measureData.customer_code,
            measure_datetime: measureDate,
            measure_type: measureData.measure_type,
            image_url: result.imageUrl,
            has_confirmed: false
        });

        const responseBody = {
            image_url: newMeasure.image_url,
            measure_value: parseInt(result.text),
            measure_uuid: newMeasure.id.toString()
        };

        return new OkResponse("Operação realizada com sucesso", responseBody);

    }

    async getMeasure(measureId: string) {
        return this.measureRepository.findMeasureById(measureId)
    }

    async getMeasureByCustomer(customerCode: string, measureType?: string) {
        return this.measureRepository.findMeasuresByCustomerCode(customerCode, measureType)
    }



    async updateMeasure(measureUuid: string, confirmedValue: number) {

        const measure = await this.measureRepository.findMeasureById(measureUuid);

        if (!measure) {
            return new BadRequestResponse("MEASURE_NOT_FOUND", "Leitura não encontrada.");
        }

        if (measure.has_confirmed) {
            return new ConflictResponse("CONFIRMATION_DUPLICATE", "Leitura do mês já realizada.");
        }

        await this.measureRepository.updateMeasure(measure.id, { has_confirmed: true });

        return new OkResponse("Operação realizada com sucesso.", { success: true });
    }
}