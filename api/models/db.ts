import sequelizeConfig from '../config';
import * as Sequelize from 'sequelize';
const env = process.env.NODE_ENV;
import User from './user';

const sequelize = new Sequelize.Sequelize(sequelizeConfig[env]);

// User.init(sequelize);
// const User = sequelize.import('./user')
User.init(sequelize)
const models = {
  User: User,
  sequelize,
  Sequelize,
  op: Sequelize.Op
};

Object.keys(models).forEach((modelName) => {
  if ('associate' in models[modelName]) {
    models[modelName].associate(models);
  }
});

// models.sequelize = sequelize;
// models.Sequelize = Sequelize;
// models.op = Sequelize.Op;

sequelize.sync().then(() => console.log('synced with db'));

export default models;
