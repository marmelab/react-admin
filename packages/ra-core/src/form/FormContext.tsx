import { createContext } from 'react';
import { FormContextValue } from '../types';

export const FormContext = createContext<FormContextValue>(undefined);
