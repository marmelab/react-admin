import * as React from 'react';
import { memo } from 'react';
import { ReactQueryDevtools } from 'react-query/devtools';
import { AppBar, Layout, InspectorButton } from 'react-admin';
import { CssBaseline, Typography } from '@mui/material';

const MyAppBar = memo(props => (
    <AppBar {...props}>
        <Typography flex="1" variant="h6" id="react-admin-title" />
        <InspectorButton />
    </AppBar>
));

export default props => (
    <>
        <CssBaseline />
        <Layout {...props} appBar={MyAppBar} />
        <ReactQueryDevtools
            initialIsOpen={false}
            toggleButtonProps={{ style: { width: 20, height: 30 } }}
        />
    </>
);
