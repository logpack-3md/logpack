import z from "zod";
import Setor from "../models/Setor.js";

class SetorController {
    static createUpdateSchema = z.object({
        name: z.string().max(6, { message: "O nome do setor deve conter no máximo 6 caracteres." }),
        status: z.enum(['ativo', 'inativo'], { message: 'O setor só pode estar ativo ou inativo.' }).optional()
    });

    static async createSetor(req, res) {
        try {
            const validatedSchema = SetorController.createUpdateSchema.parse(req.body)
            const setor = await Setor.create(validatedSchema)

            return res.status(200).json(setor)
        } catch (error) {
            if(error instanceof z.ZodError) {
                return res.status(400).json({
                    message: "Dados de entrada inválidos",
                    issues: error.issues
                })
            }
            res.status(500).json({ error: "Ocorreu um erro interno no servidor." })
            console.error("Erro ao criar usuário", error);
        }
    }

    static async getSectors(req, res) {
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 10

        const offset = (page - 1) * limit

        try {
            const result = await Setor.findAndCountAll({
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

            res.status(200).json({
                data: setores,
                meta: {
                    totalItems: totalItems,
                    totalPages: totalPages,
                    currentPage: page,
                    itemsPerPage: limit
                }
            })

            if (setores.length === 0 && page > 1) {
                return res.status(404).json({ message: "Página não encontrada ou vazia"})
            }

            if (totalItems === 0) {
                return res.status(404).json({ message: "Nenhum setor cadastrado."})
            }
        } catch (error) {
            res.status(500).json({ error: "Erro ao listar setores." })
            console.error("Erro ao listar setores: ", error)
        }
    }
}

export default SetorController