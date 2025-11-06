import express from "express";
import AuthMiddleware from "../middlewares/AuthMiddleware.js";
import BuyerController from "../controllers/BuyerController.js";

const router = express.Router()

router.get('/compras',
    AuthMiddleware.verifyToken,
    AuthMiddleware.isActiveUser,
    AuthMiddleware.isBuyer,
    BuyerController.getCompras
)

router.post('/orcamento/:compraId',
    AuthMiddleware.verifyToken,
    AuthMiddleware.isActiveUser,
    AuthMiddleware.isBuyer,
    BuyerController.createOrcamento
)

router.put('/orcamento/:id',
    AuthMiddleware.verifyToken,
    AuthMiddleware.isActiveUser,
    AuthMiddleware.isBuyer,
    BuyerController.updateOrcamento
)

router.put('/orcamento/cancelar/:id',
    AuthMiddleware.verifyToken,
    AuthMiddleware.isActiveUser,
    AuthMiddleware.isBuyer,
    BuyerController.cancelarOrcamento
)

export default router