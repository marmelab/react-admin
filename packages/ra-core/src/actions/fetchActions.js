export const FETCH_START = 'RA/FETCH_START';
export const FETCH_END = 'RA/FETCH_END';
export const FETCH_ERROR = 'RA/FETCH_ERROR';
export const FETCH_CANCEL = 'RA/FETCH_CANCEL';

export const fetchStart = () => ({
    type: FETCH_START,
});

export const fetchEnd = () => ({
    type: FETCH_END,
});

export const fetchError = () => ({
    type: FETCH_ERROR,
});

export const fetchCancel = () => ({
    type: FETCH_CANCEL,
});
