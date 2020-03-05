import { createContext } from 'react';
import { FormFunctions } from '../types';

const defaultFormFunctions: FormFunctions = { setOnSave: () => {} };

const FormContext = createContext<FormFunctions>(defaultFormFunctions);

FormContext.displayName = 'FormContext';

export default FormContext;
