import * as React from 'react';
import { render, waitFor } from '@testing-library/react';
import { TranslateComponent } from './index.stories';

describe('i18next i18nProvider', () => {
    test('should be compatible with the <Translate> component', async () => {
        const { container } = render(<TranslateComponent />);
        await waitFor(() => {
            expect(container.innerHTML).toEqual(
                'My Translated Key<br>Dashboard<br>Hello, world!<br>2 beers'
            );
        });
    });
});
