import * as React from 'react';
import { render, screen } from '@testing-library/react';

import { TestMemoryRouter } from './TestMemoryRouter';
import { useRouterProvider } from './RouterProviderContext';
import { useSplatPathBase } from './useSplatPathBase';

describe('useSplatPathBase', () => {
    const SplatPathBase = () => <>base: {useSplatPathBase()}</>;

    const ShowRoutes = () => {
        const { Route, Routes } = useRouterProvider();
        return (
            <Routes>
                <Route path="/posts/:id/show/*" element={<SplatPathBase />} />
            </Routes>
        );
    };

    const renderAt = (pathname: string) =>
        render(
            <TestMemoryRouter initialEntries={[pathname]}>
                <ShowRoutes />
            </TestMemoryRouter>
        );

    it('should return the pathname when the splat is empty', async () => {
        renderAt('/posts/12/show');
        await screen.findByText('base: /posts/12/show');
    });

    it('should remove the trailing slash when the splat is empty', async () => {
        renderAt('/posts/12/show/');
        await screen.findByText('base: /posts/12/show');
    });

    it.each(['3', 'details', 'details/3'])(
        'should remove the splat from the pathname (%s)',
        async splat => {
            renderAt(`/posts/12/show/${splat}`);
            await screen.findByText('base: /posts/12/show');
        }
    );

    it.each([
        '%20',
        '%33',
        'a%2Fb',
        '%252F',
        'a%2Fb%20',
        '3/%20',
        'd%C3%A9tails',
    ])(
        'should remove a splat containing percent-encoded characters (%s)',
        async splat => {
            renderAt(`/posts/12/show/${splat}`);
            await screen.findByText('base: /posts/12/show');
        }
    );

    it('should remove a splat that cannot be decoded', async () => {
        // react-router warns that the pathname is malformed
        jest.spyOn(console, 'warn').mockImplementation(() => {});
        renderAt('/posts/12/show/%');
        await screen.findByText('base: /posts/12/show');
    });

    it.each(['a+', '.*', '(3', '3|4'])(
        'should not interpret the splat as a regular expression (%s)',
        async splat => {
            renderAt(`/posts/12/show/${splat}`);
            await screen.findByText('base: /posts/12/show');
        }
    );

    it('should keep the encoded record identifier', async () => {
        renderAt('/posts/a%20b/show/1');
        await screen.findByText('base: /posts/a%20b/show');
    });
});
