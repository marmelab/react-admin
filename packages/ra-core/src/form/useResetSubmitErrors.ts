import { useRef } from 'react';
import { useForm, useFormState } from 'react-final-form';

/**
 * Reset the submission error when the corresponding field changes.
 * final-form doesn't do this by default.
 */
const useResetSubmitErrors = () => {
    const { mutators } = useForm();
    const { values } = useFormState({ subscription: { values: true } });
    const prevValues = useRef(values);
    useFormState({
        onChange: ({ values }) => {
            mutators.resetSubmitErrors({
                current: values,
                prev: prevValues.current,
            });

            prevValues.current = values;
        },
        subscription: { values: true },
    });
};

export default useResetSubmitErrors;
