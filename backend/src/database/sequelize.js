import 'dotenv'
import Sequelize from 'sequelize';

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: 'localhost',
    dialect: 'mysql'
})

async function initializeDatabase() {
    try {
        await sequelize.authenticate()
        console.log('Conexão com o banco de dados estabelecida.')

        await sequelize.sync({})
        console.log('Modelos sincronizados com o banco de dados.')
    } catch (error) {
        console.error('Não foi possível conectar com o banco de dados.', error)
    }
}

initializeDatabase()

export default sequelize