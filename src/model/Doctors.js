import sequelize from '../config/database.js'
import { DataTypes } from 'sequelize';

const Doctors = sequelize.define('doctors', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    gender: {
        type: DataTypes.ENUM('homem', 'mulher'),
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    area: {
        type: DataTypes.STRING,
        allowNull: false
    },
}, {
    tableName: 'doctors', 
    timestamps: true 
});

export default Doctors