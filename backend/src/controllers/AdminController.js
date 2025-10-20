import User from "../models/User.js"
import z from "zod"

class AdminController {
    static updateSchema = z.object({
        name: z.string().trim().min(2, { message: "O nome deve conter no mínimo dois caracteres." }),
        role: z.enum(['employee', 'admin', 'buyer', 'manager'], { message: "Escolha entre 'employee', 'admin', 'buyer' ou 'manager'." })
    }).partial();

    static async setStatusUser(req, res) {
        const { id } = req.params

        const statusSchema = z.object({
            status: z.enum(['ativo', 'inativo'], {
                message: "Status deve ser 'ativo' ou 'inativo'."
            })
        })

        try {
            const { status } = statusSchema.parse(req.body)

            const [rowsAffected] = await User.update({ status: status }, {
                where: { id: id }
            })

            if (rowsAffected === 0) {
                const userExists = await User.findByPk(id);
                if (!userExists) {
                    return res.status(404).json({ message: "Usuário não encontrado." })
                }
            }

            res.status(200).json({ message: `Status alterado para ${status}` })
        } catch (error) {
            if (error instanceof z.ZodError) {
                return res.status(400).json({
                    message: "O status deve ser 'ativo' ou 'inativo'.",
                    issues: error.issues
                })
            }

            res.status(500).json({ error: "Ocorreu um erro interno no servidor." })
            console.error("Erro ao atualizar status", error);
        }
    }

    static async getUsers(req, res) {

        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 10

        const offset = (page - 1) * limit

        try {
            const result = await User.findAndCountAll({
                limit: limit,
                offset: offset,
                order: [['name', 'ASC']],

                attributes: [
                    'id',
                    'name',
                    'email',
                    'role',
                    'status'
                ]
            })

            const users = result.rows;
            const totalItems = result.count
            const totalPages = Math.ceil(totalItems / limit)

            if (users.length === 0 && page > 1) {
                return res.status(404).json({ message: "Página não encontrada ou vazia" })
            }

            if (totalItems === 0) {
                return res.status(404).json({ message: "Nenhum usuário cadastrado" })
            }

            res.status(200).json({
                data: users,
                meta: {
                    totalItems: totalItems,
                    totalPages: totalPages,
                    currentPage: page,
                    itemsPerPage: limit
                }
            });

        } catch (error) {
            res.status(500).json({ error: "Erro ao listar usuários." })
            console.error("Erro ao listar usuários: ", error)
        }
    }

    static async getUser(req, res) {
        try {
            const { id } = req.params;

            const user = await User.findByPk(id, {
                attributes: [
                    'id',
                    'name',
                    'email',
                    'role',
                    'status'
                ]
            })
            if (!user) {
                return res.status(404).json({ message: "Usuário não encontrado." })
            };
            res.status(200).json(user)
        } catch (error) {
            res.status(500).json({ error: "Erro ao encontrar usuário." })
            console.error("Erro ao encontrar usuário: ", error)
        }
    }

    static async updateUser(req, res) {
        const { id } = req.params;

        try {
            const validatedUpdate = AdminController.updateSchema.parse(req.body)

            if (Object.keys(validatedUpdate).length === 0) {
                return res.status(200).json({ message: "Nenhum dado válido fornecido para atualização" })
            }

            const [rowsAffected] = await User.update(validatedUpdate, {
                where: { id: id }
            })

            if (rowsAffected === 0) {
                return res.status(404).json({ message: "Usuário não encontrado." })
            }

            return res.status(200).json({ message: "Usuário atualizado com sucesso." })
        } catch (error) {
            if (error instanceof z.ZodError) {
                return res.status(400).json({
                    message: "Dados de atualização inválidos",
                    issues: error.issues
                })
            }
            res.status(500).json({ error: "Ocorreu um erro interno no servidor." })
            console.error("Erro ao atualizar usuário", error);
        }
    }
}

export default AdminController;