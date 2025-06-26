import { Router } from "express";
import { QuotesController } from "../controllers/QuotesController.js";
import { QuotesModel } from "../models/QuotesModel.js";
import { validationMiddleware } from "../middlewares/validationMiddleware.js";
import { addQuoteDto } from "../models/quoteDto/addQuoteDto.js";
import { checkAuth } from "../middlewares/authMiddleware.js";
import { updateQuoteDTO } from "../models/quoteDto/updateQuoteDTO.js";

const quotesController = new QuotesController({QuotesModel});
const router = Router();

router.post("/",validationMiddleware(addQuoteDto, 'body'),checkAuth ,quotesController.addQuote);

router.get("/", checkAuth ,quotesController.getQuotes);

router.get("/:id", checkAuth , quotesController.getOneQuote);

router.put("/:id",validationMiddleware(updateQuoteDTO, 'body'), checkAuth, quotesController.updateQuote);

router.delete("/:id", checkAuth , quotesController.deleteQuote);

export default router;