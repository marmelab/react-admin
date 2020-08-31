import { put, takeEvery } from 'redux-saga/effects';
import { push } from 'connected-react-router';

import { Identifier } from '../types';
import resolveRedirectTo from '../util/resolveRedirectTo';
import { refreshView } from '../actions/uiActions';

type RedirectToFunction = (
    basePath: string,
    id: Identifier,
    data: any
) => string;

export type RedirectionSideEffect = string | boolean | RedirectToFunction;

interface ActionWithSideEffect {
    type: string;
    payload?: {
        id?: string | number;
        data?: {
            id?: string | number;
        };
    };
    requestPayload?: {
        id?: string | number;
        data?: {
            id?: string | number;
        };
    };
    meta: {
        redirectTo: RedirectionSideEffect;
        basePath?: string;
    };
}

/**
 * Redirection Side Effects
 */
export function* handleRedirection({
    payload,
    requestPayload,
    meta: { basePath, redirectTo },
}: ActionWithSideEffect) {
    if (!redirectTo) {
        yield put(refreshView());
        return;
    }

    yield put(
        push(
            resolveRedirectTo(
                redirectTo,
                basePath,
                payload
                    ? payload.id || (payload.data ? payload.data.id : null)
                    : requestPayload
                    ? requestPayload.id
                    : null,
                payload && payload.data
                    ? payload.data
                    : requestPayload && requestPayload.data
                    ? requestPayload.data
                    : null
            )
        )
    );
}

export default function* () {
    yield takeEvery(
        // @ts-ignore
        action => action.meta && typeof action.meta.redirectTo !== 'undefined',
        handleRedirection
    );
}
