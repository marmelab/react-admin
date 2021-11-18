import { useDispatch, useSelector } from 'react-redux';
import isEqual from 'lodash/isEqual';

import { registerResource } from '../actions';
import { ReduxState, ResourceDefinition } from '../types';

export const useRegisterResource = () => {
    const dispatch = useDispatch();
    const knowResources = useSelector<ReduxState>(
        state => state.admin.resources
    );

    return (...resources: ResourceDefinition[]) => {
        resources.forEach(resource => {
            if (
                !knowResources[resource.name] ||
                !isEqual(knowResources[resource.name]?.props, resource)
            ) {
                dispatch(registerResource(resource));
            }
        });
    };
};
