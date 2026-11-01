import * as React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { Route, Routes, createHashRouter } from 'react-router-dom';

import { CoreAdminContext } from '../../core/CoreAdminContext';

jest.mock('react-router-dom', () => {
    const actual = jest.requireActual('react-router-dom');

    return {
        ...actual,
        createHashRouter: jest.fn((...args) =>
            actual.createHashRouter(...args)
        ),
    };
});

describe('reactRouterProvider', () => {
    it('should not recreate the router when the parent rerenders', () => {
        const App = () => {
            const [count, setCount] = React.useState(0);

            return (
                <>
                    <button onClick={() => setCount(count + 1)}>
                        Rerender parent
                    </button>

                    <span>{count}</span>

                    <CoreAdminContext>
                        <Routes>
                            <Route path="/" element={<div>Home</div>} />
                        </Routes>
                    </CoreAdminContext>
                </>
            );
        };

        render(<App />);

        expect(createHashRouter).toHaveBeenCalledTimes(1);

        fireEvent.click(
            screen.getByRole('button', { name: 'Rerender parent' })
        );

        expect(createHashRouter).toHaveBeenCalledTimes(1);
    });
});
