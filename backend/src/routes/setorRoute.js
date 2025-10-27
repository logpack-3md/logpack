import express from "express";
import SetorController from "../controllers/SetorController.js";
import AuthMiddleware from "../middlewares/AuthMiddleware.js";

const router = express.Router()

router.get('/', 
    AuthMiddleware.verifyToken,
    AuthMiddleware.isActiveUser,
    SetorController.getSectors
)

export default router;