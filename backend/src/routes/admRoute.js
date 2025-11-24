import express from "express";
import FirstAdminController from "../controllers/FirstAdminController.js";
import AdminController from "../controllers/AdminController.js";
import AuthMiddleware from "../middlewares/AuthMiddleware.js";

const router = express.Router()

// função temporaria apenas para criar o primeiro admin 'ativo' (seed)
router.post('/', FirstAdminController.createInitialAdmin)

// paginação de usuarios
router.get('/', 
    AuthMiddleware.verifyToken,
    AuthMiddleware.isActiveUser,
    AuthMiddleware.isAdmin,
    AdminController.getUsers
)

// buscar usuario
router.get('/:id', 
    AuthMiddleware.verifyToken,
    AuthMiddleware.isActiveUser,
    // AuthMiddleware.isAdmin,
    AdminController.getUser
)

// editar nome ou cargo de usuario
router.put('/manage/:id', 
    AuthMiddleware.verifyToken,
    AuthMiddleware.isActiveUser,
    AuthMiddleware.isAdmin,
    AdminController.updateUser
)

// editar status de usuario
router.put('/status/:id', 
    AuthMiddleware.verifyToken,
    AuthMiddleware.isAdmin,
    AdminController.setStatusUser
)

export default router;