import express from "express";
import ContactController from "../controllers/ContactController.js";

const router = express.Router();

// Rota para enviar o e-mail
router.post('/send', ContactController.sendContactEmail);

export default router;