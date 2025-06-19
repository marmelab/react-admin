import * as React from 'react';
import expect from 'expect';
import { render, screen } from '@testing-library/react';

import { Themed } from './InfiniteList.stories';

describe('<InfiniteList />', () => {
    it('should be customized by a theme', async () => {
        render(<Themed />);
        expect(screen.queryByTestId('themed-list').classList).toContain(
            'custom-class'
        );
    });
});
