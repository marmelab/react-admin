export const CANCELLABLE = 'RA/CANCELLABLE';
export const CANCEL = 'RA/CANCEL';
export const START_OPTIMISTIC_MODE = 'RA/START_OPTIMISTIC_MODE';
export const STOP_OPTIMISTIC_MODE = 'RA/STOP_OPTIMISTIC_MODE';

export const startCancellable = (action, delay = 3000) => ({
    type: CANCELLABLE,
    payload: { action, delay },
});

export const cancel = () => ({
    type: CANCEL,
});

export const startOptimisticMode = () => ({
    type: START_OPTIMISTIC_MODE,
});

export const stopOptimisticMode = () => ({
    type: STOP_OPTIMISTIC_MODE,
});
