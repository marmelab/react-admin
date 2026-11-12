import { FieldValues, UseFormSetError } from 'react-hook-form';

/**
 * This internal function is used to convert an object matching the form shape with errors to a
 * format compatible with react-hook-form. It's used to handle submission errors. Only useful when
 * you are implementing a custom form without leveraging our Form component.
 *
 * A field can map to a string, or to an array of strings (which are joined into a single message).
 *
 * @example
 * const MyForm = () => {
 *     const { register, handleSubmit, setError } = useForm();
 *     const onSubmit = data => {
 *         return saveAsync(data).catch(error => setSubmissionErrors(error.body.details));
 *     };
 *
 *     return (
 *         <form onSubmit={handleSubmit(onSubmit)}>
 *             ...
 *         </form>
 *     );
 * };
 */
export const setSubmissionErrors = (
    errors: FieldValues,
    setError: UseFormSetError<FieldValues>
) => {
    const setErrorFromObject = (errors: FieldValues, rootPath: string) => {
        Object.entries(errors).forEach(([name, error]) => {
            const path = `${rootPath}${name}`;
            if (error == null) {
                return;
            }
            if (isStringArray(error)) {
                const messages = error.filter(Boolean);
                if (messages.length > 0) {
                    setError(path, {
                        type: 'server',
                        message: messages.join(', '),
                    });
                }
                return;
            }
            if (typeof error === 'object') {
                setErrorFromObject(error, `${path}.`);
                return;
            }
            setError(path, {
                type: 'server',
                message: error.toString(),
            });
        });
    };
    setErrorFromObject(errors, '');
};

const isStringArray = (value: unknown): value is string[] =>
    Array.isArray(value) && value.every(item => typeof item === 'string');
