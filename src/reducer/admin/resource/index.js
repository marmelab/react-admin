import { DECLARE_RESOURCES } from '../../../actions';

import data from './data';
import list from './list';

const initialState = {};
export default (previousState = initialState, action) => {
    if (action.type === DECLARE_RESOURCES) {
        const newState = action.payload.reduce(
            (acc, resource) => ({
                ...acc,
                [resource.name]: {
                    props: resource,
                    data: data(resource.name)(undefined, action),
                    list: list(resource.name)(undefined, action),
                },
            }),
            {}
        );
        return newState;
    }

    const resources = Object.keys(previousState);
    const newState = resources.reduce(
        (acc, resource) => ({
            ...acc,
            [resource]: {
                props: previousState[resource].props,
                data: data(resource)(previousState[resource].data, action),
                list: list(resource)(previousState[resource].list, action),
            },
        }),
        {}
    );

    return newState;
};

export const getResources = state =>
    Object.keys(state).map(key => state[key].props);
