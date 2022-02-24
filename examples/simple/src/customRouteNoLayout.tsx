import * as React from 'react';
import { useGetList } from 'react-admin';

const CustomRouteNoLayout = ({ title = 'Posts' }) => {
    const { isLoading, total } = useGetList('posts', {
        pagination: { page: 0, perPage: 10 },
        sort: { field: 'id', order: 'ASC' },
    });

    return (
        <div>
            <h1>{title}</h1>
            {isLoading ? (
                <p className="app-loader">Loading...</p>
            ) : (
                <p>
                    Found <span className="total">{total}</span> posts !
                </p>
            )}
        </div>
    );
};

export default CustomRouteNoLayout;
