import * as React from 'react';
import { render, screen, waitFor, cleanup } from '@testing-library/react';

import { FullApp, Embedded } from './TanStackRouterAdmin.stories';

describe('TanStack Router Admin', () => {
    beforeEach(() => {
        window.location.hash = '';
        window.scrollTo = jest.fn();
    });

    afterEach(() => {
        cleanup();
        window.location.hash = '';
    });

    describe('standalone mode', () => {
        it('renders the dashboard', async () => {
            render(<FullApp />);
            await waitFor(() => {
                expect(screen.getByText('Total Posts')).toBeInTheDocument();
            });
        });

        it('navigates to resource list via menu', async () => {
            render(<FullApp />);
            await waitFor(() => {
                expect(screen.getByText('Total Posts')).toBeInTheDocument();
            });
            screen.getAllByText('Posts')[0].click();
            await waitFor(() => {
                expect(screen.getByText('Hello World')).toBeInTheDocument();
            });
        });

        it('navigates between resources', async () => {
            render(<FullApp />);
            await waitFor(() => {
                expect(screen.getByText('Total Posts')).toBeInTheDocument();
            });
            screen.getAllByText('Posts')[0].click();
            await waitFor(() => {
                expect(screen.getByText('Hello World')).toBeInTheDocument();
            });
            screen.getAllByText('Comments')[0].click();
            await waitFor(() => {
                expect(screen.getByText('Alice')).toBeInTheDocument();
            });
        });

        it('navigates to custom route', async () => {
            render(<FullApp />);
            await waitFor(() => {
                expect(screen.getByText('Total Posts')).toBeInTheDocument();
            });
            screen.getByText('Go to Settings').click();
            await waitFor(() => {
                expect(
                    screen.getByText('Application Settings')
                ).toBeInTheDocument();
            });
        });

        it('navigates between TabbedForm tabs', async () => {
            render(<FullApp />);
            await waitFor(() => {
                expect(screen.getByText('Total Posts')).toBeInTheDocument();
            });
            // Navigate to comments list
            screen.getAllByText('Comments')[0].click();
            await waitFor(() => {
                expect(screen.getByText('Alice')).toBeInTheDocument();
            });
            // Click edit on first comment
            screen.getAllByRole('link', { name: 'Edit' })[0].click();
            // Wait for edit form to load - first tab "Content" should be active
            await waitFor(() => {
                expect(
                    screen.getByRole('tab', { name: 'Content' })
                ).toHaveAttribute('aria-selected', 'true');
            });
            // Click on the "Metadata" tab
            screen.getByRole('tab', { name: 'Metadata' }).click();
            // Verify second tab is now selected
            await waitFor(() => {
                expect(
                    screen.getByRole('tab', { name: 'Metadata' })
                ).toHaveAttribute('aria-selected', 'true');
            });
        });
    });

    describe('embedded mode', () => {
        it('renders the frontend home page initially', async () => {
            render(<Embedded />);
            await waitFor(() => {
                expect(
                    screen.getByText('Welcome to the App')
                ).toBeInTheDocument();
            });
        });

        it('navigates to admin section', async () => {
            render(<Embedded />);
            await waitFor(() => {
                expect(
                    screen.getByText('Welcome to the App')
                ).toBeInTheDocument();
            });
            screen.getByText('Go to Admin Panel').click();
            await waitFor(
                () => {
                    expect(screen.getByText('Total Posts')).toBeInTheDocument();
                },
                { timeout: 3000 }
            );
        });

        it('navigates within admin section', async () => {
            render(<Embedded />);
            await waitFor(() => {
                expect(
                    screen.getByText('Welcome to the App')
                ).toBeInTheDocument();
            });
            screen.getByText('Go to Admin Panel').click();
            await waitFor(
                () => {
                    expect(screen.getByText('Total Posts')).toBeInTheDocument();
                },
                { timeout: 3000 }
            );
            screen.getAllByText('Posts')[0].click();
            await waitFor(
                () => {
                    expect(screen.getByText('Hello World')).toBeInTheDocument();
                },
                { timeout: 3000 }
            );
        });

        it('navigates to frontend pages via hash change', async () => {
            render(<Embedded />);
            await waitFor(() => {
                expect(
                    screen.getByText('Welcome to the App')
                ).toBeInTheDocument();
            });
            window.location.hash = '#/about';
            window.dispatchEvent(new HashChangeEvent('hashchange'));
            await waitFor(() => {
                expect(
                    screen.getByText(/This demo shows how to embed react-admin/)
                ).toBeInTheDocument();
            });
        });
    });
});
