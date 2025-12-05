import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

class AuthController {
    static gerarToken(payload) {
        if (!process.env.JWT_SECRET) {
            throw new Error('JWT_SECRET não definido no ambiente.')
        }

        return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5h' })
    }

    static async login(req, res) {
        const { email, password } = req.body;

        try {
            const user = await User.findOne({
                where: { email: email }
            })

            if (!user) {
                return res.status(404).json({ message: "Usuário não encontrado" })
            }

            const correctPassword = await bcrypt.compare(password, user.password)

            if (!correctPassword) {
                return res.status(401).json({ message: "Senha incorreta." })
            }

            const token = AuthController.gerarToken({ id: user.id, role: user.role, status: user.status });
            res.status(200).json({ message: "Login realizado com sucesso!", token, role: user.role })
            return;
        } catch (error) {
            console.error("Erro ao fazer login: ", error)
            res.status(500).json({ error: "Ocorreu um erro interno no servidor." })
        }
    }
}

export default AuthController;