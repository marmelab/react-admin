import { useContext } from 'react';
import { FormContext } from './FormContext';

/**
 * Retrieve the form context enabling consumers to alter its save function or to register inputs inside a form group.
 * @returns {FormContext} The form context.
 */
export const useFormContext = () => useContext(FormContext);
