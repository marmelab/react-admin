import * as React from 'react';
import { CoreAdminContext, memoryStore, StoreSetter } from 'ra-core';
import expect from 'expect';
import { render, screen } from '@testing-library/react';
import { useTheme } from './useTheme';
import { AdminContext } from '../AdminContext';
import { ThemeTestWrapper } from '../layout/ThemeTestWrapper';
import { defaultDarkTheme } from './defaultTheme';

const authProvider = {
    login: jest.fn().mockResolvedValueOnce(''),
    logout: jest.fn().mockResolvedValueOnce(''),
    checkAuth: jest.fn().mockResolvedValueOnce(''),
    checkError: jest.fn().mockResolvedValueOnce(''),
    getPermissions: jest.fn().mockResolvedValueOnce(''),
};

const Foo = () => {
    const [theme] = useTheme();
    return theme !== undefined ? (
        <div aria-label="has-theme">{theme as any}</div>
    ) : (
        <></>
    );
};

describe('useTheme', () => {
    it('should return the light theme by default', () => {
        render(
            <CoreAdminContext authProvider={authProvider}>
                <Foo />
            </CoreAdminContext>
        );
        expect(screen.queryByText('light')).not.toBeNull();
    });

    it('should return the light theme when no dark theme is provided even though user prefers dark mode', async () => {
        render(
            <ThemeTestWrapper mode="dark">
                <CoreAdminContext authProvider={authProvider}>
                    <Foo />
                </CoreAdminContext>
            </ThemeTestWrapper>
        );
        await screen.findByText('light');
    });

    it('should return the light theme when no dark theme is provided even though the stored theme is dark', () => {
        const store = memoryStore({ theme: 'dark' });
        render(
            <CoreAdminContext authProvider={authProvider} store={store}>
                <Foo />
            </CoreAdminContext>
        );
        expect(screen.queryByText('light')).not.toBeNull();
    });

    it('should return the user preferred theme by default', async () => {
        const ssrMatchMedia = query => ({
            matches: query === '(prefers-color-scheme: dark)' ? true : false,
            addListener: () => {},
            removeListener: () => {},
        });

        render(
            <ThemeTestWrapper mode="dark">
                <AdminContext
                    authProvider={authProvider}
                    darkTheme={{
                        ...defaultDarkTheme,
                        components: {
                            MuiUseMediaQuery: {
                                defaultProps: {
                                    ssrMatchMedia,
                                    matchMedia: ssrMatchMedia,
                                },
                            },
                        },
                    }}
                >
                    <Foo />
                </AdminContext>
            </ThemeTestWrapper>
        );
        await screen.findByText('dark');
    });

    it('should return current theme when set', () => {
        render(
            <AdminContext
                authProvider={authProvider}
                store={memoryStore({ theme: 'dark' })}
                darkTheme={defaultDarkTheme}
            >
                <Foo />
            </AdminContext>
        );
        expect(screen.getByLabelText('has-theme')).not.toBeNull();
        expect(screen.queryByText('dark')).not.toBeNull();
    });

    it('should return theme from settings when available', async () => {
        const ThemeViewer = () => {
            const [theme] = useTheme();
            return <>{theme}</>;
        };
        render(
            <AdminContext
                authProvider={authProvider}
                darkTheme={defaultDarkTheme}
            >
                <StoreSetter name="theme" value="dark">
                    <ThemeViewer />
                </StoreSetter>
            </AdminContext>
        );
        await screen.findByText('dark');
    });
});
