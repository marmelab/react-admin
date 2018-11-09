export const FETCH_START = 'RA/FETCH_START';

export interface FetchStartAction {
    readonly type: typeof FETCH_START;
}

export const fetchStart = (): FetchStartAction => ({ type: FETCH_START });

export const FETCH_END = 'RA/FETCH_END';

export interface FetchEndAction {
    readonly type: typeof FETCH_END;
}

export const fetchEnd = (): FetchEndAction => ({ type: FETCH_END });

export const FETCH_ERROR = 'RA/FETCH_ERROR';

export interface FetchErrorAction {
    readonly type: typeof FETCH_ERROR;
}

export const fetchError = (): FetchErrorAction => ({ type: FETCH_ERROR });

export const FETCH_CANCEL = 'RA/FETCH_CANCEL';

export interface FetchCancelAction {
    readonly type: typeof FETCH_CANCEL;
}

export const fetchCancel = (): FetchCancelAction => ({ type: FETCH_CANCEL });
