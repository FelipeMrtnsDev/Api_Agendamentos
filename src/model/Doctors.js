import { DataTypes } from 'sequelize';
import neonDB from '../config/database.js';

const Doctors = neonDB.define('doctors', {
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