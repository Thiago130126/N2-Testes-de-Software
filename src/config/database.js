import { Sequelize } from 'sequelize';

import 'dotenv/config';

const configDB = {
    development: {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        logging: false,
        dialect: 'postgres',
        define: {
            timestamps: true,
            underscored: true,
        }
    },
    test: {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        dialect: 'postgres',
        logging: false
    },
    production: {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        dialect: 'postgres',
        logging: false
    }
};

const sequelize = new Sequelize(configDB[process.env.NODE_ENV || 'development']);

export default sequelize;