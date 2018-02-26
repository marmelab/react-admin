import { all, put, takeEvery } from 'redux-saga/effects';
import { push } from 'react-router-redux';
import {
    CRUD_DELETE,
    CRUD_DELETE_MANY,
    CRUD_UPDATE,
    CRUD_UPDATE_MANY,
} from '../../actions/dataActions';
import { refreshView } from '../../actions/uiActions';
import resolveRedirectTo from '../../util/resolveRedirectTo';

function* handleOptimisticRedirect({ payload }) {
    const actions = [put(refreshView())];
    if (payload.redirectTo) {
        actions.push(
            put(
                push(
                    resolveRedirectTo(
                        payload.redirectTo,
                        payload.basePath,
                        payload.id
                    )
                )
            )
        );
    }
    return yield all(actions);
}

export default function*() {
    yield takeEvery(
        [CRUD_DELETE, CRUD_DELETE_MANY, CRUD_UPDATE, CRUD_UPDATE_MANY],
        handleOptimisticRedirect
    );
}
