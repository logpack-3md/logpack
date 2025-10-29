import User from "../models/User.js ";
import validarCpf from "validar-cpf";
import z from "zod";


class UserController {

    static createSchema = z.object({
        name: z.string().trim().min(2, { error: "O nome deve conter no mínimo dois caracteres." }),
        cpf: z.string().refine(validarCpf, { error: "CPF inválido. Verifique o formato ou os dígitos verificadores." }),
        email: z.email({ error: "Digite um email válido." }),
        password: z.string().min(6, { error: "A senha deve conter no mínimo 6 caracteres." }),
        role: z.enum(['employee', 'admin', 'buyer', 'manager'], { error: "A função é obrigatória." })
    });

    static updateSchema = z.object({
        name: z.string().trim().min(2, { error: "O nome deve conter no mínimo dois caracteres." }),
        password: z.string().min(6, { error: "A senha deve conter no mínimo 6 caracteres." }),
        email: z.email({ error: "Digite um email válido." }),
    }).partial();

    static async createUser(req, res) {

        try {
            const validatedSchema = UserController.createSchema.parse(req.body);
            const user = await User.create(validatedSchema);

            return res.status(201).json(user);

        } catch (error) {
            if (error instanceof z.ZodError) {
                return res.status(400).json({
                    message: "Dados de entrada inválidos.",
                    issues: error.issues
                })
            }

            if (error.name === "SequelizeUniqueConstraintError") {
                const fields = Object.keys(error.fields)

                let message = "O registro já existe. "

                if (fields.includes('email')) {
                    message += "O Email já está cadastrado. "
                }

                if (fields.includes('cpf')) {
                    message += "O CPF já está cadastrado. "
                }

                return res.status(409).json({ message: message.trim(), fields: fields })
            }

            res.status(500).json({ error: "Ocorreu um erro interno no servidor." })
            console.error("Erro ao criar usuário", error);
        }
    }

    static async updateUser(req, res) {
        const { id } = req.params;

        try {
            const validatedUpdate = UserController.updateSchema.parse(req.body)
            if (Object.keys(validatedUpdate).length === 0) {
                return res.status(200).json({ message: "Nenhum dado válido fornecido para atualização." })
            }

            const [rowsAffected] = await User.update(validatedUpdate, {
                where: { id: id }
            })

            if (rowsAffected === 0) {
                const userExists = await User.findByPk(id);
                if (!userExists) {
                    return res.status(404).json({ message: "Usuário não encontrado." })
                }
            }

            res.status(200).json({ message: "Usuário atualizado com sucesso." })
        } catch (error) {
            if (error instanceof z.ZodError) {
                return res.status(400).json({
                    message: "Dados de atualização inválidos.",
                    issues: error.issues
                })
            }
            res.status(500).json({ error: "Ocorreu um erro interno no servidor." })
            console.error("Erro ao atualizar usuário", error);
        }
    }
}

export default UserController;