import React from 'react';
import expect from 'expect';
import { render, cleanup, fireEvent } from 'react-testing-library';

import { FilterButton } from './FilterButton';
import TextInput from '../input/TextInput';

describe('<FilterButton />', () => {
    const defaultProps = {
        resource: 'post',
        filters: [
            <TextInput source="title" label="Title" />,
            <TextInput source="customer.name" label="Name" />,
        ],
        displayedFilters: { 
            title: true,
            "customer.name": true,
        },
        showFilter: () => {},
        translate: () => {},
        filterValues: {},
    };

    afterEach(cleanup);

    describe('filter button', () => {
        it('should not be rendered, if all filters are already being displayed', () => {
            const { queryByText } = render(
                <FilterButton
                    {...defaultProps}
                />
            );
            expect(queryByText('ra.action.add_filter')).toBeNull();
        });

    });

    describe('filter selection menu', () => {
        it('should display only hidden filters', () => {
            const hiddenFilter = <TextInput source="Returned" label="Returned" />;
            const { queryByText } = render(
                <FilterButton
                    {...defaultProps}
                    filters={defaultProps.filters.concat(hiddenFilter)}
                />
            );
            fireEvent.click(queryByText('ra.action.add_filter'));

            expect(queryByText('Returned')).not.toBeNull();
            expect(queryByText('Name')).toBeNull();
        });
    });
});
