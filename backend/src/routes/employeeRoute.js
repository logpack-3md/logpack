import express from "express";
import AuthMiddleware from "../middlewares/AuthMiddleware.js";
import EmployeeController from "../controllers/EmployeeController.js";

const router = express.Router()

// pedido de estoque/insumo
router.post('/request',
    AuthMiddleware.verifyToken,
    AuthMiddleware.isActiveUser,
    AuthMiddleware.requestInsumo,
    AuthMiddleware.alreadyRequested,
    EmployeeController.sendRequest
)

export default router;