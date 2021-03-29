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

        // Disable this option when re-initializing the form because in this case, it should reset the dirty state of all fields
        // We do need to keep this option for dynamically added inputs though which is why it is kept at the form level
        form.setConfig('keepDirtyOnReinitialize', false);
        form.restart(initialValuesMergedWithRecord);
        form.setConfig('keepDirtyOnReinitialize', true);
    }, [form, JSON.stringify(record)]); // eslint-disable-line react-hooks/exhaustive-deps
};

export default useInitializeFormWithRecord;
