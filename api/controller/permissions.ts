import { checkCurrentUser, IRequest } from '../routes/helpers';
import { Response } from 'express';
import { IRemovePermissionAsyncAttrs, removePermissionAsync } from '../services/permissionService';

export async function removePermission(request: IRequest, response: Response, next: Function) {
    try {
        checkCurrentUser(request);
        const userId = request.currentUser.id;
        const permissionId = request.params.id;
        const attrs: IRemovePermissionAsyncAttrs = {
            userId,
            permissionId
        };
        await removePermissionAsync(attrs);
        return response.status(200).send();
    } catch (error) {
        return response.status(422).json({message: error.message});
    }
}
