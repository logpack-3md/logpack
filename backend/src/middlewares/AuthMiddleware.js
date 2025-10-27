import jwt from 'jsonwebtoken'
import Setor from '../models/Setor.js';

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

    async isManager(req, res, next) {
        if (!req.user || req.user.role !== 'manager') {
            res.status(403).json({ message: "Acesso proibido: Esta ação é exclusiva do gerente." })
        }
        next()
    }

    async isActiveSector(req, res, next) {
        const setorName = req.body.setorName
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
        const storage = req.body.current_weight_carga
        try {
            if (storage > 35) {
                return res.status(403).json({ message: "Pedido negado: Os insumos so podem ser solicitados se estiverem abaixo de 35% do estoque total."})
            }
            next()
        } catch (error) {
            console.error("Erro no middleware requestInsumo", error)
            return res.status(500).json({ message: "Erro interno do servidor ao verificar pedido de insumos."})
        }
    }
}

export default new AuthMiddleware