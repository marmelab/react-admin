import { useFormContext } from 'react-hook-form';
import get from 'lodash/get';
import { useDeepCompareEffect } from '../util/hooks';
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

    useDeepCompareEffect(() => {
        if (
            (!record || get(record, source) == undefined) && // eslint-disable-line eqeqeq
            get(getValues(), source) == undefined && // eslint-disable-line eqeqeq
            defaultValue != undefined // eslint-disable-line eqeqeq
        ) {
            resetField(source, {
                defaultValue: get(record, source, defaultValue),
            });
        }
    }, [record, JSON.stringify(defaultValue)]);
};
