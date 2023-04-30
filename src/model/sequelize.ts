import { Sequelize } from 'sequelize';
import {
    database,
    host,
    port,
    username,
    password
} from '../config/db';

const sequelize = new Sequelize(database, username, password, {
    host,
    port,
    dialect: 'postgres',
});

sequelize
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch((err: Error) => {
        console.error('Unable to connect to the database:', err);
    });

export default sequelize;