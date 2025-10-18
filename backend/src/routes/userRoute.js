import express from "express";
import UserController from "../controllers/UserController.js";
import AuthController from "../controllers/AuthController.js";
import AuthMiddleware from "../middlewares/AuthMiddleware.js";

const router = express.Router()

router.get('/', UserController.getUsers)
router.get('/:id', UserController.getUser)
router.post('/', UserController.createUser)

router.put('/:id', 
    AuthMiddleware.verifyToken,
    AuthMiddleware.isActive,
    UserController.updateUser
)

router.delete('/:id', 
    AuthMiddleware.verifyToken,
    AuthMiddleware.isAdmin,
    AuthMiddleware.isActive,
    UserController.deleteUser
)

router.post('/login', AuthController.login, (req, res) => {
    res.status(200).json({ message: 'Acesso permitido.' })
})

export default router;