import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { withLatestFrom, switchMap } from 'rxjs/operators';
import { UserServiceProxy } from '../../services/service-proxy/service-proxies';
import { AppState } from '../../models/app.state';
import { Store } from '@ngrx/store';
import { UPDATE_DEAL } from '../actions/deals/deals.action';

@Injectable()
export class DealEffects {

    @Effect({ dispatch: false })
    saveDeals$ = this.actions$
        .pipe(
            ofType(UPDATE_DEAL),
            withLatestFrom(
                this.store.select(state => state.deal),
                ([], state) => {
                    return JSON.stringify(state.map(data => {
                        return { id: data.dealId, name: data.dealName }
                    }))
                }
            ),
            switchMap((storeData) => this.userService.insertUserPreference("mmcbroom", "deal", storeData)
                .pipe())
        );

    constructor(
        private actions$: Actions,
        private userService: UserServiceProxy,
        private store: Store<AppState>
    ) { }
}