import { Model, DataTypes } from 'sequelize'
import sequelize from '../database/sequelize.js'

class Setor extends Model {}

Setor.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    
    name: {
        type: DataTypes.STRING(6),
        allowNull: false,
        unique: true
    },

    status: {
        type: DataTypes.ENUM,
        values: ['ativo', 'inativo', 'pendente'],
        defaultValue: 'pendente',
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'Setor',
    tableName: 'setor',
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
})

export default Setor;