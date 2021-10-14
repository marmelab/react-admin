import * as React from 'react';
import { useGetList } from 'react-admin';

const CustomRouteNoLayout = () => {
    const { loaded, total } = useGetList(
        'posts',
        { page: 0, perPage: 10 },
        { field: 'id', order: 'ASC' }
    );

    return (
        <div>
            <h1>Posts</h1>
            {!loaded && <p className="app-loader">Loading...</p>}
            {loaded && (
                <p>
                    Found <span className="total">{total}</span> posts !
                </p>
            )}
        </div>
    );
};

export default CustomRouteNoLayout;
