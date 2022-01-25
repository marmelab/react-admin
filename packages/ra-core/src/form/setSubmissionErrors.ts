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
    const setErrorFromArray = (errors: any[], rootPath: string) => {
        errors.forEach((error, index) => {
            if (typeof error === 'object') {
                setErrorFromObject(error, `${rootPath}.${index}.`);
                return;
            }
            if (Array.isArray(error)) {
                setErrorFromArray(error, `${rootPath}.${index}.`);
                return;
            }
            setError(`${rootPath}.${index}`, {
                type: 'server',
                message: error.toString(),
            });
        });
    };
    const setErrorFromObject = (errors: any, rootPath: string) => {
        Object.entries(errors).forEach(([name, error]) => {
            if (typeof error === 'object') {
                setErrorFromObject(error, `${rootPath}${name}.`);
                return;
            }
            if (Array.isArray(error)) {
                setErrorFromArray(error, `${rootPath}${name}.`);
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
