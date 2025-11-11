import Compra from '../models/Compra.js'
import Insumos from '../models/Insumos.js'
import InsumosLog from '../models/InsumosLog.js'
import Orcamento from '../models/Orcamento.js'
import Pedidos from '../models/Pedidos.js'
import Setor from '../models/Setor.js'
import z from 'zod'
import SetorLog from '../models/SetorLog.js'
import PedidosLog from '../models/PedidosLog.js'
import CompraLog from '../models/CompraLog.js'
import OrcamentoLog from '../models/OrcamentoLog.js'

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
                return res.status(404).json({ message: "Nenhum pedido solicitado" })
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

    static async getPedido(req, res) {
        try {
            const { id } = req.params;

            const pedido = await Pedidos.findByPk(id, {
                attributes: [
                    'id',
                    'userId',
                    'insumoSKU',
                    'status'
                ]
            })

            if (!pedido) {
                return res.status(404).json({ message: "Pedido não encontrado." })
            };

            res.status(200).json(pedido)
        } catch (error) {
            console.error("Erro ao encontrar pedido: ", error)
            return res.status(500).json({ error: "Erro ao encontrar pedido." })
        }
    }

    static async getOrcamentos(req, res) {
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 10

        const offset = (page - 1) * limit

        try {
            const result = await Orcamento.findAndCountAll({
                limit: limit,
                offset: offset,
                order: [['createdAt', 'DESC']],

                attributes: [
                    'id',
                    'compraId',
                    'buyerId',
                    'description',
                    'amount',
                    'valor_total',
                    'status'
                ]
            })

            const orcamentos = result.rows;
            const totalItems = result.count
            const totalPages = Math.ceil(totalItems / limit)

            if (orcamentos.length === 0 && page > 1) {
                return res.status(404).json({ message: "Página não encontrada ou vazia" })
            }

            if (totalItems === 0) {
                return res.status(404).json({ message: "Nenhum orçamento encontrado" })
            }

            res.status(200).json({
                data: orcamentos,
                meta: {
                    totalItems: totalItems,
                    totalPages: totalPages,
                    currentPage: page,
                    itemsPerPage: limit
                }
            });

        } catch (error) {
            console.error("Erro ao listar orçamentos: ", error)
            res.status(500).json({ error: "Erro ao listar orçamentos." })
        }
    }

    static async getOrcamento(req, res) {
        try {
            const { orcamentoId } = req.params;

            const orcamento = await Orcamento.findByPk(orcamentoId, {
                attributes: [
                    'id',
                    'compraId',
                    'buyerId',
                    'description',
                    'amount',
                    'valor_total',
                    'status',
                    'createdAt'
                ]
            })

            if (!orcamento) {
                return res.status(404).json({ message: "Orçamento não encontrado." })
            };

            res.status(200).json(orcamento)
        } catch (error) {
            console.error("Erro ao encontrar orçamento: ", error)
            return res.status(500).json({ error: "Erro ao encontrar orçamento." })
        }
    }

    static async setStatusInsumo(req, res) {
        const { id } = req.params
        const userId = req.user.id

        const statusSchema = z.object({
            status: z.enum(['inativo', 'ativo'], {
                error: "O status deve ser 'ativo' ou 'inativo'."
            })
        })

        try {
            const { status } = statusSchema.parse(req.body)

            const oldDataJson = await Insumos.findByPk(id)

            const rowsAffected = await Insumos.update(
                { status: status },
                { where: { id: id } }
            )

            if (rowsAffected === 0) {
                return res.status(404).json({ message: "Insumo não encontrado." })
            }

            const newDataJson = await Insumos.findByPk(id)

            await InsumosLog.create({
                userId: userId,
                insumoId: id,
                actionType: 'UPDATE',
                contextDetails: "Alteração de status do Insumo",
                oldData: oldDataJson.toJSON(),
                newData: newDataJson.toJSON()

            })

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
        const userId = req.user.id

        try {
            const updateData = {
                last_check: new Date()
            }

            const oldDataJson = await Insumos.findByPk(id)

            const [rowsAffected] = await Insumos.update(updateData, {
                where: { id: id }
            })

            if (rowsAffected === 0) {
                return res.status(404).json({ message: "Insumo não encontrado" })
            }

            const verifiedInsumo = await Insumos.findByPk(id, {
                attributes: ['id', 'name', 'last_check']
            })

            const newDataJson = await Insumos.findByPk(id)

            await InsumosLog.create({
                userId: userId,
                insumoId: id,
                actionType: 'UPDATE',
                contextDetails: "Insumo verificado por algum gerente.",
                oldData: oldDataJson.toJSON(),
                newData: newDataJson.toJSON()
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
        const gerenteId = req.user.id;

        const statusSchema = z.object({
            status: z.enum(['inativo', 'ativo'], {
                error: "O status deve ser 'ativo' ou 'inativo'."
            })
        })

        try {
            const { status } = statusSchema.parse(req.body)

            const oldDataJson = await Setor.findByPk(id)

            const [rowsAffected] = await Setor.update(
                { status: status },
                { where: { id: id } }
            )

            if (rowsAffected === 0) {
                return res.status(404).json({ message: "Setor não encontrado." })
            }

            const newDataJson = await Setor.findByPk(id)

            await SetorLog.create({
                gerenteId: gerenteId,
                setorId: newDataJson.id,
                actionType: 'UPDATE',
                contextDetails: "Atualização de status do setor.",
                oldData: oldDataJson.toJSON(),
                newData: newDataJson.toJSON()
            })

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
        const userId = req.user.id
        const maxStorageSchema = z.object({
            max_storage: z.int()
                .min(200, { error: "Insira um valor acima de 200." })
                .refine(value => value % 200 === 0, { error: "O estoque máximo deve ser sempre um MÚLTIPLO de 200 (ex: 200, 400, 600, etc.)." })
        })

        try {
            const { max_storage } = maxStorageSchema.parse(req.body)

            const oldDataJson = await Insumos.findByPk(id)

            const [rowsAffected] = await Insumos.update(
                { max_storage: max_storage },
                { where: { id: id } }
            )

            if (rowsAffected === 0) {
                return res.status(404).json({ message: "Insumo não encontrado." })
            }

            const updatedInsumo = await Insumos.findByPk(id)
            const newDataJson = updatedInsumo.toJSON()

            await InsumosLog.create({
                userId: userId,
                insumoId: id,
                actionType: 'UPDATE',
                contextDetails: "Atualização de tamanho máximo do estoque.",
                oldData: oldDataJson.toJSON(),
                newData: newDataJson
            })

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
        const userId = req.user.id
        const approveSchema = z.object({
            status: z.enum(['rejeitado', 'aprovado'], { error: "O gerente só pode determinar se o pedido foi aprovado ou rejeitado." })
        })

        try {
            const { status } = approveSchema.parse(req.body)

            const oldDataJson = await Pedidos.findByPk(id)

            const [rowsAffected] = await Pedidos.update(
                { status: status },
                { where: { id: id } }
            )

            if (rowsAffected === 0) {
                return res.status(404).json({ message: "Pedido não encontrado." })
            };

            const newDataJson = await Pedidos.findByPk(id)

            await PedidosLog.create({
                userId: userId,
                pedidoId: newDataJson.id,
                actionType: 'UPDATE',
                contextDetails: "Status de pedido alterado por gerente de produção.",
                oldData: oldDataJson.toJSON(),
                newData: newDataJson.toJSON()
            })

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

            const oldDataJson = await Pedidos.findByPk(pedidoId)

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

            const newDataJson = await Pedidos.findByPk(pedidoId)

            await PedidosLog.create({
                userId: gerenteId,
                pedidoId: pedidoId,
                actionType: 'UPDATE',
                contextDetails: "Status de pedido alterado logo após gerente de compras aceitar pedido.",
                oldData: oldDataJson.toJSON(),
                newData: newDataJson.toJSON()
            })

            await CompraLog.create({
                gerenteId: gerenteId,
                compraId: compra.id,
                actionType: 'INSERT',
                contextDetails: "Criação de pedido de compra enviado para gerente de compras.",
                oldData: null,
                newData: compra.toJSON()
            })

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

            const oldDataOrcamento = await Orcamento.findByPk(orcamentoId)
            const oldDataOrcamentoJson = oldDataOrcamento ? oldDataOrcamento.toJSON() : null

            const compraId = oldDataOrcamento.compraId
            const oldDataCompra = await Compra.findByPk(compraId)
            const oldDataCompraJson = oldDataCompra ? oldDataCompra.toJSON() : null

            const pedidoId = oldDataCompra.pedidoId
            const oldDataPedido = await Pedidos.findByPk(pedidoId)
            const oldDataPedidoJson = oldDataPedido ? oldDataPedido.toJSON() : null

            if (!oldDataOrcamento) {
                return res.status(404).json({ message: "Orçamento não encontrado" })
            }

            const [rowsAffected] = await Orcamento.update(
                { status: status },
                { where: { id: orcamentoId } },
            )

            if (rowsAffected === 0 && oldDataOrcamento.status === status) {
                return res.status(200).json({ message: `Status de orçamento já era: ${status}` })
            }

            const orcamentoAtualizado = await Orcamento.findByPk(orcamentoId)
            const newDataOrcamentoJson = orcamentoAtualizado.toJSON()

            if (rowsAffected === 0) {
                return res.status(404).json({ message: 'Orçamento não encontrado.' })
            }


            const compraInfo = await Compra.findOne({
                where: { id: compraId },
                attributes: ['pedidoId', 'status', 'data_de_decisao', 'responsavel_pela_decisao_id']
            });

            switch (status) {
                case 'aprovado':
                    if (pedidoId) {

                        await Pedidos.update(
                            { status: 'compra_efetuada' },
                            { where: { id: pedidoId } }
                        );

                        const newDataPedido = await Pedidos.findByPk(pedidoId)

                        await PedidosLog.create({
                            userId: gerenteId,
                            pedidoId: pedidoId,
                            actionType: 'UPDATE',
                            contextDetails: "Compra feita por gerente de produção.",
                            oldData: oldDataPedidoJson,
                            newData: newDataPedido.toJSON()
                        })
                    }

                    await Compra.update(
                        {
                            data_de_decisao: new Date(),
                            status: 'concluído',
                            responsavel_pela_decisao_id: gerenteId
                        },
                        { where: { id: compraId } }
                    )

                    const newDataCompra = await Compra.findByPk(compraId)

                    await CompraLog.create({
                        gerenteId: gerenteId,
                        compraId: compraId,
                        actionType: 'UPDATE',
                        contextDetails: "Orçamento aceito por gerente de produção.",
                        oldData: oldDataCompraJson,
                        newData: newDataCompra.toJSON()
                    })

                    break;

                case 'negado':
                    if (!compraInfo || !compraInfo.pedidoId) {
                        console.warn(`Compra ${compraId} não tem Pedido associado.`);
                    } else {
                        const pedidoId = compraInfo.pedidoId;

                        await Pedidos.update(
                            { status: 'negado' },
                            { where: { id: pedidoId } }
                        );

                        const newDataPedido = await Pedidos.findByPk(pedidoId)

                        await PedidosLog.create({
                            userId: gerenteId,
                            pedidoId: pedidoId,
                            actionType: 'UPDATE',
                            contextDetails: "Compra negada por gerente de produção.",
                            oldData: oldDataPedidoJson,
                            newData: newDataPedido.toJSON()
                        })
                    }

                    await Compra.update(
                        {
                            data_de_decisao: new Date(),
                            status: 'negado',
                            responsavel_pela_decisao_id: gerenteId
                        },
                        { where: { id: compraId } }
                    )

                    await CompraLog.create({
                        gerenteId: gerenteId,
                        compraId: compraId,
                        actionType: 'UPDATE',
                        contextDetails: "Orçamento negado por gerente de produção.",
                        oldData: oldDataCompraJson,
                        newData: newDataCompra.toJSON()
                    })

                    break;

                case 'renegociacao':
                    await Compra.update({
                        data_de_decisao: new Date(),
                        status: 'renegociacao_solicitada',
                        responsavel_pela_decisao_id: gerenteId
                    },
                        { where: { id: compraId } }
                    )

                    await CompraLog.create({
                        gerenteId: gerenteId,
                        compraId: compraId,
                        actionType: 'UPDATE',
                        contextDetails: "Renegociação de orçamento solicitada por gerente de produção.",
                        oldData: oldDataCompraJson,
                        newData: newDataCompra.toJSON()
                    })

                    await Orcamento.update({
                        status: 'renegociacao'
                    },
                        { where: { id: orcamentoId } }
                    )

                    await OrcamentoLog.create({
                        buyerId: oldDataOrcamento.buyerId,
                        orcamentoId: orcamentoId,
                        actionType: 'UPDATE',
                        contextDetails: "Renegociação de orçamento solicitada por gerente de produção.",
                        oldData: oldDataOrcamentoJson,
                        newData: newDataOrcamentoJson
                    })

                    break;
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