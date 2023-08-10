import React, { HtmlHTMLAttributes } from 'react';
import { CssBaseline, Container } from '@mui/material';
import { CoreLayoutProps, CheckForApplicationUpdate } from 'react-admin';
import { ErrorBoundary } from 'react-error-boundary';

import { Error } from 'react-admin';
import Header from './Header';

const Layout = ({ children }: LayoutProps) => (
    <>
        <CssBaseline />
        <Header />
        <Container sx={{ maxWidth: { xl: 1280 } }}>
            <main id="main-content">
                {/* @ts-ignore */}
                <ErrorBoundary FallbackComponent={Error}>
                    {children}
                </ErrorBoundary>
            </main>
        </Container>
        <CheckForApplicationUpdate interval={30 * 1000} />
    </>
);

export interface LayoutProps
    extends CoreLayoutProps,
        Omit<HtmlHTMLAttributes<HTMLDivElement>, 'title'> {}

export default Layout;
