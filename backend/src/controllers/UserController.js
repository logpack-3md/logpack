import User from "../models/User.js";

class UserController {

    static async getUsers(req, res) {
        try {
            const users = await User.findAll()
            res.status(200).json(users);

        } catch (error) {
            res.status(500).json({ error: "Erro ao listar usuários." })
            console.error("Erro ao listar usuários: ", error)
            return;
        }
    }

    static async getUser(req, res) {
        try {
            const { id } = req.params;

            const user = User.findByPk(id)
            if (!user) {
                return res.status(404).json({ message: "Usuário não encontrado." })
            };
            res.status(200).json(user)
        } catch (error) {
            res.status(500).json({error: "Erro ao encontrar usuário."})
            console.error("Erro ao encontrar usuário: ", error)
        }
    }

    static async createUser(req, res) {
        try {
            const { name, email, password, func } = req.body
            const user = await User.create({ name, email, password, func })

            const requiredFields = [
                {name: "Nome", value: name},
                {name: "Email", value: email},
                {name: "Senha", value: password},
                {name: "Função", value: func},
            ]

            const missingFields = requiredFields.find(field => !field.value)

            if (missingFields) {
                return res.status(400).json({message: `O campo ${missingFields.value} é obrigatório.`})
            }

            return res.status(201).json(user);

        } catch (error) {
            res.status(500).json({error: "Ocorreu um erro interno no servidor."})
            console.error("Erro ao criar usuário", error)
        }
    }
}

export default UserController;