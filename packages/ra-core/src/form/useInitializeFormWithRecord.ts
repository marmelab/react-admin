import { useEffect } from 'react';
import { useForm } from 'react-final-form';
import merge from 'lodash/merge';

/**
 * Restore the record values which should override any default values specified on the form.
 */
const useInitializeFormWithRecord = record => {
    const form = useForm();

    useEffect(() => {
        if (!record) {
            return;
        }

        const initialValues = form.getState().initialValues;
        const initialValuesMergedWithRecord = merge({}, initialValues, record);
        form.initialize(initialValuesMergedWithRecord);
    }, [form, JSON.stringify(record)]); // eslint-disable-line react-hooks/exhaustive-deps
};

export default useInitializeFormWithRecord;
