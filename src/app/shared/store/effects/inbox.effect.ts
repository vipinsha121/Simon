import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { withLatestFrom, switchMap, map } from 'rxjs/operators';
import { UPDATE_INBOX } from '../actions/inbox/inbox.action';
import { UserServiceProxy } from '../../services/service-proxy/service-proxies';
import { AppState } from '../../models/app.state';
import { Store } from '@ngrx/store';

@Injectable()
export class InboxEffects {

    @Effect({ dispatch: false })
    saveInboxes$ = this.actions$
        .pipe(
            ofType(UPDATE_INBOX),
            withLatestFrom(
                this.store.select(state => state.inbox),
                ([], state) => {
                    return state.map(data => { return data.id }).join("|");
                }
            ),
            switchMap((storeData) => this.userService.insertUserPreference("mmcbroom", "inbox", storeData)
                .pipe(
                    map(() => ({

                    }))
                ))
        );

    constructor(
        private actions$: Actions,
        private userService: UserServiceProxy,
        private store: Store<AppState>
    ) { }
}