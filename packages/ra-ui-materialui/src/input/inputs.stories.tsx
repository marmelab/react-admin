import * as React from 'react';
import polyglotI18nProvider from 'ra-i18n-polyglot';
import englishMessages from 'ra-language-english';

import { AdminContext } from '../AdminContext';
import { Create } from '../detail';
import { SimpleForm } from '../form';
import {
    AutocompleteInput,
    CheckboxGroupInput,
    TextInput,
    DateInput,
    AutocompleteArrayInput,
    SelectInput,
    BooleanInput,
    SelectArrayInput,
    DateTimeInput,
    NullableBooleanInput,
    NumberInput,
    RadioButtonGroupInput,
    TimeInput,
    TranslatableInputs,
    SearchInput,
    PasswordInput,
    ImageInput,
    ArrayInput,
    SimpleFormIterator,
} from './';
import { ImageField } from '../field';

export default {
    title: 'ra-ui-materialui/input',
};

const i18nProvider = polyglotI18nProvider(() => englishMessages);

export const AllInputs = () => (
    <AdminContext i18nProvider={i18nProvider}>
        <Create
            resource="posts"
            record={{ id: 1, title: 'Lorem Ipsum', updated_at: new Date() }}
        >
            <SimpleForm>
                <TextInput source="title" helperText="TextInput" />
                <NumberInput source="average_note" helperText="NumberInput" />
                <DateInput source="published_at" helperText="DateInput" />
                <TimeInput source="published_at_time" helperText="TimeInput" />
                <DateTimeInput source="updated_at" helperText="DateTimeInput" />
                <AutocompleteInput
                    source="author_id"
                    choices={[
                        { id: 1, name: 'John Doe' },
                        { id: 2, name: 'Jane Doe' },
                    ]}
                    helperText="AutocompleteInput"
                />
                <AutocompleteArrayInput
                    source="secondary_authors_id"
                    helperText="AutocompleteArrayInput"
                    choices={[
                        { id: 1, name: 'John Doe' },
                        { id: 2, name: 'Jane Doe' },
                    ]}
                />
                <SelectInput
                    source="status"
                    choices={[
                        { id: 'draft', name: 'Draft' },
                        { id: 'published', name: 'Published' },
                    ]}
                    helperText="SelectInput"
                />
                <SelectArrayInput
                    source="tags"
                    choices={[
                        { id: 1, name: 'Tech' },
                        { id: 2, name: 'Lifestyle' },
                    ]}
                    helperText="SelectArrayInput"
                />
                <RadioButtonGroupInput
                    source="workflow"
                    helperText="RadioButtonGroupInput"
                    choices={[
                        { id: 1, name: 'Simple' },
                        { id: 2, name: 'Manager' },
                        { id: 3, name: 'All' },
                    ]}
                />
                <CheckboxGroupInput
                    source="roles"
                    choices={[
                        { id: 'admin', name: 'Admin' },
                        { id: 'u001', name: 'Editor' },
                        { id: 'u002', name: 'Moderator' },
                        { id: 'u003', name: 'Reviewer' },
                    ]}
                    helperText="CheckboxGroupInput"
                />
                <NullableBooleanInput
                    source="exclusive"
                    helperText="NullableBooleanInput"
                />
                <BooleanInput source="commentable" helperText="BooleanInput" />
                <ArrayInput source="backlinks" helperText="ArrayInput">
                    <SimpleFormIterator>
                        <TextInput source="url" />
                        <TextInput source="title" />
                    </SimpleFormIterator>
                </ArrayInput>
                <TranslatableInputs locales={['en', 'fr']} defaultLocale="en">
                    <TextInput source="description" />
                    <TextInput source="body" />
                </TranslatableInputs>
                <PasswordInput source="password" helperText="PasswordInput" />
                <SearchInput source="q" helperText="SearchInput" />
                <ImageInput source="pictures" helperText="ImageInput">
                    <ImageField source="src" title="title" />
                </ImageInput>
            </SimpleForm>
        </Create>
    </AdminContext>
);
