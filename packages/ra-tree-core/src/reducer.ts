import { CLOSE_NODE, TOGGLE_NODE, EXPAND_NODE } from './actions';
import { GET_ROOT_NODES, GET_LEAF_NODES } from './fetch';
import { FETCH_END } from 'ra-core';

const initialState = {};

export default (state = initialState, { type, payload, meta }) => {
    if (!meta) {
        return state;
    }

    if (
        GET_ROOT_NODES === meta.fetchResponse &&
        meta.fetchStatus === FETCH_END
    ) {
        if (!meta.resource) {
            console.warn(`The ${type} action does not have a resource meta`); // eslint-disable-line
            return state;
        }
        const resourceState = state[meta.resource] || { ids: [], data: {} };
        return {
            ...state,
            [meta.resource]: {
                ...resourceState,
                ids: Array.from(
                    new Set(
                        resourceState.ids.concat(
                            payload.data.map(({ id }) => id)
                        )
                    )
                ),
                data: payload.data.reduce((acc, item) => {
                    acc[item.id] = item;
                    return acc;
                }, resourceState.data),
            },
        };
    }
    if (
        GET_LEAF_NODES === meta.fetchResponse &&
        meta.fetchStatus === FETCH_END
    ) {
        if (!meta.resource) {
            console.warn(`The ${type} action does not have a resource meta`); // eslint-disable-line
            return state;
        }
        const resourceState = state[meta.resource] || { ids: [], data: {} };
        return {
            ...state,
            [meta.resource]: {
                ...resourceState,
                ids: Array.from(
                    new Set(
                        resourceState.ids.concat(
                            payload.data.map(({ id }) => id)
                        )
                    )
                ),
                data: payload.data.reduce((acc, item) => {
                    acc[item.id] = item;
                    return acc;
                }, resourceState.data),
            },
        };
    }

    if ([CLOSE_NODE, TOGGLE_NODE, EXPAND_NODE].includes(type)) {
        if (!meta.resource) {
            console.warn(`The ${type} action does not have a resource meta`); // eslint-disable-line
            return state;
        }

        return {
            ...state,
            [meta.resource]: {
                ...(state[meta.resource] || {}),
                [payload]:
                    type === TOGGLE_NODE
                        ? state[meta.resource]
                            ? !state[meta.resource][payload]
                            : true
                        : type === EXPAND_NODE,
            },
        };
    }

    return state;
};
