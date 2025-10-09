import { Model, DataTypes } from 'sequelize';
import sequelize from '../database/sequelize.js';
import bcrypt from 'bcryptjs';

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

    func: {
        type: DataTypes.ENUM('user', 'admin', 'buyer'),
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