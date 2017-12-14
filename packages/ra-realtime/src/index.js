import { LOCATION_CHANGE } from 'react-router-redux';
import { takeLatest, call, put, take, cancelled } from 'redux-saga/effects';
import {
    CRUD_GET_LIST,
    CRUD_GET_ONE,
    FETCH_START,
    FETCH_END,
} from 'react-admin';
import omit from 'lodash.omit';

import buildAorAction from './buildAorAction';
import createObserverChannel from './createObserverChannel';

export const watchCrudActionsFactory = observeQuery =>
    function* watchCrudActions(action) {
        const {
            payload: params,
            meta: { fetch: fetchType, resource },
        } = action;
        const observer = yield call(observeQuery, fetchType, resource, params);

        if (!observer) return;

        const queryChannel = yield call(createObserverChannel, observer);

        try {
            while (true) { // eslint-disable-line
                const parsedApolloQueryResult = yield take(queryChannel);
                const { type, payload, meta } = action;

                yield [
                    put({
                        type: `${type}_LOADING`,
                        payload,
                        meta: omit(meta, 'fetch'),
                    }),
                    put({ type: FETCH_START }),
                ];

                const aorAction = yield call(
                    buildAorAction,
                    action,
                    parsedApolloQueryResult
                );

                yield put(aorAction);

                yield put({ type: FETCH_END });
            }
        } finally {
            if (yield cancelled() && queryChannel) {
                queryChannel.close();
            }
        }
    };

export const watchLocationChangeFactory = watchCrudActions =>
    function* watchLocationChange() {
        yield takeLatest([CRUD_GET_LIST, CRUD_GET_ONE], watchCrudActions);
    };

export default observeQuery =>
    function* aorGraphQlSaga() {
        const watchCrudActions = watchCrudActionsFactory(observeQuery);
        yield takeLatest(
            LOCATION_CHANGE,
            watchLocationChangeFactory(watchCrudActions)
        );
    };
