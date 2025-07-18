import { Router } from "express";
import { ScheduleController } from "../controllers/ScheduleController.js";
import { ScheduleModel } from "../models/ScheduleModel.js";
import { checkAuth } from "../middlewares/authMiddleware.js";
import { validationMiddleware } from "../middlewares/validationMiddleware.js";
import { schedule } from "../models/scheduleDto/addSchedule.js";

const router = Router();
const scheduleController = new ScheduleController({ScheduleModel})

router.get("/", checkAuth,scheduleController.getAll);
router.post("/", checkAuth, validationMiddleware(schedule, "body"), scheduleController.addAll);
export default router;