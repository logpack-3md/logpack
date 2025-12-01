import InsumosLog from '../models/InsumosLog.js'

class LogController {

    // 1. Buscar logs gerais de insumos com paginação
    static async getInsumosLogs(req, res) {
        
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 10
        
        const insumoIdFilter = req.query.insumoId
        const actionFilter = req.query.action

        const offset = (page - 1) * limit

        let whereClause = {}

        if (insumoIdFilter) {
            whereClause.insumoId = insumoIdFilter
        }

        if (actionFilter) {
            whereClause.actionType = actionFilter
        }

        try {
            const result = await InsumosLog.findAndCountAll({
                where: whereClause,
                limit: limit,
                offset: offset,
                // Correção: Ordenando pelo campo 'timestamps'
                order: [['timestamps', 'DESC']], 

                attributes: [
                    'id',
                    'userId',
                    'insumoId',
                    'contextDetails',
                    'actionType',
                    'oldData',
                    'newData',
                    'timestamps' // Correção: Trazendo 'timestamps' em vez de createdAt
                ]
            })

            const logs = result.rows
            const totalItems = result.count
            const totalPages = Math.ceil(totalItems / limit)

            if (logs.length === 0 && page > 1) {
                return res.status(404).json({ message: "Página não encontrada ou vazia" })
            }

            if (totalItems === 0) {
                return res.status(404).json({ message: "Nenhum registro de log encontrado." })
            }

            res.status(200).json({
                data: logs,
                meta: {
                    totalItems: totalItems,
                    totalPages: totalPages,
                    currentPage: page,
                    itemsPerPage: limit,
                    filterApplied: {
                        insumoId: insumoIdFilter || null,
                        action: actionFilter || null
                    }
                }
            });

        } catch (error) {
            console.error("Erro ao buscar logs de insumos: ", error)
            res.status(500).json({ error: "Erro interno ao buscar histórico de logs." })
        }
    }

    // 2. Buscar histórico completo de um insumo específico por ID do insumo
    static async getLogsByInsumo(req, res) {
        const { insumoId } = req.params
        
        // Padrão 10 itens se não for especificado na query
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 6 
        const offset = (page - 1) * limit

        try {
            const result = await InsumosLog.findAndCountAll({
                where: { insumoId: insumoId },
                limit: limit,
                offset: offset,
                order: [['timestamps', 'DESC']], // Garante que pega os últimos

                attributes: [
                    'id',
                    'userId',
                    'insumoId',
                    'contextDetails',
                    'actionType',
                    'oldData',
                    'newData',
                    'timestamps'
                ]
            })

            const logs = result.rows
            const totalItems = result.count
            const totalPages = Math.ceil(totalItems / limit)

            // --- Lógica de Cálculo da Média ---
            let sumStorage = 0;
            let countValidValues = 0;

            logs.forEach(log => {
                // Garante que newData seja um objeto (caso o banco retorne string)
                let dataInfo = log.newData;
                if (typeof dataInfo === 'string') {
                    try {
                        dataInfo = JSON.parse(dataInfo);
                    } catch (e) {
                        dataInfo = {};
                    }
                }

                // Verifica se existe o campo 'current_storage' para somar
                // OBS: Se quiser média de outro campo (ex: preço), altere 'current_storage' aqui
                if (dataInfo && dataInfo.current_storage !== undefined && dataInfo.current_storage !== null) {
                    sumStorage += Number(dataInfo.current_storage);
                    countValidValues++;
                }
            });

            // Evita divisão por zero
            const averageStorage = countValidValues > 0 
                ? (sumStorage / countValidValues).toFixed(2) // Fixa em 2 casas decimais
                : 0;
            // ----------------------------------

            if (logs.length === 0 && page > 1) {
                return res.status(404).json({ message: "Página não encontrada ou vazia" })
            }

            if (totalItems === 0) {
                return res.status(404).json({ message: "Nenhum histórico encontrado para este insumo." })
            }

            res.status(200).json({
                data: logs,
                meta: {
                    totalItems: totalItems,
                    totalPages: totalPages,
                    currentPage: page,
                    itemsPerPage: limit,
                    targetInsumo: insumoId,
                    // Adicionamos a estatística aqui
                    statistics: {
                        average_current_storage: parseFloat(averageStorage),
                        samples_used: countValidValues
                    }
                }
            });

        } catch (error) {
            console.error(`Erro ao buscar logs do insumo ${insumoId}: `, error)
            res.status(500).json({ error: "Erro ao buscar histórico do insumo." })
        }
    }
    
    // 3. Buscar um log específico pelo ID do Log (para detalhes)
    static async getLogById(req, res) {
        const { id } = req.params
        
        try {
            const logEntry = await InsumosLog.findByPk(id, {
                attributes: [
                    'id',
                    'userId',
                    'insumoId',
                    'contextDetails',
                    'actionType',
                    'oldData',
                    'newData',
                    'timestamps'
                ]
            })

            if (!logEntry) {
                return res.status(404).json({ message: "Registro de log não encontrado." })
            }

            return res.status(200).json(logEntry)

        } catch (error) {
            console.error("Erro ao buscar log único: ", error)
            res.status(500).json({ error: "Erro ao buscar detalhes do log." })
        }
    }
    static async getStorageChartData(req, res) {
        const { insumoId } = req.params
        
        // Fixo em 6 valores como solicitado
        const limit = 6

        try {
            const logs = await InsumosLog.findAll({
                where: { insumoId: insumoId },
                limit: limit,
                // Ordena DESC para pegar os 6 MAIS RECENTES
                order: [['timestamps', 'DESC']], 
                
                // Otimização: Buscando apenas o necessário
                attributes: ['newData', 'timestamps'] 
            })

            if (logs.length === 0) {
                return res.status(200).json([]) // Retorna array vazio para não quebrar o gráfico
            }

            // Mapeia para o formato do gráfico
            const chartData = logs.map(log => {
                // 1. Formatar Data "DD/MM"
                const dateObj = new Date(log.timestamps);
                const day = String(dateObj.getDate()).padStart(2, '0');
                const month = String(dateObj.getMonth() + 1).padStart(2, '0'); // Mês começa em 0 no JS
                const dateLabel = `${day}/${month}`;

                // 2. Extrair current_storage
                let dataInfo = log.newData;
                // Tratamento de segurança caso venha como string
                if (typeof dataInfo === 'string') {
                    try { dataInfo = JSON.parse(dataInfo); } catch (e) { dataInfo = {}; }
                }

                return {
                    label: dateLabel, // Eixo X
                    value: dataInfo.current_storage ? Number(dataInfo.current_storage) : 0 // Eixo Y
                };
            });

            // Inverte o array para ficar em ordem cronológica (Esquerda -> Direita no gráfico)
            // O banco trouxe: [Hoje, Ontem, Anteontem...]
            // O gráfico quer: [Anteontem, Ontem, Hoje...]
            const chronologicalData = chartData.reverse();

            return res.status(200).json(chronologicalData);

        } catch (error) {
            console.error(`Erro ao buscar dados gráficos do insumo ${insumoId}: `, error)
            res.status(500).json({ error: "Erro ao gerar dados do gráfico." })
        }
    }
}

export default LogController;