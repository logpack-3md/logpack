import { Model, DataTypes } from 'sequelize'
import sequelize from '../database/sequelize.js'

class Pedidos extends Model {}

Pedidos.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },

    userId: {
        type: DataTypes.UUID,
        allowNull: false,
    },

    insumoSKU: {
        type: DataTypes.STRING(50),
        allowNull: false
    },

    status: {
        type: DataTypes.ENUM,
        values: ['solicitado', 'aprovado', 'rejeitado', 'compra_iniciada', 'compra_efetuada', 'cancelado'],
        defaultValue: 'solicitado'
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