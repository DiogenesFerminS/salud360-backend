import { Router } from "express";
import { UsersController } from "../controllers/usersController.js";
import { UsersModel } from "../models/UsersModel.js";
import { validationMiddleware } from "../middlewares/validationMiddleware.js";
import { registerDto } from "../models/usersDto/registerDto.js";
import { loginDto } from "../models/usersDto/loginDto.js";
import { checkAuth } from "../middlewares/authMiddleware.js";

const router = Router();

const usersController = new UsersController({UsersModel})

//PUBLIC ROUTES
router.post("/", validationMiddleware(registerDto, 'body'), usersController.register);

router.post("/login", validationMiddleware(loginDto, 'body'), usersController.login);

router.get("/confirm/:token", usersController.confirm);

router.post("/recover-password", usersController.recoverPassword);

router.get("/recover-password/:token", usersController.comprobarToken);

router.post("/recover-password/:token", usersController.newPassword);

//PRIVATE ROUTES
router.get("/profile", checkAuth, usersController.profile);

export default router