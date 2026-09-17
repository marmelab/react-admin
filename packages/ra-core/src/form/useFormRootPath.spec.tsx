import * as React from 'react';
import { render, screen } from '@testing-library/react';

import { useFormRootPath } from './useFormRootPath';
import { TestMemoryRouter } from '../routing';

describe('useFormRootPath', () => {
    const UseFormRootPath = () => <div>{`[${useFormRootPath()}]`}</div>;

    const renderAt = (pathname: string) =>
        render(
            <TestMemoryRouter initialEntries={[pathname]}>
                <UseFormRootPath />
            </TestMemoryRouter>
        );

    it('returns the create form root path', async () => {
        renderAt('/posts/create');

        await screen.findByText('[/posts/create]');
    });

    it('returns the create form root path when on a tab', async () => {
        renderAt('/posts/create/2');

        await screen.findByText('[/posts/create]');
    });

    it('returns the edit form root path', async () => {
        renderAt('/posts/123');

        await screen.findByText('[/posts/123]');
    });

    it('returns the edit form root path when on a tab', async () => {
        renderAt('/posts/123/2');

        await screen.findByText('[/posts/123]');
    });

    it('returns an empty string when the location matches no form', async () => {
        renderAt('/posts');

        await screen.findByText('[]');
    });
});
