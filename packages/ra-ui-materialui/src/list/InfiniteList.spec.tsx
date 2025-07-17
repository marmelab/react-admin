import * as React from 'react';
import expect from 'expect';
import { render, screen, waitFor } from '@testing-library/react';

import { Themed, WithRenderProp } from './InfiniteList.stories';

describe('<InfiniteList />', () => {
    let originalIntersectionObserver;
    beforeAll(() => {
        originalIntersectionObserver = window.IntersectionObserver;
        const intersectionObserverMock = () => ({
            observe: () => null,
            unobserve: () => null,
        });
        window.IntersectionObserver = jest
            .fn()
            .mockImplementation(intersectionObserverMock);
    });
    afterAll(() => {
        window.IntersectionObserver = originalIntersectionObserver;
    });

    it('should be customized by a theme', async () => {
        render(<Themed />);
        expect(screen.queryByTestId('themed-list').classList).toContain(
            'custom-class'
        );
    });
    it('should render a list page using render prop', async () => {
        render(<WithRenderProp />);
        expect(screen.getByText('Loading...')).toBeDefined();

        await waitFor(() => {
            screen.getByText('War and Peace');
            screen.getByText('Leo Tolstoy');
        });
    });
});
