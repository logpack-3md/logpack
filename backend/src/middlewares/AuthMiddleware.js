import jwt from 'jsonwebtoken'

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

    async isAdmin(req, res, next) {
        if (!req.user || req.user.role !== 'admin') {
            res.status(403).json({ message: "Acesso proibido: Esta ação requer permissão do administrador."})
        }
        next()
    }

    async isActive(req, res, next) {
        if (req.user.status === 'inativo' || req.user.status === 'pendente') {
            return res.status(403).json({ message: "Acesso proibido: Sua conta precisa ser ativada pelo administrador."})
        }
        next()
    }

}

export default new AuthMiddleware