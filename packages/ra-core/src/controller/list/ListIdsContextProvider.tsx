import * as React from 'react';
import { useResourceContext } from '../../core';
import { useGetList } from '../../dataProvider';
import { ListIdsContext } from './ListIdsContext';
import { useListParams } from './useListParams';

export const ListIdsContextProvider = ({ children }) => {
    const resource = useResourceContext();

    const [query] = useListParams({
        resource,
    });

    const list = useGetList(resource, {
        pagination: { page: query.page, perPage: query.perPage },
        sort: { field: query.sort, order: query.order },
        filter: { ...query.filter },
    });

    if (list.isLoading) {
        return null;
    }

    const ids = list ? list.data.map(record => record.id) : [];

    return (
        <ListIdsContext.Provider value={ids}>
            {children}
        </ListIdsContext.Provider>
    );
};
