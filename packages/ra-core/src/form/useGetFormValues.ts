import { useForm } from 'react-final-form';

/**
 * This hook returns a function that can be used to get the current values of the form.
 */
export const useGetFormValues = <ValuesType = Record<string, any>>() => {
    const form = useForm<ValuesType>();

    return () => {
        return form.getState().values;
    };
};
