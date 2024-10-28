import * as React from 'react';
import polyglotI18nProvider from 'ra-i18n-polyglot';
import englishMessages from 'ra-language-english';
import { minValue } from 'ra-core';

import { AdminContext } from '../AdminContext';
import { Create } from '../detail';
import { SimpleForm, SimpleFormProps } from '../form';
import { DateInput, DateInputProps } from './DateInput';
import { FormInspector } from './common';

export default { title: 'ra-ui-materialui/input/DateInput' };

export const Basic = ({
    dateInputProps,
    simpleFormProps,
}: {
    dateInputProps?: Partial<DateInputProps>;
    simpleFormProps?: Partial<SimpleFormProps>;
}) => (
    <Wrapper simpleFormProps={simpleFormProps}>
        <DateInput source="publishedAt" {...dateInputProps} />
    </Wrapper>
);

export const OnChangeValidation = ({
    dateInputProps = {
        validate: value => {
            console.log({ value });
            return undefined;
        },
    },
    simpleFormProps = { mode: 'onChange' },
}: {
    dateInputProps?: Partial<DateInputProps>;
    simpleFormProps?: Partial<SimpleFormProps>;
}) => (
    <Wrapper simpleFormProps={simpleFormProps}>
        <DateInput source="publishedAt" {...dateInputProps} />
    </Wrapper>
);

export const NonFullWidth = () => (
    <Wrapper>
        <DateInput source="publishedAt" fullWidth={false} />
    </Wrapper>
);

export const Disabled = () => (
    <Wrapper>
        <DateInput source="publishedAt" disabled />
        <DateInput source="announcement" defaultValue="01/01/2000" disabled />
    </Wrapper>
);

export const ReadOnly = () => (
    <Wrapper>
        <DateInput source="publishedAt" readOnly />
        <DateInput source="announcement" defaultValue="01/01/2000" readOnly />
    </Wrapper>
);

export const Validate = () => (
    <Wrapper>
        <DateInput source="publishedAt" validate={minValue('2022-10-26')} />
    </Wrapper>
);

const i18nProvider = polyglotI18nProvider(() => englishMessages);

const Wrapper = ({
    children,
    simpleFormProps,
}: {
    children: React.ReactNode;
    simpleFormProps?: Partial<SimpleFormProps>;
}) => (
    <AdminContext i18nProvider={i18nProvider} defaultTheme="light">
        <Create resource="posts">
            <SimpleForm {...simpleFormProps}>
                {children}
                <FormInspector name="publishedAt" />
            </SimpleForm>
        </Create>
    </AdminContext>
);
