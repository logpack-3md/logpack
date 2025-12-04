import Insumos from '../models/Insumos.js';
import InsumosLog from '../models/InsumosLog.js';
import z from 'zod';

class MqttStorageController {

    static defaultPayloadSchema = z.object({
        id_dispositivo: z.string({ required_error: "O ID do dispositivo é obrigatório." }),
        valor: z.number({ required_error: "O valor numérico é obrigatório." })
            .nonnegative("O valor não pode ser negativo.")
    });

    static calculateProportions(insumo) {
        if (!insumo.max_cal_Value || insumo.max_cal_Value === 0) return;

        const currentValue = insumo.calc_Value || 0;
        let factor = currentValue / insumo.max_cal_Value;

        if (factor > 1) factor = 1; 

        if (insumo.max_storage) {
            insumo.current_storage = parseFloat((insumo.max_storage * factor).toFixed(2));
        }

        if (insumo.max_weight_carga) {
            insumo.current_weight_carga = parseFloat((insumo.max_weight_carga * factor).toFixed(2));
        }
    }

    // ============================================================
    // ROTA 1: ATUALIZAR LEITURA ATUAL
    // ============================================================
    static async updateCurrentValue(req, res) {
        try {
            const { id_dispositivo, valor } = MqttStorageController.defaultPayloadSchema.parse(req.body);

            const insumo = await Insumos.findOne({ where: { setorName: id_dispositivo } });

            if (!insumo) {
                return res.status(404).json({ message: `Dispositivo ${id_dispositivo} não encontrado.` });
            }

            // 1. CAPTURA O ESTADO ANTES DA MUDANÇA (Igual ao ManagerController)
            const oldDataJson = insumo.toJSON();

            // 2. REALIZA A MUDANÇA
            insumo.calc_Value = valor;
            MqttStorageController.calculateProportions(insumo);
            await insumo.save();

            // 3. CAPTURA O ESTADO NOVO (O objeto insumo já está atualizado após o save)
            const newDataJson = insumo.toJSON();

            // 4. CRIA O LOG SEGUINDO O PADRÃO
            await InsumosLog.create({
                userId: null, // É null pois vem do Bridge (automático)
                insumoId: insumo.id,
                actionType: 'UPDATE', // Padronizado como UPDATE
                contextDetails: `Atualização automática via Sensor (Nível). Leitura: ${valor}`,
                oldData: oldDataJson,
                newData: newDataJson
            });

            return res.status(200).json({
                message: "Leitura atualizada.",
                data: {
                    setor: insumo.setorName,
                    leitura_sensor: insumo.calc_Value,
                    novo_estoque: insumo.current_storage
                }
            });

        } catch (error) {
            if (error instanceof z.ZodError) return res.status(400).json({ issues: error.issues });
            console.error("Erro updateCurrentValue:", error);
            return res.status(500).json({ error: "Erro interno." });
        }
    }

    // ============================================================
    // ROTA 2: ATUALIZAR MÁXIMO
    // ============================================================
    static async updateMaxValue(req, res) {
        try {
            const { id_dispositivo, valor } = MqttStorageController.defaultPayloadSchema.parse(req.body);

            // Validação extra simples além do Zod
            if (valor === null || valor === undefined) {
                return res.status(400).json({ message: "Valor não pode ser nulo." });
            }

            const insumo = await Insumos.findOne({ where: { setorName: id_dispositivo } });

            if (!insumo) {
                return res.status(404).json({ message: `Dispositivo ${id_dispositivo} não encontrado.` });
            }

            // 1. CAPTURA O ESTADO ANTES
            const oldDataJson = insumo.toJSON();

            // 2. ATUALIZA
            insumo.max_cal_Value = valor;
            MqttStorageController.calculateProportions(insumo); // Recalcula pois a régua mudou
            await insumo.save();

            // 3. CAPTURA O ESTADO DEPOIS
            const newDataJson = insumo.toJSON();

            // 4. LOG
            await InsumosLog.create({
                userId: null,
                insumoId: insumo.id,
                actionType: 'UPDATE',
                contextDetails: `Configuração de Máximo do Sensor alterada para: ${valor}`,
                oldData: oldDataJson,
                newData: newDataJson
            });

            return res.status(200).json({
                message: "Configuração de Máximo atualizada.",
                data: {
                    setor: insumo.setorName,
                    novo_max_sensor: insumo.max_cal_Value
                }
            });

        } catch (error) {
            if (error instanceof z.ZodError) return res.status(400).json({ issues: error.issues });
            console.error("Erro updateMaxValue:", error);
            return res.status(500).json({ error: "Erro interno." });
        }
    }

    // ============================================================
    // ROTA 3: ATUALIZAR BATERIA
    // ============================================================
    static async updateBattery(req, res) {
        try {
            const { id_dispositivo, valor } = MqttStorageController.defaultPayloadSchema.parse(req.body);

            const insumo = await Insumos.findOne({ where: { setorName: id_dispositivo } });

            if (!insumo) {
                return res.status(404).json({ message: `Dispositivo ${id_dispositivo} não encontrado.` });
            }

            // 1. CAPTURA O ESTADO ANTES
            const oldDataJson = insumo.toJSON();

            // 2. ATUALIZA
            insumo.batery = valor; // Nota: mantive 'batery' conforme seu DB
            await insumo.save();

            // 3. CAPTURA O ESTADO DEPOIS
            const newDataJson = insumo.toJSON();

            // 4. LOG
            await InsumosLog.create({
                userId: null,
                insumoId: insumo.id,
                actionType: 'UPDATE',
                contextDetails: `Leitura de Tensão (Bateria): ${valor}V`,
                oldData: oldDataJson,
                newData: newDataJson
            });

            return res.status(200).json({
                message: "Nível de bateria atualizado.",
                data: {
                    setor: insumo.setorName,
                    nova_tensao: insumo.batery
                }
            });

        } catch (error) {
            if (error instanceof z.ZodError) return res.status(400).json({ issues: error.issues });
            console.error("Erro updateBattery:", error);
            return res.status(500).json({ error: "Erro interno." });
        }
    }

    // ============================================================
    // ROTA DE CONSULTA
    // ============================================================
    static async getBySetor(req, res) {
        const { setorName } = req.params;
        try {
            const insumo = await Insumos.findOne({ where: { setorName } });
            if (!insumo) return res.status(404).json({ message: "Não encontrado" });
            return res.status(200).json(insumo);
        } catch (error) {
            return res.status(500).json({ error: "Erro interno." });
        }
    }
}

export default MqttStorageController;