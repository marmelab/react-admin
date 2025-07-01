import * as React from 'react';
import polyglotI18nProvider from 'ra-i18n-polyglot';
import englishMessages from 'ra-language-english';

import { AdminContext } from '../AdminContext';
import { Create } from '../detail';
import { SimpleForm } from '../form';
import { NullableBooleanInput } from './NullableBooleanInput';
import { FormInspector } from './common';

export default { title: 'ra-ui-materialui/input/NullableBooleanInput' };

export const Basic = () => (
    <Wrapper>
        <NullableBooleanInput source="published" />
    </Wrapper>
);

export const Disabled = () => (
    <Wrapper>
        <NullableBooleanInput source="announced" defaultValue={true} disabled />
        <NullableBooleanInput source="published" disabled />
    </Wrapper>
);

export const ReadOnly = () => (
    <Wrapper>
        <NullableBooleanInput source="announced" defaultValue={true} readOnly />
        <NullableBooleanInput source="published" readOnly />
    </Wrapper>
);

export const outlinedNoLabel = () => (
    <Wrapper>
        <NullableBooleanInput
            source="published"
            label={false}
            variant="outlined"
        />
    </Wrapper>
);

const i18nProvider = polyglotI18nProvider(() => englishMessages);

const Wrapper = ({ children }) => (
    <AdminContext i18nProvider={i18nProvider} defaultTheme="light">
        <Create resource="posts">
            <SimpleForm>
                {children}
                <FormInspector name="published" />
            </SimpleForm>
        </Create>
    </AdminContext>
);
