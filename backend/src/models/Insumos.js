import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
    class Insumos extends Model { }

    Insumos.init({
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },

        SKU: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
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
            defaultValue: null,
        },

        average_storage: {
            type: DataTypes.DECIMAL(10, 2),
            defaultValue: null,
        },

        // max_storage: {
        //     type: DataTypes.INTEGER,
        //     defaultValue: ?
        // }

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
    })

    return Insumos;
}

