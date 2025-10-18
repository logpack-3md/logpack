import User from "../models/User.js";
import validarCpf from "validar-cpf";
import z from "zod";


class UserController {

    static createSchema = z.object({
        name: z.string().trim().min(2, { message: "O nome deve conter no mínimo dois caracteres." }),
        cpf: z.string().refine(validarCpf, { message: "CPF inválido. Verifique o formato ou os dígitos verificadores." }),
        email: z.email({ message: "Digite um email válido." }),
        password: z.string().min(6, { message: "A senha deve conter no mínimo 6 caracteres." }),
        role: z.string().min(1, { message: "A função é obrigatória." })
    });

    static updateSchema = z.object({
        name: z.string().trim().min(2, { message: "O nome deve conter no mínimo dois caracteres." }),
        password: z.string().min(6, { message: "A senha deve conter no mínimo 6 caracteres." }),
        email: z.email({ message: "Digite um email válido." }),
        // cpf: z.string().refine(validarCpf, { message: "CPF inválido. Verifique o formato ou os dígitos verificadores." }),
        // role: z.string().min(1, { message: "A função é obrigatória." })
    }).partial();

    static async getUsers(req, res) {
        try {
            const users = await User.findAll()

            if (users.length === 0) {
                return res.status(404).json({ message: "Nenhum usuário cadastrado." })
            }
            res.status(200).json(users);

        } catch (error) {
            res.status(500).json({ error: "Erro ao listar usuários." })
            console.error("Erro ao listar usuários: ", error)
        }
    }

    static async getUser(req, res) {
        try {
            const { id } = req.params;

            const user = await User.findByPk(id)
            if (!user) {
                return res.status(404).json({ message: "Usuário não encontrado." })
            };
            res.status(200).json(user)
        } catch (error) {
            res.status(500).json({ error: "Erro ao encontrar usuário." })
            console.error("Erro ao encontrar usuário: ", error)
        }
    }


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

            if (error.name === "SequlizeUniqueConstraintError") {
                return res.status(409).json({ message: "Este registro (CPF/Email) já está cadastrado." })
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

    static async deleteUser(req, res) {
        const { id } = req.params

        try {
            const rowsAffected = await User.destroy({
                where: { id: id }
            })

            if (rowsAffected === 0) {
                    return res.status(404).json({ message: "Usuário não encontrado." })
            }

            return res.status(200).json({ message: "Usuário excluído com sucesso." })

        } catch (error) {
            console.error("Erro ao excluir usuário: ", error)
            return res.status(500).json({ error: "Erro ao excluir usuário." })
        }
    }
}

export default UserController;