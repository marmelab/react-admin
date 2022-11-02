import * as React from 'react';
import { render, screen } from '@testing-library/react';
import expect from 'expect';

import { Basic } from './SelectColumnsButton.stories';

describe('<SelectColumnsButton>', () => {
    it('should render a datagrid with configurable columns', async () => {
        render(<Basic />);
        screen.getByText('Columns').click();
        expect(screen.queryByText('1869')).not.toBeNull();
        screen.getByLabelText('Year').click();
        expect(screen.queryByText('1869')).toBeNull();
        screen.getByLabelText('Year').click();
        expect(screen.queryByText('1869')).not.toBeNull();
    });
});
