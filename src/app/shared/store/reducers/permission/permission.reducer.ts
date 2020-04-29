import * as  PermissionActions from 'src/app/shared/store/actions/permission/permission.action';
import { Permission } from './../../../models/permission.model';


// Section 1


// Section 2
export function currentPermissionReducer(state: Permission, action: PermissionActions.Actions) {
    // Section 3
    switch (action.type) {
        case PermissionActions.ADD_PERMISSIONS:
            return action.payload;
        default:
            return state;
    }
}
