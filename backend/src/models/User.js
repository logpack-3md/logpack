import { DataTypes, Model } from 'sequelize';
import bcrypt from 'bcryptjs';
import validateCpf from 'validar-cpf';
import sequelize from '../database/sequelize.js';

class User extends Model {
    validPassword(password) {
        return bcrypt.compareSync(password, this.password)
    };

    static generateHash(password) {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)
    }
}

User.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },

    cpf: {
        type: DataTypes.STRING(),
        unique: true,
        allowNull: false,
        validate: {
            isValidCpf(value) {
                if (!validateCpf(value)) {
                    throw new Error("Formato ou dígitos verificadores de CPF inválidos")
                }
            },
            len: [11, 14]
        }
    },

    name: {
        type: DataTypes.STRING(255),
        allowNull: false
    },

    email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,

        validate: {
            isEmail: true,
        }
    },

    password: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },

    role: {
        type: DataTypes.ENUM('employee', 'admin', 'buyer', 'manager'),
        allowNull: false
    },

    status: {
        type: DataTypes.ENUM('ativo', 'inativo', 'pendente'),
        defaultValue: 'pendente',
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',

    hooks: {
        beforeCreate: async (user) => {
            if (user.password) {
                user.password = User.generateHash(user.password)
            }
        },
        beforeUpdate: async (user) => {
            if (user.changed('password')) {
                user.password = User.generateHash(user.password)
            }
        }
    }
})


export default User;
