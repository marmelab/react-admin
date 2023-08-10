import * as React from 'react';
import polyglotI18nProvider from 'ra-i18n-polyglot';
import englishMessages from 'ra-language-english';

import { AdminContext } from '../AdminContext';
import { Create } from '../detail';
import { SimpleForm } from '../form';
import { TranslatableInputs } from './TranslatableInputs';
import { FormInspector } from './common';
import { TextInput } from './TextInput';

export default { title: 'ra-ui-materialui/input/TranslatableInputs' };

export const Basic = () => (
    <Wrapper>
        <TranslatableInputs locales={['en', 'fr']}>
            <TextInput source="title" />
            <TextInput source="description" />
        </TranslatableInputs>
    </Wrapper>
);

export const FullWidth = () => (
    <Wrapper>
        <TranslatableInputs locales={['en', 'fr']} fullWidth>
            <TextInput source="title" />
            <TextInput source="description" />
        </TranslatableInputs>
    </Wrapper>
);

export const SingleInput = () => (
    <Wrapper>
        <TranslatableInputs locales={['en', 'fr']}>
            <TextInput source="title" />
        </TranslatableInputs>
    </Wrapper>
);

export const Row = () => (
    <Wrapper>
        <TranslatableInputs
            locales={['en', 'fr']}
            StackProps={{ direction: 'row' }}
        >
            <TextInput source="title" />
            <TextInput source="description" sx={{ marginLeft: 2 }} />
        </TranslatableInputs>
    </Wrapper>
);

export const Sx = () => (
    <Wrapper>
        <TranslatableInputs
            locales={['en', 'fr']}
            sx={{ border: 'solid 1px red' }}
        >
            <TextInput source="title" />
            <TextInput source="description" />
        </TranslatableInputs>
    </Wrapper>
);

const i18nProvider = polyglotI18nProvider(() => englishMessages);

const Wrapper = ({ children }) => (
    <AdminContext i18nProvider={i18nProvider}>
        <Create resource="posts">
            <SimpleForm>
                {children}
                <FormInspector name="title" />
            </SimpleForm>
        </Create>
    </AdminContext>
);
