import resource from './resource';
import { DECLARE_RESOURCES } from '../../actions';

export const initialState = {};

export default (
    previousState = initialState,
    action,
    resourceReducer = resource
) => {
    if (action.type === DECLARE_RESOURCES) {
        return action.payload.reduce(
            (acc, resource) => ({
                ...acc,
                [resource.name]: resourceReducer(resource)(undefined, action),
            }),
            {}
        );
    }

    if (action.meta && action.meta.resource) {
        return Object.keys(previousState).reduce(
            (acc, resource) => ({
                ...acc,
                [resource]:
                    action.meta.resource === resource
                        ? resourceReducer({ name: resource })(
                              previousState[resource],
                              action
                          )
                        : previousState[resource],
            }),
            {}
        );
    }

    return previousState;
};

export const mapToProps = state =>
    Object.keys(state).map(key => state[key].props);
