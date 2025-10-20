import express from 'express'
import ManagerController from "../controllers/ManagerController.js";
import AuthMiddleware from "../middlewares/AuthMiddleware.js";

const router = express.Router()

router.post('/', 
    AuthMiddleware.verifyToken,
    AuthMiddleware.isActive,
    AuthMiddleware.isManager,
    ManagerController.createItem
)

export default router

