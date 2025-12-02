import express from 'express'
import LogController from '../controllers/LogController.js';

import AuthMiddleware from "../middlewares/AuthMiddleware.js";


const router = express.Router()

// paginação de logs gerais de insumos
router.get('/insumos/logs', 
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

// buscar um log específico (detalhe de uma ação) pelo ID do log PHL
router.get('/insumos/logs/:id', 
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

// Rota 1: Listagem geral de logs de usuários (Filtro por ação/paginação)
router.get('/users/logs', 
    AuthMiddleware.verifyToken,
    AuthMiddleware.isActiveUser,
    // AuthMiddleware.isManager, // Recomendado: Apenas gerentes/admins devem ver logs de user
    LogController.getUserLogs
)

// Rota 2: Detalhes de um log específico pelo ID do Log
router.get('/users/logs/:id', 
    AuthMiddleware.verifyToken,
    AuthMiddleware.isActiveUser,
    // AuthMiddleware.isManager, 
    LogController.getUserLogById
)

router.get('/setores/logs', 
    AuthMiddleware.verifyToken,
    AuthMiddleware.isActiveUser,
    // AuthMiddleware.isManager, // Descomente se for restrito a gerentes
    LogController.getSetorLogs
)

// Rota 2: Detalhes de um log específico pelo ID
router.get('/setores/logs/:id', 
    AuthMiddleware.verifyToken,
    AuthMiddleware.isActiveUser,
    // AuthMiddleware.isManager, 
    LogController.getSetorLogById
)
router.get('/pedidos/logs', 
    AuthMiddleware.verifyToken,
    AuthMiddleware.isActiveUser,
    // AuthMiddleware.isManager, // Opcional
    LogController.getPedidoLogs
)

// Rota 2: Detalhes de um log específico de pedido
router.get('/pedidos/logs/:id', 
    AuthMiddleware.verifyToken,
    AuthMiddleware.isActiveUser,
    // AuthMiddleware.isManager, 
    LogController.getPedidoLogById
)
router.get('/orcamentos/logs', 
    AuthMiddleware.verifyToken,
    AuthMiddleware.isActiveUser,
    // AuthMiddleware.isManager, // Opcional
    LogController.getOrcamentoLogs
)

// Rota 2: Detalhes de um log específico de orçamento
router.get('/orcamentos/logs/:id', 
    AuthMiddleware.verifyToken,
    AuthMiddleware.isActiveUser,
    // AuthMiddleware.isManager, 
    LogController.getOrcamentoLogById
)

router.get('/compras/logs', 
    AuthMiddleware.verifyToken,
    AuthMiddleware.isActiveUser,
    // AuthMiddleware.isManager, // Opcional
    LogController.getCompraLogs
)

// Rota 2: Detalhes de um log específico de compra
router.get('/compras/logs/:id', 
    AuthMiddleware.verifyToken,
    AuthMiddleware.isActiveUser,
    // AuthMiddleware.isManager, 
    LogController.getCompraLogById
)

export default router