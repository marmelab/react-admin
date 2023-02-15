import { useEffect, useRef } from 'react';
import { useFormState, Control } from 'react-hook-form';
import { useNotify } from '../notification';

/**
 * This hook display an error message on submit in Form and SaveButton.
 *
 * We can't do the form validity check in the form submit handler
 * as the form state may not have been updated yet when onSubmit validation mode is enabled
 * or when the form hasn't been touched at all.
 */
export const useNotifyIsFormInvalid = (control?: Control) => {
    const { submitCount, errors } = useFormState(
        control ? { control } : undefined
    );
    const submitCountRef = useRef(submitCount);
    const notify = useNotify();

    useEffect(() => {
        // Checking the submit count allows us to only display the notification after users
        // tried to submit
        if (submitCount > submitCountRef.current) {
            submitCountRef.current = submitCount;

            if (Object.keys(errors).length > 0) {
                notify('ra.message.invalid_form', { type: 'error' });
            }
        }
    }, [errors, submitCount, notify]);
};
