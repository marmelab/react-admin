import { useEffect } from 'react';

/**
 * Restore the record values which should override any default values specified on the form.
 */
const useInitializeFormWithRecord = (form, record) => {
    useEffect(() => {
        if (!record) {
            return;
        }

        // react-final-form does not provide a way to set multiple values in one call.
        // Using batch ensure we don't get rerenders until all our values are set
        form.batch(() => {
            Object.keys(record).forEach(key => {
                form.change(key, record[key]);
                // Ensure the field stay pristine
                form.resetFieldState(key);
            });
        });
    }, []); // eslint-disable-line
};

export default useInitializeFormWithRecord;
