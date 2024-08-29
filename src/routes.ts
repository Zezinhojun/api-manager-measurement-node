import { Request, Response, Router } from 'express';

import { MeasureController } from './controllers/measure-controller';
import { validateConfirmMeasure } from './middlewares/confirm-validate';
import { validateGetMeasuresByCustomer } from './middlewares/validate-get-measures-by-customer';
import { validateMeasureData } from './middlewares/validate-measure-data';
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

router.post('/upload', validateMeasureData(), (req: Request, res: Response) => measureController.createMeasure(req, res));
router.patch("/confirm", validateConfirmMeasure(), (req: Request, res: Response) => measureController.updateMeasure(req, res));
router.get("/:customer_code/list", validateGetMeasuresByCustomer(), (req: Request, res: Response) => measureController.getMeasuresByCustomer(req, res));
