import * as React from 'react';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { crudGetList } from 'react-admin';

const CustomRouteNoLayout = () => {
    const dispatch = useDispatch();

    const loaded = useSelector(
        state =>
            state.admin.resources.posts &&
            state.admin.resources.posts.list.total > 0
    );

    const total = useSelector(state =>
        state.admin.resources.posts ? state.admin.resources.posts.list.total : 0
    );

    useEffect(() => {
        dispatch(
            crudGetList(
                'posts',
                { page: 0, perPage: 10 },
                { field: 'id', order: 'ASC' }
            )
        );
    }, [dispatch]);

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
