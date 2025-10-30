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

    description: {
        type: DataTypes.STRING,
        allowNull: true
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
        values: ['pendente', 'aprovado', 'negado', 'renegociação']
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
            const description = orcamento.description

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

            if (description) {
                const desc = await Compra.findOne(description, {
                    attributes: ['description']
                })

                if (desc) {
                    orcamento.description = desc.description;

                } else {
                    throw new Error(`A compra descrição não foi encontrada.`)
                }
            }
        }
    }
});

export default Orcamento;