import express from 'express'
import ManagerController from "../controllers/ManagerController.js";
import AuthMiddleware from "../middlewares/AuthMiddleware.js";
import { uploadSingleImage } from '../middlewares/upload.js';

const router = express.Router()

router.post('/', 
    AuthMiddleware.verifyToken,
    AuthMiddleware.isActiveUser,
    AuthMiddleware.isManager,
    uploadSingleImage,
    ManagerController.createItem
)

router.put('/:id',
    AuthMiddleware.verifyToken,
    AuthMiddleware.isActiveUser,
    AuthMiddleware.isManager,
    uploadSingleImage,
    ManagerController.updateItem
)

router.put('/status/:id', 
    AuthMiddleware.verifyToken,
    AuthMiddleware.isActiveUser,
    AuthMiddleware.isManager,
    ManagerController.setStatusInsumo
)

export default router

