import * as React from 'react';
import { ReactNode, useEffect } from 'react';
import { FormGroupContext } from './FormGroupContext';
import { useFormContext } from './useFormContext';

export const FormGroupContextProvider = ({
    children,
    name,
}: {
    children: ReactNode;
    name: string;
}) => {
    const formContext = useFormContext();

    useEffect(() => {
        formContext.registerGroup(name);

        return () => {
            formContext.unregisterGroup(name);
        };
    }, [formContext, name]);

    return (
        <FormGroupContext.Provider value={name}>
            {children}
        </FormGroupContext.Provider>
    );
};
