/* eslint react/jsx-key: off */
import * as React from 'react';
import { useParams } from 'react-router';
import {
    Edit,
    SimpleForm,
    TextField,
    TextInput,
    required,
    List,
    Datagrid,
    ResourceContextProvider,
    EditButton,
    TranslatableInputs,
} from 'react-admin';

const TagEdit = () => {
    const { id } = useParams<'id'>();
    return (
        <>
            <Edit redirect="list">
                <SimpleForm warnWhenUnsavedChanges>
                    <TextField source="id" />
                    <TranslatableInputs locales={['en', 'fr']}>
                        <TextInput source="name" validate={[required()]} />
                    </TranslatableInputs>
                </SimpleForm>
            </Edit>
            <ResourceContextProvider value="posts">
                <List
                    hasCreate={false}
                    hasShow
                    hasEdit
                    hasList
                    resource="posts"
                    filter={{ tags: [id] }}
                    title=" "
                >
                    <Datagrid>
                        <TextField source="id" />
                        <TextField source="title" />
                        <EditButton />
                    </Datagrid>
                </List>
            </ResourceContextProvider>
        </>
    );
};

export default TagEdit;
