import { addPermissionAsync } from '../../services/permissionService';
import { UserRole } from '../entity/Permission';

const relations = [
    {
        email: 'ian.harris@hackoregon.org',
        role: UserRole.GOVERNMENT_ADMIN,
        governmentName: 'WonderGov'
    }
];

export default async ({ users, governments }) => {
    if (process.env.NODE_ENV !== 'development') {
        return console.log('Can only seed in development mode');
    }
    const permissions = relations.map(r => {
        const { id: userId } = users.find(u => u.email === r.email);
        const { id: governmentId } = governments.find(g => g.name === r.governmentName);
        return {
            userId,
            governmentId,
            role: r.role
        };
    });
    return Promise.all(permissions.map(addPermissionAsync));
};
