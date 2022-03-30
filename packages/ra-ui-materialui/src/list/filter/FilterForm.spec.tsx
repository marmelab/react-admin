import * as React from 'react';
import expect from 'expect';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { minLength } from 'ra-core';

import {
    FilterForm,
    getFilterFormValues,
    mergeInitialValuesWithDefaultValues,
} from './FilterForm';
import { TextInput } from '../../input';
import { AdminContext } from '../../AdminContext';

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
        fireEvent.change(screen.queryByLabelText('Title'), {
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
        fireEvent.change(screen.queryByLabelText('Title'), {
            target: { value: 'foo' },
        });
        await waitFor(() => {
            expect(setFilters).not.toHaveBeenCalled();
        });
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
            };
            const newFilterValues = {
                classicUpdated: 'ghi2',
                nestedUpdated: { nestedValue: 'jkl2' },
            };

            expect(
                getFilterFormValues(currentFormValues, newFilterValues)
            ).toEqual({
                classicToClear: '',
                nestedToClear: { nestedValue: '' },
                classicUpdated: 'ghi2',
                nestedUpdated: { nestedValue: 'jkl2' },
            });
        });
    });
});
