import * as React from 'react';
import expect from 'expect';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { createTheme } from '@mui/material/styles';

import { AdminContext } from '../../AdminContext';
import { FilterButton } from './FilterButton';
import { TextInput } from '../../input';
import { List } from '../List';

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

        it('should display the "Clear all filters" button if any filter is set', () => {
            const { getByLabelText, queryByText } = render(
                <AdminContext theme={theme}>
                    <FilterButton {...defaultProps} />
                </AdminContext>
            );

            fireEvent.click(getByLabelText('ra.action.add_filter'));
            expect(queryByText('ra.action.remove_all_filters')).not.toBeNull();
        });

        it('should not display the "Clear all filters" button if no filter is set', () => {
            const { getByLabelText, queryByText } = render(
                <AdminContext theme={theme}>
                    <FilterButton {...defaultProps} displayedFilters={{}} />
                </AdminContext>
            );

            fireEvent.click(getByLabelText('ra.action.add_filter'));
            expect(queryByText('ra.action.remove_all_filters')).toBeNull();
        });

        it.only('should remove all filters when the "Clear all filters" button is clicked', async () => {
            render(
                <AdminContext theme={theme}>
                    <List resource="posts" filters={defaultProps.filters}>
                        <></>
                    </List>
                </AdminContext>
            );
            await screen.findByText('ra.action.add_filter');
            fireEvent.click(screen.getByText('ra.action.add_filter'));

            await screen.findByText('Title');
            fireEvent.click(screen.getByText('Title'));

            fireEvent.click(screen.getByText('ra.action.add_filter'));
            await screen.findByText('ra.action.remove_all_filters');
            fireEvent.click(screen.getByText('ra.action.remove_all_filters'));

            await waitFor(() => {
                expect(
                    (screen.getByLabelText(
                        'Title'
                    ) as Element).nodeName.toLowerCase()
                ).toBe('span');
            });
        });
    });
});
