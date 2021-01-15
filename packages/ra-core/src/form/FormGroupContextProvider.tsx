import * as React from 'react';
import { ReactNode, useEffect } from 'react';
import { FormGroupContext } from './FormGroupContext';
import { useFormContext } from './useFormContext';

/**
 * This provider allows its input children to register to a specific group.
 * This enables other components in the group to access group properties such as its
 * validation (valid/invalid) or whether its inputs have been updated (dirty/pristine).
 * @param props The component props
 * @param {ReactNode} props.children The form group content
 * @param {String} props.name The form group name
 */
export const FormGroupContextProvider = ({
    children,
    name,
}: {
    children: ReactNode;
    name: string;
}) => {
    const formContext = useFormContext();

    useEffect(() => {
        if (!formContext) {
            console.warn(
                `The FormGroupContextProvider can only be used inside a FormContext such as provided by the SimpleForm and TabbedForm components`
            );
            return;
        }
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
