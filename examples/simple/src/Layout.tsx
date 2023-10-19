import * as React from 'react';
import { ReactQueryDevtools } from 'react-query/devtools';
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
            toggleButtonProps={{ style: { width: 20, height: 30 } }}
        />
    </>
);
