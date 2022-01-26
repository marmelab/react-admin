import { useEffect, useState, useRef } from 'react';
import { useFormState } from 'react-hook-form';

/**
 * This hook returns a boolean indicating whether the form is invalid.
 * We use this to display an error message on submit in Form and SaveButton.
 *
 * We can't do the form validity check in the form submit handler
 * as the form state may not have been updated yet when onSubmit validation mode is enabled
 * or when the form hasn't been touched at all.
 */
export const useIsFormInvalid = () => {
    const [isInvalid, setIsInvalid] = useState(false);
    const { isValid, submitCount } = useFormState();
    const submitCountRef = useRef(submitCount);

    useEffect(() => {
        // Checking the submit count allows us to only display the notification after users
        // tried to submit
        if (submitCount > submitCountRef.current) {
            submitCountRef.current = submitCount;

            setIsInvalid(!isValid);
        }
    }, [isValid, submitCount]);

    return isInvalid;
};
