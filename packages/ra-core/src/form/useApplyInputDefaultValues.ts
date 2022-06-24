import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import get from 'lodash/get';
import { useRecordContext } from '../controller';
import { InputProps } from './useInput';

/*
 * This hook updates the input default value whenever the record changes
 * It applies either the record value if it has one or the defaultValue if it was specified
 */
export const useApplyInputDefaultValues = (
    props: Partial<InputProps> & { source: string }
) => {
    const { defaultValue, source } = props;
    const record = useRecordContext(props);
    const { getValues, resetField } = useFormContext();
    const recordValue = get(record, source);
    const formValue = get(getValues(), source);

    useEffect(() => {
        if (defaultValue == null) return;
        if (formValue == null && recordValue == null) {
            // special case for ArrayInput: since we use get(record, source),
            // if source is like foo.23.bar, this effect will run.
            // but we only want to set the default value for the subfield bar
            // if the record actually has a value for foo.23
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
            resetField(source, { defaultValue });
        }
    });
};

const numericRegex = /^\d+$/;
