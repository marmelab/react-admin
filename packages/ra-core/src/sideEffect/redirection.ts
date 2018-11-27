import { put, takeEvery } from 'redux-saga/effects';
import { push } from 'react-router-redux';
import { reset } from 'redux-form';

import resolveRedirectTo from '../util/resolveRedirectTo';

export type RedirectionSideEffect = string;

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
        redirectTo: RedirectionSideEffect | boolean;
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
    return redirectTo
        ? yield put(
              push(
                  resolveRedirectTo(
                      redirectTo,
                      basePath,
                      payload
                          ? payload.id ||
                            (payload.data ? payload.data.id : null)
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
          )
        : yield put(reset('record-form')); // explicit no redirection, reset the form
}

export default function*() {
    yield takeEvery(
        // @ts-ignore
        action => action.meta && typeof action.meta.redirectTo !== 'undefined',
        handleRedirection
    );
}
