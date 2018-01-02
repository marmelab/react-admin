export const PROMISE = 'RA/PROMISE_ACTION';

const defaultAction = payload => ({ payload });
const status = ['REQUEST', 'LOADING', 'SUCCESS', 'FAILURE'];

function promisingActionCreator(
    requestAction,
    types,
    actionCreator = defaultAction
) {
    const actionMethods = {};
    const formAction = payload => ({
        type: PROMISE,
        payload,
    });

    // Allow a type prefix to be passed in
    if (typeof requestAction === 'string') {
        requestAction = status.map(s => {
            let a = status[0] === s ? requestAction : `${requestAction}_${s}`;
            let subAction = (...payload) => ({
                type: a,
                ...actionCreator(...payload),
            });

            // translate specific actionType to generic actionType
            actionMethods[s] = a;
            actionMethods[s.toLowerCase()] = subAction;

            return subAction;
        })[0];

        if (types) {
            actionCreator = types;
        }

        types = [actionMethods.SUCCESS, actionMethods.FAILURE];
    }

    if (types.length !== 2) {
        throw new Error('Must include two action types: [ SUCCESS, FAILURE ]');
    }

    return Object.assign((data, dispatch) => {
        // Behave like a normal actionCreator
        if (!dispatch) return requestAction(data);

        return new Promise((resolve, reject) => {
            dispatch(
                formAction({
                    request: requestAction(data),
                    defer: { resolve, reject },
                    types,
                })
            );
        });
    }, actionMethods);
}

export { promisingActionCreator };
