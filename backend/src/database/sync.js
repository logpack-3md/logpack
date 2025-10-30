import sequelize from "./sequelize.js";
import User from '../models/User.js';
import Insumos from '../models/Insumos.js';
import Setor from "../models/Setor.js";
import Pedidos from "../models/Pedidos.js";
import Compra from "../models/Compra.js";
import Orcamento from "../models/Orcamento.js";

Setor.hasMany(Insumos, {
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
    as: 'comprasIniciadas'
})

Compra.belongsTo(User, {
    foreignKey: 'gerenteId',
    targetKey: 'id',
    as: 'gerenteResponsavel'
})

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