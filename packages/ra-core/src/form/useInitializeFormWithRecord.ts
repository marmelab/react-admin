import { useEffect } from 'react';
import { useForm } from 'react-final-form';
import isEqual from 'lodash/isEqual';
import getFormInitialValues from './getFormInitialValues';

/**
 * Restore the record values which should override any default values specified on the form.
 */
const useInitializeFormWithRecord = record => {
    const form = useForm();

    useEffect(() => {
        if (!record) {
            return;
        }

        const initialValues = getFormInitialValues(
            form.getState().initialValues,
            undefined,
            record
        );

        if (isEqual(form.getState().initialValues, initialValues)) {
            return;
        }

        // Disable this option when re-initializing the form because in this case, it should reset the dirty state of all fields
        // We do need to keep this option for dynamically added inputs though which is why it is kept at the form level
        form.setConfig('keepDirtyOnReinitialize', false);
        form.restart(initialValues);
        form.setConfig('keepDirtyOnReinitialize', true);
    }, [form, JSON.stringify(record)]); // eslint-disable-line react-hooks/exhaustive-deps
};

export default useInitializeFormWithRecord;
