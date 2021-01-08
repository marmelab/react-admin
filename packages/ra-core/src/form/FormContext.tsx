import { createContext } from 'react';
import { FormContextValue } from '../types';

const FormContext = createContext<FormContextValue>(undefined);

FormContext.displayName = 'FormContext';

export default FormContext;
