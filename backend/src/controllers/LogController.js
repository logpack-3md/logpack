import InsumosLog from '../models/InsumosLog.js';
import UserLog from '../models/UserLog.js'
import SetorLog from '../models/SetorLog.js';
import PedidosLog from '../models/PedidosLog.js';
import OrcamentoLog from '../models/OrcamentoLog.js';
import CompraLog from '../models/CompraLog.js';

import { Op, Sequelize } from 'sequelize';
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
                    // 'oldData',
                    // 'newData',
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
/* // =========================================================================
    // FUNÇÃO 1 (COMENTADA): FILTRO POR DIAS ESPECÍFICOS (DIA 5 E 25)
    // =========================================================================
    // Esta função busca no histórico apenas os registros feitos nos dias 5 e 25
    // de qualquer mês. Útil para relatórios de fechamento quinzenal.
    
    static async getStorageChartData(req, res) {
        const { insumoId } = req.params;
        const limit = 6;

        try {
            const logs = await InsumosLog.findAll({
                where: { 
                    insumoId: insumoId,
                    // Lógica SQL: WHERE DAY(timestamps) IN (5, 25)
                    [Op.and]: [
                        Sequelize.where(Sequelize.fn('DAY', Sequelize.col('timestamps')), {
                            [Op.in]: [5, 25]
                        })
                    ]
                },
                limit: limit,
                order: [['timestamps', 'DESC']], 
                attributes: ['newData', 'timestamps']
            });

            if (!logs || logs.length === 0) {
                return res.status(200).json([]);
            }

            const chartData = logs.map(log => {
                let dataInfo = log.newData;
                if (typeof dataInfo === 'string') {
                    try { dataInfo = JSON.parse(dataInfo); } catch (e) { dataInfo = {}; }
                }

                const dateObj = new Date(log.timestamps);
                const day = String(dateObj.getDate()).padStart(2, '0');
                const month = String(dateObj.getMonth() + 1).padStart(2, '0');
                
                return {
                    label: `${day}/${month}`, // Apenas Data
                    value: dataInfo && dataInfo.current_storage !== undefined 
                           ? Number(dataInfo.current_storage) 
                           : 0
                };
            });

            // Inverte para cronológico (Mais antigo -> Mais novo)
            return res.status(200).json(chartData.reverse());

        } catch (error) {
            console.error(`Erro (Filtro 5/25): `, error);
            return res.status(500).json({ error: "Erro ao gerar gráfico quinzenal." });
        }
    }
    */


    // =========================================================================
    // FUNÇÃO 2 (ATIVA): ÚLTIMAS 6 MOVIMENTAÇÕES (SEM HORÁRIO)
    // =========================================================================
    static async getStorageChartData(req, res) {
        const { insumoId } = req.params;
        
        // Pega as últimas 6 alterações, independente de quando ocorreram
        const limit = 6; 

        try {
            const logs = await InsumosLog.findAll({
                where: { 
                    insumoId: insumoId,
                },
                limit: limit,
                order: [['timestamps', 'DESC']], // Do mais recente para o mais antigo
                attributes: ['newData', 'timestamps'] 
            });

            if (!logs || logs.length === 0) {
                return res.status(200).json([]);
            }

            const chartData = logs.map(log => {
                // Tratamento do JSON
                let dataInfo = log.newData;
                if (typeof dataInfo === 'string') {
                    try {
                        dataInfo = JSON.parse(dataInfo);
                    } catch (e) {
                        dataInfo = {};
                    }
                }

                // Formatação APENAS DA DATA (DD/MM)
                const dateObj = new Date(log.timestamps);
                const day = String(dateObj.getDate()).padStart(2, '0');
                const month = String(dateObj.getMonth() + 1).padStart(2, '0');
                
                // Mesmo que tenha vários no mesmo dia, o rótulo será igual
                // Ex: 01/12, 01/12, 01/12... mostrando a variação de valor
                const label = `${day}/${month}`;

                return {
                    label: label,
                    value: dataInfo && dataInfo.current_storage !== undefined 
                           ? Number(dataInfo.current_storage) 
                           : 0
                };
            });

            // Inverte o array para o gráfico desenhar da esquerda (passado) para a direita (presente)
            const chronologicalData = chartData.reverse();

            return res.status(200).json(chronologicalData);

        } catch (error) {
            console.error(`Erro ao buscar dados gráficos do insumo ${insumoId}: `, error);
            return res.status(500).json({ error: "Erro ao gerar dados do gráfico." });
        }
    }
    // 4. Buscar logs gerais de usuários com paginação e filtros simples (Ação/Detalhes)
    static async getUserLogs(req, res) {
        
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 10
        
        // Filtros recebidos via Query Params
        const actionFilter = req.query.action
        const userIdFilter = req.query.userId // Caso queira filtrar quem fez a ação

        const offset = (page - 1) * limit

        let whereClause = {}

        if (userIdFilter) {
            whereClause.userId = userIdFilter
        }

        if (actionFilter) {
            whereClause.actionType = actionFilter
        }

        try {
            const result = await UserLog.findAndCountAll({
                where: whereClause,
                limit: limit,
                offset: offset,
                order: [['timestamps', 'DESC']], 

                attributes: [
                    'id',
                    'userId', // ID de quem realizou a ação
                    'contextDetails',
                    'actionType',
                    // 'oldData',
                    // 'newData',
                    'timestamps'
                ]
            })

            const logs = result.rows
            const totalItems = result.count
            const totalPages = Math.ceil(totalItems / limit)

            if (logs.length === 0 && page > 1) {
                return res.status(404).json({ message: "Página não encontrada ou vazia" })
            }

            if (totalItems === 0) {
                return res.status(404).json({ message: "Nenhum registro de log de usuário encontrado." })
            }

            res.status(200).json({
                data: logs,
                meta: {
                    totalItems: totalItems,
                    totalPages: totalPages,
                    currentPage: page,
                    itemsPerPage: limit,
                    filterApplied: {
                        userId: userIdFilter || null,
                        action: actionFilter || null
                    }
                }
            });

        } catch (error) {
            console.error("Erro ao buscar logs de usuários: ", error)
            res.status(500).json({ error: "Erro interno ao buscar histórico de usuários." })
        }
    }

    // 5. Buscar um log específico de usuário pelo ID do Log (Detalhes completos)
    static async getUserLogById(req, res) {
        const { id } = req.params
        
        try {
            const logEntry = await UserLog.findByPk(id, {
                attributes: [
                    'id',
                    'userId',
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
            console.error("Erro ao buscar log único de usuário: ", error)
            res.status(500).json({ error: "Erro ao buscar detalhes do log." })
        }
    }
    static async getSetorLogs(req, res) {
        
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 10
        
        // Filtros recebidos via Query Params
        const actionFilter = req.query.action
        const gerenteIdFilter = req.query.gerenteId // ID do Gerente (quem fez)
        const setorIdFilter = req.query.setorId     // ID do Setor (alvo)

        const offset = (page - 1) * limit

        let whereClause = {}

        if (gerenteIdFilter) {
            whereClause.gerenteId = gerenteIdFilter
        }

        if (setorIdFilter) {
            whereClause.setorId = setorIdFilter
        }

        if (actionFilter) {
            whereClause.actionType = actionFilter
        }

        try {
            // Ajuste 'SetorLog' para o nome exato da sua importação do Model
            const result = await SetorLog.findAndCountAll({
                where: whereClause,
                limit: limit,
                offset: offset,
                order: [['timestamps', 'DESC']], 

                attributes: [
                    'id',
                    'gerenteId',      // Quem realizou a ação
                    'setorId',        // Qual setor foi afetado
                    'contextDetails',
                    'actionType',
                    // 'oldData',     // Ocultado na listagem para performance
                    // 'newData',     // Ocultado na listagem para performance
                    'timestamps'
                ]
            })

            const logs = result.rows
            const totalItems = result.count
            const totalPages = Math.ceil(totalItems / limit)

            if (logs.length === 0 && page > 1) {
                return res.status(404).json({ message: "Página não encontrada ou vazia" })
            }

            if (totalItems === 0) {
                return res.status(404).json({ message: "Nenhum registro de log de setor encontrado." })
            }

            res.status(200).json({
                data: logs,
                meta: {
                    totalItems: totalItems,
                    totalPages: totalPages,
                    currentPage: page,
                    itemsPerPage: limit,
                    filterApplied: {
                        gerenteId: gerenteIdFilter || null,
                        setorId: setorIdFilter || null,
                        action: actionFilter || null
                    }
                }
            });

        } catch (error) {
            console.error("Erro ao buscar logs de setores: ", error)
            res.status(500).json({ error: "Erro interno ao buscar histórico de setores." })
        }
    }

    // 2. Detalhes de um log específico pelo ID
    static async getSetorLogById(req, res) {
        const { id } = req.params
        
        try {
            const logEntry = await SetorLog.findByPk(id, {
                attributes: [
                    'id',
                    'gerenteId',
                    'setorId',
                    'contextDetails',
                    'actionType',
                    'oldData', // Dados completos (JSON)
                    'newData', // Dados completos (JSON)
                    'timestamps'
                ]
            })

            if (!logEntry) {
                return res.status(404).json({ message: "Registro de log não encontrado." })
            }

            return res.status(200).json(logEntry)

        } catch (error) {
            console.error("Erro ao buscar log único de setor: ", error)
            res.status(500).json({ error: "Erro ao buscar detalhes do log." })
        }
    }
        // 1. Listar logs de pedidos com paginação e filtros
    static async getPedidoLogs(req, res) {
        
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 10
        
        // Filtros recebidos via Query Params
        const actionFilter = req.query.action
        const userIdFilter = req.query.userId     // Filtrar quem fez a ação (Usuário)
        const pedidoIdFilter = req.query.pedidoId // Filtrar qual pedido sofreu a ação

        const offset = (page - 1) * limit

        let whereClause = {}

        // Filtro por Usuário (quem realizou a ação)
        if (userIdFilter) {
            whereClause.userId = userIdFilter
        }

        // Filtro por Pedido (alvo da ação)
        if (pedidoIdFilter) {
            whereClause.pedidoId = pedidoIdFilter
        }

        // Filtro por Tipo de Ação (INSERT, UPDATE, DELETE)
        if (actionFilter) {
            whereClause.actionType = actionFilter
        }

        try {
            // Ajuste 'PedidoLog' para o nome exato da sua importação do Model
            const result = await PedidosLog.findAndCountAll({
                where: whereClause,
                limit: limit,
                offset: offset,
                order: [['timestamps', 'DESC']], 

                attributes: [
                    'id',
                    'userId',         // ID de quem realizou a ação
                    'pedidoId',       // ID do pedido afetado
                    'contextDetails',
                    'actionType',
                    // 'oldData',     // Ocultado na listagem para performance
                    // 'newData',     // Ocultado na listagem para performance
                    'timestamps'
                ]
            })

            const logs = result.rows
            const totalItems = result.count
            const totalPages = Math.ceil(totalItems / limit)

            if (logs.length === 0 && page > 1) {
                return res.status(404).json({ message: "Página não encontrada ou vazia" })
            }

            if (totalItems === 0) {
                return res.status(404).json({ message: "Nenhum registro de log de pedido encontrado." })
            }

            res.status(200).json({
                data: logs,
                meta: {
                    totalItems: totalItems,
                    totalPages: totalPages,
                    currentPage: page,
                    itemsPerPage: limit,
                    filterApplied: {
                        userId: userIdFilter || null,
                        pedidoId: pedidoIdFilter || null,
                        action: actionFilter || null
                    }
                }
            });

        } catch (error) {
            console.error("Erro ao buscar logs de pedidos: ", error)
            res.status(500).json({ error: "Erro interno ao buscar histórico de pedidos." })
        }
    }

    // 2. Detalhes de um log específico pelo ID do Log
    static async getPedidoLogById(req, res) {
        const { id } = req.params
        
        try {
            const logEntry = await PedidosLog.findByPk(id, {
                attributes: [
                    'id',
                    'userId',
                    'pedidoId',
                    'contextDetails',
                    'actionType',
                    'oldData', // JSON completo
                    'newData', // JSON completo
                    'timestamps'
                ]
            })

            if (!logEntry) {
                return res.status(404).json({ message: "Registro de log de pedido não encontrado." })
            }

            return res.status(200).json(logEntry)

        } catch (error) {
            console.error("Erro ao buscar log único de pedido: ", error)
            res.status(500).json({ error: "Erro ao buscar detalhes do log do pedido." })
        }
    }
        static async getOrcamentoLogs(req, res) {
        
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 10
        
        // Filtros recebidos via Query Params
        const actionFilter = req.query.action
        const buyerIdFilter = req.query.buyerId       // Filtrar quem fez a proposta (Comprador/Buyer)
        const orcamentoIdFilter = req.query.orcamentoId // Filtrar qual orçamento sofreu a ação

        const offset = (page - 1) * limit

        let whereClause = {}

        // Filtro por Comprador (quem realizou a ação)
        if (buyerIdFilter) {
            whereClause.buyerId = buyerIdFilter
        }

        // Filtro por Orçamento (alvo da ação)
        if (orcamentoIdFilter) {
            whereClause.orcamentoId = orcamentoIdFilter
        }

        // Filtro por Tipo de Ação (INSERT, UPDATE, DELETE)
        if (actionFilter) {
            whereClause.actionType = actionFilter
        }

        try {
            // Ajuste 'OrcamentoLog' para o nome exato da sua importação do Model
            const result = await OrcamentoLog.findAndCountAll({
                where: whereClause,
                limit: limit,
                offset: offset,
                order: [['timestamps', 'DESC']], 

                attributes: [
                    'id',
                    'buyerId',        // ID de quem realizou a ação (Comprador)
                    'orcamentoId',    // ID do orçamento afetado
                    'contextDetails',
                    'actionType',
                    // 'oldData',     // Ocultado na listagem para performance
                    // 'newData',     // Ocultado na listagem para performance
                    'timestamps'
                ]
            })

            const logs = result.rows
            const totalItems = result.count
            const totalPages = Math.ceil(totalItems / limit)

            if (logs.length === 0 && page > 1) {
                return res.status(404).json({ message: "Página não encontrada ou vazia" })
            }

            if (totalItems === 0) {
                return res.status(404).json({ message: "Nenhum registro de log de orçamento encontrado." })
            }

            res.status(200).json({
                data: logs,
                meta: {
                    totalItems: totalItems,
                    totalPages: totalPages,
                    currentPage: page,
                    itemsPerPage: limit,
                    filterApplied: {
                        buyerId: buyerIdFilter || null,
                        orcamentoId: orcamentoIdFilter || null,
                        action: actionFilter || null
                    }
                }
            });

        } catch (error) {
            console.error("Erro ao buscar logs de orçamentos: ", error)
            res.status(500).json({ error: "Erro interno ao buscar histórico de orçamentos." })
        }
    }

    // 2. Detalhes de um log específico pelo ID do Log
    static async getOrcamentoLogById(req, res) {
        const { id } = req.params
        
        try {
            const logEntry = await OrcamentoLog.findByPk(id, {
                attributes: [
                    'id',
                    'buyerId',
                    'orcamentoId',
                    'contextDetails',
                    'actionType',
                    'oldData', // JSON completo
                    'newData', // JSON completo
                    'timestamps'
                ]
            })

            if (!logEntry) {
                return res.status(404).json({ message: "Registro de log de orçamento não encontrado." })
            }

            return res.status(200).json(logEntry)

        } catch (error) {
            console.error("Erro ao buscar log único de orçamento: ", error)
            res.status(500).json({ error: "Erro ao buscar detalhes do log do orçamento." })
        }
    }

    static async getCompraLogs(req, res) {
        
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 10
        
        // Filtros recebidos via Query Params
        const actionFilter = req.query.action
        const gerenteIdFilter = req.query.gerenteId // Filtrar quem fez a ação (Gerente)
        const compraIdFilter = req.query.compraId   // Filtrar qual compra sofreu a ação

        const offset = (page - 1) * limit

        let whereClause = {}

        // Filtro por Gerente (quem realizou a ação)
        if (gerenteIdFilter) {
            whereClause.gerenteId = gerenteIdFilter
        }

        // Filtro por Compra (alvo da ação)
        if (compraIdFilter) {
            whereClause.compraId = compraIdFilter
        }

        // Filtro por Tipo de Ação (INSERT, UPDATE, DELETE)
        if (actionFilter) {
            whereClause.actionType = actionFilter
        }

        try {
            // Ajuste 'CompraLog' para o nome exato da sua importação do Model
            const result = await CompraLog.findAndCountAll({
                where: whereClause,
                limit: limit,
                offset: offset,
                order: [['timestamps', 'DESC']], 

                attributes: [
                    'id',
                    'gerenteId',      // ID de quem realizou a ação
                    'compraId',       // ID da compra afetada
                    'contextDetails',
                    'actionType',
                    // 'oldData',     // Ocultado na listagem para performance
                    // 'newData',     // Ocultado na listagem para performance
                    'timestamps'
                ]
            })

            const logs = result.rows
            const totalItems = result.count
            const totalPages = Math.ceil(totalItems / limit)

            if (logs.length === 0 && page > 1) {
                return res.status(404).json({ message: "Página não encontrada ou vazia" })
            }

            if (totalItems === 0) {
                return res.status(404).json({ message: "Nenhum registro de log de compra encontrado." })
            }

            res.status(200).json({
                data: logs,
                meta: {
                    totalItems: totalItems,
                    totalPages: totalPages,
                    currentPage: page,
                    itemsPerPage: limit,
                    filterApplied: {
                        gerenteId: gerenteIdFilter || null,
                        compraId: compraIdFilter || null,
                        action: actionFilter || null
                    }
                }
            });

        } catch (error) {
            console.error("Erro ao buscar logs de compras: ", error)
            res.status(500).json({ error: "Erro interno ao buscar histórico de compras." })
        }
    }

        static async getCompraLogById(req, res) {
        const { id } = req.params
        
        try {
            const logEntry = await CompraLog.findByPk(id, {
                attributes: [
                    'id',
                    'gerenteId',
                    'compraId',
                    'contextDetails',
                    'actionType',
                    'oldData', // JSON completo
                    'newData', // JSON completo
                    'timestamps'
                ]
            })

            if (!logEntry) {
                return res.status(404).json({ message: "Registro de log de compra não encontrado." })
            }

            return res.status(200).json(logEntry)

        } catch (error) {
            console.error("Erro ao buscar log único de compra: ", error)
            res.status(500).json({ error: "Erro ao buscar detalhes do log da compra." })
        }
    }

}

export default LogController;