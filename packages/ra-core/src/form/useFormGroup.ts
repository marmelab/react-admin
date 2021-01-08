import { useState } from 'react';
import { useForm } from 'react-final-form';
import isEqual from 'lodash/isEqual';
import { useFormContext } from './useFormContext';

type FormGroupState = {
    errors: object;
    valid: boolean;
    invalid: boolean;
    pristine: boolean;
    dirty: boolean;
};

export const useFormGroup = (name: string): FormGroupState => {
    const form = useForm();
    const formContext = useFormContext();
    const [state, setState] = useState<FormGroupState>({
        errors: undefined,
        valid: true,
        invalid: false,
        pristine: true,
        dirty: false,
    });

    form.subscribe(
        () => {
            const fields = formContext.getGroupFields(name);
            const newState = Array.from(fields).reduce<FormGroupState>(
                (acc, field) => {
                    let error = form.getFieldState(field).error;
                    let errors = acc.errors;

                    if (error) {
                        if (!errors) {
                            errors = {};
                        }
                        errors[field] = error;
                    }

                    const newState = {
                        errors,
                        valid: acc.valid && form.getFieldState(field).valid,
                        invalid:
                            acc.invalid || form.getFieldState(field).invalid,
                        pristine:
                            acc.pristine && form.getFieldState(field).valid,
                        dirty: acc.dirty || form.getFieldState(field).valid,
                    };

                    return newState;
                },
                {
                    errors: undefined,
                    valid: true,
                    invalid: false,
                    pristine: true,
                    dirty: false,
                }
            );

            if (!isEqual(state, newState)) {
                setState(newState);
            }
        },
        {
            invalid: true,
            dirty: true,
        }
    );

    return state;
};
