import neonDB from '../config/database.js'
import { DataTypes } from 'sequelize';

const User = neonDB.define('usuarios', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
    type: DataTypes.STRING,
    allowNull: false
    },
    role: {
        type: DataTypes.ENUM('user', 'admin'),
        allowNull: false,
        defaultValue: 'user'
    }
}, {
    tableName: 'usuarios',
    timestamps: true 
});

export default User