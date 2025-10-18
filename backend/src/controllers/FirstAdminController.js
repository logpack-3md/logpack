import User from '../models/User.js';

class FirstAdminController {
    static async createInitialAdmin(req, res) {

        const name = 'Admin Mestre';
        const email = 'adm@email.com';
        const password = 'senha123';
        const role = 'admin'
        const status = 'ativo';
        const cpf = '89926873030'

        try {
            const existingAdmin = await User.findOne({ where: { role: 'admin' } });

            if (existingAdmin) {
                return res.status(403).json({
                    message: "O administrador inicial já foi criado. Rota desativada."
                });
            }

            const newAdmin = await User.create({
                name: name,
                email: email,
                password: password,
                role: role,
                status: status,
                cpf: cpf
            });

            return res.status(201).json({
                message: "Administrador inicial criado com sucesso!",
                user: {
                    id: newAdmin.id,
                    email: newAdmin.email
                }
            });

        } catch (error) {
            console.error("Erro ao criar admin via rota:", error);
            return res.status(500).json({ error: "Erro interno ao provisionar o admin." });
        }
    }
}

export default FirstAdminController;