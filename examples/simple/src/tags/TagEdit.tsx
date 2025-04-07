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
    DataTable,
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
                    <DataTable>
                        <DataTable.Col source="id" />
                        <DataTable.Col source="title" />
                        <DataTable.Col>
                            <EditButton />
                        </DataTable.Col>
                    </DataTable>
                </List>
            </ResourceContextProvider>
        </>
    );
};

export default TagEdit;
