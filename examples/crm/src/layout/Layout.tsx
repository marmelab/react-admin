import { Suspense, ReactNode } from 'react';
import { CssBaseline, Container } from '@mui/material';
import { Error, Loading, CheckForApplicationUpdate } from 'react-admin';
import { ErrorBoundary } from 'react-error-boundary';

import Header from './Header';

const Layout = ({ children }: { children: ReactNode }) => (
    <>
        <CssBaseline />
        <Header />
        <Container sx={{ maxWidth: { xl: 1280 } }}>
            <main id="main-content">
                <ErrorBoundary FallbackComponent={Error}>
                    <Suspense fallback={<Loading />}>{children}</Suspense>
                </ErrorBoundary>
            </main>
        </Container>
        <CheckForApplicationUpdate interval={30 * 1000} />
    </>
);

export default Layout;
