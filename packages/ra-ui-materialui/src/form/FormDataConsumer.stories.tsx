import * as React from 'react';
import { FormDataConsumer, required, ResourceContextProvider } from 'ra-core';
import fakeRestDataProvider from 'ra-data-fakerest';
import { AdminContext } from '../AdminContext';
import { AutocompleteInput, ReferenceInput, TextInput } from '../input';
import { SimpleForm } from './SimpleForm';
import { Create } from '../detail';

// We keep this test in ra-ui-materialui because we need heavy components to reproduce the issue https://github.com/marmelab/react-admin/issues/10415
export default { title: 'ra-core/form/FormDataConsumer' };

export const Basic = () => (
    <AdminContext dataProvider={dataProvider}>
        <ResourceContextProvider value="posts">
            <Create>
                <SimpleForm>
                    <TextInput source="title" />
                    <FormDataConsumer<any>>
                        {({ formData }) => {
                            console.log({ formData });
                            if (!formData.title) {
                                return null;
                            }
                            return (
                                <ReferenceInput
                                    source="userId"
                                    reference="users"
                                >
                                    <AutocompleteInput
                                        shouldUnregister
                                        label="User"
                                        optionText={choice =>
                                            `${choice.name} / (${choice.id})`
                                        }
                                        noOptionsText="User doesn't exist"
                                        isRequired
                                        validate={[
                                            required('User is required.'),
                                        ]}
                                    />
                                </ReferenceInput>
                            );
                        }}
                    </FormDataConsumer>
                    <TextInput source="body" multiline rows={5} />
                </SimpleForm>
            </Create>
        </ResourceContextProvider>
    </AdminContext>
);

const dataProvider = fakeRestDataProvider({
    users: [
        {
            id: 1,
            name: 'Leanne Graham',
        },
        {
            id: 2,
            name: 'Ervin Howell',
        },
        {
            id: 3,
            name: 'Clementine Bauch',
        },
        {
            id: 4,
            name: 'Patricia Lebsack',
        },
        {
            id: 5,
            name: 'Chelsey Dietrich',
        },
        {
            id: 6,
            name: 'Mrs. Dennis Schulist',
        },
        {
            id: 7,
            name: 'Kurtis Weissnat',
        },
        {
            id: 8,
            name: 'Nicholas Runolfsdottir V',
        },
        {
            id: 9,
            name: 'Glenna Reichert',
        },
        {
            id: 10,
            name: 'Clementina DuBuque',
        },
    ],
});
