import * as React from 'react';
import { render, screen, waitFor, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
    Basic,
    EmbeddedInReactRouter,
    HistoryNavigation,
    LinkComponent,
    MultipleResources,
    CustomRoutesSupport,
    UseParamsTest,
    UseMatchTest,
    UseWarnWhenUnsavedChangesTest,
    NavigateComponent,
    UseLocationTest,
    RouterContextTest,
    NestedRoutesWithOutlet,
    NestedResources,
    QueryParameters,
    NestedResourcesPrecedence,
    PathlessLayoutRoutes,
    PathlessLayoutRoutesPriority,
    PathlessLayoutRoutesWithEmptyRoute,
    PathlessLayoutRoutesWithIndexRoute,
} from './reactRouterProvider.stories';
import { reactRouterProvider } from './reactRouterProvider';

const { matchPath } = reactRouterProvider;

describe('reactRouterProvider', () => {
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
                expect(matchPath('*', '/anything')).toMatchObject({
                    params: { '*': 'anything' },
                    pathname: '/anything',
                    pathnameBase: '/',
                });
            });

            it('should match "/*" against a nested path', () => {
                expect(matchPath('/*', '/posts/1')).toMatchObject({
                    params: { '*': 'posts/1' },
                    pathname: '/posts/1',
                    pathnameBase: '/',
                });
            });
        });

        describe('root/empty paths', () => {
            it('should match "/" against "/"', () => {
                expect(matchPath('/', '/')).toMatchObject({
                    params: {},
                    pathname: '/',
                    pathnameBase: '/',
                });
            });

            it('should not match "/" against "/posts" by default (end=true)', () => {
                expect(matchPath('/', '/posts')).toBeNull();
            });
        });

        describe('static paths', () => {
            it('should match an exact static path', () => {
                expect(matchPath('/posts', '/posts')).toMatchObject({
                    params: {},
                    pathname: '/posts',
                    pathnameBase: '/posts',
                });
            });

            it('should not match a static path against a longer path', () => {
                expect(matchPath('/posts', '/posts/1')).toBeNull();
            });

            it('should match a static path as a prefix with end=false', () => {
                expect(
                    matchPath({ path: '/posts', end: false }, '/posts/1')
                ).toMatchObject({
                    params: {},
                    pathname: '/posts',
                });
            });
        });

        describe('dynamic params', () => {
            it('should match a single param', () => {
                expect(matchPath('/posts/:id', '/posts/1')).toMatchObject({
                    params: { id: '1' },
                    pathname: '/posts/1',
                });
            });

            it('should match multiple params', () => {
                expect(
                    matchPath('/:resource/:id/show', '/posts/1/show')
                ).toMatchObject({
                    params: { resource: 'posts', id: '1' },
                    pathname: '/posts/1/show',
                });
            });

            it('should not match a param when the segment is missing', () => {
                expect(matchPath('/posts/:id', '/posts')).toBeNull();
            });
        });

        describe('react-admin resource patterns', () => {
            it('should match a resource list', () => {
                expect(matchPath('/:resource', '/posts')).toMatchObject({
                    params: { resource: 'posts' },
                });
            });

            it('should match a resource edit', () => {
                expect(matchPath('/:resource/:id', '/posts/1')).toMatchObject({
                    params: { resource: 'posts', id: '1' },
                });
            });
        });

        describe('basename scenarios (pathname already stripped of basename)', () => {
            it('should match a path after the basename is stripped', () => {
                // basename "/admin" + "/admin/posts" => matchPath sees "/posts"
                expect(matchPath('/posts', '/posts')).toMatchObject({
                    params: {},
                    pathname: '/posts',
                });
            });

            it('should match a catch-all after the basename is stripped', () => {
                // "/admin/posts/1" with basename "/admin" => "/posts/1"
                expect(matchPath('/*', '/posts/1')).toMatchObject({
                    params: { '*': 'posts/1' },
                });
            });

            it('should match a nested resource after the basename is stripped', () => {
                // "/admin/posts/1/show" with basename "/admin" => "/posts/1/show"
                expect(
                    matchPath('/:resource/:id/show', '/posts/1/show')
                ).toMatchObject({
                    params: { resource: 'posts', id: '1' },
                });
            });
        });
    });

    describe('RouterWrapper', () => {
        describe('standalone mode (Basic)', () => {
            it('should render the post list inside its own hash router', async () => {
                render(<Basic />);
                await waitFor(() => {
                    expect(screen.getByText('Posts')).toBeInTheDocument();
                });
            });

            it('should display the current location', async () => {
                render(<Basic />);
                await waitFor(() => {
                    expect(
                        screen.getByText('Current Location:')
                    ).toBeInTheDocument();
                });
            });
        });

        describe('embedded mode (EmbeddedInReactRouter)', () => {
            it('should render the host app home page initially', async () => {
                render(<EmbeddedInReactRouter />);
                await waitFor(() => {
                    expect(screen.getByText('Home Page')).toBeInTheDocument();
                    expect(
                        screen.getByText(
                            'This is a React Router app with embedded react-admin.'
                        )
                    ).toBeInTheDocument();
                });
            });

            it('should mount react-admin under the basename and navigate to it', async () => {
                const user = userEvent.setup();
                render(<EmbeddedInReactRouter />);
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
            });
        });
    });

    describe('useNavigate', () => {
        it('should navigate to a path programmatically', async () => {
            const user = userEvent.setup();
            render(<Basic />);
            await waitFor(() => {
                expect(screen.getByText('Create')).toBeInTheDocument();
            });

            await user.click(screen.getByText('Create'));

            await waitFor(() => {
                expect(screen.getByText('Create Post')).toBeInTheDocument();
            });
        });

        it('should navigate back in history with navigate(-1)', async () => {
            const user = userEvent.setup();
            render(<HistoryNavigation />);

            await screen.findByText('Post #1');

            await user.click(screen.getByText('Post #1'));

            await waitFor(() => {
                expect(screen.getByText('Post Details')).toBeInTheDocument();
            });

            await user.click(screen.getByText('← Back'));

            await waitFor(() => {
                expect(screen.getByText('Posts')).toBeInTheDocument();
            });
        });
    });

    describe('Link', () => {
        it('should render as an anchor element', async () => {
            render(<Basic />);
            await waitFor(() => {
                expect(screen.getByText('Post #1')).toBeInTheDocument();
            });
            expect(screen.getByText('Post #1').tagName).toBe('A');
        });

        it('should navigate when clicked', async () => {
            const user = userEvent.setup();
            render(<Basic />);
            await waitFor(() => {
                expect(screen.getByText('Post #1')).toBeInTheDocument();
            });

            await user.click(screen.getByText('Post #1'));

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
            const user = userEvent.setup();
            render(<LinkComponent />);
            await waitFor(() => {
                expect(
                    screen.getByText('Go to Post #4 (with search)')
                ).toBeInTheDocument();
            });

            await user.click(screen.getByText('Go to Post #4 (with search)'));

            await waitFor(() => {
                expect(screen.getByText('Post Details')).toBeInTheDocument();
            });
            expect(
                screen.getByText(/"search": "\?foo=bar"/)
            ).toBeInTheDocument();
        });

        it('should support location object with only search (no pathname)', async () => {
            const user = userEvent.setup();
            render(<LinkComponent />);
            await waitFor(() => {
                expect(
                    screen.getByText('Go to same page with search param')
                ).toBeInTheDocument();
            });

            await user.click(
                screen.getByText('Go to same page with search param')
            );

            await waitFor(() => {
                expect(
                    screen.getByText('Link Component Tests')
                ).toBeInTheDocument();
            });
            expect(
                screen.getByText(/"search": "\?foo=bar"/)
            ).toBeInTheDocument();
        });
    });

    describe('Routes', () => {
        describe('resource routes', () => {
            it('should match list routes', async () => {
                render(<Basic />);
                await waitFor(() => {
                    expect(screen.getByText('Posts')).toBeInTheDocument();
                });
            });

            it('should navigate between resources', async () => {
                const user = userEvent.setup();
                render(<MultipleResources />);
                await waitFor(() => {
                    expect(screen.getByText('Posts')).toBeInTheDocument();
                });

                await user.click(screen.getByText('Go to Comments'));

                await waitFor(() => {
                    expect(screen.getByText('Comments')).toBeInTheDocument();
                });

                await user.click(screen.getByText('Go to Posts'));

                await waitFor(() => {
                    expect(screen.getByText('Posts')).toBeInTheDocument();
                });
            });
        });

        describe('custom routes', () => {
            it('should render custom routes with layout', async () => {
                const user = userEvent.setup();
                render(<CustomRoutesSupport />);
                await waitFor(() => {
                    expect(
                        screen.getByText('Go to Custom Page')
                    ).toBeInTheDocument();
                });

                await user.click(screen.getByText('Go to Custom Page'));

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
                const user = userEvent.setup();
                render(<CustomRoutesSupport />);
                await waitFor(() => {
                    expect(
                        screen.getByText('Go to Custom Page (No Layout)')
                    ).toBeInTheDocument();
                });

                await user.click(
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
                const user = userEvent.setup();
                render(<CustomRoutesSupport />);
                await waitFor(() => {
                    expect(
                        screen.getByText('Go to Custom Page')
                    ).toBeInTheDocument();
                });

                await user.click(screen.getByText('Go to Custom Page'));

                await waitFor(() => {
                    expect(screen.getByText('Custom Page')).toBeInTheDocument();
                });

                await user.click(screen.getByText('Go to Posts'));

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
            const user = userEvent.setup();
            render(<UseParamsTest />);
            await waitFor(() => {
                expect(screen.getByText('Post #1')).toBeInTheDocument();
            });

            await user.click(screen.getByText('Post #1'));

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
            const user = userEvent.setup();
            render(<UseMatchTest />);
            await waitFor(() => {
                expect(screen.getByText('Post #1')).toBeInTheDocument();
            });

            await user.click(screen.getByText('Post #1'));

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
            const user = userEvent.setup();
            render(<UseMatchTest />);
            await waitFor(() => {
                expect(screen.getByText('Posts List')).toBeInTheDocument();
            });

            await user.click(screen.getByText('Comments'));

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

    describe('useWarnWhenUnsavedChanges', () => {
        it('should confirm before navigating away from a dirty form', async () => {
            const originalConfirm = window.confirm;
            let confirmCalled = false;
            // Decline the confirmation so navigation stays blocked.
            window.confirm = () => {
                confirmCalled = true;
                return false;
            };
            try {
                const user = userEvent.setup();
                render(<UseWarnWhenUnsavedChangesTest />);
                const [title] = await screen.findAllByRole('textbox');
                await user.type(title, 'A new title');
                await user.click(screen.getByText('Go to Comments'));
                await waitFor(() => {
                    expect(confirmCalled).toBe(true);
                });
                // confirm returned false => navigation blocked, still on the form
                expect(
                    screen.getByText('Form with Unsaved Changes Warning')
                ).toBeInTheDocument();
                expect(
                    screen.getByDisplayValue('A new title')
                ).toBeInTheDocument();
            } finally {
                window.confirm = originalConfirm;
            }
        });

        it('should navigate away from a dirty form once confirmed', async () => {
            const originalConfirm = window.confirm;
            // Accept the confirmation so navigation proceeds.
            window.confirm = () => true;
            try {
                const user = userEvent.setup();
                render(<UseWarnWhenUnsavedChangesTest />);
                const [title] = await screen.findAllByRole('textbox');
                await user.type(title, 'A new title');
                await user.click(screen.getByText('Go to Comments'));
                await waitFor(() => {
                    expect(
                        screen.getByText('You navigated away from the form.')
                    ).toBeInTheDocument();
                });
            } finally {
                window.confirm = originalConfirm;
            }
        });

        it('should not confirm when the form is not dirty', async () => {
            const originalConfirm = window.confirm;
            let confirmCalled = false;
            window.confirm = () => {
                confirmCalled = true;
                return true;
            };
            try {
                const user = userEvent.setup();
                render(<UseWarnWhenUnsavedChangesTest />);
                await screen.findByText('Form with Unsaved Changes Warning');
                await user.click(screen.getByText('Go to Comments'));
                await waitFor(() => {
                    expect(
                        screen.getByText('You navigated away from the form.')
                    ).toBeInTheDocument();
                });
                expect(confirmCalled).toBe(false);
            } finally {
                window.confirm = originalConfirm;
            }
        });
    });

    describe('Navigate', () => {
        it('should redirect to target route', async () => {
            const user = userEvent.setup();
            render(<NavigateComponent />);
            await waitFor(() => {
                expect(screen.getByTestId('posts-page')).toBeInTheDocument();
            });

            await user.click(
                screen.getByText('Go to Redirect Page (auto-redirects here)')
            );

            // Should immediately redirect back to posts
            await waitFor(() => {
                expect(screen.getByTestId('posts-page')).toBeInTheDocument();
            });
        });

        it('should preserve search params on redirect', async () => {
            const user = userEvent.setup();
            render(<NavigateComponent />);
            await waitFor(() => {
                expect(screen.getByTestId('posts-page')).toBeInTheDocument();
            });

            await user.click(screen.getByText('Go to redirect with params'));

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
            const user = userEvent.setup();
            render(<NavigateComponent />);
            await waitFor(() => {
                expect(screen.getByTestId('posts-page')).toBeInTheDocument();
            });

            await user.click(screen.getByText('Go to Conditional Redirect'));

            await waitFor(() => {
                expect(
                    screen.getByText('Conditional Redirect')
                ).toBeInTheDocument();
            });

            await user.click(screen.getByTestId('trigger-redirect'));

            await waitFor(() => {
                expect(screen.getByTestId('posts-page')).toBeInTheDocument();
            });
        });

        it('should support location object with only search (no pathname)', async () => {
            const user = userEvent.setup();
            render(<NavigateComponent />);
            await waitFor(() => {
                expect(screen.getByTestId('posts-page')).toBeInTheDocument();
            });

            await user.click(
                screen.getByText('Go to Navigate search-only test')
            );

            await waitFor(() => {
                expect(
                    screen.getByTestId('navigate-search-only-page')
                ).toBeInTheDocument();
            });

            expect(
                screen.getByText(/"pathname": "\/navigate-search-only"/)
            ).toBeInTheDocument();
            expect(
                screen.getByText(/"search": "\?redirected=true"/)
            ).toBeInTheDocument();
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
            const user = userEvent.setup();
            render(<UseLocationTest />);
            await waitFor(() => {
                expect(screen.getByText('Go to Post Show')).toBeInTheDocument();
            });

            await user.click(screen.getByText('Go to Post Show'));

            await waitFor(() => {
                expect(screen.getByText('Post Show')).toBeInTheDocument();
            });

            expect(
                screen.getByTestId('location-pathname').textContent
            ).toContain('/posts/1/show');
        });

        it('should include state when navigated with state', async () => {
            const user = userEvent.setup();
            render(<UseLocationTest />);
            await waitFor(() => {
                expect(
                    screen.getByText('Go to Post Show (with state)')
                ).toBeInTheDocument();
            });

            await user.click(screen.getByText('Go to Post Show (with state)'));

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

    describe('useInRouterContext / useCanBlock', () => {
        it('should report being inside a router', async () => {
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

        it('should report that blocking is supported in a data router', async () => {
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
            const user = userEvent.setup();
            render(<NestedRoutesWithOutlet />);
            await screen.findByText('Post #1');

            await user.click(screen.getByText('Post #1'));
            await screen.findByText('Tabbed Layout (like TabbedShowLayout)');

            expect(screen.getByTestId('content-tab')).toBeInTheDocument();
            expect(
                screen.getByText(
                    'This is the content tab (first tab, default).'
                )
            ).toBeInTheDocument();
        });

        it('should navigate between tabs using Outlet', async () => {
            const user = userEvent.setup();
            render(<NestedRoutesWithOutlet />);
            await screen.findByText('Post #1');

            await user.click(screen.getByText('Post #1'));
            await screen.findByTestId('content-tab');

            await user.click(screen.getByText('Metadata Tab'));
            await screen.findByTestId('metadata-tab');

            expect(
                screen.getByText('This is the metadata tab (second tab).')
            ).toBeInTheDocument();
            expect(screen.queryByTestId('content-tab')).not.toBeInTheDocument();
        });
    });

    describe('Nested Resources (Route children of Resource)', () => {
        it('should navigate to child routes defined inside Resource', async () => {
            const user = userEvent.setup();
            render(<NestedResources />);
            await screen.findByText('Post #1');

            await user.click(screen.getByText('Post #1'));

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
            const user = userEvent.setup();
            render(<QueryParameters />);
            await screen.findByText('Posts with Query Parameters');

            expect(screen.getByTestId('current-search').textContent).toContain(
                '(empty)'
            );

            await user.click(screen.getByTestId('sort-title'));

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
            const user = userEvent.setup();
            render(<QueryParameters />);
            await screen.findByText('Posts with Query Parameters');

            await user.click(screen.getByTestId('page-2'));

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
            const user = userEvent.setup();
            render(<QueryParameters />);
            await screen.findByText('Posts with Query Parameters');

            await user.click(screen.getByTestId('sort-title'));

            await waitFor(() => {
                expect(
                    screen.getByTestId('current-search').textContent
                ).toContain('sort=title');
            });

            await user.click(screen.getByTestId('page-3'));

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
            const user = userEvent.setup();

            render(<PathlessLayoutRoutes />);

            await waitFor(() => {
                expect(screen.getByText('Layout Wrapper')).toBeInTheDocument();
                expect(screen.getByTestId('posts-page')).toBeInTheDocument();
            });

            await user.click(screen.getByText('Comments'));

            await waitFor(() => {
                expect(screen.getByText('Layout Wrapper')).toBeInTheDocument();
                expect(screen.getByTestId('comments-page')).toBeInTheDocument();
            });
        });

        it('should match the most specific layout route within pathless layout routes', async () => {
            window.location.hash = '#/posts';
            const user = userEvent.setup();

            render(<PathlessLayoutRoutesPriority />);

            await waitFor(() => {
                expect(screen.getByTestId('posts-page')).toBeInTheDocument();
            });

            await user.click(screen.getByText('User'));

            await waitFor(() => {
                expect(screen.getByTestId('users-page')).toBeInTheDocument();
            });

            await user.click(screen.getByText('Block a user'));

            await waitFor(() => {
                expect(
                    screen.getByTestId('block-user-page')
                ).toBeInTheDocument();
            });
        });

        it('should match the empty path route as most specific within pathless layout routes', async () => {
            window.location.hash = '#/posts';
            const user = userEvent.setup();

            render(<PathlessLayoutRoutesWithEmptyRoute />);

            await waitFor(() => {
                expect(screen.getByTestId('posts-page')).toBeInTheDocument();
            });

            await user.click(screen.getByText('Home (path="")'));

            await waitFor(() => {
                expect(screen.getByTestId('home-page')).toBeInTheDocument();
            });
        });

        it('should match the index route as most specific within pathless layout routes', async () => {
            window.location.hash = '#/posts';
            const user = userEvent.setup();

            render(<PathlessLayoutRoutesWithIndexRoute />);

            await waitFor(() => {
                expect(screen.getByTestId('posts-page')).toBeInTheDocument();
            });

            await user.click(screen.getByText('Home (index)'));

            await waitFor(() => {
                expect(screen.getByTestId('home-page')).toBeInTheDocument();
            });
        });
    });

    describe('Resource Children (Route as children of Resource)', () => {
        it('should navigate to child routes without matching parent edit route', async () => {
            const user = userEvent.setup();
            render(<NestedResourcesPrecedence />);

            await screen.findByText('Post #1');

            await user.click(screen.getByText('Post #1'));

            await screen.findByText('Post Details');

            await user.click(screen.getByText('View Comments'));

            await waitFor(() => {
                expect(
                    screen.getByText(/Comments for Post/)
                ).toBeInTheDocument();
            });
        });
    });
});
