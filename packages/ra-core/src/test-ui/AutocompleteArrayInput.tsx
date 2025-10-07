import * as React from 'react';
import {
    FieldTitle,
    InputProps,
    isRequired,
    useChoicesContext,
    useInput,
} from '../';

export const AutocompleteArrayInput = (props: Partial<InputProps>) => {
    const { allChoices, source, setFilters, filterValues } =
        useChoicesContext();

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
            <button type="button" onClick={() => field.onChange([])}>
                Clear value
            </button>
            <ul>
                {allChoices?.map(choice => (
                    <li key={choice.id}>
                        <label>
                            <input
                                type="checkbox"
                                value={choice.id}
                                onChange={event => {
                                    const newValue = event.target.checked
                                        ? [...field.value, choice.id]
                                        : field.value.filter(
                                              (v: any) => v !== choice.id
                                          );
                                    field.onChange(newValue);
                                }}
                                checked={field.value.includes(choice.id)}
                                aria-describedby={
                                    fieldState.error
                                        ? `error-${props.source}`
                                        : undefined
                                }
                            />
                            {choice.name}
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
