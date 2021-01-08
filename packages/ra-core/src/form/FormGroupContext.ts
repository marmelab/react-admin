import { createContext } from 'react';

export const FormGroupContext = createContext<FormGroupContextValue>(undefined);

export type FormGroupContextValue = string;
