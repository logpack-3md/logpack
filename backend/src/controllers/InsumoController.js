import Insumos from '../models/Insumos.js'
import z from 'zod'
import { put, del } from '@vercel/blob'
import Setor from '../models/Setor.js';

class InsumosController {
    static createSchema = z.object({
        name: z.string().trim().min(2, { error: "O nome deve conter no mínimo dois caracteres." }),
        SKU: z.string().trim().min(3, { error: "O SKU deve conter no mínimo três caracteres." }),
        setorName: z.string().min(2, { error: "O nome do setor deve ser válido." }),
        description: z.string().trim().min(10, { error: "Escreva uma breve explicação com pelo menos 10 caracteres." }),
        measure: z.enum(['KG', 'G', 'ML', 'L'], { error: "Escolha uma unidade de medida válida. ('KG', 'G', 'ML', 'L')" }),
        current_storage: z.number().int({ error: "O estoque atual deve ser um número inteiro." }).min(0).optional(),
        max_weight_carga: z.number().int({ error: "O nível máximo deve ser um número inteiro." }).min(0).optional(),
        status: z.enum(['ativo', 'inativo'], { error: "O status deve ser 'ativo' ou 'inativo'." }).optional(),
    });

    static updateSchema = z.object({
        name: z.string().trim().min(2, { error: "O nome deve conter no mínimo dois caracteres." }).optional(),
        SKU: z.string().trim().min(3, { error: "O SKU deve conter no mínimo três caracteres." }).optional(),
        setorName: z.string().trim().min(3, { error: "O setor deve conter no mínimo três caracteres." }).optional(),
        description: z.string().trim().min(10, { error: "Escreva uma breve explicação com pelo menos 10 caracteres." }).optional(),
        measure: z.enum(['KG', 'G', 'ML', 'L'], { error: "Escolha uma unidade de medida válida. ('KG', 'G', 'ML', 'L')" }).optional(),
    });

    static async getItems(req, res) {
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 10

        const offset = (page - 1) * limit

        try {
            const result = await Insumos.findAndCountAll({
                limit: limit,
                offset: offset,
                order: [['name', 'ASC']],

                attributes: [
                    'id',
                    'name',
                    'sku',
                    'setorName',
                    'measure',
                    'image',
                    'description',
                    'current_storage',
                    'max_storage',
                    'current_weight_carga',
                    'max_weight_carga',
                    'status_solicitacao',
                    'status',
                    'last_check'
                ]
            })

            const insumos = result.rows
            const totalItems = result.count
            const totalPages = Math.ceil(totalItems / limit)

            res.status(200).json({
                data: insumos,
                meta: {
                    totalItems: totalItems,
                    totalPages: totalPages,
                    currentPage: page,
                    itemsPerPage: limit
                }
            });

            if (insumos.length === 0 && page > 1) {
                return res.status(404).json({ message: "Página não encontrada ou vazia" })
            }

            if (totalItems === 0) {
                return res.status(404).json({ message: "Nenhum insumo cadastrado" })
            }

        } catch (error) {
            res.status(500).json({ error: "Erro ao listar insumos." })
            console.error("Erro ao listar insumos: ", error)
        }
    }

    static async createItem(req, res) {
        const file = req.file;
        let imageUrl = null;

        try {
            const validatedSchema = InsumosController.createSchema.parse(req.body)
            const { SKU, setorName, ...insumoData } = validatedSchema;

            const setor = await Setor.findOne({
                where: { name: setorName },
                attributes: ['id']
            })

            const codigo = await Insumos.findOne({
                where: { SKU: SKU },
                attributes: ['id']
            })

            if (!setor) {
                return res.status(404).json({ message: `Setor '${setorName}' não encontrado.` })
            }

            if (codigo) {
                return res.status(409).json({ message: `Já existe um item com o SKU: '${SKU}'. Procure o item pelo SKU e adicione mais insumos.` })
            }

            if (file) {
                const filename = `${Date.now()}_${file.originalname}`

                const blob = await put(
                    filename,
                    file.buffer,
                    {
                        access: 'public',
                        contentType: file.mimetype,
                    }
                )

                imageUrl = blob.url
            }

            const insumo = await Insumos.create({
                ...insumoData,
                image: imageUrl,
                setorName: setorName,
                SKU: SKU
            })

            return res.status(201).json(insumo)

        } catch (error) {
            if (error instanceof z.ZodError) {
                return res.status(400).json({
                    message: "Dados de entrada inválidos.",
                    issues: error.issues
                })
            }

            res.status(500).json({ error: "Ocorreu um erro interno no servidor." })
            console.error("Erro ao criar insumo", error);
        }
    }

    static async updateItem(req, res) {
        const file = req.file;
        let imageUrl = null;
        const { id } = req.params

        try {
            const existingInsumo = await Insumos.findByPk(id);

            if (!existingInsumo) {
                return res.status(404).json({ message: "Insumo não encontrado." });
            }

            const insumoStatus = await Insumos.findOne({
                where: {
                    id: id,
                    status: 'ativo'
                },
                attributes: ['id']
            })

            const isActive = !!insumoStatus

            if (!isActive) {
                return res.status(403).json({ message: "Acesso negado: O insumo deve estar 'ativo' para poder atualizá-lo." })
            }

            const oldImageUrl = existingInsumo.image;

            const validatedUpdate = InsumosController.updateSchema.parse(req.body)

            let updateData = { ...validatedUpdate }


            if (file) {
                const filename = `${Date.now()}_${file.originalname}`

                const blob = await put(
                    filename,
                    file.buffer,
                    {
                        access: 'public',
                        contentType: file.mimetype,
                    }
                )

                imageUrl = blob.url
                updateData.image = imageUrl

                if (oldImageUrl) {
                    try {
                        await del(oldImageUrl);
                        console.log(`Imagem antiga excluída do Blob: ${oldImageUrl}`);
                    } catch (error) {
                        console.error(`Falha ao excluir imagem antiga do Blob (${oldImageUrl}):`, error);
                    }
                }
            }

            if (Object.keys(updateData).length === 0) {
                return res.status(200).json({ message: "Nenhum dado válido fornecido para atualização." })
            }

            const [rowsAffected] = await Insumos.update(updateData, {
                where: { id: id }
            })

            if (rowsAffected === 0) {
                return res.status(404).json({ message: "Insumo não encontrado." })
            }

            const updatedInsumo = await Insumos.findByPk(id);
            res.status(200).json({
                message: "Insumo atualizado com sucesso.",
                insumo: updatedInsumo
            });

        } catch (error) {
            if (error instanceof z.ZodError) {
                return res.status(400).json({
                    message: "Dados de atualização inválidos",
                    issues: error.issues
                })
            }
            res.status(500).json({ error: "Ocorreu um erro interno no servidor" })
            console.error("Erro ao atualizar insumo:", error)
        }
    }
}

export default InsumosController;