import User from "../models/User.js"
import UserLog from "../models/UserLog.js";
import z from "zod"

class AdminController {
    static updateSchema = z.object({
        name: z.string().trim().min(2, { error: "O nome deve conter no mínimo dois caracteres." }),
        role: z.enum(['employee', 'admin', 'buyer', 'manager'], { error: "Escolha entre 'employee', 'admin', 'buyer' ou 'manager'." })
    }).partial();

    static async setStatusUser(req, res) {
        const { id } = req.params
        const userId = req.user.id

        const statusSchema = z.object({
            status: z.enum(['ativo', 'inativo'], {
                error: "Status deve ser 'ativo' ou 'inativo'."
            })
        })

        try {
            const { status } = statusSchema.parse(req.body)

            const oldDataJson = await User.findByPk(id)

            const [rowsAffected] = await User.update({ status: status }, {
                where: { id: id }
            })

            if (rowsAffected === 0) {
                const userExists = await User.findByPk(id);
                if (!userExists) {
                    return res.status(404).json({ message: "Usuário não encontrado." })
                }
            }

            const newDataJson = await User.findByPk(id)

            await UserLog.create({
                userId: userId,
                contextDetails: "Status de usuário alterado por admnistrador.",
                actionType: 'UPDATE',
                oldData: oldDataJson.toJSON(),
                newData: newDataJson.toJSON()
            })

            return res.status(200).json({ message: `Status alterado para ${status}` })
        } catch (error) {
            if (error instanceof z.ZodError) {
                return res.status(400).json({
                    message: "O status deve ser 'ativo' ou 'inativo'.",
                    issues: error.issues
                })
            }

            console.error("Erro ao atualizar status", error);
            return res.status(500).json({ error: "Ocorreu um erro interno no servidor." })
        }
    }

    static async getUsers(req, res) {

        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 10

        const statusFilter = req.query.status
        const roleFilter = req.query.role

        const offset = (page - 1) * limit

        let whereClause = {}

        if (statusFilter) {
            whereClause.status = statusFilter
        }

        if (roleFilter) {
            whereClause.role = roleFilter
        }

        try {
            const result = await User.findAndCountAll({
                where: whereClause,
                limit: limit,
                offset: offset,
                order: [['name', 'ASC']],

                attributes: [
                    'id',
                    'name',
                    'cpf',
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
                const msg = statusFilter
                    ? `Nenhum usuário com encontrado com o status: "${statusFilter}"`
                    : "Nenhum usuário encontrado."
                return res.status(404).json({ message: msg })
            }

            res.status(200).json({
                data: users,
                meta: {
                    totalItems: totalItems,
                    totalPages: totalPages,
                    currentPage: page,
                    itemsPerPage: limit,
                    filterApplied: statusFilter || null,
                    roleFilter: roleFilter || null
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
        const userId = req.user.id;

        try {
            const validatedUpdate = AdminController.updateSchema.parse(req.body)

            if (Object.keys(validatedUpdate).length === 0) {
                return res.status(200).json({ message: "Nenhum dado válido fornecido para atualização" })
            }

            const oldDataJson = await User.findByPk(id)

            const [rowsAffected] = await User.update(validatedUpdate, {
                where: { id: id }
            })

            if (rowsAffected === 0) {
                return res.status(404).json({ message: "Usuário não encontrado." })
            }

            const newDataJson = await User.findByPk(id)

            await UserLog.create({
                userId: userId,
                contextDetails: "Edição de usuário feita por administrador.",
                actionType: 'UPDATE',
                oldData: oldDataJson.toJSON(),
                newData: newDataJson.toJSON()
            })

            return res.status(200).json({ message: "Usuário atualizado com sucesso." })
        } catch (error) {
            if (error instanceof z.ZodError) {
                return res.status(400).json({
                    message: "Dados de atualização inválidos",
                    issues: error.issues
                })
            }
            console.error("Erro ao atualizar usuário", error);
            return res.status(500).json({ error: "Ocorreu um erro interno no servidor." })
        }
    }
}

export default AdminController;