import z from "zod";
import Setor from "../models/Setor.js";
import SetorLog from "../models/SetorLog.js";

class SetorController {
    static createUpdateSchema = z.object({
        name: z.string().max(6, { error: "O nome do setor deve conter no máximo 6 caracteres." }),
        status: z.enum(['ativo', 'inativo'], { error: 'O setor só pode estar ativo ou inativo.' }).optional()
    });

    static async createSetor(req, res) {
        const gerenteId = req.user.id;

        try {
            const validatedSchema = SetorController.createUpdateSchema.parse(req.body)
            const setor = await Setor.create(validatedSchema)

            await SetorLog.create({
                gerenteId: gerenteId,
                setorId: setor.id,
                actionType: 'INSERT',
                contextDetails: "Criação de novo setor.",
                oldData: null,
                newData: setor.toJSON()
            })

            return res.status(200).json(setor)
        } catch (error) {
            if (error instanceof z.ZodError) {
                return res.status(400).json({
                    message: "Dados de entrada inválidos",
                    issues: error.issues
                })
            }
            res.status(500).json({ error: "Ocorreu um erro interno no servidor." })
            console.error("Erro ao criar usuário", error);
        }
    }

    static async updateSetor(req, res) {
        const { id } = req.params;
        const gerenteId = req.user.id

        const nameSchema = z.object({
            name: z.string().max(6, { error: "O nome do setor deve conter no máximo 6 caracteres." }),
        })
        try {
            const { name } = nameSchema.parse(req.body)

            const oldDataJson = await Setor.findByPk(id)

            const [rowsAffected] = await Setor.update(
                { name: name },
                { where: { id: id } }
            )

            if (rowsAffected === 0) {
                res.status(404).json({ message: "Setor não encontrado." })
            }

            const updatedSetor = await Setor.findByPk(id)

            const newDataJson = updatedSetor.toJSON()

            await SetorLog.create({
                gerenteId: gerenteId,
                setorId: updatedSetor.id,
                actionType: 'UPDATE',
                contextDetails: "Atualização de nome do setor.",
                oldData: oldDataJson.toJSON(),
                newData: newDataJson
            })

            return res.status(200).json({ message: `Nome de setor alterado para: ${name}` })
        } catch (error) {
            if (error instanceof z.ZodError) {
                res.status(400).json({
                    message: "Dados de entrada inválidos",
                    issues: error.issues
                })
            }
            console.error("Erro interno no servidor ao atualizar setor: ", error)
            return res.status(500).json({ error: "Ocorreu um erro interno no servidor ao atualizar setor." })
        }
    }

    static async getSectors(req, res) {
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 10

        const statusFilter = req.query.status

        const offset = (page - 1) * limit

        let whereClause = {}

        if (statusFilter) {
            whereClause.status = statusFilter
        }

        try {
            const result = await Setor.findAndCountAll({
                where: whereClause,
                limit: limit,
                offset: offset,
                order: [['name', 'ASC']],

                attributes: [
                    'id',
                    'name',
                    'status'
                ]
            })

            const setores = result.rows
            const totalItems = result.count
            const totalPages = Math.ceil(totalItems / limit)


            if (setores.length === 0 && page > 1) {
                return res.status(404).json({ message: "Página não encontrada ou vazia" })
            }

            if (totalItems === 0) {
                const msg = statusFilter
                    ? `Nenhum setor com encontrado com o status: "${statusFilter}"`
                    : "Nenhum setor disponível."
                return res.status(404).json({ message: msg })
            }

            res.status(200).json({
                data: setores,
                meta: {
                    totalItems: totalItems,
                    totalPages: totalPages,
                    currentPage: page,
                    itemsPerPage: limit,
                    filterApplied: statusFilter || null
                }
            })
        } catch (error) {
            res.status(500).json({ error: "Erro ao listar setores." })
            console.error("Erro ao listar setores: ", error)
        }
    }

    static async getSector(req, res) {
        try {
            const { id } = req.params;

            const setor = await Setor.findByPk(id, {
                attributes: [
                    'id',
                    'name',
                    'status'
                ]
            })

            if (!setor) {
                return res.status(404).json({ message: "Setor não encontrado." })
            };

            res.status(200).json(setor)
        } catch (error) {
            console.error("Erro ao encontrar setor: ", error)
            return res.status(500).json({ error: "Erro ao encontrar setor." })
        }
    }
}

export default SetorController