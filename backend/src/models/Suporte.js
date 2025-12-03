import { Model, DataTypes } from 'sequelize'
import sequelize from '../database/sequelize.js'

class Suporte extends Model { }

Suporte.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },

    name: {
        type: DataTypes.STRING(30),
        allowNull: false,
    },

    email: {
        type: DataTypes.STRING(65),
        allowNull: false,
    },

    title: {
        type: DataTypes.STRING(25),
        allowNull: false
    },

    phone: {
        type: DataTypes.STRING,
        allowNull: true
    },

    message: {
        type: DataTypes.STRING,
        allowNull: false
    }

}, {
    sequelize,
    modelName: 'Suporte',
    tableName: 'suporte',
    timestamps: true,
    createdAt: 'timestamps',
    updatedAt: false
})

export default Suporte;