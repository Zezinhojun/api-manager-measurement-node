import { Router } from "express";
import { CustomerService } from "./services/customer-service";
import CustomerRepository from "./repositories/customer-repository";
import CustomerController from "./controllers/customer-controller";
import MeasureRepository from "./repositories/measure-repository";
import MeasureService from "./services/measure-service";
import { MeasureController } from "./controllers/measure-controller";

const customerRepository = new CustomerRepository()
const customService = new CustomerService(customerRepository)
const customerController = new CustomerController(customService)

const measureRepository = new MeasureRepository()
const measureService = new MeasureService(measureRepository, customService)
const measureController = new MeasureController(measureService)

export const router = Router()

router.post("/upload", (req, res) => measureController.createMeasure(req, res));
router.get("/:customerCode/list", (req, res) => customerController.getCustomerByCode(req, res));
