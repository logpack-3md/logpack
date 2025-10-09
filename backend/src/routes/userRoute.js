import express from "express";
import UserController from "../controllers/UserController.js";
import AuthController from "../controllers/AuthController.js";
const router = express.Router()

router.get('/', UserController.getUsers)
router.get('/:id', UserController.getUser)
router.post('/', UserController.createUser)

router.post('/login', AuthController.login, (req, res) => {
    res.status(200).json({ message: 'Acesso permitido.' })
})

export default router;