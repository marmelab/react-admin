import * as React from 'react';
import expect from 'expect';
import { render, screen } from '@testing-library/react';
import { useTheme } from './useTheme';
import { CoreAdminContext } from 'ra-core';

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
});
