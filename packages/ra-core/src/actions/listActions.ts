export const CRUD_CHANGE_LIST_PARAMS = 'RA/CRUD_CHANGE_LIST_PARAMS';

export interface ChangeListParamsAction {
    readonly type: typeof CRUD_CHANGE_LIST_PARAMS;
    readonly payload: any;
    readonly meta: { resource: string };
}
export const changeListParams = (
    resource: string,
    params: any
): ChangeListParamsAction => ({
    type: CRUD_CHANGE_LIST_PARAMS,
    payload: params,
    meta: { resource },
});

export const SET_LIST_SELECTED_IDS = 'RA/SET_LIST_SELECTED_IDS';

export interface SetListLelectedIdsAction {
    readonly type: typeof SET_LIST_SELECTED_IDS;
    readonly payload: [];
    readonly meta: { resource: string };
}
export const setListSelectedIds = (
    resource: string,
    ids: []
): SetListLelectedIdsAction => ({
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
