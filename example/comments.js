import React from 'react';
import { List, Filter, Edit, Create, Datagrid, DateField, DeepField, ReferenceField, TextField, EditButton, DisabledInput, DateInput, LongTextInput, SelectInput, ReferenceInput } from 'admin-on-rest/mui';

export CommentIcon from 'material-ui/svg-icons/communication/chat-bubble';

const CommentFilter = (props) => (
    <Filter {...props}>
        <ReferenceInput label="Post" source="post_id" reference="posts" allowEmpty>
            <SelectInput optionText="title" />
        </ReferenceInput>
    </Filter>
);

export const CommentList = (props) => (
    <List title="All comments" {...props} filter={CommentFilter}>
        <Datagrid>
            <TextField label="id" source="id" />
            <ReferenceField label="Post" source="post_id" reference="posts">
                <TextField source="title" />
            </ReferenceField>
            <DeepField label="Author name" path="author">
                <TextField source="name" />
            </DeepField>
            <DateField label="date" source="created_at" />
            <EditButton />
        </Datagrid>
    </List>
);

export const CommentEdit = (props) => (
    <Edit {...props}>
        <DisabledInput label="id" source="id" />
        <ReferenceInput label="Post" source="post_id" reference="posts">
            <SelectInput optionText="title" />
        </ReferenceInput>
        <DateInput label="date" source="created_at" />
        <LongTextInput label="body" source="body" />
    </Edit>
);

export const CommentCreate = (props) => (
    <Create {...props}>
        <ReferenceInput label="Post" source="post_id" reference="posts" allowEmpty>
            <SelectInput optionText="title" />
        </ReferenceInput>
        <DateInput label="date" source="created_at" />
        <LongTextInput label="body" source="body" />
    </Create>
);
