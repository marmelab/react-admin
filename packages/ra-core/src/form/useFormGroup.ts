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
                    const fieldState = form.getFieldState(field);
                    let errors = acc.errors;

                    if (fieldState.error) {
                        if (!errors) {
                            errors = {};
                        }
                        errors[field] = fieldState.error;
                    }

                    const newState = {
                        errors,
                        valid: acc.valid && fieldState.valid,
                        invalid: acc.invalid || fieldState.invalid,
                        pristine: acc.pristine && fieldState.pristine,
                        dirty: acc.dirty || fieldState.dirty,
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
            errors: true,
            invalid: true,
            dirty: true,
            pristine: true,
            valid: true,
        }
    );

    return state;
};
