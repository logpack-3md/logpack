import transporter from '../../config/mailer.js'; 
import z from 'zod';
import Contato from '../models/Contato.js';

class ContactController {
  static contactSchema = z.object({
    name: z.string().trim().min(2, { error: "O nome é obrigatório." }),
    title: z.string().trim().min(5, { error: "Insira no mínimo 5 caracteres"}),
    email: z.string().email({ error: "Por favor, insira um e-mail válido." }),
    phone: z.string().optional(),
    message: z.string().min(10, { error: "A mensagem deve ter pelo menos 10 caracteres." }),
  });

  static async sendContactEmail(req, res) {
    try {
      const { name, title, email, phone, message } = ContactController.contactSchema.parse(req.body);

      const mailOptions = {
        from: `"${name}" <${email}>`, // Remetente (usuário que preencheu o form)
        to: process.env.EMAIL_USER, // Destinatário (seu e-mail)
        subject: `Nova Mensagem de Contato de ${name}`,
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <h2>Nova Mensagem do Formulário de Contato</h2>
            <p><strong>Motivo do Contato:</strong> ${title}</p>
            <p><strong>Nome:</strong> ${name}</p>
            <p><strong>E-mail:</strong> ${email}</p>
            ${phone ? `<p><strong>Telefone:</strong> ${phone}</p>` : ''}
            <hr>
            <h3>Mensagem:</h3>
            <p>${message}</p>
          </div>
        `,
      };

      await transporter.sendMail(mailOptions);
      await Contato.create({
        name: name,
        title: title,
        email: email,
        phone: phone,
        message: message
      })

      return res.status(200).json({ message: "Mensagem enviada com sucesso!" });

    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: "Dados inválidos.",
          issues: error.issues,
        });
      }

      console.error("Erro ao enviar e-mail:", error);
      return res.status(500).json({ error: "Ocorreu um erro interno no servidor ao enviar o e-mail." });
    }
  }
}

export default ContactController;