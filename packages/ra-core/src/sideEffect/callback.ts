import { call, takeEvery } from 'redux-saga/effects';

export type CallbackSideEffect = (
    args: {
        payload: any;
        requestPayload?: any;
        error?: string | { message: string };
    }
) => any;

interface ActionWithSideEffect {
    type: string;
    payload: any;
    requestPayload?: any;
    error?: string | { message: string };
    meta: {
        callback: CallbackSideEffect;
    };
}

/**
 * Callback Side Effects
 */
function* handleCallback({
    payload,
    requestPayload,
    error,
    meta: { callback },
}: ActionWithSideEffect) {
    yield call(callback, { payload, requestPayload, error });
}

export default function*() {
    yield takeEvery(
        action => action.meta && action.meta.callback,
        handleCallback
    );
}
