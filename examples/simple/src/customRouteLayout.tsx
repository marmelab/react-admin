import * as React from 'react';
import {
    useGetList,
    useAuthenticated,
    Datagrid,
    TextField,
    Title,
} from 'react-admin';

const currentSort = { field: 'published_at', order: 'DESC' };

const CustomRouteLayout = () => {
    useAuthenticated();

    const { ids, data, total, loaded } = useGetList(
        'posts',
        { page: 1, perPage: 10 },
        currentSort
    );

    return loaded ? (
        <div>
            <Title title="Example Admin" />
            <h1>Posts</h1>
            <p>
                Found <span className="total">{total}</span> posts !
            </p>
            <Datagrid
                basePath=""
                currentSort={currentSort}
                data={data}
                ids={ids}
                selectedIds={[]}
                loaded={loaded}
                total={total}
            >
                <TextField source="id" sortable={false} />
                <TextField source="title" sortable={false} />
            </Datagrid>
        </div>
    ) : null;
};

export default CustomRouteLayout;
