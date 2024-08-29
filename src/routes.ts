import { Request, Response, Router } from 'express';

import { MeasureController } from './controllers/measure-controller';
import { validateMeasureConfirmation } from './middlewares/validate-measure-confirmation';
import { validateCustomerMeasuresQuery } from './middlewares/validate-customer-measures-query';
import { validateMeasureCreation } from './middlewares/validate-measure-creation';
import CustomerRepository from './repositories/customer-repository';
import MeasureRepository from './repositories/measure-repository';
import { CustomerService } from './services/customer-service';
import MeasureService from './services/measure-service';

const customerRepository = new CustomerRepository()
const customService = new CustomerService(customerRepository)

const measureRepository = new MeasureRepository()
const measureService = new MeasureService(measureRepository, customService)
const measureController = new MeasureController(measureService)

export const router = Router()

router.post('/upload', validateMeasureCreation(), (req: Request, res: Response) => measureController.createMeasure(req, res));
router.patch("/confirm", validateMeasureConfirmation(), (req: Request, res: Response) => measureController.updateMeasure(req, res));
router.get("/:customer_code/list", validateCustomerMeasuresQuery(), (req: Request, res: Response) => measureController.getMeasuresByCustomer(req, res));
