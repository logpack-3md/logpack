import express from 'express'
import ManagerController from "../controllers/ManagerController.js";
import InsumosController from '../controllers/InsumoController.js';
import SetorController from "../controllers/SetorController.js";
import AuthMiddleware from "../middlewares/AuthMiddleware.js";
import { uploadSingleImage } from '../middlewares/upload.js';

const router = express.Router()

// criar insumo
router.post('/insumos', 
    AuthMiddleware.verifyToken,
    AuthMiddleware.isActiveUser,
    AuthMiddleware.isManager,
    uploadSingleImage,
    AuthMiddleware.isActiveSector,
    InsumosController.createItem
)

// editar insumo
router.put('/insumos/:id',
    AuthMiddleware.verifyToken,
    AuthMiddleware.isActiveUser,
    AuthMiddleware.isManager,
    uploadSingleImage,
    InsumosController.updateItem
)

// setar status de insumo (ativo/inativo) por id
router.put('/insumos/status/:id', 
    AuthMiddleware.verifyToken,
    AuthMiddleware.isActiveUser,
    AuthMiddleware.isManager,
    ManagerController.setStatusInsumo
)

// verificar insumo / não é updateAt por id
router.post('/insumos/verify/:id', 
    AuthMiddleware.verifyToken,
    AuthMiddleware.isActiveUser,
    AuthMiddleware.isManager,
    ManagerController.verifyInsumo
)

// setar tamanho do estoque desse insumo por id
router.put('/insumos/storage/:id', 
    AuthMiddleware.verifyToken,
    AuthMiddleware.isActiveUser,
    AuthMiddleware.isManager,
    ManagerController.setMaxStorage
)

// criar setor
router.post('/setor',
    AuthMiddleware.verifyToken,
    AuthMiddleware.isActiveUser,
    AuthMiddleware.isManager,
    SetorController.createSetor
)

// alterar nome de setor
router.put('/setor/name/:id',
    AuthMiddleware.verifyToken,
    AuthMiddleware.isActiveUser,
    AuthMiddleware.isManager,
    SetorController.updateSetor
)

// setiar status de setor (ativo/inativo) por ir
router.put('/setor/status/:id', 
    AuthMiddleware.verifyToken,
    AuthMiddleware.isActiveUser,
    AuthMiddleware.isManager,
    ManagerController.setStatusSetor
) 

// paginação de pedidos
router.get('/pedido', 
    AuthMiddleware.verifyToken,
    AuthMiddleware.isActiveUser,
    AuthMiddleware.canSeePedidos,
    ManagerController.getPedidos
)

// buscar um pedido
router.get('/pedido/:id', 
    AuthMiddleware.verifyToken,
    AuthMiddleware.isActiveUser,
    AuthMiddleware.canSeePedidos,
    ManagerController.getPedido
)

// paginação de orçamentos
router.get('/orcamentos', 
    AuthMiddleware.verifyToken,
    AuthMiddleware.isActiveUser,
    AuthMiddleware.isManager,
    ManagerController.getOrcamentos
)

// buscar um orçamento
router.get('/orcamentos/:orcamentoId', 
    AuthMiddleware.verifyToken,
    AuthMiddleware.isActiveUser,
    AuthMiddleware.isManager,
    ManagerController.getOrcamento
)

// aprovar pedido por id
router.put('/pedido/status/:id',
    AuthMiddleware.verifyToken,
    AuthMiddleware.isActiveUser,
    AuthMiddleware.isManager,
    ManagerController.approvePedido
)

// criar compra a partir de id de pedido
router.post('/compra/:pedidoId',
    AuthMiddleware.verifyToken,
    AuthMiddleware.isActiveUser,
    AuthMiddleware.isManager,
    AuthMiddleware.isRequestApproved,
    ManagerController.createCompra
)

// contestar orçamento ( aprovado / negado / renegociacao ) por id de orçamento
router.put('/orcamentos/contestar/:orcamentoId',
    AuthMiddleware.verifyToken,
    AuthMiddleware.isActiveUser,
    AuthMiddleware.isManager,
    AuthMiddleware.isBuyApproved,
    ManagerController.contestarOrcamento
)

export default router

