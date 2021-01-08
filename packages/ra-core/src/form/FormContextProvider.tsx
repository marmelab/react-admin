import * as React from 'react';
import { ReactNode } from 'react';
import { FormContextValue } from '../types';
import { FormContext } from './FormContext';

export const FormContextProvider = ({
    children,
    value,
}: {
    children: ReactNode;
    value: FormContextValue;
}) => <FormContext.Provider value={value}>{children}</FormContext.Provider>;
