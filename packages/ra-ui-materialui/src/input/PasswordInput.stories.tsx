import * as React from 'react';
import polyglotI18nProvider from 'ra-i18n-polyglot';
import englishMessages from 'ra-language-english';

import { AdminContext } from '../AdminContext';
import { Create } from '../detail';
import { SimpleForm } from '../form';
import { FormInspector } from './common';
import { PasswordInput } from './PasswordInput';

export default { title: 'ra-ui-materialui/input/PasswordInput' };

export const Basic = () => (
    <Wrapper>
        <PasswordInput source="published" />
    </Wrapper>
);

export const FullWidth = () => (
    <Wrapper>
        <PasswordInput source="published" fullWidth />
    </Wrapper>
);

export const Disabled = () => (
    <Wrapper>
        <PasswordInput source="published" disabled />
    </Wrapper>
);
export const ReadOnly = () => (
    <Wrapper>
        <PasswordInput source="published" readOnly />
    </Wrapper>
);

const i18nProvider = polyglotI18nProvider(() => englishMessages);

const Wrapper = ({ children }) => (
    <AdminContext i18nProvider={i18nProvider}>
        <Create resource="posts">
            <SimpleForm>
                {children}
                <FormInspector name="published" />
            </SimpleForm>
        </Create>
    </AdminContext>
);
