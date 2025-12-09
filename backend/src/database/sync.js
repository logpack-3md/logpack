import sequelize from "./sequelize.js";
import User from '../models/User.js';
import UserLog from "../models/UserLog.js";
import Insumos from '../models/Insumos.js';
import InsumosLog from "../models/InsumosLog.js";
import Setor from "../models/Setor.js";
import SetorLog from "../models/SetorLog.js";
import Pedidos from "../models/Pedidos.js";
import PedidosLog from "../models/PedidosLog.js";
import Compra from "../models/Compra.js";
import CompraLog from "../models/CompraLog.js";
import Orcamento from "../models/Orcamento.js";
import OrcamentoLog from "../models/OrcamentoLog.js";
import Contato from "../models/Contato.js";
import Suporte from "../models/Suporte.js";

Setor.hasOne(Insumos, {
    foreignKey: 'setorName', 
    sourceKey: 'name',       
    as: 'insumos'
});
Insumos.belongsTo(Setor, {
    foreignKey: 'setorName',
    targetKey: 'name',
    as: 'setorDetalhes'
});
// -- //
User.hasMany(Pedidos, {
    foreignKey: 'userId',
    targetKey: 'id',
    as: 'user'
})
Pedidos.belongsTo(User, {
    foreignKey: 'userId',
    targetKey: 'id',
    as: 'userDetalhes'
})
// -- //
Insumos.hasMany(Pedidos, {
    foreignKey: 'insumoSKU',
    sourceKey: 'SKU',
    as: 'pedidos'
})
Pedidos.belongsTo(Insumos, {
    foreignKey: 'insumoSKU',
    targetKey: 'SKU',
    as: 'insumosDetalhes'
})
// -- //
Pedidos.hasMany(Compra, {
    foreignKey: 'pedidoId',
    sourceKey: 'id',
    as: 'compras'
})
Compra.belongsTo(Pedidos, {
    foreignKey: 'pedidoId',
    targetKey: 'id',
    as: 'pedidoDetalhes'
})
// -- //
User.hasMany(Compra, {
    foreignKey: 'gerenteId',
    sourceKey: 'id',
    as: 'compraIniciadas'
})
Compra.belongsTo(User, {
    foreignKey: 'gerenteId',
    targetKey: 'id',
    as: 'gerenteResponsavel'
})
// -- //
Compra.belongsTo(User, {
    foreignKey: 'responsavel_pela_decisao_id',
    targetKey: 'id',
    as: 'aprovadorDetalhes'
});
User.hasMany(Compra, {
    foreignKey: 'responsavel_pela_decisao_id',
    sourceKey: 'id',
    as: 'compraAprovadas'
});
// -- //
Compra.hasMany(Orcamento, {
    foreignKey: 'compraId',
    sourceKey: 'id',
    as: 'compraIniciada'
})/
Orcamento.belongsTo(Compra, {
    foreignKey: 'compraId',
    targetKey: 'id',
    as: 'compraSelecionada'
})
// -- //
User.hasMany(Orcamento, {
    foreignKey: 'buyerId',
    sourceKey: 'id',
    as: 'fornecedorResponsavel'
});
Orcamento.belongsTo(User, {
    foreignKey: 'buyerId',
    targetKey: 'id',
    as: 'orcamentoIniciado'
})
// -- //
User.hasMany(InsumosLog, {
    foreignKey: 'userId',
    sourceKey: 'id',
    as: 'acoesUser'
})
InsumosLog.belongsTo(User, {
    foreignKey: 'userId',
    targetKey: 'id',
    as: "userResponsavel"
})
Insumos.hasMany(InsumosLog, {
    foreignKey: 'insumoId',
    sourceKey: 'id',
    as: 'insumoActionId'
})
InsumosLog.belongsTo(Insumos, {
    foreignKey: 'insumoId',
    targetKey: 'id',
    as: "insumoLogId"
})
// -- //
User.hasMany(UserLog, {
    foreignKey: 'userId',
    sourceKey: 'id',
    as: 'dadosUser'
})
UserLog.belongsTo(User, {
    foreignKey: 'userId',
    targetKey: 'id',
    as: 'userLog'
})
// -- //
User.hasMany(SetorLog, {
    foreignKey: 'gerenteId',
    sourceKey: 'id',
    as: 'acoesGerente'
})
SetorLog.belongsTo(User, {
    foreignKey: 'gerenteId',
    targetKey: 'id',
    as: 'gerenteResponsavel'
})
Setor.hasMany(SetorLog, {
    foreignKey: 'setorId',
    sourceKey: 'id',
    as: 'dadosSetor'
})
SetorLog.belongsTo(Setor, {
    foreignKey: 'setorId',
    targetKey: 'id',
    as: 'setorApontado'
})
// -- //
User.hasMany(PedidosLog, {
    foreignKey: 'userId',
    sourceKey: 'id',
    as: 'pedidosUser'
})
PedidosLog.belongsTo(User, {
    foreignKey: 'userId',
    targetKey: 'id',
    as: 'userSolicitante'
})
Pedidos.hasMany(PedidosLog, {
    foreignKey: 'pedidoId',
    sourceKey: 'id',
    as: 'dadosPedidos'
})
PedidosLog.belongsTo(Pedidos, {
    foreignKey: 'pedidoId',
    targetKey: 'id',
    as: 'pedidoIniciado'
})
// -- //
User.hasMany(CompraLog, {
    foreignKey: 'gerenteId',
    sourceKey: 'id',
    as: 'comprasUser'
})
CompraLog.belongsTo(User, {
    foreignKey: 'gerenteId',
    targetKey: 'id',
    as: 'gerenteSolicitante'
})
Compra.hasMany(CompraLog, {
    foreignKey: 'compraId',
    sourceKey: 'id',
    as: 'dadosCompras'
})
CompraLog.belongsTo(Compra, {
    foreignKey: 'compraId',
    targetKey: 'id',
    as: 'compraIniciada'
})
// -- //
User.hasMany(OrcamentoLog, {
    foreignKey: 'buyerId',
    sourceKey: 'id',
    as: 'orcamentosBuyer'
})

OrcamentoLog.belongsTo(User, {
    foreignKey: 'buyerId',
    targetKey: 'id',
    as: 'buyerOrçador'
})

Orcamento.hasMany(OrcamentoLog, {
    foreignKey: 'orcamentoId',
    sourceKey: 'id',
    as: 'dadosOrcamento'
})

OrcamentoLog.belongsTo(Orcamento, {
    foreignKey: 'orcamentoId',
    targetKey: 'id',
    as: 'orcamentoIniciado'
})

// -- //

Insumos.hasMany(Compra, {
    foreignKey: 'insumoSKU',
    sourceKey: 'SKU',
    as: 'comprasDoInsumo'
});
Compra.belongsTo(Insumos, {
    foreignKey: 'insumoSKU',
    targetKey: 'SKU',
    as: 'insumoDetalhes'
});

// -- //
Insumos.hasMany(Orcamento, {
    foreignKey: 'insumoSKU',
    sourceKey: 'SKU',
    as: 'orcamentosDoInsumo'
});
Orcamento.belongsTo(Insumos, {
    foreignKey: 'insumoSKU',
    targetKey: 'SKU',
    as: 'insumoDetalhes'
});
// Um usuário pode enviar vários contatos
User.hasMany(Contato, {
    foreignKey: 'userId',
    sourceKey: 'id',
    as: 'contatosEnviados'
});
Contato.belongsTo(User, {
    foreignKey: 'userId',
    targetKey: 'id',
    as: 'usuarioContato'
});

User.hasMany(Suporte, {
    foreignKey: 'userId',
    sourceKey: 'id',
    as: 'suportesAbertos'
});
Suporte.belongsTo(User, {
    foreignKey: 'userId',
    targetKey: 'id',
    as: 'usuarioSuporte'
});


async function runSync() {
    console.log('Iniciando sincronização do banco de dados...');
    
    try {
        await sequelize.authenticate();
        console.log('Conexão com o DB estabelecida com sucesso.');

        // Aplica alterações sem perder dados
        await sequelize.sync({ alter: true }); 
        
        // Reset Total - Cuidado: Apaga e recria todas as tabelas
        // await sequelize.sync({ force: true }); 
        
        console.log('✅ Modelos sincronizados com o banco de dados. DB está pronto.');
        
    } catch (error) {
        console.error('ERRO DURANTE A SINCRONIZAÇÃO:', error.message);
        console.error('Detalhes do erro:', error.parent.sqlMessage || error.message);
        process.exit(1);
    } finally {

        await sequelize.close(); 
    }
}

runSync();