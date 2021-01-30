import { useContext } from 'react';
import { FormGroupContext } from './FormGroupContext';

/**
 * Retrieve the name of the form group the consumer belongs to. May be undefined if the consumer is not inside a form group.
 */
export const useFormGroupContext = () => {
    const context = useContext(FormGroupContext);
    return context;
};
