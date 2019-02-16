import { connect } from 'react-redux';
import get from 'lodash/get';

export default Component =>
    connect(
        null,
        dispatch => ({
            dataProvider: (verb, resource: string, payload: any, meta = {}) =>
                new Promise((resolve, reject) => {
                    const action = {
                        type: 'CUSTOM_FETCH',
                        payload,
                        meta: {
                            ...meta,
                            resource,
                            fetch: verb,
                            onSuccess: {
                                ...get(meta, 'onSuccess', {}),
                                callback: ({ payload: response }) =>
                                    resolve(response),
                            },
                            onFailure: {
                                ...get(meta, 'onFailure', {}),
                                callback: ({ error }) => {
                                    error.message
                                        ? reject(error)
                                        : reject(new Error(error));
                                },
                            },
                        },
                    };

                    return dispatch(action);
                }),
        })
    )(Component);
