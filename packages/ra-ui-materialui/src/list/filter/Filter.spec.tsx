import * as React from 'react';
import { render } from '@testing-library/react';
import { ListContext, ResourceContextProvider } from 'ra-core';

import { TextInput } from '../../input';
import { Filter } from './Filter';

describe('<Filter />', () => {
    describe('With form context', () => {
        const defaultProps: any = {
            context: 'form',
            resource: 'posts',
            setFilters: jest.fn(),
            hideFilter: jest.fn(),
            showFilter: jest.fn(),
            displayedFilters: { title: true },
        };

        it('should render a <FilterForm /> component', () => {
            const { queryByLabelText } = render(
                <ResourceContextProvider value="posts">
                    <ListContext.Provider value={defaultProps}>
                        <Filter>
                            <TextInput source="title" />
                        </Filter>
                    </ListContext.Provider>
                </ResourceContextProvider>
            );

            expect(queryByLabelText('Title')).not.toBeNull();
        });

        it('should pass `filterValues` as `initialValues` props', () => {
            const { getByDisplayValue } = render(
                <ResourceContextProvider value="posts">
                    <ListContext.Provider
                        value={{
                            ...defaultProps,
                            filterValues: { title: 'Lorem' },
                        }}
                    >
                        <Filter>
                            <TextInput source="title" />
                        </Filter>
                    </ListContext.Provider>
                </ResourceContextProvider>
            );

            expect(getByDisplayValue('Lorem')).not.toBeNull();
        });
    });
});
