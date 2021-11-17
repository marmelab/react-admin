import React, { HtmlHTMLAttributes } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Container } from '@mui/material';
import { CoreLayoutProps } from 'react-admin';
import { ErrorBoundary } from 'react-error-boundary';

import { Notification, Error } from 'react-admin';
import Header from './Header';

const Layout = (props: LayoutProps) => {
    const { theme, children } = props;
    return (
        <ThemeProvider theme={createTheme(theme)}>
            <CssBaseline />
            <Header />
            <Container>
                <main id="main-content">
                    {/* @ts-ignore */}
                    <ErrorBoundary FallbackComponent={Error}>
                        {children}
                    </ErrorBoundary>
                </main>
            </Container>
            <Notification />
        </ThemeProvider>
    );
};

export interface LayoutProps
    extends CoreLayoutProps,
        Omit<HtmlHTMLAttributes<HTMLDivElement>, 'title'> {}

export default Layout;
