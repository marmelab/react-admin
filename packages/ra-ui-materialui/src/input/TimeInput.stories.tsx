import * as React from 'react';
import polyglotI18nProvider from 'ra-i18n-polyglot';
import englishMessages from 'ra-language-english';

import { AdminContext } from '../AdminContext';
import { Create } from '../detail';
import { SimpleForm } from '../form';
import { TimeInput } from './TimeInput';
import { FormInspector } from './common';

export default { title: 'ra-ui-materialui/input/TimeInput' };

export const Basic = () => (
    <Wrapper>
        <TimeInput source="published" />
    </Wrapper>
);

export const FullWidth = () => (
    <Wrapper>
        <TimeInput source="published" fullWidth />
    </Wrapper>
);

export const Disabled = () => (
    <Wrapper>
        <TimeInput source="published" disabled />
    </Wrapper>
);
export const ReadOnly = () => (
    <Wrapper>
        <TimeInput source="published" readOnly />
    </Wrapper>
);

const i18nProvider = polyglotI18nProvider(() => englishMessages);

const Wrapper = ({ children, onSuccess = console.log }) => (
    <AdminContext i18nProvider={i18nProvider}>
        <Create resource="posts" mutationOptions={{ onSuccess }}>
            <SimpleForm>
                {children}
                <FormInspector name="published" />
            </SimpleForm>
        </Create>
    </AdminContext>
);
