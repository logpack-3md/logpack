import express from "express";
import InsumosController from "../controllers/InsumoController.js";
import AuthMiddleware from "../middlewares/AuthMiddleware.js";

const router = express.Router()

router.get('/', 
    AuthMiddleware.verifyToken,
    AuthMiddleware.isActive,
    InsumosController.getItems
)

export default router;