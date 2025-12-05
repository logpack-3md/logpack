import transporter from '../../config/mailer.js';
import z from 'zod';
import Suporte from '../models/Suporte.js';

class SuporteController {
  static suporteSchema = z.object({
    name: z.string({ required_error: "Nome obrigatório." }).min(2, "Nome muito curto."),
    email: z.string({ required_error: "Email obrigatório." }).email("Email inválido."),
    title: z.string({ required_error: "Título obrigatório." }).min(5, "Título muito curto."),
    phone: z.string().optional(),
    message: z.string({ required_error: "Mensagem obrigatória." }).min(10, "Mensagem muito curta (mín. 10)."),
  });

  static async sendSuporteEmail(req, res) {
    try {
      const { name, title, email, phone, message } = SuporteController.suporteSchema.parse(req.body);

      const mailOptions = {
        from: `"${name}" <${email}>`,
        to: process.env.EMAIL_USER,
        subject: `${title}`,
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <h2>Nova Mensagem do Formulário de Suporte</h2>
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
      await Suporte.create({
        name: name,
        title: title,
        email: email,
        phone: phone,
        message: message
      })

      return res.status(200).json({ message: "Mensagem enviada com sucesso!" });

    } catch (error) {
      if (error instanceof z.ZodError) {
         const messages = error.issues.map(i => i.message).join(". ");
         return res.status(400).json({ message: messages });
      }

      console.error("Erro ao enviar e-mail:", error);
      return res.status(500).json({ error: "Ocorreu um erro interno no servidor ao enviar o e-mail." });
    }
  }
}

export default SuporteController;