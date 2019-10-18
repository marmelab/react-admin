import data from './data';
import nodes from './nodes';
import expanded from './expanded';
import loading from './loading';

const initialState = {};

export default (previousState = initialState, action) => {
    if (!action.meta || !action.meta.resource) {
        return previousState;
    }

    const previousResource = previousState[action.meta.resource] || {};
    return {
        ...previousState,
        [action.meta.resource]: {
            data: data(previousResource.data, action),
            nodes: nodes(previousResource.nodes, action),
            expanded: expanded(previousResource.expanded, action),
            loading: loading(previousResource.loading, action),
        },
    };
};
