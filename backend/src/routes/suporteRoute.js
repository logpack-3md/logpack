import express from "express";
import SuporteController from "../controllers/SuporteController.js";

const router = express.Router();

// Rota para enviar o e-mail
router.post('/send', SuporteController.sendContactEmail);

export default router;