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

                expect(
                    matchPath('/search/:query', '/search/foo+bar%20baz')
                ).toEqual({
                    params: { query: 'foo+bar%20baz' },
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

            await waitFor(() => {
                expect(screen.getByText('Posts')).toBeInTheDocument();
            });

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

            await waitFor(
                () => {
                    expect(screen.getByText('Posts')).toBeInTheDocument();
                },
                { timeout: 3000 }
            );

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
});
