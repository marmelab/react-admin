import { createContext } from 'react';
import { SetOnSave } from '../types';

export const FormContext = createContext<FormContextValue>(undefined);

export type FormContextValue = {
    setOnSave: (newOnSave: SetOnSave) => void;
};
