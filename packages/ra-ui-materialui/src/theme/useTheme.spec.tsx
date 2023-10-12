import * as React from 'react';
import { CoreAdminContext, useStore, memoryStore } from 'ra-core';
import expect from 'expect';
import { render, screen } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import { useTheme } from './useTheme';

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
        <div aria-label="has-theme">{theme}</div>
    ) : (
        <></>
    );
};

describe('useTheme', () => {
    it('should return undefined by default', () => {
        render(
            <CoreAdminContext authProvider={authProvider}>
                <Foo />
            </CoreAdminContext>
        );
        expect(screen.queryByLabelText('has-theme')).toBeNull();
    });

    it('should return current theme when set', () => {
        render(
            <CoreAdminContext
                authProvider={authProvider}
                store={memoryStore({ theme: 'dark' })}
            >
                <Foo />
            </CoreAdminContext>
        );
        expect(screen.getByLabelText('has-theme')).not.toBeNull();
    });

    it('should return theme from settings when available', () => {
        const { result: storeResult } = renderHook(() => useStore('theme'));
        const [_, setTheme] = storeResult.current;
        setTheme('dark');

        const { result: themeResult } = renderHook(() => useTheme());
        const [theme, __] = themeResult.current;

        expect(theme).toEqual('dark');
    });
});
