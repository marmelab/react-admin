import * as React from 'react';
import { DateField, ReferenceField, RecordField, Show } from 'react-admin';
import { Stack } from '@mui/material';

const CommentShow = () => (
    <Show queryOptions={{ meta: { prefetch: ['post'] } }}>
        <Stack gap={1} sx={{ py: 1, px: 2 }}>
            <RecordField source="id" />
            <RecordField source="post_id">
                <ReferenceField source="post_id" reference="posts" />
            </RecordField>
            <RecordField source="author.name" />
            <RecordField field={DateField} source="created_at" />
            <RecordField source="body" />
        </Stack>
    </Show>
);

export default CommentShow;
