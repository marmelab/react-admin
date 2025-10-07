import * as React from 'react';
import { Admin, type CoreAdminContextProps } from 'react-admin';
import {
    Resource,
    Form,
    useRecordContext,
    TestMemoryRouter,
    useEditContext,
    IsOffline,
    GetOneResult,
} from 'ra-core';
import polyglotI18nProvider from 'ra-i18n-polyglot';
import englishMessages from 'ra-language-english';
import fakeRestDataProvider from 'ra-data-fakerest';

import {
    Alert,
    Box,
    Card,
    Stack,
    ThemeOptions,
    Typography,
} from '@mui/material';

import { Layout } from '../layout';
import { TextInput } from '../input';
import { SimpleForm } from '../form/SimpleForm';
import { ShowButton, SaveButton, Button } from '../button';
import TopToolbar from '../layout/TopToolbar';
import { Edit, EditProps } from './Edit';
import { deepmerge } from '@mui/utils';
import { defaultLightTheme } from '../theme';
import { onlineManager, useMutationState } from '@tanstack/react-query';

export default { title: 'ra-ui-materialui/detail/Edit' };

const book = {
    id: 1,
    title: 'War and Peace',
    author: 'Leo Tolstoy',
    summary:
        "War and Peace broadly focuses on Napoleon's invasion of Russia, and the impact it had on Tsarist society. The book explores themes such as revolution, revolution and empire, the growth and decline of various states and the impact it had on their economies, culture, and society.",
    year: 1869,
};

const dataProvider = fakeRestDataProvider({
    books: [book],
});

const BookTitle = () => {
    const record = useRecordContext();
    return record ? <span>{record.title}</span> : null;
};

export const Basic = () => (
    <TestMemoryRouter initialEntries={['/books/1/Edit']}>
        <Admin dataProvider={dataProvider}>
            <Resource
                name="books"
                edit={() => (
                    <Edit>
                        <BookTitle />
                    </Edit>
                )}
            />
        </Admin>
    </TestMemoryRouter>
);

export const WithForm = () => (
    <TestMemoryRouter initialEntries={['/books/1/Edit']}>
        <Admin dataProvider={dataProvider}>
            <Resource
                name="books"
                edit={() => (
                    <Edit>
                        <Form>
                            <Stack spacing={2} sx={{ padding: 2 }}>
                                <TextInput source="title" />
                                <TextInput source="author" />
                                <TextInput source="summary" />
                                <TextInput source="year" />
                            </Stack>
                            <SaveButton />
                        </Form>
                    </Edit>
                )}
            />
        </Admin>
    </TestMemoryRouter>
);

export const Actions = () => (
    <TestMemoryRouter initialEntries={['/books/1/Edit']}>
        <Admin dataProvider={dataProvider}>
            <Resource
                name="books"
                edit={() => (
                    <Edit
                        actions={
                            <TopToolbar>
                                <ShowButton />
                            </TopToolbar>
                        }
                    >
                        <BookTitle />
                    </Edit>
                )}
            />
        </Admin>
    </TestMemoryRouter>
);

export const Title = () => (
    <TestMemoryRouter initialEntries={['/books/1/Edit']}>
        <Admin dataProvider={dataProvider}>
            <Resource
                name="books"
                edit={() => (
                    <Edit title="Hello">
                        <BookTitle />
                    </Edit>
                )}
            />
        </Admin>
    </TestMemoryRouter>
);

export const TitleElement = () => (
    <TestMemoryRouter initialEntries={['/books/1/Edit']}>
        <Admin dataProvider={dataProvider}>
            <Resource
                name="books"
                edit={() => (
                    <Edit title={<span>Hello</span>}>
                        <BookTitle />
                    </Edit>
                )}
            />
        </Admin>
    </TestMemoryRouter>
);

export const TitleFalse = () => (
    <TestMemoryRouter initialEntries={['/books/1/Edit']}>
        <Admin dataProvider={dataProvider}>
            <Resource
                name="books"
                edit={() => (
                    <Edit title={false}>
                        <BookTitle />
                    </Edit>
                )}
            />
        </Admin>
    </TestMemoryRouter>
);

const AsideComponent = () => <Card sx={{ padding: 2 }}>Aside</Card>;

export const Aside = () => (
    <TestMemoryRouter initialEntries={['/books/1/Edit']}>
        <Admin dataProvider={dataProvider}>
            <Resource
                name="books"
                edit={() => (
                    <Edit aside={<AsideComponent />}>
                        <BookTitle />
                    </Edit>
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
    <TestMemoryRouter initialEntries={['/books/1/Edit']}>
        <Admin dataProvider={dataProvider}>
            <Resource
                name="books"
                edit={() => (
                    <Edit component={CustomWrapper}>
                        <BookTitle />
                    </Edit>
                )}
            />
        </Admin>
    </TestMemoryRouter>
);

export const SX = () => (
    <TestMemoryRouter initialEntries={['/books/1/Edit']}>
        <Admin dataProvider={dataProvider}>
            <Resource
                name="books"
                edit={() => (
                    <Edit
                        sx={{
                            padding: 2,
                            border: '1px solid #333',
                        }}
                    >
                        <BookTitle />
                    </Edit>
                )}
            />
        </Admin>
    </TestMemoryRouter>
);

export const Meta = () => (
    <TestMemoryRouter initialEntries={['/books/1/Edit']}>
        <Admin
            dataProvider={
                {
                    getOne: (resource, params) => {
                        console.log('getOne', resource, params);
                        return dataProvider.getOne(resource, params);
                    },
                } as any
            }
        >
            <Resource
                name="books"
                edit={() => (
                    <Edit queryOptions={{ meta: { foo: 'bar ' } }}>
                        <BookTitle />
                    </Edit>
                )}
            />
        </Admin>
    </TestMemoryRouter>
);

const EditContent = () => {
    const { save } = useEditContext();
    return <button onClick={() => save!({ ...book, year: 1870 })}>Save</button>;
};

const dataProviderWithUpdate = {
    getOne: async () => ({ data: book }) as any,
    update: async (_resource, params) =>
        ({ data: { ...book, ...params.data } }) as any,
} as any;

export const NotificationDefault = () => (
    <TestMemoryRouter initialEntries={['/books/1/edit']}>
        <Admin dataProvider={dataProviderWithUpdate}>
            <Resource
                name="books"
                edit={() => (
                    <Edit>
                        <EditContent />
                    </Edit>
                )}
                list={() => <span />}
            />
        </Admin>
    </TestMemoryRouter>
);

export const NotificationTranslated = () => (
    <TestMemoryRouter initialEntries={['/books/1/edit']}>
        <Admin
            dataProvider={dataProviderWithUpdate}
            i18nProvider={polyglotI18nProvider(
                () => ({
                    ...englishMessages,
                    resources: {
                        books: { notifications: { updated: 'Book updated' } },
                    },
                }),
                'en'
            )}
        >
            <Resource
                name="books"
                edit={() => (
                    <Edit>
                        <EditContent />
                    </Edit>
                )}
                list={() => <span />}
            />
        </Admin>
    </TestMemoryRouter>
);

export const Default = () => (
    <TestMemoryRouter initialEntries={['/books/1/edit']}>
        <Admin dataProvider={dataProvider}>
            <Resource
                name="books"
                edit={() => (
                    <Edit>
                        <SimpleForm>
                            <TextInput source="title" />
                            <TextInput source="author" />
                            <TextInput source="summary" />
                            <TextInput source="year" />
                        </SimpleForm>
                    </Edit>
                )}
                show={() => <span />}
            />
        </Admin>
    </TestMemoryRouter>
);

export const EmptyWhileLoading = ({
    myDataProvider,
}: {
    myDataProvider?: CoreAdminContextProps['dataProvider'];
}) => {
    const customDataProvider = {
        getOne: () =>
            new Promise(resolve =>
                setTimeout(
                    () =>
                        resolve({
                            data: {
                                id: 1,
                                title: 'War and Peace',
                                author: 'Leo Tolstoy',
                                summary:
                                    "War and Peace broadly focuses on Napoleon's invasion of Russia, and the impact it had on Tsarist society. The book explores themes such as revolution, revolution and empire, the growth and decline of various states and the impact it had on their economies, culture, and society.",
                                year: 1869,
                            },
                        }),
                    2000
                )
            ),
    } as any;
    return (
        <TestMemoryRouter initialEntries={['/books/1/Edit']}>
            <Admin dataProvider={myDataProvider ?? customDataProvider}>
                <Resource
                    name="books"
                    edit={() => (
                        <Box>
                            <Typography variant="h6" sx={{ mt: 2, mb: -1 }}>
                                Book Edition
                            </Typography>
                            <Edit
                                emptyWhileLoading
                                aside={<AsideComponentWithRecord />}
                            >
                                <SimpleForm>
                                    <TextInput source="title" />
                                    <TextInput source="author" />
                                    <TextInput source="summary" />
                                    <TextInput source="year" />
                                </SimpleForm>
                            </Edit>
                        </Box>
                    )}
                />
            </Admin>
        </TestMemoryRouter>
    );
};

const AsideComponentWithRecord = () => {
    const { record } = useEditContext();
    return (
        <Typography>
            {record.title}, by {record.author} ({record.year})
        </Typography>
    );
};

export const Themed = () => (
    <TestMemoryRouter initialEntries={['/books/1/Edit']}>
        <Admin
            dataProvider={dataProvider}
            theme={deepmerge(defaultLightTheme, {
                components: {
                    RaEdit: {
                        defaultProps: {
                            className: 'custom-class',
                        },
                        styleOverrides: {
                            root: {
                                ['& .RaEdit-card']: {
                                    color: 'red',
                                },
                            },
                        },
                    },
                },
            } as ThemeOptions)}
        >
            <Resource
                name="books"
                edit={() => (
                    <Edit data-testid={'themed-view'}>
                        <BookTitle />
                    </Edit>
                )}
            />
        </Admin>
    </TestMemoryRouter>
);

export const WithRenderProp = () => (
    <TestMemoryRouter initialEntries={['/books/1/Edit']}>
        <Admin dataProvider={dataProvider}>
            <Resource
                name="books"
                edit={() => (
                    <Edit
                        render={editContext => {
                            return editContext.record ? (
                                <span>{editContext.record.title}</span>
                            ) : null;
                        }}
                    >
                        <BookTitle />
                    </Edit>
                )}
            />
        </Admin>
    </TestMemoryRouter>
);

export const Offline = ({
    isOnline = true,
    offline,
}: {
    isOnline?: boolean;
    offline?: React.ReactNode;
}) => {
    React.useEffect(() => {
        onlineManager.setOnline(isOnline);
    }, [isOnline]);
    return (
        <TestMemoryRouter initialEntries={['/books/1/edit']}>
            <Admin dataProvider={dataProvider}>
                <Resource
                    name="books"
                    edit={<BookEditOffline offline={offline} />}
                />
            </Admin>
        </TestMemoryRouter>
    );
};

const BookEditOffline = (props: EditProps) => {
    return (
        <Edit
            {...props}
            emptyWhileLoading
            redirect={false}
            mutationMode="pessimistic"
        >
            <OfflineIndicator />
            <SimpleForm>
                <TextInput source="title" />
                <TextInput source="author" />
                <TextInput source="summary" />
                <TextInput source="year" />
            </SimpleForm>
        </Edit>
    );
};

const OfflineIndicator = () => {
    const pendingMutations = useMutationState({
        filters: {
            status: 'pending',
        },
    });

    if (pendingMutations.length === 0) {
        return (
            <IsOffline>
                <Alert severity="warning">
                    You are offline, the data may be outdated
                </Alert>
            </IsOffline>
        );
    }
    return (
        <IsOffline>
            <Alert severity="warning">You have pending mutations</Alert>
        </IsOffline>
    );
};

const CustomOffline = () => {
    return <Alert severity="warning">You are offline!</Alert>;
};

Offline.args = {
    isOnline: true,
    offline: 'default',
};

Offline.argTypes = {
    isOnline: {
        control: { type: 'boolean' },
    },
    offline: {
        name: 'Offline component',
        control: { type: 'radio' },
        options: ['default', 'custom'],
        mapping: {
            default: undefined,
            custom: <CustomOffline />,
        },
    },
};

const CustomError = () => {
    return <Alert severity="error">Something went wrong!</Alert>;
};

export const FetchError = ({ error }: { error?: React.ReactNode }) => {
    let rejectGetOne: (() => void) | null = null;
    const errorDataProvider = {
        ...dataProvider,
        getOne: () => {
            return new Promise<GetOneResult>((_, reject) => {
                rejectGetOne = () => reject(new Error('Expected error.'));
            });
        },
    };

    return (
        <TestMemoryRouter initialEntries={['/books/1/edit']}>
            <Admin
                dataProvider={errorDataProvider}
                layout={({ children }) => (
                    <Layout>
                        <Button
                            onClick={() => {
                                rejectGetOne && rejectGetOne();
                            }}
                        >
                            Reject loading
                        </Button>
                        {children}
                    </Layout>
                )}
            >
                <Resource
                    name="books"
                    list={<p>List view</p>}
                    edit={() => (
                        <Edit error={error}>
                            <SimpleForm>
                                <TextInput source="title" />
                                <TextInput source="author" />
                                <TextInput source="summary" />
                                <TextInput source="year" />
                            </SimpleForm>
                        </Edit>
                    )}
                />
            </Admin>
        </TestMemoryRouter>
    );
};

FetchError.args = {
    error: 'custom',
};

FetchError.argTypes = {
    error: {
        name: 'Error component',
        control: { type: 'radio' },
        options: ['default', 'custom'],
        mapping: {
            default: undefined,
            custom: <CustomError />,
        },
    },
};
