import Insumos from "../models/Insumos.js";

class InsumosController {
      static async getItems(req, res) {
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 10

        const offset = (page - 1) * limit

        try {
            const result = await Insumos.findAndCountAll({
                limit: limit,
                offset: offset,
                order: [['name', 'ASC']],

                attributes: [
                    'id',
                    'name',
                    'sku',
                    'setorId',
                    'measure',
                    'image',
                    'description',
                    'current_storage',
                    'max_level_carga',
                    'status'
                ]
            })

            const insumos = result.rows
            const totalItems = result.count
            const totalPages = Math.ceil(totalItems / limit)

            res.status(200).json({
                data: insumos,
                meta: {
                    totalItems: totalItems,
                    totalPages: totalPages,
                    currentPage: page,
                    itemsPerPage: limit
                }
            });

            if (insumos.length === 0 && page > 1) {
                return res.status(404).json({ message: "Página não encontrada ou vazia" })
            }

            if (totalItems === 0) {
                return res.status(404).json({ message: "Nenhum insumo cadastrado" })
            }

        } catch (error) {
            res.status(500).json({ error: "Erro ao listar insumos." })
            console.error("Erro ao listar insumos: ", error)
        }
    }
}

export default InsumosController;