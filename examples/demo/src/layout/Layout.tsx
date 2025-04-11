import * as React from 'react';
import { Layout } from 'react-admin';
import AppBar from './AppBar';
import Menu from './Menu';

export default ({ children }: { children: React.ReactNode }) => (
    <Layout
        appBar={AppBar}
        menu={Menu}
        sx={{
            backgroundColor: theme =>
                // @ts-expect-error TS mixes up the Theme type from all the different versions of MUI in the monorepo
                (theme.vars || theme).palette.background.default,
        }}
    >
        {children}
    </Layout>
);
