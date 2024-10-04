import * as React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { Resource, testDataProvider, TestMemoryRouter } from 'ra-core';
import type { AuthProvider } from 'ra-core';
import {
    Layout,
    ListGuesser,
    EditGuesser,
    ShowGuesser,
} from 'ra-ui-materialui';
import { Box, Typography, Button } from '@mui/material';
import fakeRestDataProvider from 'ra-data-fakerest';
import { useQueryClient } from '@tanstack/react-query';

import { Admin } from './Admin';

export default {
    title: 'react-admin/Admin',
};

const PostList = () => <h1>Post List</h1>;
const CommentList = () => <h1>Comment List</h1>;

export const Basic = () => (
    <Admin dataProvider={testDataProvider()}>
        <Resource name="posts" list={PostList} />
        <Resource name="comments" list={CommentList} />
    </Admin>
);

export const InsideRouter = () => (
    <TestMemoryRouter>
        <Admin dataProvider={testDataProvider()}>
            <Resource name="posts" list={PostList} />
            <Resource name="comments" list={CommentList} />
        </Admin>
    </TestMemoryRouter>
);

export const SubPath = () => (
    <TestMemoryRouter>
        <Routes>
            <Route
                path="/"
                element={
                    <>
                        <h1>Main</h1>
                        <div>
                            <Link to="/admin">Go to admin</Link>
                        </div>
                    </>
                }
            />
            <Route
                path="/admin/*"
                element={
                    <Admin dataProvider={testDataProvider()} basename="/admin">
                        <Resource name="posts" list={PostList} />
                        <Resource name="comments" list={CommentList} />
                    </Admin>
                }
            />
        </Routes>
    </TestMemoryRouter>
);

// @ts-ignore
const FailingAppBar = () => {
    throw new Error('AppBar rendering failed');
};

const FailedLayout = props => <Layout {...props} appBar={FailingAppBar} />;

export const DefaultError = () => (
    <Admin layout={FailedLayout}>
        <Resource name="posts" list={PostList} />
    </Admin>
);

const ErrorPage = ({ errorInfo }: { errorInfo?: React.ErrorInfo }) => (
    <Box
        sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            minHeight: '100vh',
            backgroundColor: '#f44336',
        }}
    >
        <Typography variant="h1" style={{ color: 'white' }}>
            <b>Error</b>
        </Typography>
        <ul>
            {errorInfo?.componentStack
                ?.split(' at ')
                ?.slice(1)
                ?.map((line, index) => <li key={index}>At {line}</li>)}
        </ul>
    </Box>
);

export const CustomError = () => (
    <Admin layout={FailedLayout} error={ErrorPage}>
        <Resource name="posts" list={PostList} />
    </Admin>
);

const dataProvider = fakeRestDataProvider({
    books: [
        { id: 1, title: 'War and Peace', author_id: 1 },
        { id: 2, title: 'Pride and Prejudice', author_id: 2 },
        { id: 3, title: 'The Picture of Dorian Gray', author_id: 3 },
    ],
    authors: [
        { id: 1, firstName: 'Leo', lastName: 'Tolstoy' },
        { id: 2, firstName: 'Jane', lastName: 'Austen' },
        { id: 3, firstName: 'Oscar', lastName: 'Wilde' },
    ],
    users: [
        { id: 1, fullName: 'John Appleseed' },
        { id: 2, fullName: 'Jane Doe' },
    ],
});

export const AccessControl = () => {
    const readerPermissions = [
        { action: 'list', resource: 'books' },
        { action: 'show', resource: 'books' },
        { action: 'list', resource: 'authors' },
        { action: 'show', resource: 'authors' },
    ];
    const editorPermissions = [
        { action: 'list', resource: 'books' },
        { action: 'create', resource: 'books' },
        { action: 'edit', resource: 'books' },
        { action: 'delete', resource: 'books' },
        { action: 'list', resource: 'authors' },
        { action: 'create', resource: 'authors' },
        { action: 'edit', resource: 'authors' },
        { action: 'delete', resource: 'authors' },
    ];
    const adminPermissions = [
        ...editorPermissions,
        { action: 'list', resource: 'users' },
        { action: 'show', resource: 'users' },
        { action: 'create', resource: 'users' },
        { action: 'edit', resource: 'users' },
        { action: 'delete', resource: 'users' },
    ];
    const [permissions, setPermissions] = React.useState(readerPermissions);
    const authProvider: AuthProvider = {
        // authentication
        async login() {},
        async checkError() {},
        async checkAuth() {},
        async logout() {},
        async getIdentity() {
            return { id: 'user', fullName: 'John Doe' };
        },
        async handleCallback() {}, // for third-party authentication only
        // authorization (optional)
        async canAccess({ resource, action }) {
            return permissions.some(
                p => p.resource === resource && p.action === action
            );
        },
        async getPermissions() {},
    };

    const CustomLayout = ({ children }) => {
        const queryClient = useQueryClient();
        return (
            <div>
                <Box
                    display="flex"
                    gap={2}
                    position="absolute"
                    bottom={10}
                    left="50%"
                    zIndex={1000}
                    sx={{ transform: 'translate(-50%, 0)' }}
                >
                    <Button
                        variant="outlined"
                        size="small"
                        onClick={() => {
                            setPermissions(readerPermissions);
                            queryClient.invalidateQueries({
                                queryKey: ['auth', 'canAccess'],
                            });
                        }}
                        disabled={
                            permissions.length === readerPermissions.length
                        }
                    >
                        View as reader
                    </Button>
                    <Button
                        variant="outlined"
                        size="small"
                        onClick={() => {
                            setPermissions(editorPermissions);
                            queryClient.invalidateQueries({
                                queryKey: ['auth', 'canAccess'],
                            });
                        }}
                        disabled={
                            permissions.length === editorPermissions.length
                        }
                    >
                        View as editor
                    </Button>
                    <Button
                        variant="outlined"
                        size="small"
                        onClick={() => {
                            setPermissions(adminPermissions);
                            queryClient.invalidateQueries({
                                queryKey: ['auth', 'canAccess'],
                            });
                        }}
                        disabled={
                            permissions.length === adminPermissions.length
                        }
                    >
                        View as admin
                    </Button>
                </Box>
                <Layout>{children}</Layout>
            </div>
        );
    };
    return (
        <Admin
            dataProvider={dataProvider}
            authProvider={authProvider}
            layout={CustomLayout}
        >
            <Resource
                name="books"
                list={ListGuesser}
                edit={EditGuesser}
                show={ShowGuesser}
                create={<>Create view</>}
            />
            <Resource
                name="authors"
                list={ListGuesser}
                edit={EditGuesser}
                show={ShowGuesser}
                create={<>Create view</>}
                recordRepresentation={record =>
                    `${record.firstName} ${record.lastName}`
                }
            />
            <Resource
                name="users"
                list={ListGuesser}
                edit={EditGuesser}
                show={ShowGuesser}
                create={<>Create view</>}
            />
        </Admin>
    );
};
