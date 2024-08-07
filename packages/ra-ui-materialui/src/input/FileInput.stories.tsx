import * as React from 'react';
import polyglotI18nProvider from 'ra-i18n-polyglot';
import englishMessages from 'ra-language-english';

import { AdminContext } from '../AdminContext';
import { Create } from '../detail';
import { SimpleForm } from '../form';
import { FileInput } from './FileInput';
import { FileField } from '../field';
import { required } from 'ra-core';
import { FormInspector } from './common';
import DeleteIcon from '@mui/icons-material/DeleteOutline';

export default { title: 'ra-ui-materialui/input/FileInput' };

export const Basic = () => (
    <Wrapper>
        <FileInput source="attachment">
            <FileField source="src" title="title" />
        </FileInput>
        <FormInspector name="attachment" />
    </Wrapper>
);

export const DefaultValue = () => (
    <Wrapper>
        <FileInput
            source="attachment"
            defaultValue={[
                {
                    title: 'Image1',
                    src: 'https://picsum.photos/200/300',
                },
                {
                    title: 'Image2',
                    src: 'https://picsum.photos/200/300',
                },
            ]}
        >
            <FileField source="src" title="title" />
        </FileInput>
        <FormInspector name="attachment" />
    </Wrapper>
);

export const LimitByFileType = () => (
    <Wrapper>
        <FileInput source="attachment" accept="application/pdf">
            <FileField source="src" title="title" />
        </FileInput>
        <FormInspector name="attachment" />
    </Wrapper>
);

export const Required = () => (
    <Wrapper>
        <FileInput source="attachment" isRequired validate={required()}>
            <FileField source="src" title="title" />
        </FileInput>
        <FormInspector name="attachment" />
    </Wrapper>
);

export const CustomPreview = () => (
    <Wrapper>
        <FileInput source="attachment" accept="image/*">
            <FileField
                sx={{
                    borderWidth: 4,
                    borderColor: 'blue',
                    borderStyle: 'solid',
                }}
                source="src"
                title="title"
            />
        </FileInput>
        <FormInspector name="attachment" />
    </Wrapper>
);

export const Multiple = () => (
    <Wrapper>
        <FileInput source="attachments" multiple>
            <FileField source="src" title="title" />
        </FileInput>
        <FormInspector name="attachments" />
    </Wrapper>
);

export const Disabled = () => (
    <Wrapper>
        <FileInput source="attachment" disabled>
            <FileField source="src" title="title" />
        </FileInput>
        <FormInspector name="attachment" />
    </Wrapper>
);

export const ReadOnly = () => (
    <Wrapper>
        <FileInput source="attachment" readOnly>
            <FileField source="src" title="title" />
        </FileInput>
        <FormInspector name="attachment" />
    </Wrapper>
);

export const CustomRemoveIcon = () => (
    <Wrapper>
        <FileInput source="attachments" removeIcon={DeleteIcon}>
            <FileField source="src" title="title" />
        </FileInput>
        <FormInspector name="attachments" />
    </Wrapper>
);

const i18nProvider = polyglotI18nProvider(() => englishMessages);

const Wrapper = ({ children }) => (
    <AdminContext i18nProvider={i18nProvider} defaultTheme="light">
        <Create resource="posts">
            <SimpleForm>{children}</SimpleForm>
        </Create>
    </AdminContext>
);
