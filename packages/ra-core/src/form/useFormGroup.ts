import { useMemo } from 'react';
import { useForm } from 'react-final-form';
import { useFormContext } from './useFormContext';

export const useFormGroup = (name: string): FormGroup => {
    const form = useForm();
    const formContext = useFormContext();

    const context = useMemo<FormGroup>(
        () => ({
            errors: () => {
                const fields = formContext.getGroupFields(name);

                return Array.from(fields).reduce(
                    (acc, field) => ({
                        ...acc,
                        [field]: form.getFieldState(field).error,
                    }),
                    {}
                );
            },
            valid: () => {
                const fields = formContext.getGroupFields(name);
                return Array.from(fields).reduce(
                    (acc, field) => form.getFieldState(field).valid && acc,
                    false
                );
            },
            invalid: () => {
                const fields = formContext.getGroupFields(name);
                return Array.from(fields).reduce(
                    (acc, field) => form.getFieldState(field).invalid || acc,
                    false
                );
            },
            pristine: () => {
                const fields = formContext.getGroupFields(name);
                return Array.from(fields).reduce(
                    (acc, field) => form.getFieldState(field).pristine && acc,
                    false
                );
            },
            dirty: () => {
                const fields = formContext.getGroupFields(name);
                return Array.from(fields).reduce(
                    (acc, field) => form.getFieldState(field).dirty || acc,
                    false
                );
            },
        }),
        [form, formContext, name]
    );

    return context;
};

export interface FormGroup {
    valid: () => boolean;
    invalid: () => boolean;
    dirty: () => boolean;
    pristine: () => boolean;
    errors: () => object;
}
