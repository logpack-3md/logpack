import { Model, DataTypes } from "sequelize";
import sequelize from "../database/sequelize.js";

class CompraLog extends Model { }

CompraLog.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },

    gerenteId: {
        type: DataTypes.UUID,
        allowNull: false,
        comment: "ID do gerente responsável pela ação"
    },

    compraId: {
        type: DataTypes.UUID,
        allowNull: false
    },

    contextDetails: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: "Detalhes da ação executada (ex: Ajuste manual, Mudança de Preço)"
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
    modelName: "CompraLog",
    tableName: "compraLog",
    timestamps: true,
    createdAt: "timestamps",
    updatedAt: false
})

export default CompraLog