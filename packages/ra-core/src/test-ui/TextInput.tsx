import * as React from 'react';
import { FieldTitle, InputProps, isRequired, useInput } from '../';

export const TextInput = ({
    multiline,
    type = 'text',
    ...props
}: InputProps & {
    type?: React.HTMLInputTypeAttribute;
    multiline?: boolean;
}) => {
    const { id, field, fieldState } = useInput(props);

    return (
        <div>
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
                    aria-describedby={
                        fieldState.error ? `error-${id}` : undefined
                    }
                />
            ) : (
                <input
                    id={id}
                    {...field}
                    type={type}
                    aria-describedby={
                        fieldState.error ? `error-${id}` : undefined
                    }
                />
            )}
            {fieldState.error ? (
                <p style={{ color: 'red' }} id={`error-${id}`}>
                    {fieldState.error.message}
                </p>
            ) : null}
        </div>
    );
};
