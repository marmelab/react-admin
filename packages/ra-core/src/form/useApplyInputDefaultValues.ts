import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import get from 'lodash/get';
import { useRecordContext } from '../controller';
import { InputProps } from './useInput';

/*
 * This hook updates the input default value whenever the record changes
 * It applies either the record value if it has one or the defaultValue if it was specified
 */
export const useApplyInputDefaultValues = (props: Partial<InputProps>) => {
    const { defaultValue, source } = props;
    const record = useRecordContext(props);
    const { getValues, resetField } = useFormContext();
    const recordValue = get(record, source);
    const formValue = get(getValues(), source);

    useEffect(() => {
        if (defaultValue == null) return;
        if (formValue == null && recordValue == null) {
            resetField(source, { defaultValue });
        }
    });
};
