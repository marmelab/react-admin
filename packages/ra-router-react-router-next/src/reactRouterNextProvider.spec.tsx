import * as React from 'react';
import { render, screen, waitFor, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
    Basic,
    Embedded,
    LinkComponent,
    NavigateComponent,
    UseParams,
    UseMatch,
    UseLocation,
    RouterContext,
    WarnWhenUnsavedChanges,
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

    describe('RouterWrapper standalone mode (Basic)', () => {
        it('should render the post list inside its own hash router', async () => {
            render(<Basic />);
            await waitFor(() => {
                expect(screen.getByText('Posts')).toBeInTheDocument();
            });
        });

        it('should navigate from the list to the show view via a Link', async () => {
            const user = userEvent.setup();
            render(<Basic />);
            await waitFor(() => {
                expect(screen.getByText('Post #1')).toBeInTheDocument();
            });
            await user.click(screen.getByText('Post #1'));
            await waitFor(() => {
                expect(screen.getByText('Post Details')).toBeInTheDocument();
            });
        });
    });

    describe('RouterWrapper embedded mode with basename (Embedded)', () => {
        it('should render the host app home page initially', async () => {
            render(<Embedded />);
            await waitFor(() => {
                expect(screen.getByText('Home Page')).toBeInTheDocument();
            });
        });

        it('should mount react-admin under the basename and navigate to it', async () => {
            const user = userEvent.setup();
            render(<Embedded />);
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

    describe('Link (custom routes, no resource)', () => {
        it('should navigate on click', async () => {
            const user = userEvent.setup();
            render(<LinkComponent />);
            await waitFor(() => {
                expect(screen.getByText('Go to page 2')).toBeInTheDocument();
            });
            await user.click(screen.getByText('Go to page 2'));
            await waitFor(() => {
                expect(screen.getByTestId('page-2')).toBeInTheDocument();
            });
        });
    });

    describe('Navigate (declarative redirect)', () => {
        it('should redirect to the target route', async () => {
            render(<NavigateComponent />);
            await waitFor(() => {
                expect(screen.getByTestId('target-page')).toBeInTheDocument();
            });
        });
    });

    describe('useParams', () => {
        it('should expose the URL params', async () => {
            render(<UseParams />);
            await waitFor(() => {
                expect(screen.getByTestId('params')).toHaveTextContent('"42"');
            });
        });
    });

    describe('useMatch', () => {
        it('should match the current location against a pattern', async () => {
            render(<UseMatch />);
            await waitFor(() => {
                expect(screen.getByTestId('match')).toHaveTextContent('"7"');
            });
        });
    });

    describe('useLocation', () => {
        it('should expose the current location', async () => {
            render(<UseLocation />);
            await waitFor(() => {
                expect(
                    screen.getByTestId('location-display')
                ).toBeInTheDocument();
            });
        });
    });

    describe('useInRouterContext / useCanBlock', () => {
        it('should report being inside a router', async () => {
            render(<RouterContext />);
            await waitFor(() => {
                expect(
                    screen.getByTestId('in-router-context')
                ).toHaveTextContent('true');
            });
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
                render(<WarnWhenUnsavedChanges />);
                const title = await screen.findByDisplayValue('Post #1');
                await user.type(title, ' edited');
                await user.click(screen.getByText('Go to comments'));
                await waitFor(() => {
                    expect(confirmCalled).toBe(true);
                });
                // confirm returned false => navigation blocked, still on the form
                expect(
                    screen.getByDisplayValue('Post #1 edited')
                ).toBeInTheDocument();
            } finally {
                window.confirm = originalConfirm;
            }
        });
    });
});
