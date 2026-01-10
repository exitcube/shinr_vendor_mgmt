
import { DataSource, DataSourceOptions } from 'typeorm';
import { ENV } from './env';
import path from 'path';
import { entities } from '../models';

const baseConfig: DataSourceOptions = {
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'shinr_user_mgmt',
    entities: entities,
    migrations: [path.join(__dirname, '../migrations/*.{ts,js}')],
    synchronize: false,
    logging: ENV.NODE_ENV === 'development',
    ssl: ENV.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
};

export default new DataSource(baseConfig);
