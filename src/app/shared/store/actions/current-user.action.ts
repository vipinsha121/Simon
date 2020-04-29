// Section 1
import { Action } from '@ngrx/store'
import { UserFullProfileDto } from '../../services/service-proxy/service-proxies';


// Section 2
export const ADD_USER = '[USER] Add'


// Section 3
export class AddUser implements Action {
    readonly type = ADD_USER

    constructor(public payload: UserFullProfileDto) { }
}

// Section 4
export type Actions = AddUser
