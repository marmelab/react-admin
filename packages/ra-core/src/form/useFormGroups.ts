import { useContext } from 'react';
import { FormGroupsContext } from './FormGroupsContext';

/**
 * Retrieve the form groups management context. Used by inputs to register themselves into a form group.
 */
export const useFormGroups = () => {
    const context = useContext(FormGroupsContext);
    return context;
};
