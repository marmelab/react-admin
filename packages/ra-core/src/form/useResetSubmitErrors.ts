import { useEffect, useRef } from 'react';
import { useForm } from 'react-final-form';

/**
 * Reset the submission error when the corresponding field changes.
 * final-form doesn't do this by default.
 */
const useResetSubmitErrors = () => {
    const form = useForm();
    const prevValues = useRef(form.getState().values);
    useEffect(() => {
        const unsubscribe = form.subscribe(
            ({ values }) => {
                form.mutators.resetSubmitErrors({
                    current: values,
                    prev: prevValues.current,
                });

                prevValues.current = values;
            },
            { values: true }
        );
        return unsubscribe;
    }, [form]);
};

export default useResetSubmitErrors;
