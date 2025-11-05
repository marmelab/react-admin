import * as React from 'react';
import { isRequired } from '../form/validation/validate';
import { ValidationError } from '../form/validation/ValidationError';
import { useInput, type InputProps } from '../form/useInput';
import { FieldTitle } from '../util/FieldTitle';

export const TextInput = ({
    multiline,
    type = 'text',
    ...props
}: InputProps & {
    type?: React.HTMLInputTypeAttribute;
    multiline?: boolean;
}) => {
    const {
        id,
        field,
        fieldState: { error, invalid },
    } = useInput(props);

    return (
        <div>
            {}
            <label htmlFor={id}>
                <FieldTitle
                    label={props.label}
                    source={props.source}
                    resource={props.resource}
                    isRequired={isRequired(props.validate)}
                />
            </label>
            <br />
            {multiline ? (
                <textarea
                    id={id}
                    {...field}
                    aria-describedby={invalid ? `error-${id}` : undefined}
                />
            ) : (
                <input
                    id={id}
                    {...field}
                    type={type}
                    aria-describedby={invalid ? `error-${id}` : undefined}
                />
            )}
            {invalid && error?.message ? (
                <p style={{ color: 'red' }} id={`error-${id}`}>
                    <ValidationError error={error.message} />
                </p>
            ) : null}
        </div>
    );
};
