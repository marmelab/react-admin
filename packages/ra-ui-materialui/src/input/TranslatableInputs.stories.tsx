import * as React from 'react';
import polyglotI18nProvider from 'ra-i18n-polyglot';
import englishMessages from 'ra-language-english';

import { AdminContext } from '../AdminContext';
import { Create } from '../detail';
import { SimpleForm } from '../form';
import { TranslatableInputs } from './TranslatableInputs';
import { FormInspector } from './common';
import { TextInput } from './TextInput';
import { useSourceContext } from 'ra-core';
import { useFormContext } from 'react-hook-form';
import { Button } from '@mui/material';

export default { title: 'ra-ui-materialui/input/TranslatableInputs' };

export const Basic = () => (
    <Wrapper>
        <TranslatableInputs locales={['en', 'fr']}>
            <TextInput source="title" />
            <TextInput source="description" />
        </TranslatableInputs>
    </Wrapper>
);

export const NonFullWidth = () => (
    <Wrapper>
        <TranslatableInputs locales={['en', 'fr']} fullWidth={false}>
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
    <AdminContext i18nProvider={i18nProvider} defaultTheme="light">
        <Create resource="posts">
            <SimpleForm>
                {children}
                <FormInspector name="title" />
                <FormInspector name="description" />
            </SimpleForm>
        </Create>
    </AdminContext>
);

const PrefillWithTitleButton = () => {
    const sourceContext = useSourceContext();
    const { setValue, getValues } = useFormContext();

    const onClick = () => {
        setValue(
            sourceContext.getSource('description'),
            getValues(sourceContext.getSource('title'))
        );
    };

    return (
        <Button onClick={onClick} size="small" sx={{ maxWidth: 140 }}>
            Prefill with title
        </Button>
    );
};

export const SetValue = () => (
    <Wrapper>
        <TranslatableInputs locales={['en', 'fr']}>
            <TextInput source="title" />
            <TextInput source="description" helperText={false} />
            <PrefillWithTitleButton />
        </TranslatableInputs>
    </Wrapper>
);
