import { put, takeEvery } from 'redux-saga/effects';
import { push } from 'react-router-redux';
import { reset } from 'redux-form';

import resolveRedirectTo from '../util/resolveRedirectTo';
import { REDUX_FORM_NAME } from '../form';

/**
 * Redirection Side Effects
 */
export function* handleRedirection({
    payload,
    requestPayload,
    meta: { basePath, redirectTo, formName = REDUX_FORM_NAME },
}) {
    return redirectTo
        ? yield put(
              push(
                  resolveRedirectTo(
                      redirectTo,
                      basePath,
                      payload
                          ? payload.id ||
                            (payload.data ? payload.data.id : null)
                          : requestPayload ? requestPayload.id : null,
                      payload && payload.data
                          ? payload.data
                          : requestPayload && requestPayload.data
                            ? requestPayload.data
                            : null
                  )
              )
          )
        : yield put(reset(formName)); // explicit no redirection, reset the form
}

export default function*() {
    yield takeEvery(
        action => action.meta && typeof action.meta.redirectTo !== 'undefined',
        handleRedirection
    );
}
