import * as  DealsActions from 'src/app/shared/store/actions/deals/deals.action';
import { Deal } from 'src/app/shared/models/deal.model';
import { AppConsts } from 'src/app/shared/app-constants';

export function dealReducer(dealList: Deal[] = [], action: DealsActions.Actions) {

    switch (action.type) {
        case DealsActions.ADD_DEAL:
            let index = dealList.findIndex(el => el.dealId == action.payload.dealId);
            dealList.forEach(menu => {
                if (menu.dealId == action.payload.dealId)
                    menu.active = true;
                else
                    menu.active = false;
                return menu;
            });
            if (index == -1)
                return [...dealList, action.payload];
            return dealList;

        case DealsActions.UPDATE_DEAL:
            dealList.forEach(menu => {
                if (menu.dealId == action.payload.dealId)
                    menu.active = true;
                else
                    menu.active = false;
                return menu;
            });
            var data = dealList.filter(result => {
                return result.dealId != action.payload.dealId
            })
            if (dealList.length < AppConsts.inboxMaxLength) {
                data.splice(0, 0, action.payload);
                dealList = data;
            }
            else if (dealList.length == AppConsts.inboxMaxLength) {
                if (dealList.length != data.length) {
                    data.splice(0, 0, action.payload);
                    dealList = data;
                }
                else {
                    dealList.pop();
                    dealList.splice(0, 0, action.payload);
                }
            }
            return dealList;

        default:
            return dealList;
    }
}
