/* eslint react/jsx-key: off */
import * as React from 'react';
import { useParams } from 'react-router';
import {
    Edit,
    SimpleFormConfigurable,
    TextField,
    TextInput,
    required,
    List,
    Datagrid,
    ResourceContextProvider,
    EditButton,
    TranslatableInputs,
    ListActions,
} from 'react-admin';

const TagEdit = () => {
    const { id } = useParams<'id'>();
    return (
        <>
            <Edit redirect="list">
                <SimpleFormConfigurable warnWhenUnsavedChanges>
                    <TextField source="id" />
                    <TranslatableInputs locales={['en', 'fr']}>
                        <TextInput source="name" validate={[required()]} />
                    </TranslatableInputs>
                </SimpleFormConfigurable>
            </Edit>
            <ResourceContextProvider value="posts">
                <List
                    actions={<ListActions hasCreate={false} />}
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
