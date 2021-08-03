import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
    render(<App />);
    const postsMenu = screen.queryByText(/Posts/i, {
        selector: '[role="menuitem"]',
    });
    expect(postsMenu).toBeInTheDocument();
});
