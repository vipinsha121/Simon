import { Action } from '@ngrx/store'
import { Deal } from './../../../models/deal.model'



export const ADD_DEAL = '[DEAL] Add'
export const UPDATE_DEAL = '[DEAL] Update'


export class AddDeal implements Action {
    readonly type = ADD_DEAL

    constructor(public payload: Deal) { }
}

export class UpdateDeal implements Action {
    readonly type = UPDATE_DEAL

    constructor(public payload: Deal) { }
}

export type Actions = AddDeal | UpdateDeal 