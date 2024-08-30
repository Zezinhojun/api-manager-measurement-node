import { HttpResponse } from '../models/http-response-model';
import MeasureRepository from '../repositories/measure-repository';
import { BadRequestResponse } from '../utils/http-responses/bad-request-response';
import { ConflictResponse } from '../utils/http-responses/conflict-response';
import { NotFoundResponse } from '../utils/http-responses/not-found-response';
import { OkResponse } from '../utils/http-responses/ok-response';
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

    async registerMeasure(measureData: MeasureData): Promise<HttpResponse> {
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

        if (MeasureUtils.hasDuplicateForDate(existingMeasures, measureDate, measureData.measure_type)) {
            return new ConflictResponse("DOUBLE_REPORT", "Já existe uma leitura para este tipo no mês atual");
        }
        const result = await run(measureData.image)

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

    async fetchMeasureById(measureId: string) {
        return this.measureRepository.findMeasureById(measureId)
    }

    async fetchMeasuresByCustomer(customerCode: string, measureType?: MeasureType) {
        const customer = await this.customerService.getCustomerByCode(customerCode)

        if (!customer) {
            return new NotFoundResponse("MEASURE_NOT_FOUND", "Nenhuma leitura encontrada.");
        }

        const measures = await this.measureRepository.findAllMeasures(customerCode, measureType)

        if (!measures.length) {
            return new NotFoundResponse("MEASURES_NOT_FOUND", "Nenhuma leitura encontrada.");
        }
        const responseBody = {
            customer_code: customerCode,
            measures: measures.map(measure => ({
                measure_uuid: measure.id,
                measure_datetime: measure.measure_datetime,
                measure_type: measure.measure_type,
                has_confirmed: measure.has_confirmed,
                image_url: measure.image_url
            }))
        };

        return new OkResponse("Operação realizada com sucesso", responseBody);
    }

    async markMeasureAsConfirmed(measureUuid: string, confirmedValue: number) {
        const measure = await this.measureRepository.findMeasureById(measureUuid);
        if (!measure) {
            return new NotFoundResponse("MEASURE_NOT_FOUND", "Leitura não encontrada.");
        }
        if (measure.has_confirmed) {
            return new ConflictResponse("CONFIRMATION_DUPLICATE", "Leitura do mês já realizada.");
        }
        await this.measureRepository.markMeasureAsConfirmed(measure.id, { has_confirmed: true });

        return new OkResponse("Operação realizada com sucesso.", { success: true });
    }
}