import * as React from 'react';
import {
    createRouter,
    createRootRoute,
    createRoute,
    RouterProvider,
    Outlet,
    Link as TanStackLink,
} from '@tanstack/react-router';
import { createHashHistory } from '@tanstack/history';
import fakeRestDataProvider from 'ra-data-fakerest';
import {
    tanStackRouterProvider,
    CustomRoutes,
    useGetList,
    Resource,
    LinkBase,
} from 'ra-core';
import {
    List,
    Datagrid,
    TextField,
    DateField,
    ReferenceField,
    EditButton,
    ShowButton,
    Edit,
    SimpleForm,
    TabbedForm,
    TextInput,
    DateInput,
    ReferenceInput,
    Show,
    SimpleShowLayout,
    Create,
    ReferenceManyField,
    TabbedShowLayout,
} from 'ra-ui-materialui';
import { Box, Card, CardContent, Typography, Button } from '@mui/material';

import { Admin } from './Admin';
const { Route } = tanStackRouterProvider;

export default {
    title: 'react-admin/Frameworks/TanStack',
};

// Fake data provider with posts and comments
const dataProvider = fakeRestDataProvider(
    {
        posts: [
            {
                id: 1,
                title: 'Hello World',
                body: 'Welcome to react-admin with TanStack Router!',
                created_at: '2024-01-15',
            },
            {
                id: 2,
                title: 'Getting Started',
                body: 'This is a guide to get you started with react-admin.',
                created_at: '2024-01-20',
            },
            {
                id: 3,
                title: 'Advanced Features',
                body: 'Learn about advanced features in react-admin.',
                created_at: '2024-02-01',
            },
            {
                id: 4,
                title: 'Custom Components',
                body: 'How to create custom components in react-admin.',
                created_at: '2024-02-10',
            },
            {
                id: 5,
                title: 'Data Providers',
                body: 'Understanding data providers in react-admin.',
                created_at: '2024-02-15',
            },
        ],
        comments: [
            {
                id: 1,
                post_id: 1,
                author: 'Alice',
                body: 'Great post!',
                created_at: '2024-01-16',
            },
            {
                id: 2,
                post_id: 1,
                author: 'Bob',
                body: 'Very helpful, thanks!',
                created_at: '2024-01-17',
            },
            {
                id: 3,
                post_id: 2,
                author: 'Charlie',
                body: 'This is exactly what I needed.',
                created_at: '2024-01-21',
            },
            {
                id: 4,
                post_id: 3,
                author: 'Diana',
                body: 'Can you explain more about this?',
                created_at: '2024-02-02',
            },
            {
                id: '類/衣',
                post_id: 4,
                author: 'Eve',
                body: 'Awesome tutorial!',
                created_at: '2024-02-11',
            },
        ],
    },
    process.env.NODE_ENV === 'development'
);

// Post List component
const PostList = () => (
    <List>
        <Datagrid>
            <TextField source="id" />
            <TextField source="title" />
            <DateField source="created_at" />
            <EditButton />
            <ShowButton />
        </Datagrid>
    </List>
);

// Post Edit component
const PostEdit = () => (
    <Edit>
        <SimpleForm warnWhenUnsavedChanges>
            <TextInput source="title" />
            <TextInput source="body" multiline rows={4} />
            <DateInput source="created_at" />
        </SimpleForm>
    </Edit>
);

// Post Show component
const PostShow = () => (
    <Show>
        <SimpleShowLayout>
            <TextField source="id" />
            <TextField source="title" />
            <TextField source="body" />
            <DateField source="created_at" />
            <ReferenceManyField
                label="Comments"
                reference="comments"
                target="post_id"
            >
                <Datagrid>
                    <TextField source="author" />
                    <TextField source="body" />
                    <DateField source="created_at" />
                </Datagrid>
            </ReferenceManyField>
        </SimpleShowLayout>
    </Show>
);

// Post Create component
const PostCreate = () => (
    <Create>
        <SimpleForm>
            <TextInput source="title" />
            <TextInput source="body" multiline rows={4} />
            <DateInput source="created_at" />
        </SimpleForm>
    </Create>
);

// Comment List component
const CommentList = () => (
    <List>
        <Datagrid>
            <TextField source="id" />
            <ReferenceField source="post_id" reference="posts" />
            <TextField source="author" />
            <TextField source="body" />
            <DateField source="created_at" />
            <EditButton />
        </Datagrid>
    </List>
);

const CommentShow = () => (
    <Show>
        <TabbedShowLayout>
            <TabbedShowLayout.Tab label="content">
                <TextField source="author" />
                <TextField source="body" />
            </TabbedShowLayout.Tab>
            <TabbedShowLayout.Tab label="metadata">
                <TextField source="id" />
                <ReferenceField source="post_id" reference="posts" />
                <DateField source="created_at" />
            </TabbedShowLayout.Tab>
        </TabbedShowLayout>
    </Show>
);

// Comment Edit component
const CommentEdit = () => (
    <Edit>
        <TabbedForm>
            <TabbedForm.Tab label="Content">
                <TextInput source="author" />
                <TextInput source="body" multiline rows={3} fullWidth />
            </TabbedForm.Tab>
            <TabbedForm.Tab label="Metadata">
                <ReferenceInput source="post_id" reference="posts" />
                <DateInput source="created_at" />
            </TabbedForm.Tab>
        </TabbedForm>
    </Edit>
);

// Comment Create component
const CommentCreate = () => (
    <Create>
        <SimpleForm>
            <ReferenceInput source="post_id" reference="posts" />
            <TextInput source="author" />
            <TextInput source="body" multiline rows={3} />
            <DateInput source="created_at" />
        </SimpleForm>
    </Create>
);

// Custom Dashboard page
const Dashboard = () => {
    const { data: posts, total: totalPosts } = useGetList('posts', {
        pagination: { page: 1, perPage: 5 },
        sort: { field: 'created_at', order: 'DESC' },
    });
    const { total: totalComments } = useGetList('comments', {
        pagination: { page: 1, perPage: 5 },
        sort: { field: 'created_at', order: 'DESC' },
    });

    return (
        <Box sx={{ p: 2 }}>
            <Typography variant="h4" gutterBottom>
                Dashboard
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Card sx={{ minWidth: 200 }}>
                    <CardContent>
                        <Typography color="textSecondary" gutterBottom>
                            Total Posts
                        </Typography>
                        <Typography variant="h3">{totalPosts ?? 0}</Typography>
                    </CardContent>
                </Card>
                <Card sx={{ minWidth: 200 }}>
                    <CardContent>
                        <Typography color="textSecondary" gutterBottom>
                            Total Comments
                        </Typography>
                        <Typography variant="h3">
                            {totalComments ?? 0}
                        </Typography>
                    </CardContent>
                </Card>
                <Card sx={{ minWidth: 200 }}>
                    <CardContent>
                        <Typography color="textSecondary" gutterBottom>
                            Configuration
                        </Typography>
                        <Button
                            component={LinkBase}
                            to="/settings"
                            variant="outlined"
                            sx={{ mt: 1 }}
                        >
                            Go to Settings
                        </Button>
                    </CardContent>
                </Card>
            </Box>
            <Box sx={{ mt: 4 }}>
                <Typography variant="h5" gutterBottom>
                    Recent Posts
                </Typography>
                {posts?.map(post => (
                    <Card key={post.id} sx={{ mb: 1 }}>
                        <CardContent>
                            <Typography variant="h6">{post.title}</Typography>
                            <Typography color="textSecondary">
                                {post.created_at}
                            </Typography>
                        </CardContent>
                    </Card>
                ))}
            </Box>
        </Box>
    );
};

// Custom Settings page (custom route example)
const SettingsPage = () => (
    <Box sx={{ p: 2 }}>
        <Typography variant="h4" gutterBottom>
            Settings
        </Typography>
        <Card>
            <CardContent>
                <Typography variant="h6">Application Settings</Typography>
                <Typography color="textSecondary" sx={{ mt: 2 }}>
                    This is a custom page demonstrating custom routes with
                    TanStack Router.
                </Typography>
                <Box sx={{ mt: 2 }}>
                    <Typography>Theme: Light</Typography>
                    <Typography>Language: English</Typography>
                    <Typography>Notifications: Enabled</Typography>
                </Box>
            </CardContent>
        </Card>
    </Box>
);

/**
 * Basic: Standalone TanStack Router Admin
 * Admin creates its own TanStack Router instance.
 */
export const FullApp = () => (
    <Admin
        routerProvider={tanStackRouterProvider}
        dataProvider={dataProvider}
        dashboard={Dashboard}
    >
        <CustomRoutes>
            <Route path="/settings" element={<SettingsPage />} />
        </CustomRoutes>
        <Resource
            name="posts"
            list={PostList}
            edit={PostEdit}
            show={PostShow}
            create={PostCreate}
            recordRepresentation="title"
        />
        <Resource
            name="comments"
            list={CommentList}
            show={CommentShow}
            edit={CommentEdit}
            create={CommentCreate}
            recordRepresentation={record => `Comment by ${record.author}`}
        />
    </Admin>
);

/**
 * Embedded in existing TanStack Router app
 * Admin is mounted under /admin in an existing TanStack Router application.
 */
const AppNav = () => (
    <Box
        component="nav"
        sx={{
            p: 2,
            bgcolor: 'primary.main',
            color: 'white',
            display: 'flex',
            gap: 2,
        }}
    >
        <TanStackLink to="/" style={{ color: 'white', textDecoration: 'none' }}>
            Home
        </TanStackLink>
        <TanStackLink
            to="/about"
            style={{ color: 'white', textDecoration: 'none' }}
        >
            About
        </TanStackLink>
        <TanStackLink
            to="/admin"
            style={{ color: 'white', textDecoration: 'none' }}
        >
            Admin
        </TanStackLink>
    </Box>
);

const HomePage = () => (
    <Box sx={{ p: 4 }}>
        <Typography variant="h3" gutterBottom>
            Welcome to the App
        </Typography>
        <Typography paragraph>
            This is a TanStack Router application with an embedded react-admin
            panel.
        </Typography>
        <Button
            variant="contained"
            component={TanStackLink}
            to="/admin"
            sx={{ mt: 2 }}
        >
            Go to Admin Panel
        </Button>
    </Box>
);

const AboutPage = () => (
    <Box sx={{ p: 4 }}>
        <Typography variant="h3" gutterBottom>
            About
        </Typography>
        <Typography paragraph>
            This demo shows how to embed react-admin inside an existing TanStack
            Router application.
        </Typography>
        <Typography paragraph>
            The admin panel is mounted at <code>/admin</code> and uses its own
            routing while integrating seamlessly with the parent application.
        </Typography>
    </Box>
);

const EmbeddedAdmin = () => (
    <Admin
        routerProvider={tanStackRouterProvider}
        dataProvider={dataProvider}
        dashboard={Dashboard}
        basename="/admin"
    >
        <CustomRoutes>
            <Route path="/settings" element={<SettingsPage />} />
        </CustomRoutes>
        <Resource
            name="posts"
            list={PostList}
            edit={PostEdit}
            show={PostShow}
            create={PostCreate}
            recordRepresentation="title"
        />
        <Resource
            name="comments"
            list={CommentList}
            edit={CommentEdit}
            create={CommentCreate}
            recordRepresentation={record => `Comment by ${record.author}`}
        />
    </Admin>
);

// Create route tree for embedded mode
// The frontend app has its own layout with AppNav
// The admin app has its own layout (provided by react-admin)
const rootRoute = createRootRoute({
    component: () => <Outlet />,
});

// Frontend layout with navigation - only for non-admin pages
const FrontendLayout = () => (
    <Box>
        <AppNav />
        <Outlet />
    </Box>
);

const frontendLayoutRoute = createRoute({
    getParentRoute: () => rootRoute,
    id: 'frontend',
    component: FrontendLayout,
});

const homeRoute = createRoute({
    getParentRoute: () => frontendLayoutRoute,
    path: '/',
    component: HomePage,
});

const aboutRoute = createRoute({
    getParentRoute: () => frontendLayoutRoute,
    path: '/about',
    component: AboutPage,
});

// Admin routes - no frontend layout, admin provides its own
const adminRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/admin',
    component: EmbeddedAdmin,
});

const adminSplatRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/admin/$',
    component: EmbeddedAdmin,
});

const routeTree = rootRoute.addChildren([
    frontendLayoutRoute.addChildren([homeRoute, aboutRoute]),
    adminRoute,
    adminSplatRoute,
]);

export const Embedded = () => {
    const router = React.useMemo(
        () =>
            createRouter({
                routeTree,
                history: createHashHistory(),
            } as any),
        []
    );

    return <RouterProvider router={router} />;
};
