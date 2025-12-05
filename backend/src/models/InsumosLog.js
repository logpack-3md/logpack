import { Model, DataTypes } from "sequelize";
import sequelize from "../database/sequelize.js";

class InsumosLog extends Model { }

InsumosLog.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },

    userId: {
        type: DataTypes.UUID,
        allowNull: true,      
        references: {
            model: 'users',
            key: 'id'
        },
        onDelete: 'SET NULL', 
        onUpdate: 'CASCADE',
        comment: "ID do usuário (pode ser NULL se for ação do sistema/IoT)"
    },

    insumoId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'insumos', 
            key: 'id'
        },
        onDelete: 'CASCADE', 
        onUpdate: 'CASCADE'
    },
    contextDetails: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    actionType: {
        type: DataTypes.ENUM,
        values: ['INSERT', 'UPDATE'],
        allowNull: true
    },
    oldData: {
        type: DataTypes.JSON,
        allowNull: true
    },
    newData: {
        type: DataTypes.JSON,
        allowNull: false
    }
}, {
    sequelize,
    modelName: "InsumosLog",
    tableName: "insumosLog",
    timestamps: true,
    createdAt: "timestamps",
    updatedAt: false
})

export default InsumosLog;