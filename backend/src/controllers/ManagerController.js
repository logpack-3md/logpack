import Insumos from '../models/Insumos.js'
import Setor from '../models/Setor.js'
import z from 'zod'

class ManagerController {
    static async setStatusInsumo(req, res) {
        const { id } = req.params

        const statusSchema = z.object({
            status: z.enum(['inativo', 'ativo'], {
                message: "O status deve ser 'ativo' ou 'inativo'."
            })
        })

        try {
            const { status } = statusSchema.parse(req.body)

            const rowsAffected = await Insumos.update(
                { status: status },
                { where: { id: id } }
            )

            if (rowsAffected === 0) {
                return res.status(404).json({ message: "Insumo não encontrado." })
            }

            return res.status(200).json({ message: `Status de insumo alterado para ${status}` })

        } catch (error) {
            if (error instanceof z.ZodError) {
                return res.status(400).json({
                    message: "Dados de atualização inválidos",
                    issues: error.issues
                })
            }
            console.error("Erro ao alterar status: ", error)
            return res.status(500).json({ error: "Erro ao alterar status." })
        }
    }

    static async setStatusSetor(req, res) {
        const { id } = req.params

        const statusSchema = z.object({
            status: z.enum(['inativo', 'ativo'], {
                message: "O status deve ser 'ativo' ou 'inativo'."
            })
        })

        try {
            const { status } = statusSchema.parse(req.body)

            const rowsAffected = await Setor.update(
                { status: status },
                { where: { id: id } }
            )

            if (rowsAffected === 0) {
                return res.status(404).json({ message: "Setor não encontrado." })
            }

            return res.status(200).json({ message: `Status de setor alterado para ${status}` })

        } catch (error) {
            if (error instanceof z.ZodError) {
                return res.status(400).json({
                    message: "Dados de atualização inválidos",
                    issues: error.issues
                })
            }
            console.error("Erro ao alterar status: ", error)
            return res.status(500).json({ error: "Erro ao alterar status." })
        }
    }
}

export default ManagerController;