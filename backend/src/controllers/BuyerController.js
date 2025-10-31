import Compra from "../models/Compra.js";
import Orcamento from "../models/Orcamento.js";
import z from "zod";

class BuyerController {
    static createOrcamentoSchema = z.object({
        valor_total: z.number({ invalid_type_error: "O valor total deve ser um número.", })
            .min(0.01, { error: "O valor deve ser maior que zero." })
            .refine((value) => {
                const roundedValue = Math.round(value * 100) / 100;
                return value === roundedValue;
            }, { error: "O valor pode ter no máximo duas casas decimais.", })


    })

    static async createOrcamento(req, res) {
        const buyerId = req.user.id
        const { compraId } = req.params

        try {
            const validatedSchema = BuyerController.createOrcamentoSchema.parse(req.body)

            const newOrcamento = {
                ...validatedSchema,
                buyerId: buyerId,
                compraId: compraId
            }

            const orcamento = await Orcamento.create(newOrcamento)

            await Compra.update(
                { status: 'fase_de_orcamento' },
                { where: {id: compraId, status: ''}}
            )

            return res.status(201).json({
                message: `Fase de orçamento iniciada. ID do gerente de compras responsavel pelo orçamento: ${buyerId}`,
                orcamento: orcamento
            })

        } catch (error) {

        }

    }
}

export default BuyerController;