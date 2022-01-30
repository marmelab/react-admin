import * as React from 'react';
import { Form, FormProps, required } from 'ra-core';
import { AdminContext } from 'ra-ui-materialui';
import { RichTextInput } from './RichTextInput';
import { RichTextInputToolbar } from './RichTextInputToolbar';

export default { title: 'Basic Usage' };

export const Basic = (props: Partial<FormProps>) => (
    <AdminContext>
        <Form
            defaultValues={{ body: 'Hello World' }}
            onSubmit={() => {}}
            render={() => (
                <>
                    <RichTextInput label="Body" source="body" />
                    <button type="submit">Save</button>
                </>
            )}
            {...props}
        />
    </AdminContext>
);

export const Small = (props: Partial<FormProps>) => (
    <AdminContext>
        <Form
            defaultValues={{ body: 'Hello World' }}
            onSubmit={() => {}}
            render={() => (
                <>
                    <RichTextInput
                        toolbar={<RichTextInputToolbar size="small" />}
                        label="Body"
                        source="body"
                    />
                    <button type="submit">Save</button>
                </>
            )}
            {...props}
        />
    </AdminContext>
);

export const Large = (props: Partial<FormProps>) => (
    <AdminContext>
        <Form
            defaultValues={{ body: 'Hello World' }}
            onSubmit={() => {}}
            render={() => (
                <>
                    <RichTextInput
                        toolbar={<RichTextInputToolbar size="large" />}
                        label="Body"
                        source="body"
                    />
                    <button type="submit">Save</button>
                </>
            )}
            {...props}
        />
    </AdminContext>
);

export const Validation = (props: Partial<FormProps>) => (
    <AdminContext>
        <Form
            defaultValues={{ body: 'Hello World' }}
            onSubmit={() => {}}
            render={() => (
                <>
                    <RichTextInput
                        label="Body"
                        source="body"
                        validate={required()}
                    />
                    <button type="submit">Save</button>
                </>
            )}
            {...props}
        />
    </AdminContext>
);
