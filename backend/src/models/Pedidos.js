import { Model, DataTypes } from 'sequelize'
import sequelize from '../database/sequelize.js'

class Pedidos extends Model {}

Pedidos.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },

    insumoName: {
        type: DataTypes.STRING(50),
        allowNull: false
    },

    status: {
        type: DataTypes.ENUM,
        values: ['solicitado', 'realizado']
    }

}, {
    sequelize,
    modelName: 'Pedidos',
    tableName: 'pedidos',
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
})

export default Pedidos