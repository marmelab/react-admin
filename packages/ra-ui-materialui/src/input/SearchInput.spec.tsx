import * as React from 'react';
import { render } from '@testing-library/react';
import { testDataProvider } from 'ra-core';

import { AdminContext } from '../AdminContext';
import { SearchInput } from '.';
import { FilterForm } from '../list';

describe('<SearchInput />', () => {
    it('should not render label if passed explicit `undefined` value', async () => {
        const source = 'test';

        const filters = [<SearchInput source={source} label={undefined} />];
        const displayedFilters = {
            [source]: true,
        };

        const { container } = render(
            <AdminContext dataProvider={testDataProvider()}>
                <FilterForm
                    setFilters={jest.fn()}
                    filters={filters}
                    displayedFilters={displayedFilters}
                />
            </AdminContext>
        );

        expect(container.querySelector(`label`)).toBeNull();
    });
});
