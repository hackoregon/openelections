import * as bcrypt from 'bcryptjs';
import {
    BelongsTo,
    BelongsToCreateAssociationMixin,
    BelongsToGetAssociationMixin,
    BelongsToSetAssociationMixin,
    DataTypes,
    FindOptions,
    Model,
} from 'sequelize';
// import sequelize from './db';


class User extends Model {
    static init(sequelize) {
        return super.init({
            username: DataTypes.STRING,
            firstName: DataTypes.STRING,
            lastName: DataTypes.STRING,
            email: DataTypes.STRING,
            password: DataTypes.STRING,
        }, { sequelize });
    }

    public static associations: {
        group: BelongsTo
    };
    validPassword(password: string) {
        return bcrypt.compareSync(password, this.password);
    }

    public id: number;
    public email: string;
    public password: string;
    public username: string;
    public firstName: string;
    public lastName: string;
    public createdAt: Date;
    public updatedAt: Date;

    // mixins for association (optional)
    // public groupId: number;
    // public group: UserGroup;
    // public getGroup: BelongsToGetAssociationMixin<UserGroup>;
    // public setGroup: BelongsToSetAssociationMixin<UserGroup, number>;
    // public createGroup: BelongsToCreateAssociationMixin<UserGroup>;

}
// Hooks
// User.beforeCreate((user) => {
//     const salt = bcrypt.genSaltSync();
//     user.password = bcrypt.hashSync(user.password, salt);
// });
// User.afterFind((users, options: FindOptions) => {
//     console.log('found');
// });
// User.prototype.validPassword = (password) => {
//     return bcrypt.compareSync(password, this.password);
// };

export default User;


// associate
// it is important to import _after_ the model above is already exported so the circular reference works.
// import { UserGroup } from './UserGroup';
// export const Group = User.belongsTo(UserGroup, { as: 'group', foreignKey: 'groupId' });
