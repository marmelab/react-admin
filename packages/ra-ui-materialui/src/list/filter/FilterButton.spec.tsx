import * as React from 'react';
import expect from 'expect';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { createTheme } from '@mui/material/styles';

import { AdminContext } from '../../AdminContext';
import { FilterButton } from './FilterButton';
import { TextInput } from '../../input';
import { Basic, WithAutoCompleteArrayInput } from './FilterButton.stories';

const theme = createTheme();

describe('<FilterButton />', () => {
    const defaultProps = {
        resource: 'post',
        filters: [
            <TextInput source="title" label="Title" />,
            <TextInput source="customer.name" label="Name" />,
        ],
        displayedFilters: {
            title: true,
            'customer.name': true,
        },
        showFilter: () => {},
        filterValues: {},
    };

    describe('filter selection menu', () => {
        it('should display only hidden filters', () => {
            const hiddenFilter = (
                <TextInput source="Returned" label="Returned" />
            );
            const { getByLabelText, queryByText } = render(
                <AdminContext theme={theme}>
                    <FilterButton
                        {...defaultProps}
                        filters={defaultProps.filters.concat(hiddenFilter)}
                    />
                </AdminContext>
            );

            fireEvent.click(getByLabelText('ra.action.add_filter'));

            expect(queryByText('Returned')).not.toBeNull();
            expect(queryByText('Name')).toBeNull();
        });

        it('should display the filter button if all filters are shown and there is a filter value', () => {
            render(
                <AdminContext theme={theme}>
                    <FilterButton
                        {...defaultProps}
                        filters={[
                            <TextInput source="title" label="Title" />,
                            <TextInput source="customer.name" label="Name" />,
                        ]}
                        displayedFilters={{
                            title: true,
                            'customer.name': true,
                        }}
                        filterValues={{ title: 'foo' }}
                    />
                </AdminContext>
            );
            expect(
                screen.queryByLabelText('ra.action.add_filter')
            ).not.toBeNull();
            fireEvent.click(screen.getByLabelText('ra.action.add_filter'));
            screen.getByText('ra.saved_queries.new_label');
        });

        it('should return disabled filter menu item when "disabled" passed to filter', () => {
            const hiddenFilter = (
                <TextInput source="Returned" label="Returned" disabled={true} />
            );
            const { getByLabelText, queryByText } = render(
                <AdminContext theme={theme}>
                    <FilterButton
                        {...defaultProps}
                        filters={defaultProps.filters.concat(hiddenFilter)}
                    />
                </AdminContext>
            );

            fireEvent.click(getByLabelText('ra.action.add_filter'));

            const disabledFilter = queryByText('Returned')?.closest('li');

            expect(disabledFilter).not.toBeNull();
            expect(disabledFilter?.getAttribute('aria-disabled')).toEqual(
                'true'
            );
        });

        it('should remove all filters when the "Remove all filters" button is clicked', async () => {
            render(<Basic />);

            // First, check we don't have a clear filters option yet
            await screen.findByText('Add filter');
            fireEvent.click(screen.getByText('Add filter'));

            await screen.findByText('Title', { selector: 'li > span' });
            expect(screen.queryByDisplayValue('Remove all filters')).toBeNull();

            // Then we apply a filter
            fireEvent.click(
                screen.getByText('Title', { selector: 'li > span' })
            );
            await screen.findByDisplayValue(
                'Accusantium qui nihil voluptatum quia voluptas maxime ab similique'
            );

            // Then we clear all filters
            fireEvent.click(screen.getByText('Add filter'));
            await screen.findByText('Remove all filters');
            fireEvent.click(screen.getByText('Remove all filters'));

            // We check that the previously applied filter has been removed
            await waitFor(() => {
                expect(
                    screen.queryByDisplayValue(
                        'Accusantium qui nihil voluptatum quia voluptas maxime ab similique'
                    )
                ).toBeNull();
            });
        });

        it('should remove all alwaysOn filters when the "Remove all filters" button is clicked', async () => {
            render(<Basic />);

            // First, check we don't have a clear filters option yet
            await screen.findByText('Add filter');
            fireEvent.click(screen.getByText('Add filter'));

            await screen.findByText('Title', { selector: 'li > span' });
            expect(screen.queryByDisplayValue('Remove all filters')).toBeNull();

            // Then we apply a filter to an alwaysOn filter
            fireEvent.change(screen.getByLabelText('Search'), {
                target: {
                    value:
                        'Accusantium qui nihil voluptatum quia voluptas maxime ab similique',
                },
            });
            await screen.findByDisplayValue(
                'Accusantium qui nihil voluptatum quia voluptas maxime ab similique'
            );

            // Then we clear all filters
            fireEvent.click(screen.getByText('Add filter'));
            await screen.findByText('Remove all filters');
            fireEvent.click(screen.getByText('Remove all filters'));

            // We check that the previously applied filter has been removed
            await waitFor(() => {
                expect(
                    screen.queryByDisplayValue(
                        'Accusantium qui nihil voluptatum quia voluptas maxime ab similique'
                    )
                ).toBeNull();
            });
        });

        it('should not display save query in filter button', async () => {
            const { queryByText } = render(
                <AdminContext theme={theme}>
                    <FilterButton
                        {...defaultProps}
                        filterValues={{ title: 'foo' }}
                        filters={[
                            <TextInput source="Returned" label="Returned" />,
                        ]}
                        disableSaveQuery
                    />
                </AdminContext>
            );
            expect(
                screen.queryByLabelText('ra.action.add_filter')
            ).not.toBeNull();

            fireEvent.click(screen.getByLabelText('ra.action.add_filter'));

            await screen.findByText('Returned');

            expect(queryByText('ra.saved_queries.new_label')).toBeNull();
        });

        it('should close the filter menu on removing all filters', async () => {
            render(<WithAutoCompleteArrayInput />);

            // Open Posts List
            fireEvent.click(await screen.findByText('Posts'));

            await waitFor(() => {
                expect(screen.queryAllByRole('checkbox')).toHaveLength(11);
            });

            fireEvent.click(await screen.findByLabelText('Open'));
            fireEvent.click(await screen.findByText('Sint...'));

            await waitFor(
                () => {
                    expect(screen.getAllByRole('checkbox')).toHaveLength(2);
                },
                { timeout: 10000 }
            );

            fireEvent.click(screen.getByLabelText('Add filter'));
            fireEvent.click(screen.getByText('Remove all filters'));

            await waitFor(() => {
                expect(screen.getAllByRole('checkbox')).toHaveLength(11);
            });

            fireEvent.click(screen.getByLabelText('Open'));
            fireEvent.click(screen.getByText('Sint...'));

            await waitFor(() => {
                expect(
                    screen.getAllByTestId('CheckBoxOutlineBlankIcon')
                ).toHaveLength(2);
            });

            expect(screen.queryByText('Save current query...')).toBeNull();
        }, 20000);
    });
});
