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
        insumoSKU: z.string().min(1)
    })

    static async getPedidos(req, res) {

        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 10

        const statusFilter = req.query.status

        const offset = (page - 1) * limit

        let whereClause = {}

        if (statusFilter) {
            whereClause.status = statusFilter
        }

        try {
            const result = await Pedidos.findAndCountAll({
                where: whereClause,
                limit: limit,
                offset: offset,
                order: [['insumoSKU', 'ASC']],

                attributes: [
                    'id',
                    'userId',
                    'insumoSKU',
                    'status',
                    'createdAt'
                ]
            })

            const pedidos = result.rows;
            const totalItems = result.count
            const totalPages = Math.ceil(totalItems / limit)

            if (pedidos.length === 0 && page > 1) {
                return res.status(404).json({ message: "Página não encontrada ou vazia" })
            }

            if (totalItems === 0) {
                const msg = statusFilter
                    ? `Nenhum pedido com encontrado com o status: "${statusFilter}"`
                    : "Nenhum pedido solicitado."
                return res.status(404).json({ message: msg })
            }


            res.status(200).json({
                data: pedidos,
                meta: {
                    totalItems: totalItems,
                    totalPages: totalPages,
                    currentPage: page,
                    itemsPerPage: limit,
                    filterApplied: statusFilter || null
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
                    'status',
                    'createdAt'
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

        const statusFilter = req.query.status

        const offset = (page - 1) * limit

        let whereClause = {}

        if (statusFilter) {
            whereClause.status = statusFilter
        }

        try {
            const result = await Orcamento.findAndCountAll({
                where: whereClause,
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
                const msg = statusFilter
                    ? `Nenhum orçamento com encontrado com o status: "${statusFilter}"`
                    : "Nenhum orçamento disponível."
                return res.status(404).json({ message: msg })
            }

            res.status(200).json({
                data: orcamentos,
                meta: {
                    totalItems: totalItems,
                    totalPages: totalPages,
                    currentPage: page,
                    itemsPerPage: limit,
                    filterApplied: statusFilter || null
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

            const oldInsumo = await Insumos.findByPk(id)
            if (!oldInsumo) {
                return res.status(404).json({ message: "Insumo não encontrado." })
            }

            const oldDataJson = oldInsumo.toJSON()
            let updateFields = { status: status };
            let contextDetails = `Alteração de status do Insumo para ${status}.`;

            if (status === 'inativo' && oldInsumo.setorName) {
                updateFields.setorName = null;
                contextDetails = `Alteração de status do Insumo para ${status} e desvinculação do Setor ${oldInsumo.setorName}.`;
                console.log(`Insumo ${oldInsumo.name} será desativado e desvinculado do setor ${oldInsumo.setorName}.`);
            }

            const [rowsAffected] = await Insumos.update(
                updateFields,
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
                contextDetails: contextDetails,
                oldData: oldDataJson,
                newData: newDataJson
            })

            return res.status(200).json({ message: `Status de insumo alterado para ${status}.` })

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

            const oldSetor = await Setor.findByPk(id)
            if (!oldSetor) {
                return res.status(404).json({ message: "Setor não encontrado." })
            }
            const oldDataJson = oldSetor.toJSON()
            let logContextDetails = `Atualização de status do setor para ${status}.`;

            if (status === 'inativo') {
                const insumoVinculado = await Insumos.findOne({
                    where: { setorName: oldSetor.name }
                });

                if (insumoVinculado) {
                    const oldInsumoData = insumoVinculado.toJSON();

                    await Insumos.update(
                        { setorName: null },
                        { where: { id: insumoVinculado.id } }
                    );

                    const newInsumoData = { ...oldInsumoData, setorName: null };

                    await InsumosLog.create({
                        userId: gerenteId,
                        insumoId: insumoVinculado.id,
                        actionType: 'UPDATE',
                        contextDetails: `Desvinculação automática: Setor ${oldSetor.name} foi desativado.`,
                        oldData: oldInsumoData,
                        newData: newInsumoData
                    });

                    logContextDetails += ` O insumo ${insumoVinculado.name} foi desvinculado.`;
                    console.log(`Setor ${oldSetor.name} desativado e Insumo ${insumoVinculado.name} desvinculado.`);
                }
            }

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
                contextDetails: logContextDetails,
                oldData: oldDataJson,
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
    // Alterado por victor (a função tava forçando sempre o "aprovado", dificultando o sistema entender "negado")
    static async approvePedido(req, res) {
        try {
            const { id } = req.params;
            const managerId = req.user.id;

            const pedido = await Pedidos.findByPk(id);
            if (!pedido) return res.status(404).json({ error: 'Pedido não encontrado' });

            const oldStatus = pedido.status;
            const novoStatus = req.body.status === 'negado' ? 'negado' : 'aprovado';

            pedido.status = novoStatus;
            await pedido.save();

            await PedidosLog.create({
                userId: managerId,
                pedidoId: pedido.id,
                contextDetails: novoStatus === 'negado' ? 'Pedido negado pelo gerente' : 'Pedido aprovado pelo gerente',
                actionType: 'UPDATE',
                oldData: { status: oldStatus },
                newData: { status: novoStatus }
            });

            res.json({ message: 'Status atualizado com sucesso', pedido });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Erro interno' });
        }
    }

    static async createCompra(req, res) {
        const gerenteId = req.user.id
        const { pedidoId } = req.params

        try {
            const validatedSchema = ManagerController.createCompraSchema.parse(req.body)

            const pedido = await Pedidos.findByPk(pedidoId)

            if (!pedido) {
                return res.status(404).json({ message: "Pedido não encontrado para iniciar compra." })
            }

            const oldDataJson = await Pedidos.findByPk(pedidoId)

            const newCompraData = {
                ...validatedSchema,
                gerenteId: gerenteId,
                pedidoId: pedidoId,
                insumoSKU: pedido.insumoSKU
            }

            const compra = await Compra.create(newCompraData)

            await Pedidos.update(
                { status: "compra_iniciada" },
                { where: { id: pedidoId } }
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
            status: z.enum(['negado', 'aprovado', 'renegociacao'], {
                error: "Status inválido."
            }),
            description: z.string().optional()
        })

        try {
            const { status, description } = approveSchema.parse(req.body);

            const oldDataOrcamento = await Orcamento.findByPk(orcamentoId);
            if (!oldDataOrcamento) return res.status(404).json({ message: "Orçamento não encontrado" });

            const oldDataOrcamentoJson = oldDataOrcamento.toJSON();
            const compraId = oldDataOrcamento.compraId;

            const oldDataCompra = await Compra.findByPk(compraId);
            const oldDataCompraJson = oldDataCompra ? oldDataCompra.toJSON() : null;

            await Orcamento.update(
                { status: status },
                { where: { id: orcamentoId } }
            );

            switch (status) {
                case 'aprovado':
                    if (oldDataCompra.pedidoId) {
                        const oldPedido = await Pedidos.findByPk(oldDataCompra.pedidoId);

                        await Pedidos.update(
                            { status: 'compra_efetuada' },
                            { where: { id: oldDataCompra.pedidoId } }
                        );

                        const newPedido = await Pedidos.findByPk(oldDataCompra.pedidoId);

                        await PedidosLog.create({
                            userId: gerenteId,
                            pedidoId: oldDataCompra.pedidoId,
                            actionType: 'UPDATE',
                            contextDetails: "Compra efetuada/aprovada pelo gerente.",
                            oldData: oldPedido ? oldPedido.toJSON() : null,
                            newData: newPedido.toJSON()
                        });
                    }

                    await Compra.update({
                        data_de_decisao: new Date(),
                        status: 'concluido',
                        responsavel_pela_decisao_id: gerenteId
                    }, { where: { id: compraId } });
                    break;

                case 'negado':
                    if (oldDataCompra.pedidoId) {
                        const oldPedido = await Pedidos.findByPk(oldDataCompra.pedidoId);

                        await Pedidos.update(
                            { status: 'negado' },
                            { where: { id: oldDataCompra.pedidoId } }
                        );

                        const newPedido = await Pedidos.findByPk(oldDataCompra.pedidoId);

                        await PedidosLog.create({
                            userId: gerenteId,
                            pedidoId: oldDataCompra.pedidoId,
                            actionType: 'UPDATE',
                            contextDetails: "Compra negada pelo gerente.",
                            oldData: oldPedido ? oldPedido.toJSON() : null,
                            newData: newPedido.toJSON()
                        });
                    }

                    await Compra.update({
                        data_de_decisao: new Date(),
                        status: 'negado',
                        responsavel_pela_decisao_id: gerenteId
                    }, { where: { id: compraId } });
                    break;

                case 'renegociacao':

                    await Compra.update({
                        data_de_decisao: new Date(),
                        status: 'renegociacao_solicitada',
                        responsavel_pela_decisao_id: gerenteId
                    }, { where: { id: compraId } });

                    if (description) {
                        await Orcamento.update({
                            description: description,
                            status: 'renegociacao'
                        },
                            { where: { id: orcamentoId } }
                        );
                    }

                    const orcamentoRenegociado = await Orcamento.findByPk(orcamentoId);

                    await OrcamentoLog.create({
                        buyerId: oldDataOrcamento.buyerId,
                        orcamentoId: orcamentoId,
                        actionType: 'UPDATE',
                        contextDetails: description
                            ? "Solicitação de renegociação enviada pelo gerente com nova descrição."
                            : "Solicitação de renegociação enviada pelo gerente.",
                        oldData: oldDataOrcamentoJson,
                        newData: orcamentoRenegociado.toJSON()
                    });
                    break;
            }

            const orcamentoFinal = await Orcamento.findByPk(orcamentoId);
            const newDataCompra = await Compra.findByPk(compraId);

            await CompraLog.create({
                gerenteId: gerenteId,
                compraId: compraId,
                actionType: 'UPDATE',
                contextDetails: `Decisão de orçamento: ${status}`,
                oldData: oldDataCompraJson,
                newData: newDataCompra.toJSON()
            });

            return res.status(200).json({
                message: `Status atualizado para: ${status}`,
                orcamento: orcamentoFinal
            });

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