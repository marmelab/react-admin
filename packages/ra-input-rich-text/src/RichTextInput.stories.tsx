import * as React from 'react';
import { I18nProvider, required } from 'ra-core';
import { AdminContext, SimpleForm, SimpleFormProps } from 'ra-ui-materialui';
import { RichTextInput } from './RichTextInput';
import { RichTextInputToolbar } from './RichTextInputToolbar';
import { useWatch } from 'react-hook-form';

export default { title: 'ra-input-rich-text/RichTextInput' };

const FormInspector = ({ name = 'body' }) => {
    const value = useWatch({ name });
    return (
        <div style={{ backgroundColor: 'lightgrey' }}>
            {name} value in form:&nbsp;
            <code>
                {JSON.stringify(value)} ({typeof value})
            </code>
        </div>
    );
};

const i18nProvider: I18nProvider = {
    translate: (key: string, options: any) => options?._ ?? key,
    changeLocale: () => Promise.resolve(),
    getLocale: () => 'en',
};

export const Basic = (props: Partial<SimpleFormProps>) => (
    <AdminContext i18nProvider={i18nProvider}>
        <SimpleForm
            defaultValues={{ body: 'Hello World' }}
            onSubmit={() => {}}
            {...props}
        >
            <RichTextInput source="body" />
            <FormInspector />
        </SimpleForm>
    </AdminContext>
);

export const Disabled = (props: Partial<SimpleFormProps>) => (
    <AdminContext i18nProvider={i18nProvider}>
        <SimpleForm
            defaultValues={{ body: 'Hello World' }}
            onSubmit={() => {}}
            {...props}
        >
            <RichTextInput source="body" disabled />
            <FormInspector />
        </SimpleForm>
    </AdminContext>
);

export const Small = (props: Partial<SimpleFormProps>) => (
    <AdminContext i18nProvider={i18nProvider}>
        <SimpleForm
            defaultValues={{ body: 'Hello World' }}
            onSubmit={() => {}}
            {...props}
        >
            <RichTextInput
                toolbar={<RichTextInputToolbar size="small" />}
                label="Body"
                source="body"
            />
            <FormInspector />
        </SimpleForm>
    </AdminContext>
);

export const Medium = (props: Partial<SimpleFormProps>) => (
    <AdminContext i18nProvider={i18nProvider}>
        <SimpleForm
            defaultValues={{ body: 'Hello World' }}
            onSubmit={() => {}}
            {...props}
        >
            <RichTextInput
                toolbar={<RichTextInputToolbar size="medium" />}
                label="Body"
                source="body"
            />
            <FormInspector />
        </SimpleForm>
    </AdminContext>
);

export const Large = (props: Partial<SimpleFormProps>) => (
    <AdminContext i18nProvider={i18nProvider}>
        <SimpleForm
            defaultValues={{ body: 'Hello World' }}
            onSubmit={() => {}}
            {...props}
        >
            <RichTextInput
                toolbar={<RichTextInputToolbar size="large" />}
                label="Body"
                source="body"
            />
            <FormInspector />
        </SimpleForm>
    </AdminContext>
);

export const FullWidth = (props: Partial<SimpleFormProps>) => (
    <AdminContext i18nProvider={i18nProvider}>
        <SimpleForm
            defaultValues={{ body: 'Hello World' }}
            onSubmit={() => {}}
            {...props}
        >
            <RichTextInput
                toolbar={<RichTextInputToolbar />}
                label="Body"
                source="body"
                fullWidth
            />
            <FormInspector />
        </SimpleForm>
    </AdminContext>
);

export const Sx = (props: Partial<SimpleFormProps>) => (
    <AdminContext i18nProvider={i18nProvider}>
        <SimpleForm
            defaultValues={{ body: 'Hello World' }}
            onSubmit={() => {}}
            {...props}
        >
            <RichTextInput
                label="Body"
                source="body"
                sx={{ border: '1px solid red' }}
            />
            <FormInspector />
        </SimpleForm>
    </AdminContext>
);

export const Validation = (props: Partial<SimpleFormProps>) => (
    <AdminContext i18nProvider={i18nProvider}>
        <SimpleForm onSubmit={() => {}} {...props}>
            <RichTextInput label="Body" source="body" validate={required()} />
            <FormInspector />
        </SimpleForm>
    </AdminContext>
);
