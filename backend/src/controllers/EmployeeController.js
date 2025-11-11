// import z from "zod";
import Pedidos from "../models/Pedidos.js";
import PedidosLog from "../models/PedidosLog.js";

class EmployeeController {
    static async sendRequest(req, res) {
        const userId = req.user.id
        const insumo = req.insumo
        const insumoSKU = insumo.SKU

        try {
            const pedido = await Pedidos.create({
                insumoSKU: insumoSKU,
                userId: userId
            })

            await PedidosLog.create({
                userId: userId,
                pedidoId: pedido.id,
                actionType: 'INSERT',
                contextDetails: "Pedido de insumo criado.",
                oldData: null,
                newData: pedido.toJSON()
            })

            return res.status(201).json({
                message: `Solicitação do insumo com SKU '${insumoSKU}' aberta com sucesso.`,
                pedido: pedido
            })

        } catch (error) {
            console.error("Erro interno no servidor ao tentar criar pedido", error)
            return res.status(500).json({ error: "Ocorreu um erro interno no servidor." })
        }
    }
}

export default EmployeeController;