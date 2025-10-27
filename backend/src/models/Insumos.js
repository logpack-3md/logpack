import { Model, DataTypes } from 'sequelize';
import sequelize from '../database/sequelize.js';

class Insumos extends Model { }

Insumos.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },

    name: {
        type: DataTypes.STRING(50),
        allowNull: false
    },

    SKU: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    },

    setorName: {
        type: DataTypes.STRING(6),
        allowNull: false,
        unique: true
    },

    description: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    image: {
        type: DataTypes.STRING,
    },

    measure: {
        type: DataTypes.ENUM,
        values: ['KG', 'G', 'ML', 'L']
    },

    current_storage: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },

    average_storage: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0,
    },

    max_storage: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false
    },

    current_weight_carga: { // esse vem do MQTT
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
        defaultValue: 0
    },

    max_weight_carga: {
        type: DataTypes.DECIMAL(5,2),
        defaultValue: 100.00
    },

    status_solicitacao: {
        type: DataTypes.STRING,
        get() {
            const current_storage = this.getDataValue('current_storage') || 0;

            if (current_storage < 40) {
                return 'Solicitar Reposição';
            }
            return 'Estoque Ok';
        }
    },

    last_check: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: DataTypes.NOW
    },

    status: {
        type: DataTypes.ENUM,
        values: ['ativo', 'inativo'],
        defaultValue: 'ativo',
        allowNull: false,
    },

}, {
    sequelize,
    modelName: 'Insumos',
    tableName: 'insumos',
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',

    hooks: {
        beforeUpdate: async (insumo) => {
            insumo.last_check = new Date()
        }
    }
})

export default Insumos;

