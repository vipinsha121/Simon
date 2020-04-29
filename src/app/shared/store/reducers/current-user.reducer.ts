import * as  UserActions from 'src/app/shared/store/actions/current-user.action';
import { UserFullProfileDto } from '../../services/service-proxy/service-proxies';


// Section 1


// Section 2
export function currentUserReducer(state: UserFullProfileDto, action: UserActions.Actions) {
    // Section 3
    switch (action.type) {
        case UserActions.ADD_USER:
            return action.payload;
        default:
            return state;
    }
}
