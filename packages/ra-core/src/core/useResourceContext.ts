import { useContext } from 'react';
import { ResourceContext, ResourceContextValue } from './ResourceContext';

/**
 * Hook to read the resource from the ResourceContext.
 *
 * Must be used within a <ResourceContextProvider> (e.g. as a descendent of <Resource>
 * or any reference related components).
 *
 * @returns {ResourceContextValue} The resource
 */
export const useResourceContext = <
    ResourceInformationsType extends Partial<{ resource: string }>
>(
    props: ResourceInformationsType
): ResourceContextValue => {
    const context = useContext(ResourceContext);

    if (!context) {
        /**
         * The element isn't inside a <ResourceContextProvider>
         *
         * @deprecated - to be removed in 4.0
         */
        if (process.env.NODE_ENV !== 'production') {
            // Restore this message when ResourceContext is actually used
            // console.warn(
            //     "Any react-admin components must be used inside a <ResourceContextProvider>. Relying on props rather than context to get the resource data is deprecated and won't be supported in the next major version of react-admin."
            // );
        }
        // Ignored because resource is often optional (as it is injected) in components which passes the props to this hook
        return props.resource;
    }

    return context;
};
