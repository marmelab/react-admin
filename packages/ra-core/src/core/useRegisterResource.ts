import { useDispatch, useSelector } from 'react-redux';
import isEqual from 'lodash/isEqual';

import { registerResource } from '../actions';
import { ReduxState, ResourceDefinition } from '../types';

export const useRegisterResource = () => {
    const dispatch = useDispatch();
    const resources = useSelector<ReduxState>(state => state.admin.resources);

    return (resource: ResourceDefinition) => {
        if (
            !resources[resource.name] ||
            !isEqual(resources[resource.name]?.props, resource)
        ) {
            dispatch(registerResource(resource));
        }
    };
};
