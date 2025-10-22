import express from "express";
import UserController from "../controllers/UserController.js";
import AuthController from "../controllers/AuthController.js";
import AuthMiddleware from "../middlewares/AuthMiddleware.js";

const router = express.Router()

router.post('/', UserController.createUser)

router.put('/:id', 
    AuthMiddleware.verifyToken,
    AuthMiddleware.isActiveUser,
    UserController.updateUser
)

router.post('/login', AuthController.login, (req, res) => {
    res.status(200).json({ message: 'Acesso permitido.' })
})

export default router;