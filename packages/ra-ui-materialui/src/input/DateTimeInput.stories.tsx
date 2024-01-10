import * as React from 'react';
import polyglotI18nProvider from 'ra-i18n-polyglot';
import englishMessages from 'ra-language-english';

import { AdminContext } from '../AdminContext';
import { Create } from '../detail';
import { SimpleForm } from '../form';
import { DateTimeInput } from './DateTimeInput';
import { FormInspector } from './common';

export default { title: 'ra-ui-materialui/input/DateTimeInput' };

export const Basic = () => (
    <Wrapper>
        <DateTimeInput source="published" />
    </Wrapper>
);

export const FullWidth = () => (
    <Wrapper>
        <DateTimeInput source="published" fullWidth />
    </Wrapper>
);

export const Disabled = () => (
    <Wrapper>
        <DateTimeInput source="published" disabled />
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
