import * as React from 'react';
import { render } from '@testing-library/react';
import {
    testDataProvider,
    useList,
    ListContextProvider,
    RaRecord,
} from 'ra-core';

import { AdminContext } from '../AdminContext';
import { SearchInput } from '.';
import { FilterForm } from '../list';

describe('<SearchInput />', () => {
    const source = 'test';
    const DummyList = ({ children }) => {
        const listContext = useList<RaRecord>({ data: [] });
        const displayedFilters = {
            [source]: true,
        };
        return (
            <ListContextProvider value={{ ...listContext, displayedFilters }}>
                {children}
            </ListContextProvider>
        );
    };
    it('should render a search input', async () => {
        const filters = [<SearchInput source={source} />];

        const { container } = render(
            <AdminContext dataProvider={testDataProvider()}>
                <DummyList>
                    <FilterForm filters={filters} />
                </DummyList>
            </AdminContext>
        );

        expect(container.querySelector(`input[name=test]`)).not.toBeNull();
    });
});
