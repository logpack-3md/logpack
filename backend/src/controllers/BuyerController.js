import Compra from "../models/Compra.js";
import Orcamento from "../models/Orcamento.js";
import z from "zod";
import Pedidos from "../models/Pedidos.js";
import OrcamentoLog from "../models/OrcamentoLog.js";
import CompraLog from "../models/CompraLog.js";

class BuyerController {
    static createOrcamentoSchema = z.object({
        valor_total: z.number({ error: "O valor total deve ser um número.", })
            .min(0.01, { error: "O valor deve ser maior que zero." })
            .refine((value) => {
                const roundedValue = Math.round(value * 100) / 100;
                return value === roundedValue;
            }, { error: "O valor pode ter no máximo duas casas decimais.", })
    })

    static updateOrcamentoSchema = z.object({
        description: z.string().min(10, { error: "Adicione no mínimo 10 caracteres." }).nullable()
    })

    static renegociarSchema = z.object({
        valor_total: z.number({ error: "O valor total deve ser um número." })
            .min(0.01, { error: "O valor de deve ser maior que zero" })
            .refine((value) => {
                const roundedValue = Math.round(value * 100) / 100;
                return value === roundedValue;
            }, { error: "O valor pode ter no máximo duas casas decimais.", }).optional(),
    })

    static async getCompras(req, res) {

        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 10

        const offset = (page - 1) * limit

        try {
            const result = await Compra.findAndCountAll({
                limit: limit,
                offset: offset,
                order: [['amount', 'ASC']],

                attributes: [
                    'id',
                    'gerenteId',
                    'pedidoId',
                    'description',
                    'amount',
                    'status',
                ]
            })

            const compras = result.rows;
            const totalItems = result.count
            const totalPages = Math.ceil(totalItems / limit)

            if (compras.length === 0 && page > 1) {
                return res.status(404).json({ message: "Página não encontrada ou vazia" })
            }

            if (totalItems === 0) {
                return res.status(404).json({ message: "Nenhum usuário cadastrado" })
            }

            res.status(200).json({
                data: compras,
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

    static async createOrcamento(req, res) {
        const buyerId = req.user.id
        const { compraId } = req.params

        try {
            const validatedSchema = BuyerController.createOrcamentoSchema.parse(req.body)

            const oldDataJson = await Compra.findByPk(compraId)

            const newOrcamento = {
                ...validatedSchema,
                buyerId: buyerId,
                compraId: compraId
            }

            const orcamento = await Orcamento.create(newOrcamento)

            await Compra.update(
                { status: 'fase_de_orcamento' },
                { where: { id: compraId, status: 'pendente' } }
            )

            const newDataJson = await Compra.findByPk(compraId)

            await CompraLog.create({
                gerenteId: oldDataJson.gerenteId,
                compraId: compraId,
                actionType: "UPDATE",
                contextDetails: "Status alterado para fase_de_orcamento após efetuação de proposta de orçamento.",
                oldData: oldDataJson.toJSON(),
                newData: newDataJson.toJSON()
            })

            await OrcamentoLog.create({
                buyerId: buyerId,
                orcamentoId: orcamento.id,
                actionType: "INSERT",
                contextDetails: "Proposta de orçamento efetuada e enviada para gerente de produção.",
                oldData: null,
                newData: orcamento.toJSON()
            })

            return res.status(201).json({
                message: `Fase de orçamento iniciada. ID do gerente de compras responsavel pelo orçamento: ${buyerId}`,
                orcamento: orcamento
            })

        } catch (error) {
            if (error instanceof z.ZodError) {
                return res.status(400).json({
                    message: "Dados de entrada inválidos",
                    issues: error.issues
                })
            }
            console.error("Erro no servidor ao criar orçamento", error)
            return res.status(500).json({ error: "Erro interno no servidor ao criar orçamento." })
        }
    }

    static async updateOrcamento(req, res) {
        const { id } = req.params

        try {
                const validatedSchema = BuyerController.updateOrcamentoSchema.parse(req.body)

                const [rowsAffected] = await Orcamento.update(validatedSchema,
                    { where: { id: id } }
                )

                if (rowsAffected === 0) {
                    return res.status(404).json({ message: "Orçamento não encontrado" })
                }

                const orcamentoAtualizado = await Orcamento.findByPk(id);

                await Compra.update(
                    { status: 'fase_de_orçamento' },
                    { where: { id: orcamentoAtualizado.compraId } }
                )

                return res.status(200).json(
                    {
                        message: "Valor atualizado com sucesso.",
                        orcamento: orcamentoAtualizado
                    }
                )

        } catch (error) {
            if (error instanceof z.ZodError) {
                return res.status(400).json({
                    message: "Dados de entrada inválidos.",
                    issues: error.issues
                })
            }
            console.error("Erro ao atualizar a descrição do orçamento", error)
            return res.status(500).json({ error: "Ocorreu um erro interno no servidor ao atualizar orçamento" })
        }
    }

    static async renegociarOrcamento(req, res) {
        const { id } = req.params;

        try {
            const validatedSchema = BuyerController.renegociarSchema.parse(req.body);

            const [rowsAffected] = await Orcamento.update(validatedSchema, {
                where: { id: id }
            })

            if (rowsAffected === 0) {
                return res.status(404).json({ message: "Orçamento não encontrado." })
            }

            const orcamentoAtualizado = await Orcamento.findByPk(id)

            return res.status(200).json({
                message: `Renegociação efetuada. Novo valor: ${orcamentoAtualizado.valor_total}`,
                orcamento: orcamentoAtualizado
            })
        } catch (error) {

        }
    }

    static async cancelarOrcamento(req, res) {
        const { id } = req.params;

        try {
            const [rowsAffected] = await Orcamento.update(
                { status: 'cancelado' },
                { where: { id: id } }
            )

            if (rowsAffected === 0) {
                res.status(404).json({ message: "Orçamento não encontrado" })
            };

            const orcamentoCancelado = await Orcamento.findByPk(id)
            const compra = await Compra.findOne({
                where: { id: orcamentoCancelado.compraId }
            })

            await Compra.update(
                { status: 'cancelado' },
                { where: { id: orcamentoCancelado.compraId } }
            )

            await Pedidos.update(
                { status: 'solicitado' },
                { where: { id: compra.pedidoId } }
            )

            return res.status(200).json({
                message: "Orçamento cancelado com sucesso.",
                orcamento: orcamentoCancelado,
            })

        } catch (error) {
            console.error("Erro ao cancelar orçamento: ", error)
            return res.status(500).json({ error: "Ocorreu um erro interno no servidor ao cancelar orçamento" })
        }
    }
}

export default BuyerController;