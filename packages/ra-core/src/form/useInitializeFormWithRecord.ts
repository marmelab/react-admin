import { useEffect } from 'react';
import { useForm } from 'react-final-form';
import { isObject } from '../inference/assertions';

/**
 * Restore the record values which should override any default values specified on the form.
 */
const useInitializeFormWithRecord = record => {
    const form = useForm();

    useEffect(() => {
        if (!record) {
            return;
        }

        const registeredFields = form.getRegisteredFields();

        // react-final-form does not provide a way to set multiple values in one call.
        // Using batch ensure we don't get rerenders until all our values are set
        form.batch(() => {
            Object.keys(record).forEach(key => {
                // We have to check that the record key is actually registered as a field
                // as some record keys may not have a matching input
                if (registeredFields.some(field => field === key)) {
                    if (Array.isArray(record[key])) {
                        // array of values
                        record[key].forEach((value, index) => {
                            if (
                                isObject(value) &&
                                Object.keys(value).length > 0
                            ) {
                                // array of objects
                                Object.keys(value).forEach(key2 => {
                                    form.change(
                                        `${key}[${index}].${key2}`,
                                        value[key2]
                                    );
                                });
                            } else {
                                // array of scalar values
                                form.change(`${key}[${index}]`, value);
                            }
                        });
                    } else {
                        // scalar value
                        form.change(key, record[key]);
                    }
                    form.resetFieldState(key);
                }
            });
        });
    }, [form, JSON.stringify(record)]); // eslint-disable-line react-hooks/exhaustive-deps
};

export default useInitializeFormWithRecord;
