import { chipClasses } from '@mui/material/Chip';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import expect from 'expect';
import {
    ListContext,
    ListContextProvider,
    minLength,
    ResourceContextProvider,
    testDataProvider,
    ListControllerResult,
} from 'ra-core';
import * as React from 'react';

import { AdminContext } from '../../AdminContext';
import { ReferenceInput, SelectInput, TextInput } from '../../input';
import { Filter } from './Filter';
import {
    Basic,
    WithArrayInput,
    WithAutoCompleteArrayInput,
    WithComplexValueFilter,
} from './FilterButton.stories';
import {
    FilterForm,
    getFilterFormValues,
    mergeInitialValuesWithDefaultValues,
} from './FilterForm';

describe('<FilterForm />', () => {
    const defaultListContext = {
        resource: 'post',
        showFilter: () => {},
        hideFilter: () => {},
        displayedFilters: {},
    } as unknown as ListControllerResult;

    beforeAll(() => {
        window.scrollTo = jest.fn();
    });

    afterAll(() => {
        jest.clearAllMocks();
    });

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
                <ListContextProvider
                    value={{
                        ...defaultListContext,
                        setFilters,
                        displayedFilters,
                    }}
                >
                    <FilterForm filters={filters} />
                </ListContextProvider>
            </AdminContext>
        );
        expect(screen.queryAllByLabelText('Title')).toHaveLength(1);
        expect(screen.queryAllByLabelText('Name')).toHaveLength(1);
    });

    it('should retain key values in the form inputs', () => {
        // As key is not rendered, we just test that the React warning doesn't occur.
        const origError = console.error;
        console.error = message => {
            throw new Error(message);
        };

        const setFilters = jest.fn();
        const filters = [
            <TextInput source="title" label="Title" key="custom-key" />,
            <TextInput source="title" label="Title2" key="another-key" />,
        ];
        const displayedFilters = {
            title: true,
            title2: true,
        };

        expect(() => {
            render(
                <AdminContext>
                    <ListContextProvider
                        value={{
                            ...defaultListContext,
                            setFilters,
                            displayedFilters,
                        }}
                    >
                        <FilterForm filters={filters} />
                    </ListContextProvider>
                </AdminContext>
            );
        }).not.toThrow();
        console.error = origError;
    });

    it('should change the filter when the user updates an input', async () => {
        const filters = [<TextInput source="title" label="Title" />];
        const displayedFilters = {
            title: true,
        };
        const setFilters = jest.fn();

        render(
            <AdminContext>
                <ListContextProvider
                    value={{
                        ...defaultListContext,
                        setFilters,
                        displayedFilters,
                    }}
                >
                    <FilterForm filters={filters} />
                </ListContextProvider>
            </AdminContext>
        );
        fireEvent.change(screen.queryByLabelText('Title') as Element, {
            target: { value: 'foo' },
        });
        await waitFor(() => {
            expect(setFilters).toHaveBeenCalledWith(
                { title: 'foo' },
                { title: true },
                true
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
                <ListContextProvider
                    value={{
                        ...defaultListContext,
                        setFilters,
                        displayedFilters,
                    }}
                >
                    <FilterForm filters={filters} />
                </ListContextProvider>
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
                <ListContextProvider
                    value={{
                        ...defaultListContext,
                        setFilters,
                        displayedFilters,
                    }}
                >
                    <FilterForm filters={filters} />
                </ListContextProvider>
            </AdminContext>
        );
        fireEvent.change(screen.queryByLabelText('Title') as Element, {
            target: { value: 'foo' },
        });
        await waitFor(() => {
            expect(setFilters).not.toHaveBeenCalled();
        });
    });

    it('should allow to add and clear a filter with a nested value', async () => {
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
        await waitFor(() => {
            expect(screen.queryByText('Nested')).toBeNull();
        });
        expect(screen.queryByLabelText('Nested')).toBeNull();
    });

    it('should hide a removed filter with a complex object value', async () => {
        render(<WithComplexValueFilter />);

        const addFilterButton = await screen.findByText('Add filter');
        fireEvent.click(addFilterButton);
        fireEvent.click(await screen.findByText('Complex'));
        await screen.findByText('1-7 of 7');
        await screen.findByText('Complex', {
            selector: `.${chipClasses.root} *`,
        });
        fireEvent.click(await screen.findByTitle('Remove this filter'));
        await screen.findByText('1-10 of 13');
        expect(
            screen.queryByText('Complex', {
                selector: `.${chipClasses.root} *`,
            })
        ).toBeNull();
    });

    it('should provide a FormGroupContext', async () => {
        render(<WithArrayInput />);

        fireEvent.click(await screen.findByLabelText('Add'));
        fireEvent.change((await screen.findAllByLabelText('Title'))[0], {
            target: { value: 'Sint dignissimos in architecto aut' },
        });
        fireEvent.click(await screen.findByLabelText('Add'));

        await waitFor(() => {
            expect(screen.getAllByText('Title')).toHaveLength(3);
        });
        fireEvent.change((await screen.findAllByLabelText('Title'))[1], {
            target: { value: 'Sed quo et et fugiat modi' },
        });

        await screen.findByText('1-2 of 2');
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
                nestedToClear: { nestedValue: '' },
                classicUpdated: 'ghi2',
                nestedUpdated: { nestedValue: 'jkl2' },
                published_at: '2022-01-01T03:00:00.000Z',
                clearedDateValue: '',
            });
        });
    });

    it('should not reapply previous filter form values when clearing nested AutocompleteArrayInput', async () => {
        render(<WithAutoCompleteArrayInput />);

        // Open Posts List
        fireEvent.click(await screen.findByText('Posts'));

        // Set nested filter value to 'bar'
        fireEvent.click(await screen.findByLabelText('Add filter'));
        fireEvent.click(
            await screen.findByRole('menuitemcheckbox', { name: 'Nested' })
        );
        fireEvent.click(await screen.findByText('bar'));
        fireEvent.blur(await screen.findByLabelText('Nested'));
        await screen.findByText('1-7 of 7');
        expect(screen.queryByRole('button', { name: 'bar' })).not.toBeNull();

        // Navigate to Dashboard
        fireEvent.click(await screen.findByText('Dashboard'));
        // Navigate back to Posts List
        fireEvent.click(await screen.findByText('Posts'));
        // Filter should still be applied
        await screen.findByText('1-7 of 7');
        expect(screen.queryByRole('button', { name: 'bar' })).not.toBeNull();

        // Clear nested filter value
        fireEvent.mouseDown(
            await screen.findByLabelText('Nested', { selector: 'input' })
        );
        fireEvent.keyDown(
            await screen.findByLabelText('Nested', { selector: 'input' }),
            {
                key: 'Backspace',
            }
        );
        fireEvent.blur(
            await screen.findByLabelText('Nested', { selector: 'input' })
        );

        // Wait until filter is cleared
        await screen.findByText('1-10 of 13');
        // Make sure the 'bar' value is not displayed anymore
        expect(screen.queryByRole('button', { name: 'bar' })).toBeNull();
    }, 10000);
});
