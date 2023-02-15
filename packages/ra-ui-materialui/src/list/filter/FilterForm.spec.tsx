import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import expect from 'expect';
import {
    ListContext,
    minLength,
    ResourceContextProvider,
    testDataProvider,
} from 'ra-core';
import * as React from 'react';

import { AdminContext } from '../../AdminContext';
import { ReferenceInput, SelectInput, TextInput } from '../../input';
import { Filter } from './Filter';
import { Basic } from './FilterButton.stories';
import {
    FilterForm,
    getFilterFormValues,
    mergeInitialValuesWithDefaultValues,
} from './FilterForm';

describe('<FilterForm />', () => {
    const defaultProps = {
        resource: 'post',
        filters: [],
        setFilters: () => {},
        hideFilter: () => {},
        displayedFilters: {},
    };

    it('should display correctly passed filters', () => {
        const setFilters = jest.fn();
        const filters = [
            <TextInput source="title" label="Title" />,
            <TextInput source="customer.name" label="Name" />,
        ];
        const displayedFilters = {
            title: true,
            'customer.name': true,
        };

        render(
            <AdminContext>
                <FilterForm
                    {...defaultProps}
                    setFilters={setFilters}
                    filters={filters}
                    displayedFilters={displayedFilters}
                />
            </AdminContext>
        );
        expect(screen.queryAllByLabelText('Title')).toHaveLength(1);
        expect(screen.queryAllByLabelText('Name')).toHaveLength(1);
    });

    it('should change the filter when the user updates an input', async () => {
        const filters = [<TextInput source="title" label="Title" />];
        const displayedFilters = {
            title: true,
        };
        const setFilters = jest.fn();

        render(
            <AdminContext>
                <FilterForm
                    {...defaultProps}
                    filters={filters}
                    displayedFilters={displayedFilters}
                    setFilters={setFilters}
                />
            </AdminContext>
        );
        fireEvent.change(screen.queryByLabelText('Title') as Element, {
            target: { value: 'foo' },
        });
        await waitFor(() => {
            expect(setFilters).toHaveBeenCalledWith(
                { title: 'foo' },
                { title: true }
            );
        });
    });

    it('should not change the filter when the user updates an input with an invalid value', async () => {
        const filters = [
            <TextInput
                source="title"
                label="Title"
                validate={[minLength(5)]}
            />,
        ];
        const displayedFilters = {
            title: true,
        };
        const setFilters = jest.fn();

        render(
            <AdminContext>
                <FilterForm
                    {...defaultProps}
                    filters={filters}
                    displayedFilters={displayedFilters}
                    setFilters={setFilters}
                />
            </AdminContext>
        );
        fireEvent.change(screen.queryByLabelText('Title') as HTMLElement, {
            target: { value: 'foo' },
        });
        await waitFor(() => {
            expect(setFilters).not.toHaveBeenCalled();
        });
    });

    it('should provide ressource context for ReferenceInput filters', async () => {
        const defaultProps: any = {
            context: 'form',
            resource: 'comments',
            setFilters: jest.fn(),
            hideFilter: jest.fn(),
            showFilter: jest.fn(),
            displayedFilters: { post_id: true },
        };
        const dataProvider = testDataProvider({
            // @ts-ignore
            getList: () => Promise.resolve({ data: [], total: 0 }),
        });

        render(
            <AdminContext dataProvider={dataProvider}>
                <ResourceContextProvider value="comments">
                    <ListContext.Provider value={defaultProps}>
                        <Filter>
                            <ReferenceInput source="post_id" reference="posts">
                                <SelectInput optionText="title" />
                            </ReferenceInput>
                        </Filter>
                    </ListContext.Provider>
                </ResourceContextProvider>
            </AdminContext>
        );
        await waitFor(() => {
            expect(
                screen.getByText('resources.comments.fields.post_id')
            ).not.toBeNull();
        });
        const filters = [
            <TextInput
                source="title"
                label="Title"
                validate={[minLength(5)]}
            />,
        ];
        const displayedFilters = {
            title: true,
        };
        const setFilters = jest.fn();

        render(
            <AdminContext>
                <FilterForm
                    {...defaultProps}
                    filters={filters}
                    displayedFilters={displayedFilters}
                    setFilters={setFilters}
                />
            </AdminContext>
        );
        fireEvent.change(screen.queryByLabelText('Title') as Element, {
            target: { value: 'foo' },
        });
        await waitFor(() => {
            expect(setFilters).not.toHaveBeenCalled();
        });
    });

    it('should allow to add and clear a filter with a complex object value', async () => {
        render(<Basic />);

        const addFilterButton = await screen.findByText('Add filter');
        fireEvent.click(addFilterButton);

        fireEvent.click(await screen.findByText('Nested'));
        await screen.findByDisplayValue('bar');
        await screen.findByText('1-7 of 7');

        fireEvent.change(screen.getByLabelText('Nested'), {
            target: { value: 'baz' },
        });
        await screen.findByText('1-6 of 6');

        fireEvent.click(await screen.findByTitle('Remove this filter'));
        await screen.findByText('1-10 of 13');
        expect(screen.queryByText('Nested')).toBeNull();
        expect(screen.queryByLabelText('Nested')).toBeNull();
    });

    describe('mergeInitialValuesWithDefaultValues', () => {
        it('should correctly merge initial values with the default values of the alwaysOn filters', () => {
            const initialValues = {
                title: 'initial title',
            };
            const filters = [
                {
                    props: {
                        source: 'title',
                        alwaysOn: true,
                        defaultValue: 'default title',
                    },
                },
                {
                    props: {
                        source: 'url',
                        alwaysOn: true,
                        defaultValue: 'default url',
                    },
                },
                {
                    props: {
                        source: 'author.name',
                        alwaysOn: true,
                        defaultValue: 'default author',
                    },
                },
                { props: { source: 'notMe', defaultValue: 'default url' } },
                { props: { source: 'notMeEither' } },
            ];

            expect(
                mergeInitialValuesWithDefaultValues(initialValues, filters)
            ).toEqual({
                title: 'initial title',
                url: 'default url',
                author: { name: 'default author' },
            });
        });
    });

    describe('getFilterFormValues', () => {
        it('should correctly get the filter form values from the new filterValues', () => {
            const currentFormValues = {
                classicToClear: 'abc',
                nestedToClear: { nestedValue: 'def' },
                classicUpdated: 'ghi',
                nestedUpdated: { nestedValue: 'jkl' },
                published_at: new Date('2022-01-01T03:00:00.000Z'),
                clearedDateValue: null,
            };
            const newFilterValues = {
                classicUpdated: 'ghi2',
                nestedUpdated: { nestedValue: 'jkl2' },
                published_at: '2022-01-01T03:00:00.000Z',
            };

            expect(
                getFilterFormValues(currentFormValues, newFilterValues)
            ).toEqual({
                classicToClear: '',
                nestedToClear: '',
                classicUpdated: 'ghi2',
                nestedUpdated: { nestedValue: 'jkl2' },
                published_at: '2022-01-01T03:00:00.000Z',
                clearedDateValue: '',
            });
        });
    });
});
