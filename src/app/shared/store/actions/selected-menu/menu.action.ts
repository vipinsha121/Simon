// Section 1
import { Action } from '@ngrx/store'
import { SelectedMenuModel } from '../../../models/menu.model'

// Section 2
export const SELECT_MENU = '[Menu] Select'


// Section 3
export class SelectedMenu implements Action {
    readonly type = SELECT_MENU

    constructor(public payload: SelectedMenuModel) { }
}

// Section 4
export type Actions = SelectedMenu
