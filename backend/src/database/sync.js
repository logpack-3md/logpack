import sequelize from "./sequelize.js";
import User from '../models/User.js';
import Insumos from '../models/Insumos.js';
import Setor from "../models/Setor.js";

Setor.hasMany(Insumos, {
    foreignKey: 'setorId',
    as: 'insumos',
})

Insumos.belongsTo(Setor, {
    foreignKey: 'setorId',
    as: 'setor'
})  

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