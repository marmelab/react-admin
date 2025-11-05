import * as React from 'react';
import { useInput, type InputProps } from '../form/useInput';
import { isRequired } from '../form/validation/validate';
import { FieldTitle } from '../util/FieldTitle';

export const BooleanInput = (props: InputProps) => {
    const { field } = useInput(props);

    return (
        <label>
            <input
                type="checkbox"
                checked={field.value}
                onChange={event => {
                    field.onChange(event.target.checked);
                }}
            />
            <span>
                <FieldTitle
                    label={props.label}
                    source={props.source}
                    resource={props.resource}
                    isRequired={isRequired(props.validate)}
                />
            </span>{' '}
        </label>
    );
};
