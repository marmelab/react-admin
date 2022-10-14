import { useContext } from 'react';
import { SubmitContext } from './SubmitContext';

/**
 * Retrieve form submission related props.
 */
export const useSubmitContext = () => {
    const context = useContext(SubmitContext);
    return context;
};
