import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import { useGetList } from 'react-admin';

export default () => {
    const { loading, total } = useGetList(
        'posts',
        { page: 1, perPage: 1 },
        {},
        {}
    );
    return (
        <Card>
            <CardHeader title="Welcome to the administration" />
            {!loading && <CardContent>There are {total} posts !</CardContent>}
        </Card>
    );
};
