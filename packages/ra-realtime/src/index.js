import { LOCATION_CHANGE } from 'react-router-redux';
import { takeLatest, call, put, take, cancelled } from 'redux-saga/effects';
import {
    CRUD_GET_LIST,
    CRUD_GET_ONE,
    FETCH_START,
    FETCH_END,
} from 'react-admin';
import omit from 'lodash/omit';

import buildAction from './buildAction';
import createObserverChannel from './createObserverChannel';

export const watchCrudActionsFactory = observeRequest =>
    function* watchCrudActions(action) {
        const {
            payload: params,
            meta: { fetch: fetchType, resource },
        } = action;
        const observer = yield call(
            observeRequest,
            fetchType,
            resource,
            params
        );

        if (!observer) return;

        const realtimeChannel = yield call(createObserverChannel, observer);

        try {
            while (true) {
                // eslint-disable-line
                const payload = yield take(realtimeChannel);
                const { type, payload: requestPayload, meta } = action;

                yield [
                    put({
                        type: `${type}_LOADING`,
                        payload: requestPayload,
                        meta: omit(meta, 'fetch'),
                    }),
                    put({ type: FETCH_START }),
                ];

                const raAction = yield call(buildAction, action, payload);

                yield put(raAction);

                yield put({ type: FETCH_END });
            }
        } finally {
            if (yield cancelled() && realtimeChannel) {
                realtimeChannel.close();
            }
        }
    };

export const watchLocationChangeFactory = watchCrudActions =>
    function* watchLocationChange() {
        yield takeLatest([CRUD_GET_LIST, CRUD_GET_ONE], watchCrudActions);
    };

export default observeQuery =>
    function* realtimeSaga() {
        const watchCrudActions = watchCrudActionsFactory(observeQuery);
        yield takeLatest(
            LOCATION_CHANGE,
            watchLocationChangeFactory(watchCrudActions)
        );
    };
