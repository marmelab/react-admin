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
        // Since the submit function returns a promise, use setTimeout to prevent the error "Cannot reset() in onSubmit()" in final-form
        // It will not be necessary anymore when the next version of final-form will be released (see https://github.com/final-form/final-form/pull/363)
        setTimeout(() => {
            // Ignored until next version of final-form is released. See https://github.com/final-form/final-form/pull/376
            // @ts-ignore
            form.restart(initialValuesMergedWithRecord);
            form.setConfig('keepDirtyOnReinitialize', true);
        });
    }, [form, JSON.stringify(record)]); // eslint-disable-line react-hooks/exhaustive-deps
};

export default useInitializeFormWithRecord;
