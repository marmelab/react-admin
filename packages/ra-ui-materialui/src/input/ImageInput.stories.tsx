import * as React from 'react';
import polyglotI18nProvider from 'ra-i18n-polyglot';
import englishMessages from 'ra-language-english';

import { AdminContext } from '../AdminContext';
import { Create } from '../detail';
import { SimpleForm } from '../form';
import { ImageInput } from './ImageInput';
import { ImageField } from '../field';

export default { title: 'ra-ui-materialui/input/ImageInput' };

export const Basic = () => (
    <Wrapper>
        <ImageInput source="image">
            <ImageField source="attachment" title="title" />
        </ImageInput>
    </Wrapper>
);

export const LimitByFileType = () => (
    <Wrapper>
        <ImageInput source="image" accept="image/png">
            <ImageField source="attachment" title="title" />
        </ImageInput>
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
                source="attachment"
                title="title"
            />
        </ImageInput>
    </Wrapper>
);

export const Multiple = () => (
    <Wrapper>
        <ImageInput source="attachments" multiple>
            <ImageField source="src" title="title" />
        </ImageInput>
    </Wrapper>
);

export const FullWidth = () => (
    <Wrapper>
        <ImageInput source="attachment" fullWidth>
            <ImageField source="src" title="title" />
        </ImageInput>
    </Wrapper>
);

export const Disabled = () => (
    <Wrapper>
        <ImageInput source="attachment" disabled>
            <ImageField source="src" title="title" />
        </ImageInput>
    </Wrapper>
);

const i18nProvider = polyglotI18nProvider(() => englishMessages);

const Wrapper = ({ children }) => (
    <AdminContext i18nProvider={i18nProvider}>
        <Create resource="posts">
            <SimpleForm>{children}</SimpleForm>
        </Create>
    </AdminContext>
);
