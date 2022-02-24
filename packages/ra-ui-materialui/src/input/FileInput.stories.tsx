import * as React from 'react';
import polyglotI18nProvider from 'ra-i18n-polyglot';
import englishMessages from 'ra-language-english';

import { AdminContext } from '../AdminContext';
import { Create } from '../detail';
import { SimpleForm } from '../form';
import { FileInput } from './FileInput';
import { FileField } from '../field';

export default { title: 'ra-ui-materialui/input/FileInput' };

export const Basic = () => (
    <Wrapper>
        <FileInput source="attachment">
            <FileField source="src" title="title" />
        </FileInput>
    </Wrapper>
);

export const LimitByFileType = () => (
    <Wrapper>
        <FileInput source="attachment" accept="application/pdf">
            <FileField source="src" title="title" />
        </FileInput>
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
    </Wrapper>
);

export const Multiple = () => (
    <Wrapper>
        <FileInput source="attachments" multiple>
            <FileField source="src" title="title" />
        </FileInput>
    </Wrapper>
);

export const FullWidth = () => (
    <Wrapper>
        <FileInput source="attachment" fullWidth>
            <FileField source="src" title="title" />
        </FileInput>
    </Wrapper>
);

export const Disabled = () => (
    <Wrapper>
        <FileInput source="attachment" disabled>
            <FileField source="src" title="title" />
        </FileInput>
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
