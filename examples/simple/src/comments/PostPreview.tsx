import * as React from 'react';
import { useQueryClient } from 'react-query';
import {
    SimpleShowLayout,
    TextField,
    ResourceContextProvider,
    Identifier,
    RaRecord,
} from 'react-admin';

const PostPreview = <RecordType extends RaRecord = any>({
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
        { id: String(id) },
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
