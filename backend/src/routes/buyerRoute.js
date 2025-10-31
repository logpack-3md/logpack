import express from "express";
import AuthMiddleware from "../middlewares/AuthMiddleware.js";
import BuyerController from "../controllers/BuyerController.js";

const router = express.Router()

router.post('/orcamento/:compraId',
    AuthMiddleware.verifyToken,
    AuthMiddleware.isActiveUser,
    AuthMiddleware.isBuyer,
    BuyerController.createOrcamento
)

export default router