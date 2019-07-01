import React from 'react';
import { useGetList, useAuth, Title } from 'react-admin';

const CustomRouteLayout = () => {
    useAuth();
    const { total, loaded } = useGetList(
        'posts',
        { page: 1, perPage: 10 },
        { field: 'published_at', order: 'DESC' }
    );

    return loaded ? (
        <div>
            <Title title="Example Admin" />
            <h1>Posts</h1>
            <p>
                Found <span className="total">{total}</span> posts !
            </p>
        </div>
    ) : null;
};

export default CustomRouteLayout;
