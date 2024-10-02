import * as React from 'react';
import { render, screen } from '@testing-library/react';
import {
    AccessControl,
    InferredEditLink,
    InferredEditLinkWithAccessControl,
    InferredShowLink,
    InferredShowLinkWithAccessControl,
    NoAuthProvider,
} from './useGetPathForRecord.stories';

describe('useGetPathForRecord', () => {
    it('should return an edit path for a record when there is no authProvider', async () => {
        render(<NoAuthProvider />);
        expect(
            (await screen.findByText('Edit', { selector: 'a' })).getAttribute(
                'href'
            )
        ).toEqual('#/posts/123');
    });
    it('should return a show path for a record when there is no authProvider', async () => {
        render(<NoAuthProvider />);
        expect(
            (await screen.findByText('Show', { selector: 'a' })).getAttribute(
                'href'
            )
        ).toEqual('#/posts/123/show');
    });
    it('should infer an edit path for a record when there is no authProvider and no show view for the resource', async () => {
        render(<InferredEditLink />);
        expect(
            (await screen.findByText('Link', { selector: 'a' })).getAttribute(
                'href'
            )
        ).toEqual('#/posts/123');
    });
    it('should infer a show path for a record when there is no authProvider and a show view for the resource', async () => {
        render(<InferredShowLink />);
        expect(
            (await screen.findByText('Link', { selector: 'a' })).getAttribute(
                'href'
            )
        ).toEqual('#/posts/123/show');
    });
    it('should return a path only when users have access to the requested action for the resource', async () => {
        render(<AccessControl />);
        expect(
            (await screen.findByText('Edit', { selector: 'a' })).getAttribute(
                'href'
            )
        ).toEqual('#/posts/123');
        await screen.findByText('Show no link');
    });
    it('should infer an edit path for a record when users have access to the edit action and no show view for the resource', async () => {
        render(<InferredEditLinkWithAccessControl />);
        expect(
            (await screen.findByText('Link', { selector: 'a' })).getAttribute(
                'href'
            )
        ).toEqual('#/posts/123');
    });
    it('should infer a show path for a record when users have access to the edit action and a show view for the resource', async () => {
        render(<InferredShowLinkWithAccessControl />);
        expect(
            (await screen.findByText('Link', { selector: 'a' })).getAttribute(
                'href'
            )
        ).toEqual('#/posts/123/show');
    });
});
