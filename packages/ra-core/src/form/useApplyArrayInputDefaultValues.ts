import { useEffect } from 'react';
import {
    FieldValues,
    UseFieldArrayReturn,
    useFormContext,
} from 'react-hook-form';
import get from 'lodash/get';
import { useRecordContext } from '../controller';
import { InputProps } from './useInput';

type Props = Partial<InputProps> & {
    source: string;
};

/*
 * This hook updates the array input with the default value if default value is present
 * and field input is not already populated or dirty
 */
export const useApplyArrayInputDefaultValues = (
    inputProps: Props,
    fieldArrayInputControl: UseFieldArrayReturn<FieldValues, string, 'id'>
) => {
    const { defaultValue, source } = inputProps;
    const record = useRecordContext(inputProps);
    const { getValues, getFieldState, formState, reset } = useFormContext();
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

        // We need to update inputs nested in array using react hook forms
        // own array controller rather then the generic reset to prevent control losing
        // context of the nested inputs
        fieldArrayInputControl.replace(defaultValue);
        // resets the form so that control no longer sees the form as dirty after
        // defaults applied
        reset({}, { keepValues: true });
    });
};

const numericRegex = /^\d+$/;
