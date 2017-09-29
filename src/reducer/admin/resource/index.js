import { DECLARE_RESOURCES } from '../../../actions';

import data from './data';
import list from './list';

const initialState = {};
export default (
    previousState = initialState,
    action,
    dataReducer = data,
    listReducer = list
) => {
    if (action.type === DECLARE_RESOURCES) {
        const newState = action.payload.reduce(
            (acc, resource) => ({
                ...acc,
                [resource.name]: {
                    props: resource,
                    data: dataReducer(resource.name)(undefined, action),
                    list: listReducer(resource.name)(undefined, action),
                },
            }),
            {}
        );
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

export const getResources = state =>
    Object.keys(state).map(key => state[key].props);
