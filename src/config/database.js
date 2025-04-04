import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import pg from 'pg';

dotenv.config();

const neonDB = new Sequelize(process.env.NEON_URL, {
    dialect: 'postgres',
    dialectModule: pg,
    logging: false,
    ssl: true,
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false,
        },
    },
});

export default neonDB;
