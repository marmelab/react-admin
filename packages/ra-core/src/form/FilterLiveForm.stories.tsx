import * as React from 'react';

import { FilterLiveForm, FilterLiveFormProps, useInput, required } from '.';
import { ListContextProvider } from '../controller/list/ListContextProvider';
import { useList } from '../controller/list/useList';
import { useListContext } from '../controller/list/useListContext';

export default { title: 'ra-core/form/FilterLiveForm' };

const TextInput = props => {
    const { field, fieldState } = useInput(props);
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
