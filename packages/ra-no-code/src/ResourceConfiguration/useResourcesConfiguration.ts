import { useContext } from 'react';
import { ResourceConfigurationContext } from './ResourceConfigurationContext';

/**
 * This hooks returns a tuple containing a map of the resources indexed by name as the first element, and an object providing helper functions to manipulate them as its second element.
 *
 * @example
 * const [resources, helpers] = useResourcesConfiguration();
 *
 * console.log(resources); // { customer: { name: 'customers', label: 'Customers', fields: [] } }
 *
 * helpers.addResource({ name: 'orders', label: 'Orders' });
 * helpers.updateResource('orders', { label: 'Commands' });
 * helpers.removeResource('orders');
 *
 * @returns {ResourceConfigurationContextValue}
 */
export const useResourcesConfiguration = () => {
    const context = useContext(ResourceConfigurationContext);
    return context;
};
