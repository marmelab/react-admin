import * as React from 'react';
import { Routes, Route, Link } from 'react-router-dom';

import { Admin } from './Admin';
import { Resource, testDataProvider, TestMemoryRouter } from 'ra-core';
import { AppBar, Layout } from 'ra-ui-materialui';
import { Box, Typography } from '@mui/material';

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
const FailedAppBar = () => <AppBar color="nothing" />;

const FailedLayout = props => <Layout {...props} appBar={FailedAppBar} />;

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
                ?.map((line, index) => (
                    <li key={index}>At {line}</li>
                ))}
        </ul>
    </Box>
);

export const CustomError = () => (
    <Admin layout={FailedLayout} error={ErrorPage}>
        <Resource name="posts" list={PostList} />
    </Admin>
);
