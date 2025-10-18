import User from "../models/User.js"
import z from "zod"

class AdminController {
    static async activeUser(req, res) {
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
}

export default AdminController;