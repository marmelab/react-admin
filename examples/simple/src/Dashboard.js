import React from 'react';

import { useQuery } from 'react-admin';

export default () => {
    const { data } = useQuery({
        type: 'getOne',
        resource: 'users',
        payload: { id: 1 },
    });

    return <span>{data && JSON.stringify(data)}</span>;
};
