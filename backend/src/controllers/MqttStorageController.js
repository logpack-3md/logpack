import Insumos from '../models/Insumos.js';
import InsumosLog from '../models/InsumosLog.js';
import z from 'zod';

class MqttStorageController {

    static updateStorageSchema = z.object({
        setorName: z.string({ required_error: "O nome do setor é obrigatório." }),
        current_storage: z.number({ required_error: "O valor do estoque é obrigatório." })
            .int("O valor deve ser um número inteiro.")
            .nonnegative("O valor não pode ser negativo.")
    });

    // GET: Buscar insumo pelo setorName
    static async getBySetor(req, res) {
        const { setorName } = req.params;

        try {
            const insumo = await Insumos.findOne({
                where: { setorName: setorName },
                attributes: ['id', 'name', 'SKU', 'setorName', 'current_storage', 'max_storage', 'current_weight_carga', 'status']
            });

            if (!insumo) {
                const now = new Date();
                return res.status(404).json({
                    message: "Erro: Insumo não encontrado para este setor.",
                    details: {
                        itemId: null,
                        setor: setorName,
                        data: now.toLocaleDateString('pt-BR'),
                        hora: now.toLocaleTimeString('pt-BR')
                    }
                });
            }

            return res.status(200).json(insumo);

        } catch (error) {
            console.error("Erro ao buscar insumo por setor: ", error);
            return res.status(500).json({ error: "Erro interno ao buscar insumo." });
        }
    }

    // PUT: Atualizar current_storage E CALCULAR current_weight_carga
    static async updateStorage(req, res) {
        const userId = req.user ? req.user.id : null;

        try {
            const { setorName, current_storage } = MqttStorageController.updateStorageSchema.parse(req.body);

            const insumo = await Insumos.findOne({
                where: { setorName: setorName }
            });

            if (!insumo) {
                const now = new Date();
                return res.status(404).json({
                    message: "Insumo não localizado via setorName.",
                    error_data: {
                        itemId: null,
                        setor: setorName,
                        data: now.toLocaleDateString('pt-BR'),
                        hora: now.toLocaleTimeString('pt-BR')
                    }
                });
            }

            const oldDataJson = insumo.toJSON();

            const maxStorage = insumo.max_storage || 0; 
            let calculatedPercentage = 0;

            if (maxStorage > 0) {
                calculatedPercentage = (current_storage / maxStorage) * 100;
            }

            insumo.current_storage = current_storage;
            insumo.current_weight_carga = parseFloat(calculatedPercentage.toFixed(2)); 
            await insumo.save(); 

            const newDataJson = insumo.toJSON();

            // if (userId) {
                await InsumosLog.create({
                    userId: null,
                    insumoId: insumo.id,
                    actionType: 'UPDATE',
                    contextDetails: `Atualização de estoque via rota Storage (Setor: ${setorName}). Carga calculada: ${calculatedPercentage.toFixed(2)}%`,
                    oldData: oldDataJson,
                    newData: newDataJson
                });
            // }

            return res.status(200).json({
                message: "Estoque e carga atualizados com sucesso.",
                data: {
                    id: insumo.id,
                    setor: insumo.setorName,
                    new_storage: insumo.current_storage,
                    max_storage_ref: maxStorage, 
                    new_weight_carga: insumo.current_weight_carga, 
                    updatedAt: insumo.updatedAt
                }
            });

        } catch (error) {
            if (error instanceof z.ZodError) {
                
                console.error("Erro de Validação (Zod):", JSON.stringify(error.issues, null, 2));

                return res.status(400).json({
                    message: "Dados de entrada inválidos.",
                    issues: error.issues
                });
            }

            console.error("Erro ao atualizar estoque via MqttStorageController: ", error);
            return res.status(500).json({ error: "Erro interno no servidor ao atualizar estoque." });
        }
    }

    static updateMaxStorageSchema = z.object({
        setorName: z.string({ required_error: "O nome do setor é obrigatório." }),
        max_storage: z.number({ required_error: "O valor do estoque máximo é obrigatório." })
            .int("O valor deve ser um número inteiro.")
            .nonnegative("O valor não pode ser negativo.")
    });

    static async updateMaxStorage(req, res) {
        const userId = req.user ? req.user.id : null;

        try {
            const { setorName, max_storage } = MqttStorageController.updateMaxStorageSchema.parse(req.body);

            const insumo = await Insumos.findOne({
                where: { setorName: setorName }
            });

            if (!insumo) {
                const now = new Date();
                return res.status(404).json({
                    message: "Insumo não localizado via setorName para alteração de máximo.",
                    error_data: {
                        itemId: null,
                        setor: setorName,
                        data: now.toLocaleDateString('pt-BR'),
                        hora: now.toLocaleTimeString('pt-BR')
                    }
                });
            }

            const oldDataJson = insumo.toJSON();

            insumo.max_storage = max_storage;


            
            if (max_storage > 0) {
                 const current = insumo.current_storage || 0;
                 insumo.current_weight_carga = parseFloat(((current / max_storage) * 100).toFixed(2));
            }
            

            await insumo.save();

            const newDataJson = insumo.toJSON();

            // if (userId) {
                await InsumosLog.create({
                    userId: null,
                    insumoId: insumo.id,
                    actionType: 'UPDATE',
                    contextDetails: `Atualização de estoque MÁXIMO via rota Storage (Setor: ${setorName}).`,
                    oldData: oldDataJson,
                    newData: newDataJson
                });
            // }

            return res.status(200).json({
                message: "Estoque máximo atualizado com sucesso.",
                data: {
                    id: insumo.id,
                    setor: insumo.setorName,
                    new_max_storage: insumo.max_storage,
                    updatedAt: insumo.updatedAt
                }
            });

        } catch (error) {
            if (error instanceof z.ZodError) {
                return res.status(400).json({
                    message: "Dados de entrada inválidos.",
                    issues: error.issues
                });
            }
            console.error("Erro ao atualizar estoque máximo via StorageController: ", error);
            return res.status(500).json({ error: "Erro interno no servidor ao atualizar estoque máximo." });
        }
    }
}

export default MqttStorageController;