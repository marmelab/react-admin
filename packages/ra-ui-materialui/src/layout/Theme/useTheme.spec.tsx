import * as React from 'react';
import { CoreAdminContext, useStore } from 'ra-core';
import expect from 'expect';
import { render, screen } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import { useTheme } from './useTheme';
import { SimplePaletteColorOptions } from '@mui/material';

const authProvider = {
    login: jest.fn().mockResolvedValueOnce(''),
    logout: jest.fn().mockResolvedValueOnce(''),
    checkAuth: jest.fn().mockResolvedValueOnce(''),
    checkError: jest.fn().mockResolvedValueOnce(''),
    getPermissions: jest.fn().mockResolvedValueOnce(''),
};

const Foo = () => {
    const [theme] = useTheme();
    return theme !== undefined ? <div aria-label="has-theme" /> : <></>;
};

describe('useTheme', () => {
    it('should return current theme', () => {
        render(
            <CoreAdminContext authProvider={authProvider}>
                <Foo />
            </CoreAdminContext>
        );
        expect(screen.getByLabelText('has-theme')).not.toBeNull();
    });

    it('should return theme from settings when available', () => {
        const { result: storeResult } = renderHook(() => useStore('theme'));
        storeResult.current[1]({ palette: { primary: { main: 'red' } } });

        const { result: themeResult } = renderHook(() => useTheme());

        expect(storeResult.current[0].palette.primary.main).toEqual(
            (themeResult.current[0].palette
                ?.primary as SimplePaletteColorOptions).main
        );
    });
});
