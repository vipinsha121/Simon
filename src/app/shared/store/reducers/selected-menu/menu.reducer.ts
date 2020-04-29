import * as  MenuActions from 'src/app/shared/store/actions/selected-menu/menu.action';
import { SelectedMenuModel } from 'src/app/shared/models/menu.model';


// Section 1


// Section 2
export function menuReducer(state: SelectedMenuModel, action: MenuActions.Actions) {
    // Section 3
    switch (action.type) {
        case MenuActions.SELECT_MENU:
            return action.payload;
        default:
            return state;
    }
}
