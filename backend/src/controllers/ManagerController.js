import Insumos from '../models/Insumos.js'
import z from 'zod'
import { put } from '@vercel/blob'

class ManagerController {
    static createSchema = z.object({
        name: z.string().trim().min(2, { message: "O nome deve conter no mínimo dois caracteres." }),
        SKU: z.string().trim().min(3, { message: "O SKU deve conter no mínimo três caracteres." }),
        setor: z.string().trim().min(3, { message: "O setor deve conter no mínimo três caracteres." }),
        description: z.string().trim().min(10, { message: "Escreva uma breve explicação com pelo menos 10 caracteres." }),
        measure: z.enum(['KG', 'G', 'ML', 'L'], { message: "Escolha uma unidade de medida válida. ('KG', 'G', 'ML', 'L')" }),
        current_storage: z.number().int("O estoque atual deve ser um número inteiro.").min(0).optional(),
        max_level_carga: z.number().int("O nível máximo deve ser um número inteiro.").min(0).optional(),
        status: z.enum(['ativo', 'inativo'], { message: "O status deve ser 'ativo' ou 'inativo'." }).optional(),
    });

    static updateSchema = z.object({
        name: z.string().trim().min(2, { message: "O nome deve conter no mínimo dois caracteres." }),
        SKU: z.string().trim().min(3, { message: "O SKU deve conter no mínimo três caracteres." }),
        setor: z.string().trim().min(3, { message: "O setor deve conter no mínimo três caracteres." }),
        description: z.string().trim().min(10, { message: "Escreva uma breve explicação com pelo menos 10 caracteres." }),
        measure: z.enum(['KG', 'G', 'ML', 'L'], { message: "Escolha uma unidade de medida válida. ('KG', 'G', 'ML', 'L')" }),
        current_storage: z.number().int("O estoque atual deve ser um número inteiro.").min(0).optional(),
        max_level_carga: z.number().int("O nível máximo deve ser um número inteiro.").min(0).optional(),
        status: z.enum(['ativo', 'inativo'], { message: "O status deve ser 'ativo' ou 'inativo'." }).optional(),
    });

    static async createItem(req, res) {
        const file = req.file;
        let imageUrl = null;

        try {
            const validatedSchema = ManagerController.createSchema.parse(req.body)

            if (file) {
                const filename = `${validatedSchema.SKU}_${Date.now()}_${validatedSchema.name}`

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
                ...validatedSchema,
                image: imageUrl,
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
            console.error("Erro ao criar usuário", error);
        }
    }

    static async updateItem(req, res) {
        const { id } = req.params

        try {
            const validatedUpdate = ManagerController.updateSchema.parse(req.body)

            if (Object.keys(validatedUpdate).length === 0) {
                return res.status()
            }
        } catch (error) {
            
        }
    }
}

export default ManagerController;