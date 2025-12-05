import { Model, DataTypes } from "sequelize";
import sequelize from "../database/sequelize.js";
import Compra from "./Compra.js";

class Orcamento extends Model { }

Orcamento.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },

    compraId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false
    },

    buyerId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false
    },

    insumoSKU: {
        type: DataTypes.STRING(50),
        allowNull: true // Pode ser null inicialmente se migrar dados antigos, mas idealmente preenchido
    },

    description: {
        type: DataTypes.STRING,
        allowNull: false
    },

    amount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },

    valor_total: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true
    },

    status: {
        type: DataTypes.ENUM,
        values: ['pendente', 'aprovado', 'negado', 'renegociacao', 'cancelado'],
        defaultValue: 'pendente'
    }

}, {
    sequelize,
    modelName: 'Orcamento',
    tableName: 'orcamentos',
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',

    hooks: {
        beforeCreate: async (orcamento, options) => {
            const compraId = orcamento.compraId;
            // const description = orcamento.description

            if (compraId) {
                const compra = await Compra.findByPk(compraId, {
                    attributes: ['amount']
                })

                if (compra) {
                    orcamento.amount = compra.amount;

                } else {
                    throw new Error(`A compra com ID ${compraId} não foi encontrada para determinar a quantidade.`)
                }
            };
        }
    }
});

export default Orcamento;