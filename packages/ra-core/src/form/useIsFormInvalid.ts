import { useEffect, useState, useRef } from 'react';
import { useFormState, FormState, FieldValues } from 'react-hook-form';

/**
 * This hook returns a boolean indicating whether the form is invalid.
 * We use this to display an error message on submit in Form and SaveButton.
 *
 * We can't do the form validity check in the form submit handler
 * as the form state may not have been updated yet when onSubmit validation mode is enabled
 * or when the form hasn't been touched at all.
 */
export const useIsFormInvalid = <
    TFieldValues extends FieldValues = FieldValues
>({
    isValid: isValidFromProps,
    submitCount: submitCountFromProps,
    errors: errorsFromProps,
}: UseIsFormInvalidProps<TFieldValues> = {}) => {
    const [isInvalid, setIsInvalid] = useState(false);
    const {
        isValid: isValidFromContext,
        submitCount: submitCountFromContext,
        errors: errorsFromContext,
    } = useFormState();
    const isValid =
        typeof isValidFromProps !== 'undefined'
            ? isValidFromProps
            : isValidFromContext;
    const submitCount =
        typeof submitCountFromProps !== 'undefined'
            ? submitCountFromProps
            : submitCountFromContext;
    const errors =
        typeof errorsFromProps !== 'undefined'
            ? errorsFromProps
            : errorsFromContext;
    const submitCountRef = useRef(submitCount);

    useEffect(() => {
        // Checking the submit count allows us to only display the notification after users
        // tried to submit
        if (submitCount > submitCountRef.current) {
            submitCountRef.current = submitCount;

            // For some reason, the validation state might not be sync yet on first submit
            // so we need to check if there are actually some errors even though the isValid is false
            if (Object.keys(errors).length > 0 && !isValid) {
                setIsInvalid(true);
            } else {
                setIsInvalid(false);
            }
        }
    }, [errors, isValid, submitCount]);

    return isInvalid;
};

export type UseIsFormInvalidProps<
    TFieldValues extends FieldValues = FieldValues
> = Partial<
    Pick<FormState<TFieldValues>, 'isValid' | 'submitCount' | 'errors'>
>;
