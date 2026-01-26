import * as React from 'react';
import {
    render,
    screen,
    fireEvent,
    waitFor,
    cleanup,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
    BasicStandalone,
    EmbeddedInTanStackRouter,
    HistoryNavigation,
    LinkComponent,
    MultipleResources,
    CustomRoutesSupport,
    UseParamsTest,
    UseMatchTest,
    UseBlockerTest,
    NavigateComponent,
    UseLocationTest,
    RouterContextTest,
    NestedRoutesWithOutlet,
    NestedResources,
    QueryParameters,
    PathlessLayoutRoutes,
    NestedResourcesPrecedence,
    PathlessLayoutRoutesPriority,
} from './tanStackRouterProvider.stories';
import { tanStackRouterProvider } from './tanStackRouterProvider';

const { matchPath } = tanStackRouterProvider;

describe('tanStackRouterProvider', () => {
    // Reset hash before each test to ensure clean state
    beforeEach(() => {
        window.location.hash = '';
    });

    afterEach(() => {
        cleanup();
        window.location.hash = '';
    });

    describe('matchPath', () => {
        describe('catch-all patterns', () => {
            it('should match "*" against any path', () => {
                expect(matchPath('*', '/anything')).toEqual({
                    params: { '*': '/anything' },
                    pathname: '/anything',
                    pathnameBase: '/',
                });
            });

            it('should match "*" against root path', () => {
                expect(matchPath('*', '/')).toEqual({
                    params: { '*': '/' },
                    pathname: '/',
                    pathnameBase: '/',
                });
            });

            it('should match "/*" against root path', () => {
                expect(matchPath('/*', '/')).toEqual({
                    params: { '*': '' },
                    pathname: '/',
                    pathnameBase: '/',
                });
            });

            it('should match "/*" against nested path', () => {
                expect(matchPath('/*', '/posts/1/show')).toEqual({
                    params: { '*': 'posts/1/show' },
                    pathname: '/posts/1/show',
                    pathnameBase: '/',
                });
            });
        });

        describe('root/empty paths', () => {
            it('should match "/" against "/"', () => {
                expect(matchPath('/', '/')).toEqual({
                    params: {},
                    pathname: '/',
                    pathnameBase: '/',
                });
            });

            it('should match "" against "/"', () => {
                expect(matchPath('', '/')).toEqual({
                    params: {},
                    pathname: '/',
                    pathnameBase: '/',
                });
            });

            it('should match "" against ""', () => {
                expect(matchPath('', '')).toEqual({
                    params: {},
                    pathname: '/',
                    pathnameBase: '/',
                });
            });

            it('should not match "/" against "/posts" by default (end=true)', () => {
                expect(matchPath('/', '/posts')).toBeNull();
            });

            it('should match "/" against "/posts" with end=false', () => {
                expect(matchPath({ path: '/', end: false }, '/posts')).toEqual({
                    params: {},
                    pathname: '/',
                    pathnameBase: '/',
                });
            });
        });

        describe('static paths', () => {
            it('should match exact static path', () => {
                expect(matchPath('/posts', '/posts')).toEqual({
                    params: {},
                    pathname: '/posts',
                    pathnameBase: '/posts',
                });
            });

            it('should match static path with trailing slash in pathname', () => {
                expect(matchPath('/posts', '/posts/')).toEqual({
                    params: {},
                    pathname: '/posts',
                    pathnameBase: '/posts',
                });
            });

            it('should not match static path against longer path by default', () => {
                expect(matchPath('/posts', '/posts/1')).toBeNull();
            });

            it('should match static path as prefix with end=false', () => {
                expect(
                    matchPath({ path: '/posts', end: false }, '/posts/1')
                ).toEqual({
                    params: {},
                    pathname: '/posts',
                    pathnameBase: '/posts',
                });
            });

            it('should match nested static path', () => {
                expect(matchPath('/users/settings', '/users/settings')).toEqual(
                    {
                        params: {},
                        pathname: '/users/settings',
                        pathnameBase: '/users/settings',
                    }
                );
            });

            it('should not match different static path', () => {
                expect(matchPath('/posts', '/comments')).toBeNull();
            });
        });

        describe('dynamic params', () => {
            it('should match single param', () => {
                expect(matchPath('/posts/:id', '/posts/123')).toEqual({
                    params: { id: '123' },
                    pathname: '/posts/123',
                    pathnameBase: '/posts/123',
                });
            });

            it('should match multiple params', () => {
                expect(
                    matchPath(
                        '/users/:userId/posts/:postId',
                        '/users/1/posts/2'
                    )
                ).toEqual({
                    params: { userId: '1', postId: '2' },
                    pathname: '/users/1/posts/2',
                    pathnameBase: '/users/1/posts/2',
                });
            });

            it('should match param with special characters in value', () => {
                expect(matchPath('/posts/:id', '/posts/hello-world')).toEqual({
                    params: { id: 'hello-world' },
                    pathname: '/posts/hello-world',
                    pathnameBase: '/posts/hello-world',
                });
            });

            it('should not match param when segment is missing', () => {
                expect(matchPath('/posts/:id', '/posts')).toBeNull();
                expect(matchPath('/posts/:id', '/posts/')).toBeNull();
            });

            it('should match param at root level', () => {
                expect(matchPath('/:resource', '/posts')).toEqual({
                    params: { resource: 'posts' },
                    pathname: '/posts',
                    pathnameBase: '/posts',
                });
            });

            it('should decode URL-encoded params', () => {
                // UTF-8 characters: 衣類/衣類 encoded
                expect(
                    matchPath(
                        '/comments/:id',
                        '/comments/%E8%A1%A3%E9%A1%9E%2F%E8%A1%A3%E9%A1%9E'
                    )
                ).toEqual({
                    params: { id: '衣類/衣類' },
                    pathname:
                        '/comments/%E8%A1%A3%E9%A1%9E%2F%E8%A1%A3%E9%A1%9E',
                    pathnameBase:
                        '/comments/%E8%A1%A3%E9%A1%9E%2F%E8%A1%A3%E9%A1%9E',
                });
            });

            it('should decode URL-encoded params with spaces', () => {
                expect(matchPath('/posts/:id', '/posts/hello%20world')).toEqual(
                    {
                        params: { id: 'hello world' },
                        pathname: '/posts/hello%20world',
                        pathnameBase: '/posts/hello%20world',
                    }
                );
            });
        });

        describe('splat patterns (path/*)', () => {
            it('should match splat with content', () => {
                expect(matchPath('/posts/*', '/posts/1/show')).toEqual({
                    params: { '*': '1/show' },
                    pathname: '/posts/1/show',
                    pathnameBase: '/posts',
                });
            });

            it('should match splat at root of pattern', () => {
                expect(matchPath('/posts/*', '/posts')).toEqual({
                    params: { '*': '' },
                    pathname: '/posts',
                    pathnameBase: '/posts',
                });
            });

            it('should match splat with trailing slash', () => {
                expect(matchPath('/posts/*', '/posts/')).toEqual({
                    params: { '*': '' },
                    pathname: '/posts',
                    pathnameBase: '/posts',
                });
            });

            it('should match splat with deeply nested path', () => {
                expect(matchPath('/admin/*', '/admin/users/1/edit')).toEqual({
                    params: { '*': 'users/1/edit' },
                    pathname: '/admin/users/1/edit',
                    pathnameBase: '/admin',
                });
            });

            it('should decode URL-encoded splat values', () => {
                expect(
                    matchPath('/files/*', '/files/path%2Fto%2Ffile%20name.txt')
                ).toEqual({
                    params: { '*': 'path/to/file name.txt' },
                    pathname: '/files/path%2Fto%2Ffile%20name.txt',
                    pathnameBase: '/files',
                });
            });
        });

        describe('combined params and splat', () => {
            it('should match param followed by splat', () => {
                expect(matchPath('/:resource/*', '/posts/1/show')).toEqual({
                    params: { resource: 'posts', '*': '1/show' },
                    pathname: '/posts/1/show',
                    pathnameBase: '/posts',
                });
            });

            it('should match multiple params with splat', () => {
                expect(
                    matchPath('/:resource/:id/*', '/posts/1/comments/2')
                ).toEqual({
                    params: { resource: 'posts', id: '1', '*': 'comments/2' },
                    pathname: '/posts/1/comments/2',
                    pathnameBase: '/posts/1',
                });
            });

            it('should match param and empty splat', () => {
                expect(matchPath('/:resource/*', '/posts')).toEqual({
                    params: { resource: 'posts', '*': '' },
                    pathname: '/posts',
                    pathnameBase: '/posts',
                });
            });
        });

        describe('ReDoS avoidance and edge cases', () => {
            it('should handle long paths efficiently', () => {
                const longPath =
                    '/a/b/c/d/e/f/g/h/i/j/k/l/m/n/o/p/q/r/s/t/u/v/w/x/y/z';
                const pattern =
                    '/a/b/c/d/e/f/g/h/i/j/k/l/m/n/o/p/q/r/s/t/u/v/w/x/y/z';
                expect(matchPath(pattern, longPath)).not.toBeNull();
            });

            it('should handle long paths with mismatch at the end efficiently', () => {
                const longPath =
                    '/a/b/c/d/e/f/g/h/i/j/k/l/m/n/o/p/q/r/s/t/u/v/w/x/y/z/mismatch';
                const pattern =
                    '/a/b/c/d/e/f/g/h/i/j/k/l/m/n/o/p/q/r/s/t/u/v/w/x/y/z/match';
                expect(matchPath(pattern, longPath)).toBeNull();
            });

            it('should handle paths with multiple slashes', () => {
                expect(matchPath('/a/b', '///a///b///')).toEqual({
                    params: {},
                    pathname: '/a/b',
                    pathnameBase: '/a/b',
                });
            });

            it('should handle special characters in path segments', () => {
                expect(
                    matchPath('/files/:filename', '/files/image.png')
                ).toEqual({
                    params: { filename: 'image.png' },
                    pathname: '/files/image.png',
                    pathnameBase: '/files/image.png',
                });

                // %20 is decoded to space, + stays as + (not form encoding)
                expect(
                    matchPath('/search/:query', '/search/foo+bar%20baz')
                ).toEqual({
                    params: { query: 'foo+bar baz' },
                    pathname: '/search/foo+bar%20baz',
                    pathnameBase: '/search/foo+bar%20baz',
                });
            });
        });

        describe('end option', () => {
            it('should match exact path when end=true (default)', () => {
                expect(matchPath('/posts', '/posts')).not.toBeNull();
                expect(matchPath('/posts', '/posts/1')).toBeNull();
            });

            it('should match prefix when end=false', () => {
                expect(
                    matchPath({ path: '/posts', end: false }, '/posts/1/show')
                ).toEqual({
                    params: {},
                    pathname: '/posts',
                    pathnameBase: '/posts',
                });
            });

            it('should match param prefix when end=false', () => {
                expect(
                    matchPath(
                        { path: '/posts/:id', end: false },
                        '/posts/1/comments'
                    )
                ).toEqual({
                    params: { id: '1' },
                    pathname: '/posts/1',
                    pathnameBase: '/posts/1',
                });
            });

            it('should use end=true when pattern is string', () => {
                expect(matchPath('/posts', '/posts/1')).toBeNull();
            });

            it('should use end=true when end is not specified in object', () => {
                expect(matchPath({ path: '/posts' }, '/posts/1')).toBeNull();
            });
        });

        describe('paths without leading slash', () => {
            it('should normalize path without leading slash', () => {
                expect(matchPath('posts', '/posts')).toEqual({
                    params: {},
                    pathname: '/posts',
                    pathnameBase: '/posts',
                });
            });

            it('should normalize param path without leading slash', () => {
                expect(matchPath('posts/:id', '/posts/1')).toEqual({
                    params: { id: '1' },
                    pathname: '/posts/1',
                    pathnameBase: '/posts/1',
                });
            });
        });

        describe('trailing slashes', () => {
            it('should match path with trailing slash in pattern', () => {
                expect(matchPath('/posts/', '/posts')).toEqual({
                    params: {},
                    pathname: '/posts',
                    pathnameBase: '/posts',
                });
            });

            it('should match path with trailing slash in pathname', () => {
                expect(matchPath('/posts', '/posts/')).toEqual({
                    params: {},
                    pathname: '/posts',
                    pathnameBase: '/posts',
                });
            });

            it('should match when both have trailing slash', () => {
                expect(matchPath('/posts/', '/posts/')).toEqual({
                    params: {},
                    pathname: '/posts',
                    pathnameBase: '/posts',
                });
            });
        });

        describe('special regex characters in path', () => {
            it('should escape dots in path', () => {
                expect(matchPath('/api/v1.0', '/api/v1.0')).toEqual({
                    params: {},
                    pathname: '/api/v1.0',
                    pathnameBase: '/api/v1.0',
                });
            });

            it('should not match dot as wildcard', () => {
                expect(matchPath('/api/v1.0', '/api/v1X0')).toBeNull();
            });
        });

        describe('react-admin resource patterns', () => {
            it('should match resource list pattern', () => {
                expect(matchPath('/:resource/*', '/posts')).toEqual({
                    params: { resource: 'posts', '*': '' },
                    pathname: '/posts',
                    pathnameBase: '/posts',
                });
            });

            it('should match resource show pattern', () => {
                expect(
                    matchPath('/:resource/:id/show', '/posts/1/show')
                ).toEqual({
                    params: { resource: 'posts', id: '1' },
                    pathname: '/posts/1/show',
                    pathnameBase: '/posts/1/show',
                });
            });

            it('should match resource edit pattern', () => {
                expect(matchPath('/:resource/:id', '/posts/1')).toEqual({
                    params: { resource: 'posts', id: '1' },
                    pathname: '/posts/1',
                    pathnameBase: '/posts/1',
                });
            });

            it('should match resource create pattern', () => {
                expect(matchPath('/:resource/create', '/posts/create')).toEqual(
                    {
                        params: { resource: 'posts' },
                        pathname: '/posts/create',
                        pathnameBase: '/posts/create',
                    }
                );
            });
        });

        describe('basename scenarios', () => {
            it('should match path after basename is stripped', () => {
                // When basename is /admin, the pathname passed to matchPath
                // should already have basename stripped (this is done by Routes)
                expect(matchPath('/posts', '/posts')).toEqual({
                    params: {},
                    pathname: '/posts',
                    pathnameBase: '/posts',
                });
            });

            it('should match root after basename is stripped', () => {
                // After stripping /admin from /admin, we get /
                expect(matchPath('/', '/')).toEqual({
                    params: {},
                    pathname: '/',
                    pathnameBase: '/',
                });
            });

            it('should match catch-all after basename is stripped', () => {
                // /admin/posts/1 with basename /admin becomes /posts/1
                expect(matchPath('/*', '/posts/1')).toEqual({
                    params: { '*': 'posts/1' },
                    pathname: '/posts/1',
                    pathnameBase: '/',
                });
            });

            it('should match nested resource after basename is stripped', () => {
                // /admin/posts/1/show with basename /admin becomes /posts/1/show
                expect(
                    matchPath('/:resource/:id/show', '/posts/1/show')
                ).toEqual({
                    params: { resource: 'posts', id: '1' },
                    pathname: '/posts/1/show',
                    pathnameBase: '/posts/1/show',
                });
            });
        });
    });

    describe('RouterWrapper', () => {
        describe('standalone mode', () => {
            it('should render the post list', async () => {
                render(<BasicStandalone />);
                await waitFor(() => {
                    expect(screen.getByText('Posts')).toBeInTheDocument();
                });
            });

            it('should display the current location', async () => {
                render(<BasicStandalone />);
                await waitFor(() => {
                    expect(
                        screen.getByText('Current Location:')
                    ).toBeInTheDocument();
                });
            });
        });

        describe('embedded mode', () => {
            it('should render home page initially', async () => {
                render(<EmbeddedInTanStackRouter />);
                await waitFor(() => {
                    expect(screen.getByText('Home Page')).toBeInTheDocument();
                    expect(
                        screen.getByText(
                            'This is a TanStack Router app with embedded react-admin.'
                        )
                    ).toBeInTheDocument();
                });
            });

            it('should navigate to admin section', async () => {
                render(<EmbeddedInTanStackRouter />);
                await waitFor(() => {
                    expect(screen.getByText('Admin')).toBeInTheDocument();
                });

                fireEvent.click(screen.getByText('Admin'));

                await waitFor(
                    () => {
                        expect(screen.getByText('Posts')).toBeInTheDocument();
                    },
                    { timeout: 3000 }
                );
            });

            it('should navigate back to parent app', async () => {
                const user = userEvent.setup();
                render(<EmbeddedInTanStackRouter />);
                await waitFor(() => {
                    expect(screen.getByText('Admin')).toBeInTheDocument();
                });

                await user.click(screen.getByText('Admin'));

                await waitFor(
                    () => {
                        expect(screen.getByText('Posts')).toBeInTheDocument();
                    },
                    { timeout: 3000 }
                );

                // Navigate back to home via hash change
                window.location.hash = '#/';
                window.dispatchEvent(new HashChangeEvent('hashchange'));

                await waitFor(
                    () => {
                        expect(
                            screen.getByText('Home Page')
                        ).toBeInTheDocument();
                    },
                    { timeout: 3000 }
                );
            });
        });
    });

    describe('useNavigate', () => {
        it('should navigate to a path programmatically', async () => {
            render(<BasicStandalone />);
            await waitFor(() => {
                expect(screen.getByText('Create New Post')).toBeInTheDocument();
            });

            fireEvent.click(screen.getByText('Create New Post'));

            await waitFor(() => {
                expect(screen.getByText('Create Post')).toBeInTheDocument();
            });
        });

        it('should navigate back in history with navigate(-1)', async () => {
            render(<HistoryNavigation />);

            await screen.findByText('Post #1');

            fireEvent.click(screen.getByText('Post #1'));

            await waitFor(() => {
                expect(screen.getByText('Post Details')).toBeInTheDocument();
            });

            fireEvent.click(screen.getByText('← Back'));

            await waitFor(() => {
                expect(screen.getByText('Posts')).toBeInTheDocument();
            });
        });

        it('should navigate within nested routes', async () => {
            render(<EmbeddedInTanStackRouter />);
            await waitFor(() => {
                expect(screen.getByText('Admin')).toBeInTheDocument();
            });

            fireEvent.click(screen.getByText('Admin'));

            await screen.findByText('Posts');

            // Wait for data to load before clicking
            await screen.findByText('Post #1');

            fireEvent.click(screen.getByText('Post #1'));

            await waitFor(
                () => {
                    expect(
                        screen.getByText('Post Details')
                    ).toBeInTheDocument();
                },
                { timeout: 3000 }
            );
        });
    });

    describe('Link', () => {
        it('should render as an anchor element', async () => {
            render(<BasicStandalone />);
            await waitFor(() => {
                expect(screen.getByText('Post #1')).toBeInTheDocument();
            });
            expect(screen.getByText('Post #1').tagName).toBe('A');
        });

        it('should navigate when clicked', async () => {
            render(<BasicStandalone />);
            await waitFor(() => {
                expect(screen.getByText('Post #1')).toBeInTheDocument();
            });

            fireEvent.click(screen.getByText('Post #1'));

            await waitFor(
                () => {
                    expect(
                        screen.getByText('Post Details')
                    ).toBeInTheDocument();
                },
                { timeout: 3000 }
            );
        });

        it('should support replace prop', async () => {
            render(<LinkComponent />);
            await waitFor(() => {
                expect(
                    screen.getByText('Go to Post #2 (replace history)')
                ).toBeInTheDocument();
            });
        });

        it('should support state prop', async () => {
            render(<LinkComponent />);
            await waitFor(() => {
                expect(
                    screen.getByText('Go to Post #3 (with state)')
                ).toBeInTheDocument();
            });
        });

        it('should support location object with pathname and search', async () => {
            render(<LinkComponent />);
            await waitFor(() => {
                expect(
                    screen.getByText('Go to Post #4 (with search)')
                ).toBeInTheDocument();
            });

            fireEvent.click(screen.getByText('Go to Post #4 (with search)'));

            await waitFor(() => {
                expect(screen.getByText('Post Details')).toBeInTheDocument();
            });
            // Check that search params are preserved in location
            expect(
                screen.getByText(/"search": "\?foo=bar"/)
            ).toBeInTheDocument();
        });

        it('should support location object with only search (no pathname)', async () => {
            render(<LinkComponent />);
            await waitFor(() => {
                expect(
                    screen.getByText('Go to same page with search param')
                ).toBeInTheDocument();
            });

            fireEvent.click(
                screen.getByText('Go to same page with search param')
            );

            await waitFor(() => {
                // Should stay on the same page (Link Tests page)
                expect(
                    screen.getByText('Link Component Tests')
                ).toBeInTheDocument();
            });
            // Check that search params are added
            expect(
                screen.getByText(/"search": "\?foo=bar"/)
            ).toBeInTheDocument();
        });
    });

    describe('Routes', () => {
        describe('resource routes', () => {
            it('should match list routes', async () => {
                render(<BasicStandalone />);
                await waitFor(() => {
                    expect(screen.getByText('Posts')).toBeInTheDocument();
                });
            });

            it('should match show routes', async () => {
                render(<BasicStandalone />);
                await waitFor(() => {
                    expect(screen.getByText('Post #1')).toBeInTheDocument();
                });

                fireEvent.click(screen.getByText('Post #1'));

                await waitFor(
                    () => {
                        expect(
                            screen.getByText('Post Details')
                        ).toBeInTheDocument();
                    },
                    { timeout: 3000 }
                );
            });

            it('should navigate between resources', async () => {
                render(<MultipleResources />);
                await waitFor(() => {
                    expect(screen.getByText('Posts')).toBeInTheDocument();
                });

                fireEvent.click(screen.getByText('Go to Comments'));

                await waitFor(() => {
                    expect(screen.getByText('Comments')).toBeInTheDocument();
                });

                fireEvent.click(screen.getByText('Go to Posts'));

                await waitFor(() => {
                    expect(screen.getByText('Posts')).toBeInTheDocument();
                });
            });
        });

        describe('custom routes', () => {
            it('should render custom routes with layout', async () => {
                render(<CustomRoutesSupport />);
                await waitFor(() => {
                    expect(
                        screen.getByText('Go to Custom Page')
                    ).toBeInTheDocument();
                });

                fireEvent.click(screen.getByText('Go to Custom Page'));

                await waitFor(() => {
                    expect(screen.getByText('Custom Page')).toBeInTheDocument();
                    expect(
                        screen.getByText(
                            "This is a custom route using react-router's Route component."
                        )
                    ).toBeInTheDocument();
                });
            });

            it('should render custom routes without layout', async () => {
                render(<CustomRoutesSupport />);
                await waitFor(() => {
                    expect(
                        screen.getByText('Go to Custom Page (No Layout)')
                    ).toBeInTheDocument();
                });

                fireEvent.click(
                    screen.getByText('Go to Custom Page (No Layout)')
                );

                await waitFor(() => {
                    expect(
                        screen.getByText('Custom Page (No Layout)')
                    ).toBeInTheDocument();
                    expect(
                        screen.getByText(
                            'This page renders outside the layout.'
                        )
                    ).toBeInTheDocument();
                });
            });

            it('should navigate from custom route back to resource', async () => {
                render(<CustomRoutesSupport />);
                await waitFor(() => {
                    expect(
                        screen.getByText('Go to Custom Page')
                    ).toBeInTheDocument();
                });

                fireEvent.click(screen.getByText('Go to Custom Page'));

                await waitFor(() => {
                    expect(screen.getByText('Custom Page')).toBeInTheDocument();
                });

                fireEvent.click(screen.getByText('Go to Posts'));

                await waitFor(() => {
                    expect(screen.getByText('Posts')).toBeInTheDocument();
                });
            });
        });
    });

    describe('useParams', () => {
        it('should not have id param on list page', async () => {
            render(<UseParamsTest />);
            await waitFor(() => {
                expect(screen.getByText('Posts')).toBeInTheDocument();
            });

            const paramsDisplay = screen.getByTestId('params-display');
            expect(paramsDisplay.textContent).not.toContain('"id"');
        });

        it('should return id param on show page', async () => {
            render(<UseParamsTest />);
            await waitFor(() => {
                expect(screen.getByText('Post #1')).toBeInTheDocument();
            });

            fireEvent.click(screen.getByText('Post #1'));

            await waitFor(
                () => {
                    expect(
                        screen.getByText('Post Details')
                    ).toBeInTheDocument();
                },
                { timeout: 3000 }
            );

            const paramsDisplay = screen.getByTestId('params-display');
            expect(paramsDisplay.textContent).toContain('"id"');
            expect(paramsDisplay.textContent).toContain('"1"');
        });

        it('should return different id param for different records', async () => {
            render(<UseParamsTest />);
            await waitFor(() => {
                expect(screen.getByText('Post #2')).toBeInTheDocument();
            });

            fireEvent.click(screen.getByText('Post #2'));

            await waitFor(
                () => {
                    expect(
                        screen.getByText('Post Details')
                    ).toBeInTheDocument();
                },
                { timeout: 3000 }
            );

            const paramsDisplay = screen.getByTestId('params-display');
            expect(paramsDisplay.textContent).toContain('"id"');
            expect(paramsDisplay.textContent).toContain('"2"');
        });
    });

    describe('useMatch', () => {
        it('should match current route with end=false', async () => {
            render(<UseMatchTest />);
            await waitFor(() => {
                expect(screen.getByText('Posts List')).toBeInTheDocument();
            });

            expect(screen.getByTestId('posts-match').textContent).toContain(
                'MATCH'
            );
            expect(screen.getByTestId('comments-match').textContent).toContain(
                'no match'
            );
        });

        it('should match exact route with end=true', async () => {
            render(<UseMatchTest />);
            await waitFor(() => {
                expect(screen.getByText('Posts List')).toBeInTheDocument();
            });

            expect(
                screen.getByTestId('posts-exact-match').textContent
            ).toContain('MATCH');
        });

        it('should not match exact route on nested path', async () => {
            render(<UseMatchTest />);
            await waitFor(() => {
                expect(screen.getByText('Post #1')).toBeInTheDocument();
            });

            fireEvent.click(screen.getByText('Post #1'));

            await waitFor(
                () => {
                    expect(screen.getByText('Post Show')).toBeInTheDocument();
                },
                { timeout: 3000 }
            );

            // end=false should still match /posts on /posts/1/show
            expect(screen.getByTestId('posts-match').textContent).toContain(
                'MATCH'
            );
            // end=true should NOT match /posts on /posts/1/show
            expect(
                screen.getByTestId('posts-exact-match').textContent
            ).toContain('no match');
        });

        it('should update match when navigating to different resource', async () => {
            render(<UseMatchTest />);
            await waitFor(() => {
                expect(screen.getByText('Posts List')).toBeInTheDocument();
            });

            fireEvent.click(screen.getByText('Comments'));

            await waitFor(() => {
                expect(screen.getByText('Comments List')).toBeInTheDocument();
            });

            expect(screen.getByTestId('posts-match').textContent).toContain(
                'no match'
            );
            expect(screen.getByTestId('comments-match').textContent).toContain(
                'MATCH'
            );
        });
    });

    describe('useBlocker', () => {
        it('should show unblocked state initially', async () => {
            render(<UseBlockerTest />);
            await waitFor(() => {
                expect(
                    screen.getByText('Form with Unsaved Changes Warning')
                ).toBeInTheDocument();
            });

            expect(screen.getByTestId('blocker-state').textContent).toBe(
                'unblocked'
            );
            expect(screen.getByTestId('dirty-status').textContent).toBe(
                'No changes'
            );
        });

        it('should mark form as dirty when input changes', async () => {
            const user = userEvent.setup();
            render(<UseBlockerTest />);
            await waitFor(() => {
                expect(screen.getByTestId('form-input')).toBeInTheDocument();
            });

            await user.type(screen.getByTestId('form-input'), 'test');

            expect(screen.getByTestId('dirty-status').textContent).toBe(
                'Unsaved changes'
            );
        });

        it('should block navigation when form is dirty', async () => {
            const user = userEvent.setup();
            render(<UseBlockerTest />);
            await waitFor(() => {
                expect(screen.getByTestId('form-input')).toBeInTheDocument();
            });

            await user.type(screen.getByTestId('form-input'), 'test');

            fireEvent.click(screen.getByText('Go to Comments'));

            await waitFor(() => {
                expect(
                    screen.getByTestId('blocker-dialog')
                ).toBeInTheDocument();
            });

            expect(screen.getByTestId('blocker-state').textContent).toBe(
                'blocked'
            );
        });

        it('should allow navigation when clicking proceed', async () => {
            const user = userEvent.setup();
            render(<UseBlockerTest />);
            await waitFor(() => {
                expect(screen.getByTestId('form-input')).toBeInTheDocument();
            });

            await user.type(screen.getByTestId('form-input'), 'test');
            fireEvent.click(screen.getByText('Go to Comments'));

            await waitFor(() => {
                expect(
                    screen.getByTestId('blocker-dialog')
                ).toBeInTheDocument();
            });

            fireEvent.click(screen.getByTestId('blocker-proceed'));

            await waitFor(() => {
                expect(screen.getByText('Comments')).toBeInTheDocument();
            });
        });

        it('should cancel navigation when clicking cancel', async () => {
            const user = userEvent.setup();
            render(<UseBlockerTest />);
            await waitFor(() => {
                expect(screen.getByTestId('form-input')).toBeInTheDocument();
            });

            await user.type(screen.getByTestId('form-input'), 'test');
            fireEvent.click(screen.getByText('Go to Comments'));

            await waitFor(() => {
                expect(
                    screen.getByTestId('blocker-dialog')
                ).toBeInTheDocument();
            });

            fireEvent.click(screen.getByTestId('blocker-cancel'));

            await waitFor(() => {
                expect(
                    screen.queryByTestId('blocker-dialog')
                ).not.toBeInTheDocument();
            });

            expect(
                screen.getByText('Form with Unsaved Changes Warning')
            ).toBeInTheDocument();
        });

        it('should not block navigation when form is not dirty', async () => {
            render(<UseBlockerTest />);
            await waitFor(() => {
                expect(screen.getByTestId('form-input')).toBeInTheDocument();
            });

            fireEvent.click(screen.getByText('Go to Comments'));

            await waitFor(() => {
                expect(screen.getByText('Comments')).toBeInTheDocument();
            });
        });
    });

    describe('Navigate', () => {
        it('should redirect to target route', async () => {
            render(<NavigateComponent />);
            await waitFor(() => {
                expect(screen.getByTestId('posts-page')).toBeInTheDocument();
            });

            fireEvent.click(
                screen.getByText('Go to Redirect Page (auto-redirects here)')
            );

            // Should immediately redirect back to posts
            await waitFor(() => {
                expect(screen.getByTestId('posts-page')).toBeInTheDocument();
            });
        });

        it('should preserve search params on redirect', async () => {
            render(<NavigateComponent />);
            await waitFor(() => {
                expect(screen.getByTestId('posts-page')).toBeInTheDocument();
            });

            fireEvent.click(screen.getByText('Go to redirect with params'));

            // Should immediately redirect back to posts with search params
            await waitFor(() => {
                expect(screen.getByTestId('posts-page')).toBeInTheDocument();
            });

            expect(
                screen.getByText(/"pathname": "\/posts"/)
            ).toBeInTheDocument();
            expect(
                screen.getByText(/"search": "\?foo=bar"/)
            ).toBeInTheDocument();
        });

        it('should redirect conditionally when state changes', async () => {
            render(<NavigateComponent />);
            await waitFor(() => {
                expect(screen.getByTestId('posts-page')).toBeInTheDocument();
            });

            fireEvent.click(screen.getByText('Go to Conditional Redirect'));

            await waitFor(() => {
                expect(
                    screen.getByText('Conditional Redirect')
                ).toBeInTheDocument();
            });

            fireEvent.click(screen.getByTestId('trigger-redirect'));

            await waitFor(() => {
                expect(screen.getByTestId('posts-page')).toBeInTheDocument();
            });
        });

        it('should support location object with only search (no pathname)', async () => {
            render(<NavigateComponent />);
            await waitFor(() => {
                expect(screen.getByTestId('posts-page')).toBeInTheDocument();
            });

            // Navigate to the Navigate search-only test page
            // This page uses <Navigate to={{ search: '?redirected=true' }} replace />
            // which should stay on the same pathname but add search params
            fireEvent.click(
                screen.getByText('Go to Navigate search-only test')
            );

            // Should show the success message after redirecting
            await waitFor(() => {
                expect(
                    screen.getByTestId('navigate-search-only-page')
                ).toBeInTheDocument();
            });

            // Should stay on /navigate-search-only but with search params added
            expect(
                screen.getByText(/"pathname": "\/navigate-search-only"/)
            ).toBeInTheDocument();

            // The search params should contain 'redirected'
            expect(screen.getByText(/redirected/)).toBeInTheDocument();
        });
    });

    describe('useLocation', () => {
        it('should return current pathname', async () => {
            render(<UseLocationTest />);
            await waitFor(() => {
                expect(screen.getByText('Location Test')).toBeInTheDocument();
            });

            expect(
                screen.getByTestId('location-pathname').textContent
            ).toContain('/posts');
        });

        it('should return empty search by default', async () => {
            render(<UseLocationTest />);
            await waitFor(() => {
                expect(screen.getByText('Location Test')).toBeInTheDocument();
            });

            expect(screen.getByTestId('location-search').textContent).toContain(
                '""'
            );
        });

        it('should update pathname on navigation', async () => {
            render(<UseLocationTest />);
            await waitFor(() => {
                expect(screen.getByText('Go to Post Show')).toBeInTheDocument();
            });

            fireEvent.click(screen.getByText('Go to Post Show'));

            await waitFor(() => {
                expect(screen.getByText('Post Show')).toBeInTheDocument();
            });

            expect(
                screen.getByTestId('location-pathname').textContent
            ).toContain('/posts/1/show');
        });

        it('should include state when navigated with state', async () => {
            render(<UseLocationTest />);
            await waitFor(() => {
                expect(
                    screen.getByText('Go to Post Show (with state)')
                ).toBeInTheDocument();
            });

            fireEvent.click(screen.getByText('Go to Post Show (with state)'));

            await waitFor(() => {
                expect(screen.getByText('Post Show')).toBeInTheDocument();
            });

            expect(screen.getByTestId('location-state').textContent).toContain(
                'from'
            );
            expect(screen.getByTestId('location-state').textContent).toContain(
                'list'
            );
        });
    });

    describe('useInRouterContext', () => {
        it('should return true when inside router', async () => {
            render(<RouterContextTest />);
            await waitFor(() => {
                expect(
                    screen.getByText('Router Context Test')
                ).toBeInTheDocument();
            });

            expect(
                screen.getByTestId('in-router-context').textContent
            ).toContain('true');
        });
    });

    describe('useCanBlock', () => {
        it('should return true for TanStack Router', async () => {
            render(<RouterContextTest />);
            await waitFor(() => {
                expect(
                    screen.getByText('Router Context Test')
                ).toBeInTheDocument();
            });

            expect(screen.getByTestId('can-block').textContent).toContain(
                'true'
            );
        });
    });

    describe('Nested Routes with Outlet', () => {
        it('should render the default tab content', async () => {
            render(<NestedRoutesWithOutlet />);
            await screen.findByText('Post #1');

            fireEvent.click(screen.getByText('Post #1'));
            await screen.findByText('Tabbed Layout (like TabbedShowLayout)');

            // Should render the first tab (content) by default
            expect(screen.getByTestId('content-tab')).toBeInTheDocument();
            expect(
                screen.getByText(
                    'This is the content tab (first tab, default).'
                )
            ).toBeInTheDocument();
        });

        it('should navigate between tabs using Outlet', async () => {
            render(<NestedRoutesWithOutlet />);
            await screen.findByText('Post #1');

            fireEvent.click(screen.getByText('Post #1'));
            await screen.findByTestId('content-tab');

            // Click on the second tab (Metadata)
            fireEvent.click(screen.getByText('Metadata Tab'));
            await screen.findByTestId('metadata-tab');

            expect(
                screen.getByText('This is the metadata tab (second tab).')
            ).toBeInTheDocument();
            expect(screen.queryByTestId('content-tab')).not.toBeInTheDocument();
        });

        it('should navigate back to first tab', async () => {
            render(<NestedRoutesWithOutlet />);
            await waitFor(() => {
                expect(screen.getByText('Post #1')).toBeInTheDocument();
            });

            fireEvent.click(screen.getByText('Post #1'));

            await waitFor(
                () => {
                    expect(
                        screen.getByTestId('content-tab')
                    ).toBeInTheDocument();
                },
                { timeout: 3000 }
            );

            // Go to second tab
            fireEvent.click(screen.getByText('Metadata Tab'));

            await waitFor(() => {
                expect(screen.getByTestId('metadata-tab')).toBeInTheDocument();
            });

            // Go back to first tab
            fireEvent.click(screen.getByText('Content Tab'));

            await waitFor(() => {
                expect(screen.getByTestId('content-tab')).toBeInTheDocument();
            });

            expect(
                screen.queryByTestId('metadata-tab')
            ).not.toBeInTheDocument();
        });
    });

    describe('Nested Resources (Route children of Resource)', () => {
        it('should navigate to child routes defined inside Resource', async () => {
            render(<NestedResources />);
            await screen.findByText('Post #1');

            fireEvent.click(screen.getByText('Post #1'));

            await waitFor(
                () => {
                    expect(
                        screen.getByText('Post Details')
                    ).toBeInTheDocument();
                },
                { timeout: 3000 }
            );
        });
    });

    describe('Query Parameters', () => {
        it('should update URL with query parameters when sorting', async () => {
            render(<QueryParameters />);
            await screen.findByText('Posts with Query Parameters');

            // Initially no search params
            expect(screen.getByTestId('current-search').textContent).toContain(
                '(empty)'
            );

            // Click sort by title
            fireEvent.click(screen.getByTestId('sort-title'));

            await waitFor(() => {
                expect(
                    screen.getByTestId('current-search').textContent
                ).toContain('sort=title');
            });

            expect(screen.getByTestId('current-sort').textContent).toContain(
                'title'
            );
        });

        it('should update URL with query parameters when changing page', async () => {
            render(<QueryParameters />);
            await screen.findByText('Posts with Query Parameters');

            // Click page 2
            fireEvent.click(screen.getByTestId('page-2'));

            await waitFor(() => {
                expect(
                    screen.getByTestId('current-search').textContent
                ).toContain('page=2');
            });

            expect(screen.getByTestId('current-page').textContent).toContain(
                '2'
            );
        });

        it('should preserve query parameters across multiple updates', async () => {
            render(<QueryParameters />);
            await screen.findByText('Posts with Query Parameters');

            // Set sort
            fireEvent.click(screen.getByTestId('sort-title'));

            await waitFor(() => {
                expect(
                    screen.getByTestId('current-search').textContent
                ).toContain('sort=title');
            });

            // Set page
            fireEvent.click(screen.getByTestId('page-3'));

            await waitFor(() => {
                const search =
                    screen.getByTestId('current-search').textContent || '';
                expect(search).toContain('sort=title');
                expect(search).toContain('page=3');
            });
        });
    });

    describe('Pathless Layout Routes', () => {
        it('should match pathless layout routes with child routes', async () => {
            window.location.hash = '#/posts';

            render(<PathlessLayoutRoutes />);

            await waitFor(() => {
                expect(screen.getByText('Layout Wrapper')).toBeInTheDocument();
                expect(screen.getByTestId('posts-page')).toBeInTheDocument();
            });
        });

        it('should navigate between child routes within pathless layout', async () => {
            window.location.hash = '#/posts';

            render(<PathlessLayoutRoutes />);

            await waitFor(() => {
                expect(screen.getByText('Layout Wrapper')).toBeInTheDocument();
                expect(screen.getByTestId('posts-page')).toBeInTheDocument();
            });

            fireEvent.click(screen.getByText('Comments'));

            await waitFor(() => {
                expect(screen.getByText('Layout Wrapper')).toBeInTheDocument();
                expect(screen.getByTestId('comments-page')).toBeInTheDocument();
            });
        });

        it('should match the most specific layout route within pathless layout routes', async () => {
            window.location.hash = '#/posts';

            render(<PathlessLayoutRoutesPriority />);

            await waitFor(() => {
                expect(screen.getByTestId('posts-page')).toBeInTheDocument();
            });

            fireEvent.click(screen.getByText('User'));

            await waitFor(() => {
                expect(screen.getByTestId('users-page')).toBeInTheDocument();
            });

            fireEvent.click(screen.getByText('Block a user'));

            await waitFor(() => {
                expect(
                    screen.getByTestId('block-user-page')
                ).toBeInTheDocument();
            });
        });
    });

    describe('Resource Children (Route as children of Resource)', () => {
        it('should navigate to child routes without matching parent edit route', async () => {
            render(<NestedResourcesPrecedence />);

            // Wait for posts list to load
            await screen.findByText('Post #1');

            // Click on a post to go to edit page
            fireEvent.click(screen.getByText('Post #1'));

            // Wait for edit page
            await screen.findByText('Post Details');

            // Click to view comments (child route)
            fireEvent.click(screen.getByText('View Comments'));

            // Should navigate to comments page, not stay on edit
            await waitFor(() => {
                expect(
                    screen.getByText(/Comments for Post/)
                ).toBeInTheDocument();
            });
        });
    });
});
