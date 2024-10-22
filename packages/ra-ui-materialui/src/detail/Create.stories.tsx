import * as React from 'react';
import { Admin } from 'react-admin';
import {
    Resource,
    Form,
    TestMemoryRouter,
    testDataProvider,
    useCreateContext,
} from 'ra-core';
import polyglotI18nProvider from 'ra-i18n-polyglot';
import englishMessages from 'ra-language-english';
import { Box, Card, Stack } from '@mui/material';

import { TextInput } from '../input';
import { SimpleForm } from '../form/SimpleForm';
import { ListButton, SaveButton } from '../button';
import TopToolbar from '../layout/TopToolbar';
import { Create } from './Create';

export default { title: 'ra-ui-materialui/detail/Create' };

const dataProvider = testDataProvider();

const Content = () => <div>Create content</div>;

export const Basic = () => (
    <TestMemoryRouter initialEntries={['/books/create']}>
        <Admin dataProvider={dataProvider}>
            <Resource
                name="books"
                create={() => (
                    <Create>
                        <Content />
                    </Create>
                )}
            />
        </Admin>
    </TestMemoryRouter>
);

export const WithForm = () => (
    <TestMemoryRouter initialEntries={['/books/create']}>
        <Admin dataProvider={dataProvider}>
            <Resource
                name="books"
                create={() => (
                    <Create>
                        <Form>
                            <Stack spacing={2} sx={{ padding: 2 }}>
                                <TextInput source="title" />
                                <TextInput source="author" />
                                <TextInput source="summary" />
                                <TextInput source="year" />
                            </Stack>
                            <SaveButton />
                        </Form>
                    </Create>
                )}
            />
        </Admin>
    </TestMemoryRouter>
);

export const Actions = () => (
    <TestMemoryRouter initialEntries={['/books/create']}>
        <Admin dataProvider={dataProvider}>
            <Resource
                name="books"
                create={() => (
                    <Create
                        actions={
                            <TopToolbar>
                                <ListButton />
                            </TopToolbar>
                        }
                    >
                        <Content />
                    </Create>
                )}
            />
        </Admin>
    </TestMemoryRouter>
);

export const Title = () => (
    <TestMemoryRouter initialEntries={['/books/create']}>
        <Admin dataProvider={dataProvider}>
            <Resource
                name="books"
                create={() => (
                    <Create title="Hello">
                        <Content />
                    </Create>
                )}
            />
        </Admin>
    </TestMemoryRouter>
);

export const TitleElement = () => (
    <TestMemoryRouter initialEntries={['/books/create']}>
        <Admin dataProvider={dataProvider}>
            <Resource
                name="books"
                create={() => (
                    <Create title={<span>Hello</span>}>
                        <Content />
                    </Create>
                )}
            />
        </Admin>
    </TestMemoryRouter>
);

export const TitleFalse = () => (
    <TestMemoryRouter initialEntries={['/books/create']}>
        <Admin dataProvider={dataProvider}>
            <Resource
                name="books"
                create={() => (
                    <Create title={false}>
                        <Content />
                    </Create>
                )}
            />
        </Admin>
    </TestMemoryRouter>
);

const AsideComponent = () => <Card sx={{ padding: 2 }}>Aside</Card>;

export const Aside = () => (
    <TestMemoryRouter initialEntries={['/books/create']}>
        <Admin dataProvider={dataProvider}>
            <Resource
                name="books"
                create={() => (
                    <Create aside={<AsideComponent />}>
                        <Content />
                    </Create>
                )}
            />
        </Admin>
    </TestMemoryRouter>
);

const CustomWrapper = ({ children }) => (
    <Box
        sx={{ padding: 2, width: 200, border: 'solid 1px black' }}
        data-testid="custom-component"
    >
        {children}
    </Box>
);

export const Component = () => (
    <TestMemoryRouter initialEntries={['/books/create']}>
        <Admin dataProvider={dataProvider}>
            <Resource
                name="books"
                create={() => (
                    <Create component={CustomWrapper}>
                        <Content />
                    </Create>
                )}
            />
        </Admin>
    </TestMemoryRouter>
);

export const SX = () => (
    <TestMemoryRouter initialEntries={['/books/create']}>
        <Admin dataProvider={dataProvider}>
            <Resource
                name="books"
                create={() => (
                    <Create
                        sx={{
                            padding: 2,
                            border: '1px solid red',
                        }}
                    >
                        <Content />
                    </Create>
                )}
            />
        </Admin>
    </TestMemoryRouter>
);

const CreateContent = () => {
    const { save } = useCreateContext();
    return <button onClick={save}>Save</button>;
};

const dataProviderWithCreate = {
    create: async () =>
        ({
            data: {
                id: 1,
                title: 'War and Peace',
                author: 'Leo Tolstoy',
                summary:
                    "War and Peace broadly focuses on Napoleon's invasion of Russia, and the impact it had on Tsarist society. The book explores themes such as revolution, revolution and empire, the growth and decline of various states and the impact it had on their economies, culture, and society.",
                year: 1869,
            },
        }) as any,
} as any;

export const NotificationDefault = () => (
    <TestMemoryRouter initialEntries={['/books/create']}>
        <Admin dataProvider={dataProviderWithCreate}>
            <Resource
                name="books"
                create={() => (
                    <Create>
                        <CreateContent />
                    </Create>
                )}
                list={() => <span />}
            />
        </Admin>
    </TestMemoryRouter>
);

export const NotificationTranslated = () => (
    <TestMemoryRouter initialEntries={['/books/create']}>
        <Admin
            dataProvider={dataProviderWithCreate}
            i18nProvider={polyglotI18nProvider(
                () => ({
                    ...englishMessages,
                    resources: {
                        books: { notifications: { created: 'Book created' } },
                    },
                }),
                'en'
            )}
        >
            <Resource
                name="books"
                create={() => (
                    <Create>
                        <CreateContent />
                    </Create>
                )}
                list={() => <span />}
            />
        </Admin>
    </TestMemoryRouter>
);

export const Default = () => (
    <TestMemoryRouter initialEntries={['/books/create']}>
        <Admin dataProvider={dataProvider}>
            <Resource
                name="books"
                create={() => (
                    <Create>
                        <SimpleForm>
                            <TextInput source="title" />
                            <TextInput source="author" />
                            <TextInput source="summary" />
                            <TextInput source="year" />
                        </SimpleForm>
                    </Create>
                )}
                show={() => <span />}
            />
        </Admin>
    </TestMemoryRouter>
);
