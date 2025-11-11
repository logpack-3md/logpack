import express from "express";
import SetorController from "../controllers/SetorController.js";
import AuthMiddleware from "../middlewares/AuthMiddleware.js";

const router = express.Router()

// paginação de setores
router.get('/', 
    AuthMiddleware.verifyToken,
    AuthMiddleware.isActiveUser,
    SetorController.getSectors
)

// buscar um setor
router.get('/:id', 
    AuthMiddleware.verifyToken,
    AuthMiddleware.isActiveUser,
    SetorController.getSector
)

export default router;