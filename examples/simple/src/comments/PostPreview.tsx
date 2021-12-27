import * as React from 'react';
import { useQueryClient } from 'react-query';
import {
    SimpleShowLayout,
    TextField,
    ResourceContextProvider,
    Identifier,
    Record,
} from 'react-admin';

const PostPreview = <RecordType extends Record = Record>({
    id,
    resource,
}: {
    id: Identifier;
    resource: string;
}) => {
    const queryClient = useQueryClient();
    const record = queryClient.getQueryData<RecordType>([
        resource,
        'getOne',
        String(id),
    ]);

    return (
        <ResourceContextProvider value={resource}>
            <SimpleShowLayout record={record}>
                <TextField source="id" />
                <TextField source="title" />
                <TextField source="teaser" />
            </SimpleShowLayout>
        </ResourceContextProvider>
    );
};

export default PostPreview;
