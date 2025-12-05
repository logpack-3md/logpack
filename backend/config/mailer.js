import nodemailer from 'nodemailer';
import 'dotenv/config';

// DEBUG: Mostra no console os valores lidos do .env
console.log("Email User from .env:", process.env.EMAIL_USER);
console.log("Email Pass from .env:", process.env.EMAIL_PASS);

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com", // Servidor SMTP do Gmail
  port: 465, // Porta para SSL
  secure: true, // `true` para a porta 465
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  
});

export default transporter;