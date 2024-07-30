import * as React from 'react';
import polyglotI18nProvider from 'ra-i18n-polyglot';
import englishMessages from 'ra-language-english';

import { AdminContext } from '../AdminContext';
import { Create } from '../detail';
import { SimpleForm } from '../form';
import { ImageInput } from './ImageInput';
import { ImageField } from '../field';
import { required } from 'ra-core';
import { FormInspector } from './common';
import DeleteIcon from '@mui/icons-material/DeleteOutline';

export default { title: 'ra-ui-materialui/input/ImageInput' };

export const Basic = () => (
    <Wrapper>
        <ImageInput source="image">
            <ImageField source="src" title="title" />
        </ImageInput>
        <FormInspector name="image" />
    </Wrapper>
);

export const LimitByFileType = () => (
    <Wrapper>
        <ImageInput source="image" accept="image/png">
            <ImageField source="src" title="title" />
        </ImageInput>
        <FormInspector name="image" />
    </Wrapper>
);

export const CustomPreview = () => (
    <Wrapper>
        <ImageInput source="image" accept="image/*">
            <ImageField
                sx={{
                    borderWidth: 4,
                    borderColor: 'blue',
                    borderStyle: 'solid',
                }}
                source="src"
                title="title"
            />
        </ImageInput>
        <FormInspector name="image" />
    </Wrapper>
);

export const Multiple = () => (
    <Wrapper>
        <ImageInput source="attachments" multiple>
            <ImageField source="src" title="title" />
        </ImageInput>
        <FormInspector name="attachments" />
    </Wrapper>
);

export const Disabled = () => (
    <Wrapper>
        <ImageInput source="attachment" disabled>
            <ImageField source="src" title="title" />
        </ImageInput>
        <FormInspector name="attachment" />
    </Wrapper>
);

export const ReadOnly = () => (
    <Wrapper>
        <ImageInput source="attachment" readOnly>
            <ImageField source="src" title="title" />
        </ImageInput>
        <FormInspector name="attachment" />
    </Wrapper>
);

export const Required = () => (
    <Wrapper>
        <ImageInput source="attachment" isRequired validate={required()}>
            <ImageField source="src" title="title" />
        </ImageInput>
        <FormInspector name="attachment" />
    </Wrapper>
);

export const CustomRemoveIcon = () => (
    <Wrapper>
        <ImageInput source="image" removeIcon={DeleteIcon}>
            <ImageField source="src" title="title" />
        </ImageInput>
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
