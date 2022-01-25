import * as React from 'react';
import expect from 'expect';
import { render, fireEvent } from '@testing-library/react';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import { FilterButton } from './FilterButton';
import { TextInput } from '../../input';

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

    describe('filter button', () => {
        it('should not be rendered, if all filters are already being displayed', () => {
            const { queryByText } = render(<FilterButton {...defaultProps} />);
            expect(queryByText('ra.action.add_filter')).toBeNull();
        });
    });

    describe('filter selection menu', () => {
        it('should display only hidden filters', () => {
            const hiddenFilter = (
                <TextInput source="Returned" label="Returned" />
            );
            const { getByLabelText, queryByText } = render(
                <ThemeProvider theme={theme}>
                    <FilterButton
                        {...defaultProps}
                        filters={defaultProps.filters.concat(hiddenFilter)}
                    />
                </ThemeProvider>
            );

            fireEvent.click(getByLabelText('ra.action.add_filter'));

            expect(queryByText('Returned')).not.toBeNull();
            expect(queryByText('Name')).toBeNull();
        });

        it('should return disabled filter menu item when "disabled" passed to filter', () => {
            const hiddenFilter = (
                <TextInput source="Returned" label="Returned" disabled={true} />
            );
            const { getByLabelText } = render(
                <ThemeProvider theme={theme}>
                    <FilterButton
                        {...defaultProps}
                        filters={defaultProps.filters.concat(hiddenFilter)}
                    />
                </ThemeProvider>
            );

            fireEvent.click(getByLabelText('ra.action.add_filter'));

            const filter = getByLabelText('Returned') as HTMLInputElement;

            expect(filter.disabled).toEqual(true);
        });
    });
});
