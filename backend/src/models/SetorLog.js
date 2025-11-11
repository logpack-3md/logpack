import { Model, DataTypes } from 'sequelize'
import sequelize from '../database/sequelize.js'

class SetorLog extends Model {}

SetorLog.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    
    gerenteId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false
    },
    
    setorId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false
    },

    contextDetails: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: "Detalhes da ação executada (ex: Cadastro ou edição)"
    },

    actionType: {
        type: DataTypes.ENUM,
        values: ['INSERT', 'UPDATE'],
        allowNull: true
    },

    oldData: {
        type: DataTypes.JSON,
        allowNull: true,
        comment: "Dados antes de mudança"
    },

    newData: {
        type: DataTypes.JSON,
        allowNull: false,
        comment: "Dados após a mudança"
    }

}, {
    sequelize,
    modelName: "SetorLog",
    tableName: "setorLog",
    timestamps: true,
    createdAt: "timestamps",
    updatedAt: false
})

export default SetorLog;