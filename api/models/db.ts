import sequelizeConfig from '../config';
import * as Sequelize from 'sequelize';
const env = process.env.NODE_ENV;

const sequelize = new Sequelize.Sequelize(sequelizeConfig[env]);

sequelize.sync().then(() => console.log('synced with db'));

export default sequelize;
