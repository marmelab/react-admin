import * as React from 'react';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { AppBar, Layout, InspectorButton, TitlePortal } from 'react-admin';

const MyAppBar = () => (
    <AppBar>
        <TitlePortal />
        <InspectorButton />
    </AppBar>
);

export default props => (
    <>
        <Layout {...props} appBar={MyAppBar} />
        <ReactQueryDevtools
            initialIsOpen={false}
            buttonPosition="bottom-left"
        />
    </>
);
