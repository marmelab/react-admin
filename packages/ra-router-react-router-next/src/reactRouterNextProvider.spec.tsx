import * as React from 'react';
import { render, screen, waitFor, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
    BasicStandalone,
    EmbeddedInReactRouter,
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
} from './reactRouterNextProvider.stories';
import { reactRouterNextProvider } from './reactRouterNextProvider';

const { matchPath } = reactRouterNextProvider;

describe('reactRouterNextProvider', () => {
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
        describe('standalone mode', () => {
            it('should render the post list inside its own hash router', async () => {
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

        describe('embedded mode (with basename)', () => {
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
        it('should navigate programmatically', async () => {
            const user = userEvent.setup();
            render(<HistoryNavigation />);
            await waitFor(() => {
                expect(screen.getByText('Posts')).toBeInTheDocument();
            });
            await user.click(screen.getByText('Post #1'));
            await waitFor(() => {
                expect(screen.getByText('Post Details')).toBeInTheDocument();
            });
        });
    });

    describe('Link', () => {
        it('should render links and navigate on click', async () => {
            const user = userEvent.setup();
            render(<LinkComponent />);
            await waitFor(() => {
                expect(screen.getByText('Go to Post #1')).toBeInTheDocument();
            });
            await user.click(screen.getByText('Go to Post #1'));
            await waitFor(() => {
                expect(screen.getByText('Post Details')).toBeInTheDocument();
            });
        });
    });

    describe('Routes / multiple resources', () => {
        it('should render multiple resources and navigate between them', async () => {
            const user = userEvent.setup();
            render(<MultipleResources />);
            await waitFor(() => {
                expect(screen.getByText('Go to Comments')).toBeInTheDocument();
            });
            await user.click(screen.getByText('Go to Comments'));
            await waitFor(() => {
                expect(screen.getByText('Comments')).toBeInTheDocument();
            });
        });
    });

    describe('custom routes', () => {
        it('should render a custom route', async () => {
            render(<CustomRoutesSupport />);
            await waitFor(() => {
                expect(
                    screen.getByText('Go to Custom Page')
                ).toBeInTheDocument();
            });
        });
    });

    describe('useParams', () => {
        it('should expose the URL params', async () => {
            const user = userEvent.setup();
            render(<UseParamsTest />);
            await waitFor(() => {
                expect(screen.getByText('Post #1')).toBeInTheDocument();
            });
            await user.click(screen.getByText('Post #1'));
            await waitFor(() => {
                const params = screen.getAllByTestId('params-display');
                expect(
                    params.some(p => (p.textContent || '').includes('"id"'))
                ).toBe(true);
            });
        });
    });

    describe('useMatch', () => {
        it('should report a match for the current location', async () => {
            render(<UseMatchTest />);
            await waitFor(() => {
                expect(screen.getByTestId('posts-match')).toHaveTextContent(
                    'MATCH'
                );
            });
        });
    });

    describe('Navigate', () => {
        it('should redirect declaratively', async () => {
            const user = userEvent.setup();
            render(<NavigateComponent />);
            await waitFor(() => {
                expect(screen.getByTestId('posts-page')).toBeInTheDocument();
            });
            await user.click(
                screen.getByText('Go to Redirect Page (auto-redirects here)')
            );
            await waitFor(() => {
                expect(screen.getByTestId('posts-page')).toBeInTheDocument();
            });
        });
    });

    describe('useLocation', () => {
        it('should expose the current location', async () => {
            render(<UseLocationTest />);
            await waitFor(() => {
                expect(
                    screen.getByTestId('location-pathname')
                ).toBeInTheDocument();
            });
        });
    });

    describe('useInRouterContext / useCanBlock', () => {
        it('should report being inside a router', async () => {
            render(<RouterContextTest />);
            await waitFor(() => {
                expect(
                    screen.getByTestId('in-router-context')
                ).toHaveTextContent('true');
            });
        });
    });

    describe('useBlocker', () => {
        it('should block navigation when there are unsaved changes', async () => {
            const user = userEvent.setup();
            render(<UseBlockerTest />);
            await waitFor(() => {
                expect(screen.getByTestId('form-input')).toBeInTheDocument();
            });
            await user.type(screen.getByTestId('form-input'), 'dirty');
            await user.click(screen.getByText('Go to Comments'));
            await waitFor(() => {
                expect(
                    screen.getByTestId('blocker-dialog')
                ).toBeInTheDocument();
            });
        });
    });

    describe('nested routes with Outlet', () => {
        it('should render the default tab', async () => {
            render(<NestedRoutesWithOutlet />);
            await waitFor(() => {
                expect(screen.getByText('Posts')).toBeInTheDocument();
            });
        });
    });

    describe('nested resources', () => {
        it('should render a resource with nested route children', async () => {
            render(<NestedResources />);
            await waitFor(() => {
                expect(screen.getByText('Posts')).toBeInTheDocument();
            });
        });
    });

    describe('query parameters', () => {
        it('should update the search part of the location', async () => {
            const user = userEvent.setup();
            render(<QueryParameters />);
            await waitFor(() => {
                expect(screen.getByTestId('sort-title')).toBeInTheDocument();
            });
            await user.click(screen.getByTestId('sort-title'));
            await waitFor(() => {
                expect(screen.getByTestId('current-sort')).toHaveTextContent(
                    'title'
                );
            });
        });
    });

    describe('pathless layout routes', () => {
        it('should render the layout wrapper and matched child', async () => {
            window.location.hash = '#/posts';
            render(<PathlessLayoutRoutes />);
            await waitFor(() => {
                expect(
                    screen.getByTestId('layout-wrapper')
                ).toBeInTheDocument();
                expect(screen.getByTestId('posts-page')).toBeInTheDocument();
            });
        });
    });
});
