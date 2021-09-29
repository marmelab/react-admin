import { useContext } from 'react';
import { ResourceContext, ResourceContextValue } from './ResourceContext';

/**
 * Hook to read the resource from the ResourceContext.
 *
 * Must be used within a <ResourceContextProvider> (e.g. as a descendent of <Resource>
 * or any reference related components), or called with a resource prop.
 *
 * @example
 *
 * const ResourceName = (props) => {
 *   const resource = useResourceContext(props);
 *   const getResourceLabel = useGetResourceLabel();
 *   return <>{getResourceLabel(resource, 1)}</>;
 * }
 *
 * // use it in a resource context
 * const MyComponent = () => (
 *   <ResourceContextProvider value="posts">
 *     <ResourceName />
 *     ...
 *   </ResourceContextProvider>
 * );
 *
 * // override resource via props
 * const MyComponent = () => (
 *   <>
 *     <ResourceName resource="posts"/>
 *     ...
 *   </>
 * );
 *
 * @returns {ResourceContextValue} The resource name, e.g. 'posts'
 */
export const useResourceContext = <
    ResourceInformationsType extends Partial<{ resource: string }>
>(
    props?: ResourceInformationsType
): ResourceContextValue => {
    const context = useContext(ResourceContext);
    return (props && props.resource) || context;
};
