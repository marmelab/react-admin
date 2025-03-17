import * as React from 'react';
import { render, waitFor } from '@testing-library/react';
import { TranslateComponent } from './index.stories';

describe('i18next i18nProvider', () => {
    test('should be compatible with the <Translate> component', async () => {
        const { container } = render(<TranslateComponent />);
        await waitFor(() => {
            expect(container.innerHTML).toEqual(
                '<span>My Translated Key</span><br><span>Dashboard</span><br><span>Hello, world!</span><br><span>2 beers</span>'
            );
        });
    });
});
