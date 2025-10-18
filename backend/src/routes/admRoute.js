import express from "express";
import FirstAdminController from "../controllers/FirstAdminController.js";
import AdminController from "../controllers/AdminController.js";
import AuthMiddleware from "../middlewares/AuthMiddleware.js";

const router = express.Router()

router.post('/', FirstAdminController.createInitialAdmin)

router.patch('/status/:id', 
    AuthMiddleware.verifyToken,
    AuthMiddleware.isAdmin,
    AdminController.activeUser
)

export default router;