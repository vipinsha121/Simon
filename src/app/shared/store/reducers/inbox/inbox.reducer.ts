//Imports
import * as  InboxActions from 'src/app/shared/store/actions/inbox/inbox.action';
import { Inbox } from 'src/app/shared/models/inbox.model';
import { AppConsts } from 'src/app/shared/app-constants';




//Inbox reducers
export function inboxReducer(inboxList: Inbox[] = [], action: InboxActions.Actions) {
    //Logic depending upon action types
    switch (action.type) {
        //Add inbox to store
        case InboxActions.ADD_INBOX:
            var index = inboxList.findIndex(el => el.id == action.payload.id);
            inboxList.forEach(menu => {
                if (menu.id === action.payload.id)
                    menu.active = true;
                else
                    menu.active = false;
                return menu;
            });
            if (index == -1)
                return [...inboxList, action.payload];
            return inboxList;

        //Update inboxes in store
        case InboxActions.UPDATE_INBOX:
            
            inboxList.forEach(menu => {
                if (menu.id === action.payload.id)
                    menu.active = true;
                else
                    menu.active = false;
                return menu;
            });
            var data = inboxList.filter(result => {
                return result.id != action.payload.id
            });
            if (inboxList.length < AppConsts.inboxMaxLength) {
                data.splice(0, 0, action.payload);
                inboxList = data;
            }
            //if inbox already has 5 elemetns
            else if (inboxList.length == AppConsts.inboxMaxLength) {
                if (data.length == AppConsts.inboxMaxLength) {
                    data.pop();
                }

                data.splice(0, 0, action.payload);
                inboxList = data;
            }

            return inboxList;

        //Set active flag to true for inbox
        case InboxActions.ACTIVATE_INBOX:
            var index = inboxList.findIndex(el => el.id == action.payload.id);
            inboxList.forEach(menu => {
                if (menu.id === action.payload.id)
                    menu.active = true;
                return menu;
            });
            return inboxList;

        //Set active flag to false for all inboxes
        case InboxActions.INACTIVATE_INBOX:
            inboxList.forEach(menu => {
                menu.active = false;
                return menu;
            });
            return inboxList;

        default:
            return inboxList;
    }
}
