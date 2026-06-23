import * as React from 'react';
import { useEffect } from 'react';
import expect from 'expect';
import { fireEvent, render, screen } from '@testing-library/react';
import { useLocation, useNavigate } from 'react-router';

import { CompatHashRouter } from './CompatHashRouter';

describe('CompatHashRouter', () => {
    it('should render its children', async () => {
        render(
            <CompatHashRouter>
                <span>Hello</span>
            </CompatHashRouter>
        );
        await screen.findByText('Hello');
    });

    it('should display the error message when a child throws during render', async () => {
        const consoleError = jest
            .spyOn(console, 'error')
            .mockImplementation(() => {});
        const Throw = () => {
            throw new Error('boom');
        };
        render(
            <CompatHashRouter>
                <Throw />
            </CompatHashRouter>
        );
        await screen.findByText('boom');
        await screen.findByText('Unexpected Application Error!');
        consoleError.mockRestore();
    });

    it('should not remount its children on navigation', async () => {
        let mountCount = 0;
        const Child = () => {
            const navigate = useNavigate();
            const location = useLocation();
            useEffect(() => {
                mountCount += 1;
            }, []);
            return (
                <button onClick={() => navigate('/other')}>
                    {location.pathname}
                </button>
            );
        };
        render(
            <CompatHashRouter>
                <Child />
            </CompatHashRouter>
        );
        const button = await screen.findByText('/');
        expect(mountCount).toBe(1);
        fireEvent.click(button);
        // Navigation happened...
        await screen.findByText('/other');
        // ...but the children were not remounted.
        expect(mountCount).toBe(1);
    });
});
