import express from "express";
import UserController from "../controllers/UserController.js";
import AuthController from "../controllers/AuthController.js";
import AuthMiddleware from "../middlewares/AuthMiddleware.js";

const router = express.Router()

// cadastro
router.post('/', UserController.createUser)

// atualizar seu perfil
router.put('/:id', 
    AuthMiddleware.verifyToken,
    AuthMiddleware.isActiveUser,
    UserController.updateUser
)

//login

router.post('/login', AuthController.login, (req, res) => {
    res.status(200).json({ message: 'Acesso permitido.' })
})

export default router;