import jwt from 'jsonwebtoken'
import Setor from '../models/Setor.js';
import Insumos from '../models/Insumos.js';
import Pedidos from '../models/Pedidos.js';
import Orcamento from '../models/Orcamento.js';
import Compra from '../models/Compra.js';
import { Op } from 'sequelize';

class AuthMiddleware {
    async verifyToken(req, res, next) {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({ message: 'Não autorizado: Token não fornecido.' })
        }

        const [, token] = authHeader.split(' ')

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            console.log('Token decodificado: ', decoded)
            req.user = decoded
            next()
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                return res.status(403).json({ message: "Não autorizado: Token expirado" })
            }
            res.status(403).json({ message: 'Não autorizado: Token inválido.' })
        }
    }

    async isActiveUser(req, res, next) {
        if (req.user.status === 'inativo' || req.user.status === 'pendente') {
            return res.status(403).json({ message: "Acesso proibido: Sua conta precisa ser ativada por algum administrador." })
        }
        next()
    }

    async isAdmin(req, res, next) {
        if (!req.user || req.user.role !== 'admin') {
            res.status(403).json({ message: "Acesso proibido: Esta ação requer permissão do administrador." })
        }
        next()
    }

    async canSeePedidos(req, res, next) {
        if (!req.user || (req.user.role !== 'manager' && req.user.role !== 'employee')) {
            res.status(403).json({ message: "Acesso proibido: Esta ação é exclusiva do gerente de produção." })
        }
        next()
    }

    async isManager(req, res, next) {
        if (!req.user || req.user.role !== 'manager') {
            res.status(403).json({ message: "Acesso proibido: Esta ação é exclusiva do gerente de produção." })
        }
        next()
    }

    async isBuyer(req, res, next) {
        if (!req.user || req.user.role !== 'buyer') {
            res.status(403).json({ message: "Acesso proibido: Esta ação é exclusiva do gerente de compras." })
        }
        next()

    }

    async isActiveSector(req, res, next) {
        const { setorName } = req.body
        try {
            const setor = await Setor.findOne({
                where: { name: setorName },
                attributes: ['status']
            })

            if (!setor) {
                return res.status(404).json({ message: `Setor ${setorName} não encontrado` })
            }

            if (setor.status !== 'ativo') {
                return res.status(403).json({ message: `Acesso proibido: O setor '${setorName}' está ${setor.status}.` });
            }

            next()
        } catch (error) {
            console.error("Erro no middleware isActiveSector:", error);
            return res.status(500).json({ message: "Erro interno do servidor ao verificar o setor." });
        }
    }

    async requestInsumo(req, res, next) {
        const { insumoSKU } = req.body


        try {
            const insumo = await Insumos.findOne({ where: { SKU: insumoSKU } })

            if (!insumo) {
                return res.status(404).json({ message: "Insumo não encontrado. " })
            }

            const status = insumo.get('status_solicitacao')

            if (status !== 'Solicitar Reposição') {
                return res.status(400).json({ 
                    message: "Estoque acima do limite de 35%", 
                    details: `Só é permitido solicitar quando o estoque estiver abaixo de 35%. Estoque atual: ${status}`  // V
                });
            } 
            

            req.insumo = insumo
            next()

        } catch (error) {
            console.error("Erro no middleware requestInsumo:", error)
            return res.status(500).json({ error: 'Erro interno no servidor ao verificar pedido de insumos.' })
        }
    }

    async alreadyRequested(req, res, next) {
        const { insumoSKU } = req.body

        if (!insumoSKU) {
            return res.status(400).json({ message: "O SKU do insumo é obrigatório para verificar pedidos duplicados." })
        }

        try {
            const existingRequest = await Pedidos.findOne({
                where: {
                    insumoSKU: insumoSKU,
                    status: {
                        [Op.in]: ['solicitado', 'aprovado', 'compra_iniciada']
                    }
                }
            })

            if (existingRequest) {
                return res.status(409).json({
                    message: `Pedido negado: Já existe uma solicitação aberta para o SKU ${insumoSKU}.`,
                    status: `Status atual do pedido: ${existingRequest.status}`
                });
            }

            if (req.insumo) {
                next()
            } else {
                const insumo = await Insumos.findOne({ where: { SKU: insumoSKU } });

                if (!insumo) {
                    return res.status(404).json({ message: "Insumo não encontrado." });
                }

                req.insumo = insumo;
                next();
            }
        } catch (error) {
            console.error("Erro no middleware alreadyRequested:", error)
            return res.status(500).json({ error: 'Erro interno no servidor ao verificar duplicidade de insumos.' })
        }
    }

    async isRequestApproved(req, res, next) {
        const { pedidoId } = req.params

        try {
            const pedido = await Pedidos.findOne({
                where: { id: pedidoId },
                attributes: ['status']
            })

            if (!pedido) {
                return res.status(404).json({ message: "Pedido não encontrado." })
            }

            if (pedido.status === 'solicitado' || pedido.status === 'rejeitado') {
                return res.status(403).json({ message: "Acesso negado: O pedido precisa ser aprovado por algum gerente de produção." })
            }

            next()
        } catch (error) {
            console.error("Erro no middleware isRequestApproved", error)
            return res.status(500).json({ message: "Erro interno no servidor ao verificar se o pedido foi aprovado." })
        }
    }

    async isBuyApproved(req, res, next) {
        const { orcamentoId } = req.params;

        try {

            const orcamento = await Orcamento.findByPk(orcamentoId, {
                attributes: ['compraId']
            });

            const compraId = orcamento.compraId;

            if (!compraId) {
                return res.status(400).json({ message: "O orçamento não está associado a nenhuma compra válida." });
            }

            const compra = await Compra.findOne({
                where: { id: compraId },
                attributes: ['status']
            });

            if (!compra) {
                return res.status(404).json({ message: "Compra associada não encontrada." });
            }

            if (compra.status == 'pendente') {
                return res.status(403).json({ message: "Acesso negado: A Compra ainda está pendente de orçamento." });
            }

            if (compra.status == 'concluído') {
                return res.status(403).json({ message: "Acesso negado: Essa Compra já foi aprovada e concluída." });
            }

            next();
        } catch (error) {
            console.error("Erro no middleware isBuyApproved", error);
            return res.status(500).json({ message: "Erro interno no servidor ao verificar o status da Compra." });
        }
    }

    async isOrcamentoCanceled(req, res, next) {
        const { id } = req.params;

        try {
            const orcamento = await Orcamento.findByPk(id, {
                attributes: ['status']
            })

            if (orcamento.status == "cancelado") {
                return res.status(403).json({ message: "Ação negada: este orçamento já foi cancelado." })
            }

            next()
        } catch (error) {
            console.error("Erro no middleware isOrcamentoCanceled", error)
            return res.status(500).json({ error: "Erro interno no servidor ao renegociar" })
        }
    }

    async renegociacaoRequested(req, res, next) {
        const { id } = req.params;

        try {
            const orcamento = await Orcamento.findByPk(id, {
                attributes: ['status']
            })

            if (orcamento.status !== "renegociação") {
                return res.status(403).json({ message: "Ação indevida: você só pode alterar o valor do orçamento se for aberto um pedido de renegociação." })
            }

            next()
        } catch (error) {
            console.error("Erro no middleware renegociacaoRequested", error)
            return res.status(500).json({ error: "Erro interno no servidor ao renegociar" })
        }
    }
}

export default new AuthMiddleware