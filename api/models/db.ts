import { dbConfig } from '../config/db';
import * as Sequelize from 'sequelize';

export const db = new Sequelize.Sequelize(dbConfig);
