// import z from "zod";
import Pedidos from "../models/Pedidos.js";

class EmployeeController {
    static async sendRequest(req, res) {
        const insumo = req.insumo
        const insumoSKU = insumo.SKU

        try {
            const pedido = await Pedidos.create({
                insumoSKU: insumoSKU,
            })

            return res.status(201).json({
                message: `Solicitação do insumo com SKU '${insumoSKU}' aberta com sucesso.`,
                pedido: pedido
            })

        } catch (error) {
            console.error("Erro interno no servidor ao tentar criar pedido", error)
            return res.status(500).json({error: "Ocorreu um erro interno no servidor."})
        }
    }
}

export default EmployeeController;