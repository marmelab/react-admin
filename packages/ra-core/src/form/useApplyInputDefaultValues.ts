import { useEffect } from 'react';
import {
    FieldValues,
    UseFieldArrayReturn,
    useFormContext,
} from 'react-hook-form';
import get from 'lodash/get';
import { useRecordContext } from '../controller';
import { InputProps } from './useInput';

interface StandardInput {
    inputProps: Partial<InputProps> & { source: string };
    isArrayInput?: undefined;
    fieldArrayInputControl?: undefined;
}

interface ArrayInput {
    inputProps: Partial<InputProps> & { source: string };
    isArrayInput: true;
    fieldArrayInputControl: UseFieldArrayReturn<FieldValues, string, 'id'>;
}

type Props = StandardInput | ArrayInput;

/*
 * This hook updates the input with the default value if default value is present
 * and field input is not already populated or dirty
 */
export const useApplyInputDefaultValues = ({
    inputProps,
    isArrayInput,
    fieldArrayInputControl,
}: Props) => {
    const { defaultValue, source } = inputProps;
    const record = useRecordContext(inputProps);
    const {
        getValues,
        resetField,
        getFieldState,
        formState,
        reset,
    } = useFormContext();
    const recordValue = get(record, source);
    const formValue = get(getValues(), source);
    const { isDirty } = getFieldState(source, formState);

    useEffect(() => {
        if (
            defaultValue == null ||
            formValue != null ||
            recordValue != null ||
            isDirty
        ) {
            return;
        }

        // Side note: For Array Input but checked for all to avoid possible regression
        // Since we use get(record, source), if source is like foo.23.bar,
        // this effect will run. However we only want to set the default value
        // for the subfield bar if the record actually has a value for foo.23
        const pathContainsIndex = source
            .split('.')
            .some(pathPart => numericRegex.test(pathPart));
        if (pathContainsIndex) {
            const parentPath = source.split('.').slice(0, -1).join('.');
            const parentValue = get(getValues(), parentPath);
            if (parentValue == null) {
                // the parent is undefined, so we don't want to set the default value
                return;
            }
        }

        if (isArrayInput) {
            if (!fieldArrayInputControl) {
                throw new Error(
                    'useApplyInputDefaultValues: No fieldArrayInputControl passed in props for array input usage'
                );
            }

            // We need to update inputs nested in array using react hook forms
            // own array controller rather then the generic reset to prevent control losing
            // context of the nested inputs
            fieldArrayInputControl.replace(defaultValue);
            // resets the form so that control no longer sees the form as dirty after
            // defaults applied
            reset({}, { keepValues: true });

            return;
        }

        resetField(source, { defaultValue });
    });
};

const numericRegex = /^\d+$/;
