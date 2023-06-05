import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import get from 'lodash/get';
import { useRecordContext } from '../controller';
import { InputProps } from './useInput';

/*
 * This hook updates the input with the default value if default value is present
 * and field input is not already populated or dirty
 */
export const useApplyInputDefaultValues = (
    props: Partial<InputProps> & { source: string }
) => {
    const { defaultValue, source } = props;
    const record = useRecordContext(props);
    const {
        getValues,
        resetField,
        getFieldState,
        formState,
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

        resetField(source, { defaultValue });
    });
};
