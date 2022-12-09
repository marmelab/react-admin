import { FieldValues, UseFormSetError } from 'react-hook-form';

/**
 * This internal function is used to convert an object matching the form shape with errors to a
 * format compatible with react-hook-form. It's used to handle submission errors. Only useful when
 * you are implementing a custom form without leveraging our Form component.
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
            if (typeof error === 'object') {
                setErrorFromObject(error, `${rootPath}${name}.`);
                return;
            }
            setError(`${rootPath}${name}`, {
                type: 'server',
                message: error.toString(),
            });
        });
    };
    setErrorFromObject(errors, '');
};
