import * as React from 'react';

import {
    FilterLiveForm,
    FilterLiveFormProps,
    useInput,
    required,
    InputProps,
} from '.';
import { ListContextProvider } from '../controller/list/ListContextProvider';
import { useList } from '../controller/list/useList';
import { useListContext } from '../controller/list/useListContext';

export default { title: 'ra-core/form/FilterLiveForm' };

const TextInput = ({ defaultValue = '', ...props }: InputProps) => {
    const { field, fieldState } = useInput({ defaultValue, ...props });
    const { error } = fieldState;

    return (
        <div
            style={{
                margin: '1em',
                display: 'flex',
                flexDirection: 'column',
                gap: '5px',
            }}
        >
            <label htmlFor={field.name} id={`id-${field.name}`}>
                {props.label || field.name}
            </label>
            <input {...field} aria-labelledby={`id-${field.name}`} />
            {error && (
                <div style={{ color: 'red' }}>
                    {/* @ts-ignore */}
                    {error.message?.message || error.message}
                </div>
            )}
            <button onClick={() => field.onChange('')}>Clear</button>
        </div>
    );
};

export const Basic = (props: Partial<FilterLiveFormProps>) => {
    const listContext = useList({
        data: [
            { id: 1, title: 'Hello', has_newsletter: true },
            { id: 2, title: 'World', has_newsletter: false },
        ],
        filter: {
            category: 'deals',
        },
    });
    return (
        <ListContextProvider value={listContext}>
            <FilterLiveForm {...props}>
                <TextInput source="title" />
            </FilterLiveForm>
            <FilterValue />
        </ListContextProvider>
    );
};

const format = (value: string): string => {
    if (!value) {
        return value;
    }
    return value.length <= 11 ? value : `${value.slice(0, 11)}...`;
};
const parse = input => {
    if (!input) {
        return input;
    }
    return input.replace(/\D/g, '');
};
export const ParseFormat = (props: Partial<FilterLiveFormProps>) => {
    const listContext = useList({
        data: [
            { id: 1, document: 'Hello', has_newsletter: true },
            { id: 2, document: 'World', has_newsletter: false },
        ],
        filter: {
            category: 'deals',
        },
    });
    return (
        <ListContextProvider value={listContext}>
            <FilterLiveForm {...props}>
                <p>
                    Expect a number (larger than 13 characters to trigger
                    format)
                </p>
                <TextInput source="document" parse={parse} format={format} />
            </FilterLiveForm>
            <FilterValue />
        </ListContextProvider>
    );
};

export const NoDebounce = () => <Basic debounce={false} />;

export const MultipleInput = () => {
    const listContext = useList({
        data: [
            { id: 1, title: 'Hello', has_newsletter: true },
            { id: 2, title: 'World', has_newsletter: false },
        ],
        filter: {
            category: 'deals',
        },
    });
    return (
        <ListContextProvider value={listContext}>
            <FilterLiveForm>
                <TextInput source="title" />
                <TextInput source="author" />
            </FilterLiveForm>
            <FilterValue />
        </ListContextProvider>
    );
};

export const MultipleFilterLiveForm = () => {
    const listContext = useList({
        data: [
            { id: 1, title: 'Hello', has_newsletter: true },
            { id: 2, title: 'World', has_newsletter: false },
        ],
        filter: {
            category: 'deals',
        },
    });
    return (
        <ListContextProvider value={listContext}>
            <FilterLiveForm>
                <TextInput source="title" />
            </FilterLiveForm>
            <FilterLiveForm>
                <TextInput source="author" />
            </FilterLiveForm>
            <FilterValue />
        </ListContextProvider>
    );
};

export const PerInputValidation = () => {
    const listContext = useList({
        data: [
            { id: 1, title: 'Hello', has_newsletter: true },
            { id: 2, title: 'World', has_newsletter: false },
        ],
        filter: {
            category: 'deals',
            author: 'Leo Tolstoy',
        },
    });
    return (
        <ListContextProvider value={listContext}>
            <FilterLiveForm>
                <TextInput source="title" />
                <TextInput source="author" validate={required()} />
            </FilterLiveForm>
            <FilterValue />
        </ListContextProvider>
    );
};

const validateFilters = values => {
    const errors: any = {};
    if (!values.author) {
        errors.author = 'The author is required';
    }
    return errors;
};
export const GlobalValidation = () => {
    const listContext = useList({
        data: [
            { id: 1, title: 'Hello', has_newsletter: true },
            { id: 2, title: 'World', has_newsletter: false },
        ],
        filter: {
            category: 'deals',
            author: 'Leo Tolstoy',
        },
    });
    return (
        <ListContextProvider value={listContext}>
            <FilterLiveForm validate={validateFilters}>
                <TextInput source="title" />
                <TextInput source="author" isRequired />
            </FilterLiveForm>
            <FilterValue />
        </ListContextProvider>
    );
};

const FilterValue = () => {
    const { filterValues } = useListContext();
    return (
        <div style={{ margin: '1em' }}>
            <p>Filter values:</p>
            <pre>{JSON.stringify(filterValues, null, 2)}</pre>
            <pre style={{ display: 'none' }} data-testid="filter-values">
                {JSON.stringify(filterValues)}
            </pre>
        </div>
    );
};
