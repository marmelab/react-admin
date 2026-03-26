import * as React from 'react';
import { render, waitFor } from '@testing-library/react';
import { TranslateComponent, TranslateWithReactElement } from './index.stories';

describe('polyglot i18nProvider', () => {
    test('should be compatible with the <Translate> component', async () => {
        const { container } = render(<TranslateComponent />);
        await waitFor(() => {
            expect(container.innerHTML).toEqual(
                'My Translated Key<br>Dashboard<br>Hello, world!<br>2 beers'
            );
        });
    });

    test('should support React elements in <Translate> options', async () => {
        const { container } = render(<TranslateWithReactElement />);
        await waitFor(() => {
            expect(container.innerHTML).toEqual(
                'Hello, <strong>John</strong>! Welcome to <em>react-admin</em>.'
            );
        });
    });
});
