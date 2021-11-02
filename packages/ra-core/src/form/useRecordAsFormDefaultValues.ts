import { useFormContext } from 'react-hook-form';
import { useDeepCompareEffect } from '../util';
import { Record } from '../types';

/**
 * This hook resets the form default values to the values of the record whenever
 * it changes. This is needed when navigating from an edit page to another for
 * example.
 * @param record The current record.
 */
export const useRecordAsFormDefaultValues = (record: Record) => {
    const { reset } = useFormContext();

    useDeepCompareEffect(() => {
        if (record) {
            reset(record);
        }
    }, [record, reset]);
};
