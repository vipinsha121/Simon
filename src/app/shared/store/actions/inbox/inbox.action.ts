import { Action } from '@ngrx/store'
import { Inbox } from './../../../models/inbox.model'

//Define constants for reducer
export const ADD_INBOX = '[INBOX] Add'
export const UPDATE_INBOX = '[INBOX] Update'
export const ACTIVATE_INBOX = '[INBOX] Activate'
export const INACTIVATE_INBOX = '[INBOX] Inactivate'

//Define Actions for reducer
//Add Inbox to store
export class AddInbox implements Action {
    readonly type = ADD_INBOX

    constructor(public payload: Inbox) { }
}

//Update Inboxes in store
export class UpdateInbox implements Action {
    readonly type = UPDATE_INBOX

    constructor(public payload: Inbox) { }
}

//Sets Inbox to active
export class SetInboxActive implements Action {
    readonly type = ACTIVATE_INBOX
    constructor(public payload: Inbox) { }
}

//Sets all inboxe inactive
export class SetInboxInActive implements Action {
    readonly type = INACTIVATE_INBOX

    constructor() { }
}

//Set Actions to be used
export type Actions = AddInbox | UpdateInbox | SetInboxActive | SetInboxInActive