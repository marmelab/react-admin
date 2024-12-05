import * as React from 'react';
import { required, email, Resource, TestMemoryRouter } from 'ra-core';
import fakeRestDataProvider from 'ra-data-fakerest';
import polyglotI18nProvider from 'ra-i18n-polyglot';
import englishMessages from 'ra-language-english';
import { Chip } from '@mui/material';

import {
    AdminUI,
    AdminContext,
    Create,
    Edit,
    List,
    SimpleList,
    SimpleForm,
    ShowGuesser,
    TextInput,
} from '../';
import { TextArrayInput } from './TextArrayInput';
import { FormInspector } from './common';

export default { title: 'ra-ui-materialui/input/TextArrayInput' };

const Wrapper = ({
    children,
    record = { id: 123, to: ['john@example.com', 'albert@target.dev'] },
}: {
    children: React.ReactNode;
    record?: any;
}) => (
    <AdminContext defaultTheme="light">
        <Create resource="emails" record={record} sx={{ width: 600 }}>
            <SimpleForm mode="onChange">{children}</SimpleForm>
        </Create>
    </AdminContext>
);

export const Basic = () => (
    <Wrapper>
        <TextArrayInput source="to" />
        <FormInspector name="to" />
    </Wrapper>
);

export const Disabled = () => (
    <Wrapper>
        <TextArrayInput source="to" disabled />
        <FormInspector name="to" />
    </Wrapper>
);

export const ReadOnly = () => (
    <Wrapper>
        <TextArrayInput source="to" readOnly />
        <FormInspector name="to" />
    </Wrapper>
);

export const DefaultValue = () => (
    <Wrapper record={{}}>
        <TextArrayInput source="to" defaultValue={['john@example.com']} />
        <FormInspector name="to" />
    </Wrapper>
);

export const HelperText = () => (
    <Wrapper>
        <TextArrayInput source="to" />
        <TextArrayInput source="to" helperText={false} />
        <TextArrayInput
            source="to"
            helperText="Email addresses of the recipients"
        />
    </Wrapper>
);

export const Label = () => (
    <Wrapper>
        <TextArrayInput source="to" />
        <TextArrayInput source="to" label={false} />
        <TextArrayInput source="to" label="To" />
    </Wrapper>
);

export const NonFullWidth = () => (
    <Wrapper>
        <TextArrayInput source="to" label="default" />
        <TextArrayInput
            source="to"
            label="Full Width False"
            fullWidth={false}
        />
    </Wrapper>
);

export const Margin = () => (
    <Wrapper>
        <div style={{ border: 'solid 1px red', marginBottom: '1em' }}>
            <TextArrayInput source="to" label="default (dense)" />
        </div>
        <div style={{ border: 'solid 1px red', marginBottom: '1em' }}>
            <TextArrayInput source="to" label="none" margin="none" />
        </div>
        <div style={{ border: 'solid 1px red', marginBottom: '1em' }}>
            <TextArrayInput source="to" label="normal" margin="normal" />
        </div>
    </Wrapper>
);

export const Variant = () => (
    <Wrapper>
        <TextArrayInput source="to" label="default (filled)" />
        <TextArrayInput source="to" label="outlined" variant="outlined" />
        <TextArrayInput source="to" label="standard" variant="standard" />
    </Wrapper>
);

export const Validate = () => (
    <Wrapper>
        <TextArrayInput
            source="to"
            validate={value => {
                if (value.some(email())) {
                    return 'Not an array of valid emails';
                }
                return undefined;
            }}
        />
    </Wrapper>
);

export const Required = () => (
    <Wrapper>
        <TextArrayInput source="to" />
        <TextArrayInput source="to" validate={required()} />
        <TextArrayInput source="to" validate={[required()]} />
    </Wrapper>
);

export const Options = () => (
    <Wrapper>
        <TextArrayInput
            source="to"
            options={[
                'john.doe@example.com',
                'jane.smith@example.com',
                'alice.jones@example.com',
                'bob.brown@example.com',
                'charlie.davis@example.com',
                'david.evans@example.com',
                'emily.frank@example.com',
                'frank.green@example.com',
                'grace.harris@example.com',
                'henry.ivan@example.com',
            ]}
        />
    </Wrapper>
);

export const RenderTags = () => (
    <Wrapper>
        <TextArrayInput
            source="to"
            renderTags={(value: readonly string[], getTagProps) =>
                value.map((option: string, index: number) => {
                    const { key, ...tagProps } = getTagProps({ index });
                    return (
                        <Chip
                            variant="outlined"
                            label={option}
                            key={key}
                            {...tagProps}
                        />
                    );
                })
            }
        />
    </Wrapper>
);

export const Sx = () => (
    <Wrapper>
        <TextArrayInput
            source="to"
            sx={{
                border: 'solid 1px red',
                borderRadius: '5px',
                '& .MuiInputLabel-root': { fontWeight: 'bold' },
            }}
        />
    </Wrapper>
);

export const ExtraProps = () => (
    <Wrapper>
        <TextArrayInput source="to" disableClearable />
    </Wrapper>
);

export const ValueUndefined = () => (
    <Wrapper record={{ id: 123 }}>
        <TextArrayInput source="to" />
        <FormInspector name="to" />
    </Wrapper>
);

export const ValueNull = () => (
    <Wrapper record={{ id: 123, to: null }}>
        <TextArrayInput source="to" />
        <FormInspector name="to" />
    </Wrapper>
);

export const Parse = () => (
    <Wrapper record={{}}>
        <TextArrayInput
            source="to"
            parse={(v: string[]) =>
                v.map(v1 => (v1.includes('@') ? v1 : `${v1}@example.com`))
            }
        />
        <FormInspector name="to" />
    </Wrapper>
);

export const Format = () => (
    <Wrapper record={{}}>
        <TextArrayInput
            source="to"
            format={v => v?.map(v1 => v1.replace('@example.com', ''))}
        />
        <FormInspector name="to" />
    </Wrapper>
);

const i18nProvider = polyglotI18nProvider(() => englishMessages, 'en');

const dataProvider = fakeRestDataProvider({
    emails: [
        {
            id: 123,
            date: '2024-11-26T11:37:22.564Z',
            from: 'julie.green@example.com',
            to: ['john.doe@example.com', 'jane.smith@example.com'],
            subject: 'Feedback on your website',
            body: `Hi, I found a bug on your website. Here is how to reproduce it:
1. Go to the home page
2. Click on the button
3. See the error

Best regards,

Julie
`,
        },
        {
            id: 124,
            date: '2024-11-28T11:49:22.009Z',
            from: 'julie.green@example.com',
            to: ['grace.harris@example.com'],
            subject: 'Request for a quote',
            body: `Hi,

I would like to know if you can provide a quote for the following items:

- 100 units of product A
- 50 units of product B
- 25 units of product C

Best regards,

Julie
`,
        },
    ],
});

export const FullApp = () => (
    <TestMemoryRouter>
        <AdminContext dataProvider={dataProvider} i18nProvider={i18nProvider}>
            <AdminUI>
                <Resource
                    name="emails"
                    list={() => (
                        <List
                            title="Outbox"
                            sort={{ field: 'date', order: 'DESC' }}
                        >
                            <SimpleList
                                primaryText={email =>
                                    `to: ${email.to.join(', ')}`
                                }
                                secondaryText="%{subject}"
                                tertiaryText={email =>
                                    new Date(email.date).toLocaleDateString()
                                }
                                linkType="show"
                            />
                        </List>
                    )}
                    show={ShowGuesser}
                    edit={() => (
                        <Edit>
                            <SimpleForm
                                defaultValues={{
                                    from: 'julie.green@example.com',
                                    date: new Date().toISOString(),
                                }}
                            >
                                <TextArrayInput
                                    source="to"
                                    helperText={false}
                                />
                                <TextInput
                                    source="subject"
                                    helperText={false}
                                />
                                <TextInput
                                    source="body"
                                    multiline
                                    minRows={5}
                                    helperText={false}
                                />
                            </SimpleForm>
                        </Edit>
                    )}
                    create={() => (
                        <Create title="New email">
                            <SimpleForm
                                defaultValues={{
                                    from: 'julie.green@example.com',
                                    date: new Date().toISOString(),
                                }}
                            >
                                <TextArrayInput
                                    source="to"
                                    helperText={false}
                                />
                                <TextInput
                                    source="subject"
                                    helperText={false}
                                />
                                <TextInput
                                    source="body"
                                    multiline
                                    minRows={5}
                                    helperText={false}
                                />
                            </SimpleForm>
                        </Create>
                    )}
                />
            </AdminUI>
        </AdminContext>
    </TestMemoryRouter>
);
