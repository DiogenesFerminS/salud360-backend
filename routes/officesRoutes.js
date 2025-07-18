import { Router } from "express";
import { OfficesController } from "../controllers/OfficesController.js";
import { OfficesModel } from "../models/OfficesModel.js";
import { checkAuth } from "../middlewares/authMiddleware.js";
import { validationMiddleware } from "../middlewares/validationMiddleware.js";
import { addOfficeDto } from "../models/officeDto/addOfficeDto.js";

const router = Router();

const officesController = new OfficesController({OfficesModel});

router.get("/",checkAuth ,officesController.getAll);
router.post("/add-office", checkAuth, validationMiddleware(addOfficeDto, 'body'), officesController.addOffice);
router.delete("/:id", checkAuth, officesController.deleteOffice );

export default router;