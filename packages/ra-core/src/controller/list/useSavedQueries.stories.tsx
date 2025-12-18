import * as React from 'react';
import fakeRestDataProvider from 'ra-data-fakerest';
import { useNavigate } from 'react-router';
import queryString from 'query-string';
import isEqual from 'lodash/isEqual.js';
import {
    TestMemoryRouter,
    Resource,
    ListBase,
    FilterLiveForm,
    useListContext,
    useSavedQueries,
    extractValidSavedQueries,
    SavedQuery,
} from '../..';
import {
    Admin,
    DataTable,
    TextInput,
    BooleanInput,
    Pagination,
} from '../../test-ui';

export default { title: 'ra-core/controller/list/useSavedQueries' };

const SavedQueries = () => {
    const { resource, filterValues, displayedFilters, sort, perPage } =
        useListContext();
    const hasFilterValues = !isEqual(filterValues, {});
    const navigate = useNavigate();
    const [savedQueries, setSavedQueries] = useSavedQueries(resource);
    const validSavedQueries = extractValidSavedQueries(savedQueries);
    const hasSavedCurrentQuery = validSavedQueries.some(savedQuery =>
        isEqual(savedQuery.value, {
            filter: filterValues,
            sort,
            perPage,
            displayedFilters,
        })
    );

    const removeQuery = () => {
        const savedQueryToRemove = {
            filter: filterValues,
            sort,
            perPage,
            displayedFilters,
        };
        const newSavedQueries = extractValidSavedQueries(savedQueries);
        const index = newSavedQueries.findIndex(savedFilter =>
            isEqual(savedFilter.value, savedQueryToRemove)
        );
        setSavedQueries([
            ...newSavedQueries.slice(0, index),
            ...newSavedQueries.slice(index + 1),
        ]);
    };

    const addQuery = () => {
        const newSavedQuery = {
            label: `My saved query: ${filterValues.title || 'all'} - ${filterValues.published ? 'published' : 'unpublished'}`,
            value: {
                filter: filterValues,
                sort,
                perPage,
                displayedFilters,
            },
        };
        const newSavedQueries = extractValidSavedQueries(savedQueries);
        setSavedQueries(newSavedQueries.concat(newSavedQuery));
    };

    const applyQuery = (savedQuery: SavedQuery) => {
        navigate({
            search: queryString.stringify({
                filter: JSON.stringify(savedQuery.value.filter),
                sort: savedQuery.value.sort?.field,
                order: savedQuery.value.sort?.order,
                page: 1,
                perPage: savedQuery.value.perPage,
                displayedFilters: JSON.stringify(
                    savedQuery.value.displayedFilters
                ),
            }),
        });
    };

    return (
        <>
            <p>Saved Queries</p>
            {validSavedQueries.length === 0 && (
                <p>No saved queries yet. Set a filter to save it.</p>
            )}
            <ul>
                {validSavedQueries.map(
                    (savedQuery: SavedQuery, index: number) => (
                        <li key={index}>
                            {savedQuery.label}{' '}
                            {isEqual(savedQuery.value, {
                                filter: filterValues,
                                sort,
                                perPage,
                                displayedFilters,
                            }) ? (
                                <button type="button" onClick={removeQuery}>
                                    Remove
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => {
                                        applyQuery(savedQuery);
                                    }}
                                >
                                    Apply
                                </button>
                            )}
                        </li>
                    )
                )}
                {hasFilterValues && !hasSavedCurrentQuery && (
                    <li>
                        <button onClick={addQuery} type="button">
                            Save current query
                        </button>
                    </li>
                )}
            </ul>
        </>
    );
};

const FilterForm = () => {
    return (
        <FilterLiveForm>
            <TextInput source="title" />
            <BooleanInput source="published" />
        </FilterLiveForm>
    );
};

export const Basic = () => (
    <TestMemoryRouter>
        <Admin
            dataProvider={fakeRestDataProvider(
                {
                    posts: [
                        { id: 1, title: 'Post 1', published: true },
                        { id: 2, title: 'Post 2', published: false },
                    ],
                },
                process.env.NODE_ENV !== 'test',
                process.env.NODE_ENV !== 'test' ? 300 : 0
            )}
        >
            <Resource
                name="posts"
                list={
                    <ListBase>
                        <FilterForm />
                        <SavedQueries />
                        <DataTable>
                            <DataTable.Col source="id" />
                            <DataTable.Col source="title" />
                            <DataTable.Col source="published" />
                        </DataTable>
                        <Pagination />
                    </ListBase>
                }
            />
        </Admin>
    </TestMemoryRouter>
);
