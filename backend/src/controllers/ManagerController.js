import Compra from '../models/Compra.js'
import Insumos from '../models/Insumos.js'
import Orcamento from '../models/Orcamento.js'
import Pedidos from '../models/Pedidos.js'
import Setor from '../models/Setor.js'
import z from 'zod'

class ManagerController {
    static createCompraSchema = z.object({
        description: z.string().min(10, { error: "Digite no mínimo 10 caracteres." }),
        amount: z.int().min(200, { error: "Insira um valor acima e múltiplo de 200." }).refine(value => value % 200 === 0, { error: "O valor deve ser MÚLTIPLO de 200. (ex.: 200, 400, 600, etc.)." }),
    })

    static async getPedidos(req, res) {

        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 10

        const offset = (page - 1) * limit

        try {
            const result = await Pedidos.findAndCountAll({
                limit: limit,
                offset: offset,
                order: [['insumoSKU', 'ASC']],

                attributes: [
                    'id',
                    'userId',
                    'insumoSKU',
                    'status',
                ]
            })

            const pedidos = result.rows;
            const totalItems = result.count
            const totalPages = Math.ceil(totalItems / limit)

            if (pedidos.length === 0 && page > 1) {
                return res.status(404).json({ message: "Página não encontrada ou vazia" })
            }

            if (totalItems === 0) {
                return res.status(404).json({ message: "Nenhum usuário cadastrado" })
            }

            res.status(200).json({
                data: pedidos,
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

    static async approvePedido(req, res) {
        const { id } = req.params
        const approveSchema = z.object({
            status: z.enum(['rejeitado', 'aprovado'], { error: "O gerente so pode determinar se o pedido foi aprovado ou rejeitado." })
        })

        try {
            const { status } = approveSchema.parse(req.body)

            const [rowsAffected] = await Pedidos.update(
                { status: status },
                { where: { id: id } }
            )

            if (rowsAffected === 0) {
                return res.status(404).json({ message: "Pedido não encontrado." })
            };

            return res.status(200).json({ message: `Status de pedido alterado para ${status}.` })
        } catch (error) {
            if (error instanceof z.ZodError) {
                return res.status(400).json({
                    message: "Dados de entrado inválidos",
                    issues: error.issues
                })
            }
            console.error("Erro ao determinar status de pedido", error);
            return res.status(500).json({ error: "Ocorreu um erro interno no servidor ao determinar status de pedido." })
        }
    }

    static async createCompra(req, res) {
        const gerenteId = req.user.id
        const { pedidoId } = req.params

        try {
            const validatedSchema = ManagerController.createCompraSchema.parse(req.body)

            const newCompraData = {
                ...validatedSchema,
                gerenteId: gerenteId,
                pedidoId: pedidoId
            }

            const compra = await Compra.create(newCompraData)

            await Pedidos.update(
                { status: "compra_iniciada" },
                { where: { id: pedidoId, status: 'aprovado' } }
            )

            return res.status(201).json({
                message: `Compra iniciada para o pedido de id: ${pedidoId}`,
                compra: compra
            })

        } catch (error) {
            if (error instanceof z.ZodError) {
                return res.status(400).json({
                    message: "Dados de entrada inválidos",
                    issues: error.issues
                })
            }
            res.status(500).json({ error: "Ocorreu um erro interno no servidor." })
            console.error("Erro ao criar compra", error);
        }
    }

    static async contestarOrcamento(req, res) {
        const gerenteId = req.user.id
        const { orcamentoId } = req.params;

        const approveSchema = z.object({
            status: z.enum(['negado', 'aprovado', 'renegociacao'],
                { error: "O gerente so pode determinar se o pedido foi aprovado, rejeitado ou deseja renegociação." })
        })

        try {
            const { status } = approveSchema.parse(req.body)

            const [rowsAffected] = await Orcamento.update(
                { status: status },
                { where: { id: orcamentoId } },
            )

            if (rowsAffected === 0) {
                return res.status(404).json({ message: 'Orçamento não encontrado.' })
            }

            const orcamentoAtualizado = await Orcamento.findByPk(orcamentoId)

            if (status === 'aprovado') {
                const compraId = orcamentoAtualizado.compraId

                await Compra.update(
                    {
                        approval_date: new Date(),
                        status: 'concluído',
                        who_approved_id: gerenteId
                    },
                    { where: { id: compraId } }

                )
            }

            return res.status(200).json({ message: `Status do orçamento alterado para: ${status}`, orcamento: orcamentoAtualizado })

        } catch (error) {
            if (error instanceof z.ZodError) {
                return res.status(400).json({
                    message: 'Dados de entrada inválidos',
                    issues: error.issues
                })
            }
            console.error("Erro interno no servidor ao contestar orçamento", error)
            res.status(500).json({ error: "Ocorreu um erro interno no servidor ao contestar o orçamento." })
        }

    }
}

export default ManagerController;