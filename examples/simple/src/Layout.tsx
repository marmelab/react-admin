import * as React from 'react';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import {
    AppBar,
    Layout,
    Menu,
    InspectorButton,
    TitlePortal,
} from 'react-admin';
import '../assets/app.css';

const MyAppBar = () => (
    <AppBar>
        <TitlePortal />
        <InspectorButton />
    </AppBar>
);

const MyMenu = () => (
    <Menu>
        <Menu.ResourceItem name="posts" keyboardShortcut="g>p" />
        <Menu.ResourceItem name="comments" keyboardShortcut="g>c" />
        <Menu.ResourceItem name="tags" keyboardShortcut="g>t" />
        <Menu.ResourceItem name="users" keyboardShortcut="g>u" />
    </Menu>
);

export default ({ children }) => (
    <>
        <Layout appBar={MyAppBar} menu={MyMenu}>
            {children}
        </Layout>
        <ReactQueryDevtools
            initialIsOpen={false}
            buttonPosition="bottom-left"
        />
    </>
);
