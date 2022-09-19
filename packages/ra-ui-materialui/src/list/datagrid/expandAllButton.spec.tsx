import * as React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';

import { Expand } from './Datagrid.stories';

describe('ExpandAllButton', () => {
    it('should expand all rows at once', async () => {
        render(<Expand />);
        const expand = () => {
            const button = screen.getAllByLabelText('ra.action.expand')[0];
            fireEvent.click(button);
        };
        const collapse = () => {
            const button = screen.getAllByLabelText('ra.action.close')[0];
            fireEvent.click(button);
        };

        const expectExpandedRows = (count: number) => {
            expect(screen.queryAllByTestId('ExpandPanel')).toHaveLength(count);
        };

        expectExpandedRows(0);

        expand();
        expectExpandedRows(4);

        collapse();
        expectExpandedRows(0);
    });
});
