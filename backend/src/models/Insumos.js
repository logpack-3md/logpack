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
        // unique: true
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
        defaultValue: 10000,
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

    // Campo VIRTUAL para calcular a porcentagem da CARGA
    current_level_carga_pct: {
        type: DataTypes.VIRTUAL,
        get() {
            const current = this.getDataValue('current_weight_carga');
            const max = this.getDataValue('max_weight_carga');

            if (max === 0 || !max) return 0;

            // Retorna a porcentagem da carga
            return parseFloat(((current / max) * 100).toFixed(2));
        }
    },

    // Campo VIRTUAL para calcular a porcentagem do ESTOQUE TOTAL
    current_storage_pct: {
        type: DataTypes.VIRTUAL,
        get() {
            const current = this.getDataValue('current_storage');
            const max = this.getDataValue('max_storage'); 

            if (max === 0 || !max) return 0;

            return parseFloat(((current / max) * 100).toFixed(2));
        }
    },

    status_solicitacao: {
        type: DataTypes.VIRTUAL,
        get() {
            const currentPct = this.getDataValue('current_storage_pct') || 0;

            if (currentPct < 40) {
                return 'SOLICITAR_REPOSIÇÃO';
            }
            return 'ESTOQUE_OK';
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

