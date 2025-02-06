import * as React from 'react';
import {
    FilterLiveForm,
    FormDataConsumer,
    ListBase,
    required,
    ResourceContextProvider,
    useListContext,
} from 'ra-core';
import fakeRestDataProvider from 'ra-data-fakerest';
import { AdminContext } from '../AdminContext';
import {
    ArrayInput,
    AutocompleteInput,
    ReferenceInput,
    SelectInput,
    SimpleFormIterator,
    TextInput,
} from '../input';
import { SimpleForm } from './SimpleForm';
import { Create } from '../detail';
import { Paper } from '@mui/material';

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

const config = {
    name: {
        operators: [
            { id: 'eq', name: 'Equals' },
            { id: 'ne', name: 'Not equals' },
        ],
    },
    id: {
        operators: [
            { id: 'eq', name: 'Equals' },
            { id: 'ne', name: 'Not equals' },
        ],
    },
};

const StackedFiltersForm = () => (
    <FilterLiveForm>
        <ArrayInput source="filters">
            <SimpleFormIterator inline disableReordering disableClear>
                <AutocompleteInput
                    source="source"
                    choices={[
                        { id: 'name', name: 'Name' },
                        { id: 'id', name: 'Id' },
                    ]}
                />
                <FormDataConsumer>
                    {({ scopedFormData }) => {
                        if (!scopedFormData) return null;
                        const source = scopedFormData.source;
                        const operators = config[source]?.operators ?? [];
                        return (
                            <SelectInput
                                source="operator"
                                choices={operators}
                                disabled={!operators.length}
                            />
                        );
                    }}
                </FormDataConsumer>
                <FormDataConsumer>
                    {({ scopedFormData }) => {
                        if (!scopedFormData) return null;
                        const source = scopedFormData.source;
                        const operators = config[source]?.operators ?? [];
                        return (
                            <TextInput
                                helperText={false}
                                source="value"
                                disabled={!operators.length}
                            />
                        );
                    }}
                </FormDataConsumer>
            </SimpleFormIterator>
        </ArrayInput>
    </FilterLiveForm>
);

const FiltersDebugger = () => {
    const { filterValues } = useListContext();
    return <pre>{JSON.stringify(filterValues, null, 2)}</pre>;
};

export const StackedFilters = () => (
    <AdminContext dataProvider={dataProvider}>
        <ResourceContextProvider value="users">
            <ListBase>
                <Paper sx={{ p: 2 }}>
                    <StackedFiltersForm />
                    <FiltersDebugger />
                </Paper>
            </ListBase>
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
