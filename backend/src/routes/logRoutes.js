import express from 'express'
import LogController from '../controllers/LogController.js';
import AuthMiddleware from "../middlewares/AuthMiddleware.js";

const router = express.Router()

// paginação de logs gerais de insumos
router.get('/insumos', 
    AuthMiddleware.verifyToken,
    AuthMiddleware.isActiveUser,
    // AuthMiddleware.isManager,
    LogController.getInsumosLogs
)

// buscar histórico completo de um insumo específico por ID do insumo
router.get('/insumos/item/:insumoId', 
    AuthMiddleware.verifyToken,
    AuthMiddleware.isActiveUser,
    // AuthMiddleware.isManager,
    LogController.getLogsByInsumo
)

// buscar um log específico (detalhe de uma ação) pelo ID do log
router.get('/insumos/:id', 
    AuthMiddleware.verifyToken,
    AuthMiddleware.isActiveUser,
    // AuthMiddleware.isManager,
    LogController.getLogById
)
router.get('/insumos/chart/:insumoId', 
    AuthMiddleware.verifyToken,
    AuthMiddleware.isActiveUser,
    // AuthMiddleware.isManager,
    LogController.getStorageChartData
)

export default router