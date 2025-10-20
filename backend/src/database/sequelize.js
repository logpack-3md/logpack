import dotenv from 'dotenv'
dotenv.config()
import UserDefiner from '../models/User.js';
import InsumosDefiner from '../models/Insumos.js';
import Sequelize, { DataTypes } from 'sequelize';

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: 'localhost',
    dialect: 'mysql'
})

const db = {};

db.User = UserDefiner(sequelize, DataTypes)
db.Insumos = InsumosDefiner(sequelize, DataTypes)

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export async function initializeDatabase() {
    try {
        await sequelize.authenticate()
        console.log('Conexão com o banco de dados estabelecida.')

        await sequelize.sync({ alter: true })
        console.log('Modelos sincronizados com o banco de dados.')
    } catch (error) {
        console.error('Não foi possível conectar com o banco de dados.', error)
    }
}

export default db;