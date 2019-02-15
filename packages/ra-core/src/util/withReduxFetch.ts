import { connect } from 'react-redux';

export default Component =>
    connect(
        null,
        dispatch => ({
            reduxFetch: (resource: string, verb, payload: any, meta = {}) =>
                new Promise((resolve, reject) => {
                    const action = {
                        type: 'CUSTOM_FETCH',
                        payload,
                        meta: {
                            ...meta,
                            resource,
                            fetch: verb,
                            onSuccess: { callback: resolve },
                            onError: { callback: reject },
                        },
                    };

                    return dispatch(action);
                }),
        })
    )(Component);
