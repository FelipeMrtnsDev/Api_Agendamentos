import { DataTypes } from 'sequelize';
import db from '../config/database.js';
import User from '../model/User.js';
import Doctor from '../model/Doctors.js';

const Appointments = db.define('Appointments', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    date: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    time: {
        type: DataTypes.TIME,
        allowNull: false
    },
    topic: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    timestamps: true
});

Appointments.belongsTo(User, { foreignKey: 'user_id' });
Appointments.belongsTo(Doctor, { foreignKey: 'doctor_id' });

export default Appointments;
