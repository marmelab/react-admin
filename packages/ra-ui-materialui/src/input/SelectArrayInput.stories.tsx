import * as React from 'react';
import polyglotI18nProvider from 'ra-i18n-polyglot';
import englishMessages from 'ra-language-english';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    TextField,
} from '@mui/material';
import fakeRestProvider from 'ra-data-fakerest';

import { AdminContext } from '../AdminContext';
import { Create, Edit } from '../detail';
import { SimpleForm } from '../form';
import { SelectArrayInput } from './SelectArrayInput';
import { useCreateSuggestionContext } from './useSupportCreateSuggestion';
import { TextInput } from './TextInput';

export default { title: 'ra-ui-materialui/input/SelectArrayInput' };

const i18nProvider = polyglotI18nProvider(() => englishMessages);

export const Basic = () => (
    <AdminContext i18nProvider={i18nProvider}>
        <Create
            resource="users"
            record={{ roles: ['u001', 'u003'] }}
            sx={{ width: 600 }}
        >
            <SimpleForm>
                <SelectArrayInput
                    source="roles"
                    choices={[
                        { id: 'admin', name: 'Admin' },
                        { id: 'u001', name: 'Editor' },
                        { id: 'u002', name: 'Moderator' },
                        { id: 'u003', name: 'Reviewer' },
                    ]}
                    sx={{ width: 300 }}
                />
                <SelectArrayInput
                    source="roles"
                    variant="outlined"
                    choices={[
                        { id: 'admin', name: 'Admin' },
                        { id: 'u001', name: 'Editor' },
                        { id: 'u002', name: 'Moderator' },
                        { id: 'u003', name: 'Reviewer' },
                    ]}
                    sx={{ width: 300 }}
                />
                <SelectArrayInput
                    source="roles"
                    variant="standard"
                    choices={[
                        { id: 'admin', name: 'Admin' },
                        { id: 'u001', name: 'Editor' },
                        { id: 'u002', name: 'Moderator' },
                        { id: 'u003', name: 'Reviewer' },
                    ]}
                    sx={{ width: 300 }}
                />
            </SimpleForm>
        </Create>
    </AdminContext>
);

const choices = [
    { id: 'admin', name: 'Admin' },
    { id: 'u001', name: 'Editor' },
    { id: 'u002', name: 'Moderator' },
    { id: 'u003', name: 'Reviewer' },
];

const CreateRole = () => {
    const { onCancel, onCreate } = useCreateSuggestionContext();
    const [value, setValue] = React.useState('');

    const handleSubmit = event => {
        event.preventDefault();
        const newOption = { id: value, name: value };
        choices.push(newOption);
        setValue('');
        onCreate(newOption);
    };

    return (
        <Dialog open onClose={onCancel}>
            <form onSubmit={handleSubmit}>
                <DialogContent>
                    <TextField
                        label="Role name"
                        value={value}
                        onChange={event => setValue(event.target.value)}
                        autoFocus
                    />
                </DialogContent>
                <DialogActions>
                    <Button type="submit">Save</Button>
                    <Button onClick={onCancel}>Cancel</Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export const CreateProp = () => (
    <AdminContext i18nProvider={i18nProvider}>
        <Create
            resource="users"
            record={{ roles: ['u001', 'u003'] }}
            sx={{ width: 600 }}
        >
            <SimpleForm>
                <SelectArrayInput
                    source="roles"
                    choices={choices}
                    sx={{ width: 300 }}
                    create={<CreateRole />}
                />
            </SimpleForm>
        </Create>
    </AdminContext>
);

export const DifferentIdTypes = () => {
    const fakeData = {
        bands: [{ id: 1, name: 'band_1', members: [1, '2'] }],
        artists: [
            { id: 1, name: 'artist_1' },
            { id: 2, name: 'artist_2' },
            { id: 3, name: 'artist_3' },
        ],
    };
    const dataProvider = fakeRestProvider(fakeData, false);
    return (
        <AdminContext dataProvider={dataProvider}>
            <Edit resource="bands" id={1} sx={{ width: 600 }}>
                <SimpleForm>
                    <TextInput source="name" fullWidth />
                    <SelectArrayInput
                        fullWidth
                        source="members"
                        choices={fakeData.artists}
                    ></SelectArrayInput>
                </SimpleForm>
            </Edit>
        </AdminContext>
    );
};

export const DifferentSizes = () => {
    const fakeData = {
        bands: [{ id: 1, name: 'band_1', members: [1, '2'] }],
        artists: [
            { id: 1, name: 'artist_1' },
            { id: 2, name: 'artist_2' },
            { id: 3, name: 'artist_3' },
        ],
    };
    const dataProvider = fakeRestProvider(fakeData, false);
    return (
        <AdminContext dataProvider={dataProvider}>
            <Edit resource="bands" id={1} sx={{ width: 600 }}>
                <SimpleForm>
                    <TextInput source="name" fullWidth />
                    <SelectArrayInput
                        fullWidth
                        source="members"
                        choices={fakeData.artists}
                        size="small"
                    />
                    <SelectArrayInput
                        fullWidth
                        source="members"
                        choices={fakeData.artists}
                        size="medium"
                    />
                    <SelectArrayInput
                        fullWidth
                        source="members"
                        choices={fakeData.artists}
                        size="small"
                        variant="outlined"
                    />
                    <SelectArrayInput
                        fullWidth
                        source="members"
                        choices={fakeData.artists}
                        size="medium"
                        variant="outlined"
                    />
                </SimpleForm>
            </Edit>
        </AdminContext>
    );
};
