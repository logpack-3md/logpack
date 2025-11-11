import { Model, DataTypes } from "sequelize";
import sequelize from "../database/sequelize.js";

class OrcamentoLog extends Model { }

OrcamentoLog.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },

    buyerId: {
        type: DataTypes.UUID,
        allowNull: false,
        comment: "ID do usuário responsável pela ação"
    },

    orcamentoId: {
        type: DataTypes.UUID,
        allowNull: false
    },

    contextDetails: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: "Detalhes da ação executada (ex: Orçamento imposto, etc)"
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
    modelName: "OrcamentoLog",
    tableName: "orcamentoLog",
    timestamps: true,
    createdAt: "timestamps",
    updatedAt: false
})

export default OrcamentoLog;