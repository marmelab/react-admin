import { REGISTER_RESOURCE, UNREGISTER_RESOURCE } from '../../../actions';

import data from './data';
import list from './list';

const initialState = {};
export default (
    previousState = initialState,
    action,
    dataReducer = data,
    listReducer = list
) => {
    if (action.type === REGISTER_RESOURCE) {
        const newState = {
            ...previousState,
            [action.payload.name]: {
                props: action.payload,
                data: dataReducer(action.payload.name)(undefined, action),
                list: listReducer(action.payload.name)(undefined, action),
            },
        };
        return newState;
    }

    if (action.type === UNREGISTER_RESOURCE) {
        const newState = Object.keys(previousState).reduce((acc, key) => {
            if (key === action.payload) {
                return acc;
            }

            return { ...acc, [key]: previousState[key] };
        }, {});
        return newState;
    }

    if (!action.meta || !action.meta.resource) {
        return previousState;
    }

    const resources = Object.keys(previousState);
    const newState = resources.reduce(
        (acc, resource) => ({
            ...acc,
            [resource]:
                action.meta.resource === resource
                    ? {
                          props: previousState[resource].props,
                          data: dataReducer(resource)(
                              previousState[resource].data,
                              action
                          ),
                          list: listReducer(resource)(
                              previousState[resource].list,
                              action
                          ),
                      }
                    : {
                          props: previousState[resource].props,
                          data: previousState[resource].data,
                          list: previousState[resource].list,
                      },
        }),
        {}
    );

    return newState;
};

export const getResource = (state, resource) => state[resource];

export const getResources = state =>
    Object.keys(state).map(key => state[key].props);
