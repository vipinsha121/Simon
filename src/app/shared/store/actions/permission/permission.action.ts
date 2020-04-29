import { Action } from '@ngrx/store'
import { Permission } from './../../../models/permission.model'

//Define constants for reducer
export const ADD_PERMISSIONS = '[PERMISSIONS] Add'


//Define Actions for reducer
//Add Inbox to store
export class AddPermissions implements Action {
    readonly type = ADD_PERMISSIONS

    constructor(public payload: Permission) { }
}

// Section 4
export type Actions = AddPermissions