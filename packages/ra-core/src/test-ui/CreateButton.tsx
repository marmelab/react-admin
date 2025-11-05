import * as React from 'react';
import { Link } from 'react-router-dom';
import { useResourceContext } from '../core/useResourceContext';

export const CreateButton = (props: { resource?: string }) => {
    const resource = useResourceContext(props);

    return (
        <Link
            to={`/${resource}/create`}
            onClick={e => {
                e.stopPropagation();
            }}
        >
            Create
        </Link>
    );
};
