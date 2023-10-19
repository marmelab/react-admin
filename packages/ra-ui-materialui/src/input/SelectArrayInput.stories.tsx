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
import { ReferenceArrayInput } from './ReferenceArrayInput';
import { useCreateSuggestionContext } from './useSupportCreateSuggestion';
import { TextInput } from './TextInput';
import { ArrayInput, SimpleFormIterator } from './ArrayInput';
import { FormDataConsumer } from 'ra-core';
import { useWatch } from 'react-hook-form';

export default { title: 'ra-ui-materialui/input/SelectArrayInput' };

const i18nProvider = polyglotI18nProvider(() => englishMessages);

const FormInspector = ({ source }) => {
    const value = useWatch({ name: source });
    return (
        <div style={{ backgroundColor: 'lightgrey' }}>
            {source} value in form:&nbsp;
            <code>
                {JSON.stringify(value)} ({typeof value})
            </code>
        </div>
    );
};

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

export const DefaultValue = () => (
    <AdminContext i18nProvider={i18nProvider}>
        <Create resource="users" sx={{ width: 600 }}>
            <SimpleForm>
                <SelectArrayInput
                    source="roles"
                    defaultValue={['u001', 'u003']}
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

export const InsideArrayInput = () => (
    <AdminContext i18nProvider={i18nProvider}>
        <Create resource="users" sx={{ width: 600 }}>
            <SimpleForm>
                <ArrayInput
                    source="items"
                    label="Items"
                    defaultValue={[{ data: ['foo'] }]}
                >
                    <SimpleFormIterator>
                        <FormDataConsumer>
                            {({ getSource }) => {
                                const source = getSource!('data');
                                return (
                                    <>
                                        <SelectArrayInput
                                            label="data"
                                            source={source}
                                            choices={[
                                                { id: 'foo', name: 'Foo' },
                                                { id: 'bar', name: 'Bar' },
                                            ]}
                                            defaultValue={['foo']}
                                        />
                                    </>
                                );
                            }}
                        </FormDataConsumer>
                    </SimpleFormIterator>
                </ArrayInput>
                <FormInspector source="items" />
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

export const TranslateChoice = () => {
    const i18nProvider = polyglotI18nProvider(() => ({
        ...englishMessages,
        'option.tech': 'Tech',
        'option.business': 'Business',
    }));
    return (
        <AdminContext
            i18nProvider={i18nProvider}
            dataProvider={
                {
                    getOne: () =>
                        Promise.resolve({ data: { id: 1, tags: ['tech'] } }),
                    getList: () =>
                        Promise.resolve({
                            data: [
                                { id: 'tech', name: 'option.tech' },
                                { id: 'business', name: 'option.business' },
                            ],
                            total: 2,
                        }),
                    getMany: (_resource, { ids }) =>
                        Promise.resolve({
                            data: [
                                { id: 'tech', name: 'option.tech' },
                                { id: 'business', name: 'option.business' },
                            ].filter(({ id }) => ids.includes(id)),
                        }),
                } as any
            }
        >
            <Edit resource="posts" id="1">
                <SimpleForm>
                    <SelectArrayInput
                        label="translateChoice default"
                        source="tags"
                        id="tags1"
                        choices={[
                            { id: 'tech', name: 'option.tech' },
                            { id: 'business', name: 'option.business' },
                        ]}
                    />
                    <SelectArrayInput
                        label="translateChoice true"
                        source="tags"
                        id="tags2"
                        choices={[
                            { id: 'tech', name: 'option.tech' },
                            { id: 'business', name: 'option.business' },
                        ]}
                        translateChoice
                    />
                    <SelectArrayInput
                        label="translateChoice false"
                        source="tags"
                        id="tags3"
                        choices={[
                            { id: 'tech', name: 'option.tech' },
                            { id: 'business', name: 'option.business' },
                        ]}
                        translateChoice={false}
                    />
                    <ReferenceArrayInput reference="tags" source="tags">
                        <SelectArrayInput
                            optionText="name"
                            label="inside ReferenceArrayInput"
                            id="tags4"
                        />
                    </ReferenceArrayInput>
                    <ReferenceArrayInput reference="tags" source="tags">
                        <SelectArrayInput
                            optionText="name"
                            label="inside ReferenceArrayInput forced"
                            id="tags5"
                            translateChoice
                        />
                    </ReferenceArrayInput>
                </SimpleForm>
            </Edit>
        </AdminContext>
    );
};
