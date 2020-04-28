import { Identifier } from '../types';

export const CRUD_CHANGE_LIST_PARAMS = 'RA/CRUD_CHANGE_LIST_PARAMS';

export interface ListParams {
    sort: string;
    order: string;
    page: number;
    perPage: number;
    filter: any;
    displayedFilters: any;
}

export interface ChangeListParamsAction {
    readonly type: typeof CRUD_CHANGE_LIST_PARAMS;
    readonly payload: ListParams;
    readonly meta: { resource: string };
}

export const changeListParams = (
    resource: string,
    params: ListParams
): ChangeListParamsAction => ({
    type: CRUD_CHANGE_LIST_PARAMS,
    payload: params,
    meta: { resource },
});

export const SET_LIST_SELECTED_IDS = 'RA/SET_LIST_SELECTED_IDS';

export interface SetListSelectedIdsAction {
    readonly type: typeof SET_LIST_SELECTED_IDS;
    readonly payload: Identifier[];
    readonly meta: { resource: string };
}
export const setListSelectedIds = (
    resource: string,
    ids: Identifier[]
): SetListSelectedIdsAction => ({
    type: SET_LIST_SELECTED_IDS,
    payload: ids,
    meta: { resource },
});

export const TOGGLE_LIST_ITEM = 'RA/TOGGLE_LIST_ITEM';

export interface ToggleListItemAction {
    readonly type: typeof TOGGLE_LIST_ITEM;
    readonly payload: any;
    readonly meta: { resource: string };
}

export const toggleListItem = (
    resource: string,
    id: any
): ToggleListItemAction => ({
    type: TOGGLE_LIST_ITEM,
    payload: id,
    meta: { resource },
});

export const TOGGLE_LIST_ITEM_EXPAND = 'RA/TOGGLE_LIST_ITEM_EXPAND';

export interface ToggleListItemExpandAction {
    readonly type: typeof TOGGLE_LIST_ITEM_EXPAND;
    readonly payload: Identifier;
    readonly meta: { resource: string };
}

/**
 * Action creator to toggle the expanded state of a list item
 *
 * @param {string} resource The resource name, e.g. 'posts'
 * @param {string|integer} id The record identifier, e.g. 123
 *
 * @example
 *
 * const onToggleItem = () => dispatch(toggleListItemExpand('posts', 123));
 */
export const toggleListItemExpand = (
    resource: string,
    id: Identifier
): ToggleListItemExpandAction => ({
    type: TOGGLE_LIST_ITEM_EXPAND,
    payload: id,
    meta: { resource },
});
