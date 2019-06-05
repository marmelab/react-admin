export const CRUD_SHOW_FILTER = 'RA/CRUD_SHOW_FILTER';

export interface ShowFilterAction {
    readonly type: typeof CRUD_SHOW_FILTER;
    readonly payload: { field: string };
    readonly meta: { resource: string };
}

export const showFilter = (resource: string, field: string): ShowFilterAction => ({
    type: CRUD_SHOW_FILTER,
    payload: { field },
    meta: { resource },
});

export const CRUD_HIDE_FILTER = 'RA/CRUD_HIDE_FILTER';

export interface HideFilterAction {
    readonly type: typeof CRUD_HIDE_FILTER;
    readonly payload: { field: string };
    readonly meta: { resource: string };
}

export const hideFilter = (resource: string, field: string): HideFilterAction => ({
    type: CRUD_HIDE_FILTER,
    payload: { field },
    meta: { resource },
});

export const CRUD_SET_FILTER = 'RA/CRUD_SET_FILTER';

export interface SetFilterAction {
    readonly type: typeof CRUD_SET_FILTER;
    readonly payload: { field: string; value: any };
    readonly meta: { resource: string };
}

export const setFilter = (resource: string, field: string, value: any): SetFilterAction => ({
    type: CRUD_SET_FILTER,
    payload: { field, value },
    meta: { resource },
});
