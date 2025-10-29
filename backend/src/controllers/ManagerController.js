import Insumos from '../models/Insumos.js'
import Setor from '../models/Setor.js'
import z from 'zod'

class ManagerController {
    static async setStatusInsumo(req, res) {
        const { id } = req.params

        const statusSchema = z.object({
            status: z.enum(['inativo', 'ativo'], {
                error: "O status deve ser 'ativo' ou 'inativo'."
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

    static async verifyInsumo(req, res) {
        const { id } = req.params

        try {
            const updateData = {
                last_check: new Date()
            }

            const [rowsAffected] = await Insumos.update(updateData, {
                where: { id: id }
            })

            if (rowsAffected === 0) {
                return res.status(404).json({ message: "Insumo não encontrado" })
            }

            const verifiedInsumo = await Insumos.findByPk(id, {
                attributes: ['id', 'name', 'last_check']
            })

            return res.status(200).json({
                message: `Insumo verificado com sucesso.`,
                lastCheck: verifiedInsumo.last_check
            })
        } catch (error) {
            console.error("Erro ao verificar insumo: ", error)
            return res.status(500).json({ error: "Erro ao verificar insumo." })
        }
    }

    static async setStatusSetor(req, res) {
        const { id } = req.params

        const statusSchema = z.object({
            status: z.enum(['inativo', 'ativo'], {
                error: "O status deve ser 'ativo' ou 'inativo'."
            })
        })

        try {
            const { status } = statusSchema.parse(req.body)

            const [rowsAffected] = await Setor.update(
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

    static async setMaxStorage(req, res) {
        const { id } = req.params
        const maxStorageSchema = z.object({
            max_storage: z.int()
                .min(200, { error: "Insira um valor acima de 200." })
                .refine(value => value % 200 === 0, { error: "O estoque máximo deve ser sempre um MÚLTIPLO de 200 (ex: 200, 400, 600, etc.)." })
        })

        try {
            const { max_storage } = maxStorageSchema.parse(req.body)

            const [rowsAffected] = await Insumos.update(
                { max_storage: max_storage },
                { where: { id: id } }
            )

            if (rowsAffected === 0) {
                return res.status(404).json({ message: "Insumo não encontrado." })
            }

            return res.status(200).json({ message: `Estoque máximo atualizado para ${max_storage}` })

        } catch (error) {
            if (error instanceof z.ZodError) {
                return res.status(400).json({
                    message: "Dados de atualização inválidos",
                    issues: error.issues
                })
            }
            console.error("Erro ao alterar estoque máximo: ", error)
            return res.status(500).json({ error: "Erro ao alterar estoque máximo." })
        }
    }
}

export default ManagerController;