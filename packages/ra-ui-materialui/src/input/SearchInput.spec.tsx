import * as React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import {
    testDataProvider,
    useList,
    ListContextProvider,
    RaRecord,
} from 'ra-core';

import { AdminContext } from '../AdminContext';
import { SearchInput } from '.';
import { FilterForm } from '../list';
import { RaceCondition } from './SearchInput.stories';

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

    it('should not ignore keystrokes while I type', async () => {
        const { container } = render(<RaceCondition />);
        fireEvent.click(await screen.findByText('Trigger bug'));
        // Wait for enough time for the bug to happen (min. 1350 ms)
        await new Promise(resolve => setTimeout(resolve, 1500));
        expect(container.querySelector(`input[name=q]`)).not.toBeNull();
        expect(
            (container.querySelector(`input[name=q]`) as HTMLInputElement).value
        ).toBe('hello');
    });
});
