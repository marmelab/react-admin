import * as React from 'react';
import { render, screen } from '@testing-library/react';
import {
    AccessControlWithLinkTypeProvided,
    InferredEditLink,
    InferredEditLinkWithAccessControl,
    InferredShowLink,
    InferredShowLinkWithAccessControl,
    NoAuthProvider,
    SlowLoading,
} from './useGetPathForRecord.stories';
import { AuthProvider } from '..';

describe('useGetPathForRecord', () => {
    it('should return an edit path for a record when there is no authProvider', async () => {
        render(<NoAuthProvider />);
        expect(
            (await screen.findByText('Edit', { selector: 'a' })).getAttribute(
                'href'
            )
        ).toEqual('/posts/123');
    });
    it('should return a show path for a record when there is no authProvider', async () => {
        render(<NoAuthProvider />);
        expect(
            (await screen.findByText('Show', { selector: 'a' })).getAttribute(
                'href'
            )
        ).toEqual('/posts/123/show');
    });
    it('should infer an edit path for a record when there is no authProvider and no show view for the resource', async () => {
        render(<InferredEditLink />);
        expect(
            (await screen.findByText('Link', { selector: 'a' })).getAttribute(
                'href'
            )
        ).toEqual('/posts/123');
    });
    it('should infer a show path for a record when there is no authProvider and a show view for the resource', async () => {
        render(<InferredShowLink />);
        expect(
            (await screen.findByText('Link', { selector: 'a' })).getAttribute(
                'href'
            )
        ).toEqual('/posts/123/show');
    });
    it('should not check for access right when the link type is provided', async () => {
        const authProvider: AuthProvider = {
            login: () => Promise.resolve(),
            logout: () => Promise.resolve(),
            checkAuth: () => Promise.resolve(),
            checkError: () => Promise.resolve(),
            getPermissions: () => Promise.resolve(),
            canAccess: jest.fn(),
        };
        render(
            <AccessControlWithLinkTypeProvided authProvider={authProvider} />
        );
        expect(
            (await screen.findByText('Edit', { selector: 'a' })).getAttribute(
                'href'
            )
        ).toEqual('/posts/123');
        expect(
            (await screen.findByText('Show', { selector: 'a' })).getAttribute(
                'href'
            )
        ).toEqual('/posts/123/show');
        expect(authProvider.canAccess).not.toHaveBeenCalled();
    });
    it('should infer an edit path for a record when users have access to the edit action and no show view for the resource', async () => {
        render(<InferredEditLinkWithAccessControl />);
        expect(
            (await screen.findByText('Link', { selector: 'a' })).getAttribute(
                'href'
            )
        ).toEqual('/posts/123');
    });
    it('should infer a show path for a record when users have access to the edit action and a show view for the resource', async () => {
        render(<InferredShowLinkWithAccessControl />);
        expect(
            (await screen.findByText('Link', { selector: 'a' })).getAttribute(
                'href'
            )
        ).toEqual('/posts/123/show');
    });
    it('should recompute the path when the record changes', async () => {
        render(<SlowLoading />);
        await screen.findByText('Show no link');
        screen.getByText('Load record').click();
        const link = await screen.findByText('Show', { selector: 'a' });
        expect(link.getAttribute('href')).toEqual('/posts/123/show');
    });
});
