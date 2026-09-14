import * as React from 'react';
import { render, waitFor } from '@testing-library/react';

import { CoreAdminContext, ResourceContextProvider } from '../core';
import { testDataProvider } from '../dataProvider';
import { RecordContextProvider } from './record';
import { memoryStore } from '../store';
import { usePrevNextController } from './usePrevNextController';

const UsePrevNextController = props => {
    usePrevNextController(props);
    return null;
};

describe('usePrevNextController', () => {
    it('should ignore stored list parameters when storeKey is false', async () => {
        const dataProvider = testDataProvider({
            getList: jest.fn().mockResolvedValue({ data: [], total: 0 }),
        });
        const store = memoryStore({
            'posts.listParams': {
                filter: { published: true },
                order: 'DESC',
                sort: 'title',
                page: 2,
                perPage: 25,
                displayedFilters: {},
            },
        });

        render(
            <CoreAdminContext dataProvider={dataProvider} store={store}>
                <ResourceContextProvider value="posts">
                    <RecordContextProvider value={{ id: 1 }}>
                        <UsePrevNextController
                            storeKey={false}
                            sort={{ field: 'id', order: 'ASC' }}
                            filter={{ featured: true }}
                        />
                    </RecordContextProvider>
                </ResourceContextProvider>
            </CoreAdminContext>
        );

        await waitFor(() => {
            expect(dataProvider.getList).toHaveBeenCalledWith('posts', {
                pagination: { page: 1, perPage: 1000 },
                sort: { field: 'id', order: 'ASC' },
                filter: { featured: true },
                meta: undefined,
                signal: undefined,
            });
        });
    });
});
