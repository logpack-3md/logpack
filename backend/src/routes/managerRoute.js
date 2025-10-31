import express from 'express'
import ManagerController from "../controllers/ManagerController.js";
import InsumosController from '../controllers/InsumoController.js';
import SetorController from "../controllers/SetorController.js";
import AuthMiddleware from "../middlewares/AuthMiddleware.js";
import { uploadSingleImage } from '../middlewares/upload.js';

const router = express.Router()

router.post('/insumos', 
    AuthMiddleware.verifyToken,
    AuthMiddleware.isActiveUser,
    AuthMiddleware.isManager,
    uploadSingleImage,
    AuthMiddleware.isActiveSector,
    InsumosController.createItem
)

router.put('/insumos/:id',
    AuthMiddleware.verifyToken,
    AuthMiddleware.isActiveUser,
    AuthMiddleware.isManager,
    uploadSingleImage,
    InsumosController.updateItem
)

router.put('/insumos/status/:id', 
    AuthMiddleware.verifyToken,
    AuthMiddleware.isActiveUser,
    AuthMiddleware.isManager,
    ManagerController.setStatusInsumo
)

router.post('/insumos/verify/:id', 
    AuthMiddleware.verifyToken,
    AuthMiddleware.isActiveUser,
    AuthMiddleware.isManager,
    ManagerController.verifyInsumo
)

router.put('/insumos/storage/:id', 
    AuthMiddleware.verifyToken,
    AuthMiddleware.isActiveUser,
    AuthMiddleware.isManager,
    ManagerController.setMaxStorage
)

router.post('/setor',
    AuthMiddleware.verifyToken,
    AuthMiddleware.isActiveUser,
    AuthMiddleware.isManager,
    SetorController.createSetor
)

router.put('/setor/status/:id', 
    AuthMiddleware.verifyToken,
    AuthMiddleware.isActiveUser,
    AuthMiddleware.isManager,
    ManagerController.setStatusSetor
) 

router.put('/pedido/status/:id',
    AuthMiddleware.verifyToken,
    AuthMiddleware.isActiveUser,
    AuthMiddleware.isManager,
    ManagerController.approvePedido
)

router.post('/compra/:pedidoId',
    AuthMiddleware.verifyToken,
    AuthMiddleware.isActiveUser,
    AuthMiddleware.isManager,
    AuthMiddleware.isApproved,
    ManagerController.createCompra
)

export default router

