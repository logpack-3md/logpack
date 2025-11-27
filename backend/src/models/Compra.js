import { Model, DataTypes } from 'sequelize'
import sequelize from '../database/sequelize.js'

class Compra extends Model { }

Compra.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },

    gerenteId: {
        type: DataTypes.UUID,
        allowNull: false
    },

    pedidoId: {
        type: DataTypes.UUID,
        allowNull: false
    },

    status: {
        type: DataTypes.ENUM,
        values: ['pendente', 'fase_de_orcamento', 'renegociacao_solicitada', 'concluido', 'cancelado', 'negado'],
        defaultValue: 'pendente'
    },

    description: {
        type: DataTypes.STRING,
        allowNull: true
    },

    amount: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    responsavel_pela_decisao_id: {
        type: DataTypes.UUID,
        allowNull: true
    },

    data_de_decisao: {
        type: DataTypes.DATE,
        allowNull: true
    },

}, {
    sequelize,
    modelName: 'Compra',
    tableName: 'compras',
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
})

export default Compra;