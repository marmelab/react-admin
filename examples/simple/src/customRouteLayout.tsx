import * as React from 'react';
import { useGetList, useAuthenticated, DataTable, Title } from 'react-admin';

const sort = { field: 'published_at', order: 'DESC' } as const;

const CustomRouteLayout = ({ title = 'Posts' }) => {
    useAuthenticated();

    const { data, total, isPending } = useGetList('posts', {
        pagination: { page: 1, perPage: 10 },
        sort,
    });

    return !isPending ? (
        <div>
            <Title title="Example Admin" />
            <h1>{title}</h1>
            <p>
                Found <span className="total">{total}</span> posts !
            </p>
            <DataTable
                sort={sort}
                data={data}
                isPending={isPending}
                total={total}
                rowClick="edit"
                bulkActionButtons={false}
                resource="posts"
            >
                <DataTable.Col source="id" disableSort />
                <DataTable.Col source="title" disableSort />
            </DataTable>
        </div>
    ) : null;
};

export default CustomRouteLayout;
