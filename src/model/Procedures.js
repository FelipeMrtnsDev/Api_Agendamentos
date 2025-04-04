import neonDB from '../config/database.js'
import Doctors from './Doctors.js';
import { DataTypes } from 'sequelize';

const Procedures = neonDB.define('procedures', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    doctor_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Doctors,
            key: 'id'
        }
    }
});

Doctors.hasMany(Procedures, { foreignKey: 'doctor_id' });
Procedures.belongsTo(Doctors, { foreignKey: 'doctor_id' });

export default Procedures
