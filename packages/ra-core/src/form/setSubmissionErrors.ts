import { FieldValues, UseFormSetError } from 'react-hook-form';

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
