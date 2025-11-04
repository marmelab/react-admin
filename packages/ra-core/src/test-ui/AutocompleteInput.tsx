import * as React from 'react';
import { useInput, type InputProps } from '../form/useInput';
import { useChoices, type ChoicesProps } from '../form/choices/useChoices';
import { useChoicesContext } from '../form/choices/useChoicesContext';
import { isRequired } from '../form/validation/validate';
import { FieldTitle } from '../util/FieldTitle';

export const AutocompleteInput = (
    props: Partial<InputProps> & Partial<ChoicesProps> & { multiple?: boolean }
) => {
    const { allChoices, source, setFilters, filterValues } =
        useChoicesContext(props);
    const { getChoiceText } = useChoices(props);

    const { field, fieldState } = useInput({ source, ...props });

    return (
        <div>
            <div>
                <FieldTitle
                    label={props.label}
                    source={props.source}
                    resource={props.resource}
                    isRequired={isRequired(props.validate)}
                />
            </div>
            <input
                type="text"
                value={filterValues['q']}
                onChange={e =>
                    setFilters({ ...filterValues, q: e.target.value })
                }
            />
            <button
                type="button"
                onClick={event => {
                    event.preventDefault();
                    field.onChange([]);
                }}
            >
                Clear value
            </button>
            <ul>
                {allChoices?.map(choice => (
                    <li key={choice.id}>
                        <label>
                            <input
                                name={field.name}
                                type={props.multiple ? 'checkbox' : 'radio'}
                                value={choice.id}
                                onChange={event => {
                                    const newValue = event.target.checked
                                        ? props.multiple
                                            ? [...field.value, choice.id]
                                            : choice.id
                                        : props.multiple
                                          ? field.value.filter(
                                                (v: any) => v !== choice.id
                                            )
                                          : null;
                                    field.onChange(newValue);
                                }}
                                checked={
                                    props.multiple
                                        ? field.value.includes(choice.id)
                                        : // eslint-disable-next-line eqeqeq
                                          field.value == choice.id
                                }
                                aria-describedby={
                                    fieldState.error
                                        ? `error-${props.source}`
                                        : undefined
                                }
                            />
                            {getChoiceText(choice)}
                        </label>
                    </li>
                ))}
            </ul>
            {fieldState.error ? (
                <p id={`error-${props.source}`} style={{ color: 'red' }}>
                    {fieldState.error.message}
                </p>
            ) : null}
        </div>
    );
};
