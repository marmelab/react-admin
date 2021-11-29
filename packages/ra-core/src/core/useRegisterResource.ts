import { useDispatch, useSelector } from 'react-redux';
import isEqual from 'lodash/isEqual';

import { registerResource } from '../actions';
import { ReduxState, ResourceDefinition } from '../types';

export const useRegisterResource = () => {
    const dispatch = useDispatch();
    const knownResources = useSelector<ReduxState>(
        state => state.admin.resources
    );

    return (...resources: ResourceDefinition[]) => {
        resources.forEach(resource => {
            if (
                !knownResources[resource.name] ||
                !isEqual(knownResources[resource.name]?.props, resource)
            ) {
                dispatch(registerResource(resource));
            }
        });
    };
};
