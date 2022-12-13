import * as React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { AuthenticatedCustomRoute } from './CustomRoutes.authenticated.stories';
import { UnauthenticatedCustomRoute } from './CustomRoutes.unauthenticated.stories';
import { WithLayoutCustomRoute } from './CustomRoutes.withLayout.stories';

describe('<CustomRoutes>', () => {
    test("should render custom routes that don't need authentication even when unauthenticated", () => {
        const history = createMemoryHistory({
            initialEntries: ['/password-recovery'],
        });
        render(<UnauthenticatedCustomRoute history={history} />);

        expect(screen.queryByText('Password recovery')).not.toBeNull();
    });

    test('should render custom routes that need authentication only when authenticated', async () => {
        const history = createMemoryHistory({
            initialEntries: ['/authenticated'],
        });
        render(<AuthenticatedCustomRoute history={history} />);

        await waitFor(() => {
            expect(screen.queryByText('Login page')).not.toBeNull();
        });
        fireEvent.click(screen.getByText('Sign in'));
        await waitFor(() => {
            expect(
                screen.queryByText(
                    'Custom page without layout, requiring authentication'
                )
            ).not.toBeNull();
        });
    });

    test('should render custom routes that need authentication and layout only when authenticated', async () => {
        const history = createMemoryHistory({
            initialEntries: ['/custom'],
        });
        render(<WithLayoutCustomRoute history={history} />);

        await waitFor(() => {
            expect(screen.queryByText('Login page')).not.toBeNull();
        });
        fireEvent.click(screen.getByText('Sign in'));
        await waitFor(() => {
            expect(
                screen.queryByText(
                    'Custom page with layout, requiring authentication'
                )
            ).not.toBeNull();
        });

        expect(screen.queryByText('Layout')).not.toBeNull();
    });
});
