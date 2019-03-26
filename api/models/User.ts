import Sequelize, {
    DataTypes,
    Model, ModelAttributes,
} from 'sequelize';
import { db } from './db'

class User extends Model {
    public id: number;
    public email: string;
    public password: string;
    public username: string;
    public firstName: string;
    public lastName: string;
    public woot: string;
    public createdAt: Date;
    public updatedAt: Date;
}

User.init({
    firstName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    woot: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    tableName: 'Users',
    sequelize: db
});

export default User;
