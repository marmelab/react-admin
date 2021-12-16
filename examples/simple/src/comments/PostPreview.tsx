import * as React from 'react';
import { useSelector } from 'react-redux';
import {
    SimpleShowLayout,
    TextField,
    ReduxState,
    Identifier,
    Record,
} from 'react-admin';

const PostPreview = ({
    id,
    basePath,
    resource,
}: {
    id: Identifier;
    basePath: string;
    resource: string;
}) => {
    const record = useSelector<ReduxState, Record>(state =>
        state.admin.resources[resource]
            ? state.admin.resources[resource].data[id]
            : null
    );

    return (
        <SimpleShowLayout record={record} resource={resource}>
            <TextField source="id" />
            <TextField source="title" />
            <TextField source="teaser" />
        </SimpleShowLayout>
    );
};

export default PostPreview;
