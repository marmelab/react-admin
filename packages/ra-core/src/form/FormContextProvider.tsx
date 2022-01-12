import * as React from 'react';
import { ReactNode } from 'react';
import { FormContext, FormContextValue } from './FormContext';
import { FormGroupsProvider } from './FormGroupsProvider';

/**
 * Provides utilities to Form children, allowing them to change the default save function or register inputs to a group.
 * @param props The component props
 * @param {ReactNode} props.children The form content
 * @param {FormContextValue} props.value The form context
 */
export const FormContextProvider = ({
    children,
    value,
}: {
    children: ReactNode;
    value: FormContextValue;
}) => (
    <FormContext.Provider value={value}>
        <FormGroupsProvider>{children}</FormGroupsProvider>
    </FormContext.Provider>
);
